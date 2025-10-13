// This is very not working rn, cuz i copy pasted it from smpp bruh
// rn it just checks if it is a buis or not.
// I also changed https://${subdomain}.smartschool.be/results/api/v1/evaluations/?itemsOnPage=100 to https://${subdomain}.smartschool.be/results/api/v1/evaluations/?itemsOnPage=1000000000
setTimeout(function () {
  if (window.location.pathname.startsWith("/")) {
    const getSubdomain = () => {
      const host = window.location.hostname;
      const subdomain = host.split(".")[0];
      return subdomain;
    };

    const subdomain = getSubdomain();
    const url = `https://${subdomain}.smartschool.be/results/api/v1/evaluations/?pageNumber=1&itemsOnPage=100000000&startDate=2015-09-01&endDate=2035-08-31`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const categories = {
          buis: 0,
          voldoende: 0,
        };

        data.forEach((evaluation) => {
          if (evaluation.graphic && evaluation.graphic.value !== undefined) {
            const value = evaluation.graphic.value;
            if (value < 50) {
              categories.buis++;
            } else {
              categories.voldoende++;
            }
          }
        });
        // Sla op in storage zodat andere scripts het kunnen lezen
        chrome.storage.local.set({ buizenCount: buizen }, () => {
          console.log("[Achievements] buizenCount opgeslagen in storage");
        });
      })
      .catch((error) => console.error("Error fetching:", error));
  }
}, 1500);