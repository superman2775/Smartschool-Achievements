console.log('assignment-finish.js geladen');

/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

//this script works, so don't touch it
//We count how many times the api call is made to /resolve when an assignment is finished
//We store this in chrome storage so other scripts can read it

// Listen for web requests to the /resolve endpoint
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
//that is basiclly it. easy right?