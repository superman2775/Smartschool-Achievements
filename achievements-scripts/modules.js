/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

//this script works, so don't touch it
//We track if the user has visited certain pages, and store that in chrome storage
//Other scripts can read this to unlock achievements
(function () {
  'use strict';

  console.log("[Achievements] Tracker gestart");

  const TRACKED_PAGES = [
    { name: 'visitNews', match: '/?module=News&file=index' },
    { name: 'visitMail', match: '/?module=Messages&file=index&function=main' },
    { name: 'visitMyDocs', match: '/mydoc' },
    { name: 'visitHandleiding', match: '/?module=Manual&file=manual&function=main' },
    { name: 'visitOnlineSessions', match: '/online-session' },
    { name: 'visitResults', match: '/results' },
    { name: 'visitPlanner', match: '/planner' }
  ];

  function checkPageAndStore() {
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;

    TRACKED_PAGES.forEach(item => {
      if (currentUrl.includes(item.match)) {
        chrome.storage.local.get(item.name, (result) => {
          if (result[item.name] !== 1) {
            chrome.storage.local.set({ [item.name]: 1 }, () => {
              console.log(`[Achievements] ${item.name} ✅ opgeslagen`);
            });
          }
        });
      }
    });
  }

  // --- Navigatie-hooks ---
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

  // --- Debounce ---
  function debounce(fn, wait) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  // --- Start ---
  checkPageAndStore();
  window.addEventListener('ss-location-change', debounce(checkPageAndStore, 150));

  const mo = new MutationObserver(debounce(checkPageAndStore, 300));
  mo.observe(document, { childList: true, subtree: true });

  window.addEventListener('focus', debounce(checkPageAndStore, 200));

  // Extra fallback voor hash-veranderingen
  setInterval(checkPageAndStore, 2000);

})();
