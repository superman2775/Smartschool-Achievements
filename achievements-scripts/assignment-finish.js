/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775
*/


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