/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775
*/

//this script works, so don't touch it
(function () {
  'use strict';

  console.log("[Achievements] WOPI Visit Counter gestart");

  const TRACKED_PAGE = { name: 'visitWopiCount', match: '/Wopi' };
  const FLAG = 'wasInsideWopi';

  function isWopi() {
    return location.pathname.includes(TRACKED_PAGE.match);
  }

  function checkVisit() {
    const inside = isWopi();
    const wasInside = sessionStorage.getItem(FLAG) === 'true';

    // Case 1: We enter WOPI from outside → COUNT
    if (inside && !wasInside) {
      sessionStorage.setItem(FLAG, 'true');

      chrome.storage.local.get(TRACKED_PAGE.name, (result) => {
        const currentCount = result[TRACKED_PAGE.name] || 0;
        const newCount = currentCount + 1;

        chrome.storage.local.set({ [TRACKED_PAGE.name]: newCount }, () => {
          console.log(`[Achievements] ${TRACKED_PAGE.name} ➕ (${newCount} keer bezocht)`);
        });
      });
    }

    // Case 2: We left WOPI → reset flag
    if (!inside && wasInside) {
      sessionStorage.setItem(FLAG, 'false');
    }
  }

  // --- Hook into SPA navigation ---
  const _push = history.pushState;
  const _replace = history.replaceState;

  history.pushState = function (...args) {
    const r = _push.apply(this, args);
    window.dispatchEvent(new Event('ss-location-change'));
    return r;
  };

  history.replaceState = function (...args) {
    const r = _replace.apply(this, args);
    window.dispatchEvent(new Event('ss-location-change'));
    return r;
  };

  window.addEventListener('popstate', () =>
    window.dispatchEvent(new Event('ss-location-change'))
  );

  // --- Debounce ---
  function debounce(fn, wait) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), wait);
    };
  }

  // Start monitoring
  checkVisit();

  window.addEventListener('ss-location-change', debounce(checkVisit, 150));

  const mo = new MutationObserver(debounce(checkVisit, 300));
  mo.observe(document, { childList: true, subtree: true });

  window.addEventListener('focus', debounce(checkVisit, 200));
})();
