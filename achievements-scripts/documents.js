/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

// We track how many times the user opened a WOPI page (e.g. Office files)
(function () {
  'use strict';

  console.log("[Achievements] WOPI Visit Counter gestart");

  const TRACKED_PAGE = { name: 'visitWopiCount', match: '/Wopi' };

  function checkPageAndStore() {
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;

    if (currentUrl.includes(TRACKED_PAGE.match)) {
      chrome.storage.local.get(TRACKED_PAGE.name, (result) => {
        const currentCount = result[TRACKED_PAGE.name] || 0;
        const newCount = currentCount + 1;

        chrome.storage.local.set({ [TRACKED_PAGE.name]: newCount }, () => {
          console.log(`[Achievements] ${TRACKED_PAGE.name} ➕ (${newCount} keer bezocht)`);
        });
      });
    }
  }

  // --- Navigatie-hooks voor SPA's ---
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
  setInterval(checkPageAndStore, 2000);

})();
