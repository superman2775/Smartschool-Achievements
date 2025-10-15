/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

setTimeout(function () {
  if (window.location.pathname.startsWith("/")) {
    const getSubdomain = () => {
      const host = window.location.hostname;
      const subdomain = host.split(".")[0];
      return subdomain;
    };

    const subdomain = getSubdomain();
    const url = `https://${subdomain}.smartschool.be/results/api/v1/evaluations/?pageNumber=1&itemsOnPage=5000000&startDate=2015-09-01&endDate=2035-08-31`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        let hundredPercentCount = 0;

        // Probeer array te vinden
        const evaluations = Array.isArray(data)
          ? data
          : data.items || data.evaluations || [];

        evaluations.forEach((evaluation) => {
          if (evaluation.graphic && typeof evaluation.graphic.value === "number") {
            if (evaluation.graphic.value === 100) {
              hundredPercentCount++;
            }
          }
        });

        // Sla op in storage zodat andere scripts het kunnen lezen
        chrome.storage.local.set({ hundredPercentCount }, () => {
          console.log("[Achievements] hundredPercentCount opgeslagen in storage");
        });
      })
      .catch((error) => console.error("Error fetching:", error));
  }
}, 1500);
