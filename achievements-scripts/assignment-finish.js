/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775
*/

//This is verrrry temporary. It won't work probably
(function() {
  let apiCallCount = 0;
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (
      typeof url === 'string' &&
      url.startsWith('https://martinusasse.smartschool.be/planner/api/v1/planned-assignments/') &&
      url.endsWith('/resolve')
    ) {
      apiCallCount++;
      console.log('API Call Count:', apiCallCount);
    }
    return originalFetch.apply(this, args);
  };
})();