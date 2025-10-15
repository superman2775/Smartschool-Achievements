console.log('assignment-finish.js geladen');

/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775
*/

//Script doesn't work someone help meeeeeeee

// Helper om de hook opnieuw te zetten als fetch/XHR wordt overschreven
function setHooks() {
  // Zet fetch-hook direct
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    const options = args[1] || {};
    if (
      typeof url === 'string' &&
      url.endsWith('/resolve') &&
      ((options.method || 'GET').toUpperCase() === 'POST')
    ) {
      console.log('Fetch naar /resolve gedetecteerd:', url);
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

  // Hook ook XMLHttpRequest
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (
      typeof url === 'string' &&
      url.endsWith('/resolve') &&
      method.toUpperCase() === 'POST'
    ) {
      console.log('XHR naar /resolve gedetecteerd:', url);
      chrome.storage.local.get(['apiAssignmentFinishCallCount'], function(result) {
        let apiAssignmentFinishCallCount = result.apiAssignmentFinishCallCount || 0;
        apiAssignmentFinishCallCount++;
        chrome.storage.local.set({ apiAssignmentFinishCallCount }, () => {
          console.log('API Call Count opgeslagen (XHR):', apiAssignmentFinishCallCount);
        });
      });
    }
    return originalXhrOpen.apply(this, [method, url, ...rest]);
  };
}

// Zet hooks direct
setHooks();

// Detecteer of fetch/XHR opnieuw wordt overschreven en zet dan de hooks opnieuw
const observer = new MutationObserver(() => {
  if (window.fetch !== setHooks.fetch || XMLHttpRequest.prototype.open !== setHooks.xhrOpen) {
    setHooks();
  }
});
observer.observe(document, { childList: true, subtree: true });