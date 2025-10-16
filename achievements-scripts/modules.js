/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

// This script detects if you are at a specific page (by URL match)
// and saves a value of 1 in chrome storage for that page (never above 1)

(function () {
  'use strict';

  // List of objects: { name, suffix }
  // You can choose the name for each tracked item
  const TRACKED_PAGES = [
    { name: 'visitNews', suffix: '/?module=News&file=index' },
    { name: 'visitMail', suffix: '/?module=Messages&file=index&function=main' },
    { name: 'visitMyDocs', suffix: '/mydoc' },
    { name: 'visitHandleiding', suffix: '/?module=Manual&file=manual&function=main' },
    { name: 'visitOnlineSessions', suffix: '/online-session'},
    { name: 'visitResults', suffix: '/results/main/results'},
    { name: 'visitPlanner', suffix: '/planner'}
    // Add more: { name: 'yourName', suffix: '/your/suffix' }
  ];

  const STORAGE_KEY = 'matchedPages';

  function checkPageAndStore() {
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    TRACKED_PAGES.forEach(item => {
      if (currentUrl.includes(item.suffix)) { // changed here
        // Save value 1 in chrome storage under your chosen name, never above 1
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          const pages = result[STORAGE_KEY] || {};
          if (pages[item.name] !== 1) {
            pages[item.name] = 1;
            chrome.storage.local.set({ [STORAGE_KEY]: pages }, () => {
              console.debug('[modules] matched and set to 1:', item.name, currentUrl);
            });
          }
        });
      }
    });
  }

  // Detect navigation changes (SPA support)
  function hookNavigation() {
    const _push = history.pushState;
    const _replace = history.replaceState;

    history.pushState = function (...args) {
      const res = _push.apply(this, args);
      window.dispatchEvent(new Event('ss-location-change'));
      return res;
    };
    history.replaceState = function (...args) {
      const res = _replace.apply(this, args);
      window.dispatchEvent(new Event('ss-location-change'));
      return res;
    };
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('ss-location-change')));
  }

  // Debounce helper
  function debounce(fn, wait) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Initial setup
  hookNavigation();
  checkPageAndStore();

  // Check on navigation and DOM changes
  window.addEventListener('ss-location-change', debounce(checkPageAndStore, 150));
  const mo = new MutationObserver(debounce(checkPageAndStore, 200));
  mo.observe(document, { childList: true, subtree: true });

  // Also check when tab regains focus
  window.addEventListener('focus', debounce(checkPageAndStore, 150));

})();
