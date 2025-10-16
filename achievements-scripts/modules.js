/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

// This script detects if you are at a specific page (by URL match)
// and saves a value of 1 in chrome storage for that page (never above 1)

(function () {
  'use strict';

  console.log("[Achievements] Tracker gestart");

  const TRACKED_PAGES = [
    { name: 'visitNews', suffix: '/?module=News&file=index' },
    { name: 'visitMail', suffix: '/?module=Messages&file=index&function=main' },
    { name: 'visitMyDocs', suffix: '/mydoc' },
    { name: 'visitHandleiding', suffix: '/?module=Manual&file=manual&function=main' },
    { name: 'visitOnlineSessions', suffix: '/online-session' },
    { name: 'visitResults', suffix: '/results/main/results' },
    { name: 'visitPlanner', suffix: '/planner' }
  ];

  const STORAGE_KEY = 'matchedPages';

  // Controleert of huidige URL een van de suffixes bevat
  function checkPageAndStore() {
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    TRACKED_PAGES.forEach(item => {
      if (currentUrl.includes(item.suffix)) {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          const pages = result[STORAGE_KEY] || {};
          if (pages[item.name] !== 1) {
            pages[item.name] = 1;
            chrome.storage.local.set({ [STORAGE_KEY]: pages }, () => {
              console.log(`[Achievements] ${item.name} ✅ (${currentUrl})`);
            });
          }
        });
      }
    });
  }

  // Hook navigatieveranderingen (SPA support)
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
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // --- INIT ---
  hookNavigation();
  checkPageAndStore();

  // Reageer op navigatie, DOM-wijzigingen en focus
  window.addEventListener('ss-location-change', debounce(checkPageAndStore, 150));
  const mo = new MutationObserver(debounce(checkPageAndStore, 300));
  mo.observe(document, { childList: true, subtree: true });
  window.addEventListener('focus', debounce(checkPageAndStore, 200));

  // Extra fallback (voor Smartschool’s dynamische hash-veranderingen)
  setInterval(checkPageAndStore, 2000);

})();
