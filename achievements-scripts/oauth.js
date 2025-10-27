/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

//We track which OAuth platforms the user has authorized (e.g. Pelckmans, Diddit, Scoodle, ...)
//We do this by checking the URL when the user is on the OAuth platform chooser page
//For more info, ask ChatGPT to explain :)
(function () {
  'use strict';

  console.log("[Achievements] OAuth Platform Tracker gestart");

  const STORAGE_KEY = 'authorizedPlatforms';

  // 🧩 Functie om platform uit de OAuth-URL te halen
  function extractPlatformFromUrl(url) {
    try {
      const decodedUrl = decodeURIComponent(url);
      const match = decodedUrl.match(/id-api\.([a-z0-9-]+)\.be/i);
      return match ? match[1].toLowerCase() : null;
    } catch (err) {
      console.warn("[Achievements] Fout bij platform extractie:", err);
      return null;
    }
  }

  // 🧠 Controleer of de huidige pagina een OAuth-platform URL is
  function checkForOAuthPlatform() {
    const currentUrl = window.location.href;

    if (currentUrl.includes('/OAuth/index/platformchooser')) {
      const platform = extractPlatformFromUrl(currentUrl);

      if (platform) {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          const existing = result[STORAGE_KEY] || [];
          if (!existing.includes(platform)) {
            const updated = [...existing, platform];
            chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
              console.log(`[Achievements] Nieuw platform gevonden: ${platform}`);
              console.log(`[Achievements] Totaal geautoriseerde platformen: ${updated.length}`);
            });
          } else {
            console.log(`[Achievements] Platform ${platform} al bekend`);
          }
        });
      } else {
        console.log("[Achievements] Geen platform gevonden in OAuth-URL.");
      }
    }
  }

  // --- Navigatie-hooks voor SPA’s ---
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

  // --- Debounce helper ---
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
