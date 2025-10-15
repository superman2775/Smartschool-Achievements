console.log('assignment-finish.js geladen');

/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (
      details.url.endsWith('/resolve') &&
      details.method === 'POST'
    ) {
      chrome.storage.local.get(['apiAssignmentFinishCallCount'], function(result) {
        let apiAssignmentFinishCallCount = result.apiAssignmentFinishCallCount || 0;
        apiAssignmentFinishCallCount++;
        chrome.storage.local.set({ apiAssignmentFinishCallCount }, () => {
          console.log('API Call Count opgeslagen (webRequest):', apiAssignmentFinishCallCount);
        });
      });
    }
  },
  { urls: ["*://*.smartschool.be/*"] }
);