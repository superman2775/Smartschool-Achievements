/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775
*/

//this script works, so don't touch it
//We track how many different OAuth platforms the user has authorized, and store that in chrome storage
//Other scripts can read this to unlock achievements
(function () {
  'use strict';

  console.log("[Achievements] OAuth Platform Teller gestart");

  const STORAGE_KEY = 'authorizedPlatformsCount';
  const KNOWN_PLATFORMS_KEY = 'knownPlatforms'; // tijdelijk voor uniek checken

  // Platform uit redirect_uri halen
  function extractPlatformFromUrl(url) {
    try {
      const decoded = decodeURIComponent(url);
      const redirectMatch = decoded.match(/redirect_uri=([^&]+)/i);
      if (!redirectMatch) return null;
      const redirectUrl = new URL(redirectMatch[1]);
      const host = redirectUrl.hostname; // vb. "login.vanin.be"
      const parts = host.split('.');
      if (parts.length >= 2) return parts[parts.length - 2].toLowerCase();
      return null;
    } catch (err) {
      console.warn("[Achievements] Fout bij platform extractie:", err);
      return null;
    }
  }

  function checkForOAuthPlatform() {
    const currentUrl = window.location.href;

    if (currentUrl.includes('/OAuth/index/platformchooser')) {
      const platform = extractPlatformFromUrl(currentUrl);
      if (!platform) return;

      // Lees bekende platformen
      chrome.storage.local.get([KNOWN_PLATFORMS_KEY, STORAGE_KEY], (result) => {
        const known = result[KNOWN_PLATFORMS_KEY] || [];
        let count = result[STORAGE_KEY] || 0;

        if (!known.includes(platform)) {
          known.push(platform);
          count = known.length; // update teller
          chrome.storage.local.set({ [KNOWN_PLATFORMS_KEY]: known, [STORAGE_KEY]: count }, () => {
            console.log(`[Achievements] Nieuw platform: ${platform}`);
            console.log(`[Achievements] Totaal geautoriseerde platformen: ${count}`);
          });
        } else {
          console.log(`[Achievements] Platform ${platform} al bekend`);
        }
      });
    }
  }

  // --- Navigatie-hooks SPA ---
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

  function debounce(fn, wait) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  // --- Start tracking ---
  checkForOAuthPlatform();
  window.addEventListener('ss-location-change', debounce(checkForOAuthPlatform, 150));
  const mo = new MutationObserver(debounce(checkForOAuthPlatform, 300));
  mo.observe(document, { childList: true, subtree: true });
  window.addEventListener('focus', debounce(checkForOAuthPlatform, 200));
  setInterval(checkForOAuthPlatform, 2000);

})();
