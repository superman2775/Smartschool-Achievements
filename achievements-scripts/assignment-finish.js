/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775
*/

setTimeout(function () {
  if (window.location.pathname.startsWith("/")) {
    const getSubdomain = () => {
      const host = window.location.hostname;
      const subdomain = host.split(".")[0];
      return subdomain;
    };
    const subdomain = getSubdomain();

    // Zet fetch-hook direct
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (
        typeof url === 'string' &&
        url.startsWith(`https://${subdomain}.smartschool.be/planner/api/v1/planned-assignments/`) &&
        url.endsWith('/resolve')
      ) {
        // Haal huidige waarde op en verhoog
        chrome.storage.local.get(['apiAssignmentFinishCallCount'], function(result) {
          let apiAssignmentFinishCallCount = result.apiAssignmentFinishCallCount || 0;
          apiAssignmentFinishCallCount++;
          chrome.storage.local.set({ apiAssignmentFinishCallCount }, () => {
            console.log('API Call Count opgeslagen:', apiAssignmentFinishCallCount);
          });
        });
      }
      return originalFetch.apply(this, args);
    };
  }
}, 0);