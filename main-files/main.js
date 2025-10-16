/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 +@broodje565
*/

(function () {
  'use strict';

  const waitForNav = setInterval(() => {
    const linksBtnWrapper = document.querySelector('[data-links]');
    const messagesBtn = document.querySelector('.js-btn-messages');
    const shortcutsMenu = document.getElementById('shortcutsMenu');

    if (linksBtnWrapper && messagesBtn && shortcutsMenu) {
      clearInterval(waitForNav);

      // Knop-wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'topnav__btn-wrapper';

      // Achievements-knop
      const button = document.createElement('button');
      button.className = 'js-btn-achievements topnav__btn';
      button.innerHTML = 'Achievements';
      button.setAttribute('aria-haspopup', 'true');
      button.setAttribute('aria-expanded', 'false');

      // Popup-container
      const menuWrapper = document.createElement('div');
      menuWrapper.id = 'achievementsMenu';
      menuWrapper.className = 'topnav__menu-wrapper';
      menuWrapper.tabIndex = -1;
      menuWrapper.hidden = true;
      menuWrapper.role = 'menu';

      // Zelfde basisstijl als “Ga naar”
      const refMenu = shortcutsMenu.querySelector('.topnav__menu');
      const menu = document.createElement('div');
      menu.className = 'topnav__menu topnav__menu--shortcuts js-achievements-container js-autosize';
      menu.style.minWidth = getComputedStyle(refMenu).minWidth || getComputedStyle(refMenu).width;
      menu.style.maxHeight = getComputedStyle(refMenu).maxHeight || '480px';
      menu.style.maxWidth = '420px';
      menu.style.overflow = 'hidden';
      menu.style.display = 'flex';
      menu.style.flexDirection = 'column';

      // Titelbalk
      const header = document.createElement('div');
      header.className = 'topnav__menu__hdr';
      header.innerHTML = `<h2 class="topnav__menu__title" style="margin-left:10px;">Achievements</h2>`;
      header.style.flex = '0 0 auto';
      menu.appendChild(header);

      // Scrollbare container
      const scrollContainer = document.createElement('div');
      scrollContainer.style.flex = '1 1 auto';
      scrollContainer.style.overflowY = 'auto';
      scrollContainer.style.maxHeight = '400px';
      scrollContainer.style.paddingRight = '4px';

      // Achievement data (chain of chrome.storage calls)
      chrome.storage.local.get("buizenCount", (result) => {
        const buizen = result.buizenCount || 0;
        chrome.storage.local.get("hundredPercentCount", (result) => {
          const hundredPercent = result.hundredPercentCount || 0;
          chrome.storage.local.get("apiAssignmentFinishCallCount", (result) => {
            const apiAssignmentFinishCallCount = result.apiAssignmentFinishCallCount || 0;
            chrome.storage.local.get("visitNews", (result) => {
              const visitNews = result.visitNews || 0;
              chrome.storage.local.get("visitMail", (result) => {
                const visitMail = result.visitMail || 0;
                chrome.storage.local.get("visitMyDocs", (result) => {
                  const visitMyDocs = result.visitMyDocs || 0;
                  chrome.storage.local.get("visitHandleiding", (result) => {
                    const visitHandleiding = result.visitHandleiding || 0;
                    chrome.storage.local.get("visitOnlineSessions", (result) => {
                      const visitOnlineSessions = result.visitOnlineSessions || 0;
                      chrome.storage.local.get("visitResults", (result) => {
                        const visitResults = result.visitResults || 0;
                        chrome.storage.local.get("visitPlanner", (result) => {
                          const visitPlanner = result.visitPlanner || 0;

                          // === Achievements array ===
                          const achievements = [
                            {
                              title: "😩 One of many",
                              desc: "Buis op 1 toets.",
                              progress: Math.min((buizen / 1) * 100, 100),
                            },
                            {
                              title: "😩 Five of many",
                              desc: "Buis op 5 toetsen.",
                              progress: Math.min((buizen / 5) * 100, 100),
                            },
                            {
                              title: "😩 Ten of many",
                              desc: "Buis op 10 toetsen.",
                              progress: Math.min((buizen / 10) * 100, 100),
                            },
                            {
                              title: "😩 Twenty-five of many",
                              desc: "Buis op 25 toetsen.",
                              progress: Math.min((buizen / 25) * 100, 100),
                            },
                            {
                              title: "😩 Just too many",
                              desc: "Buis op 50 toetsen.",
                              progress: Math.min((buizen / 50) * 100, 100),
                            },
                            {
                              title: "😩 Way too many",
                              desc: "Buis op 100 toetsen.",
                              progress: Math.min((buizen / 100) * 100, 100),
                            },
                            {
                              title: "🤓 Beginners luck",
                              desc: "Haal 100% op 1 toets.",
                              progress: Math.min((hundredPercent / 1) * 100, 100),
                            },
                            {
                              title: "🤓 Just lucky",
                              desc: "Haal 100% op 20 toetsen.",
                              progress: Math.min((hundredPercent / 20) * 100, 100),
                            },
                            {
                              title: "🤓 Teacher loves me ig",
                              desc: "Haal 100% op 50 toetsen.",
                              progress: Math.min((hundredPercent / 50) * 100, 100),
                            },
                            {
                              title: "🤓 Big brain",
                              desc: "Haal 100% op 100 toetsen.",
                              progress: Math.min((hundredPercent / 100) * 100, 100),
                            },
                            {
                              title: "🤓 Teacher's pet",
                              desc: "Haal 100% op 250 toetsen.",
                              progress: Math.min((hundredPercent / 250) * 100, 100),
                            },
                            {
                              title: "🤓 Nerd",
                              desc: "Haal 100% op 500 toetsen.",
                              progress: Math.min((hundredPercent / 500) * 100, 100),
                            },
                            {
                              title: "🤓 No life 💀",
                              desc: "Haal 100% op 1000 toetsen.",
                              progress: Math.min((hundredPercent / 1000) * 100, 100),
                            },
                            {
                              title: "⬇️ + 200 XP!",
                              desc: "Download Smartschool Achievements.",
                              progress: 100
                            },
                            {
                              title: "✅ One down!",
                              desc: "Werk 1 taak af.",
                              progress: Math.min((apiAssignmentFinishCallCount / 1) * 100, 100),
                            },
                            {
                              title: "✅ Keep it going",
                              desc: "Werk 10 taken af.",
                              progress: Math.min((apiAssignmentFinishCallCount / 10) * 100, 100),
                            },
                            {
                              title: "✅ They see me rollin'",
                              desc: "Werk 50 taken af.",
                              progress: Math.min((apiAssignmentFinishCallCount / 50) * 100, 100),
                            },
                            {
                              title: "✅ Taskmaster",
                              desc: "Werk 100 taken af.",
                              progress: Math.min((apiAssignmentFinishCallCount / 100) * 100, 100),
                            },
                            {
                              title: "✅ Multitasker",
                              desc: "Werk 250 taken af.",
                              progress: Math.min((apiAssignmentFinishCallCount / 250) * 100, 100),
                            },
                            {
                              title: "✅ Task legend",
                              desc: "Werk 500 taken af.",
                              progress: Math.min((apiAssignmentFinishCallCount / 500) * 100, 100),
                            },
                            {
                              title: "✅ Task god",
                              desc: "Werk 1000 taken af.",
                              progress: Math.min((apiAssignmentFinishCallCount / 1000) * 100, 100),
                            },
                            {
                              title: "📰 What's the news?",
                              desc: "Bekijk het vaknieuws.",
                              progress: visitNews * 100,
                              secret: true
                            },
                            {
                              title: "📧 OMG I GOT A MESSAGE!",
                              desc: "Bekijk je berichten.",
                              progress: visitMail * 100,
                              secret: true
                            },
                            {
                              title: "📁 Fake OneDrive",
                              desc: "Bekijk Mijn Documenten.",
                              progress: visitMyDocs * 100,
                              secret: true
                            },
                            {
                              title: "🤔 Who even uses this??",
                              desc: "Bekijk de handleiding.",
                              progress: visitHandleiding * 100,
                              secret: true
                            },
                            {
                              title: "🎥 2020 flashback",
                              desc: "Bekijk Online Sessies.",
                              progress: visitOnlineSessions * 100,
                              secret: true
                            },
                            {
                              title: "📝 FAILURE", // For those who don't know: it is a reference to Steven Hu
                              desc: "Bekijk Resultaten.",
                              progress: visitResults * 100,
                              secret: true
                            },
                            {
                              title: "✍️ Oh no I have homework!",
                              desc: "Bekijk de Planner.",
                              progress: visitPlanner * 100,
                              secret: true
                            },
                            {
                              title: "🧠 50 quizzen voltooid",
                              desc: "Behaal een score in vijftig verschillende quizzen.",
                              progress: 0
                            },
                            {
                              title: "🚀 Actief in 5 vakken",
                              desc: "Werk in minstens vijf verschillende vakken.",
                              progress: 60,
                              secret: true
                            },
                            {
                              title: "🏆 De ultieme student",
                              desc: "Ontgrendel alle andere achievements.",
                              progress: 0,
                              secret: true
                            }
                          ];

                          // Geheimen verbergen
                          achievements.forEach(a => {
                            if (a.secret && a.progress < 100) {
                              a.title = "❓ Secret";
                              a.desc = "Wordt onthuld zodra voltooid.";
                            }
                          });

                          achievements.forEach(a => {
                            const item = document.createElement('div');
                            item.className = 'achievement-item topnav__menuitem';
                            item.style.display = 'flex';
                            item.style.flexDirection = 'column';
                            item.style.alignItems = 'flex-start';
                            item.style.width = '100%';
                            item.style.padding = '10px 14px';
                            item.style.boxSizing = 'border-box';
                            item.style.borderBottom = '1px solid rgba(0,0,0,0.05)';

                            const topRow = document.createElement('div');
                            topRow.style.display = 'flex';
                            topRow.style.justifyContent = 'space-between';
                            topRow.style.alignItems = 'center';
                            topRow.style.width = '100%';

                            const title = document.createElement('span');
                            title.textContent = a.title;
                            title.style.fontWeight = '600';
                            title.style.marginBottom = '4px';
                            topRow.appendChild(title);

                            const status = document.createElement('span');
                            status.style.fontSize = '0.8rem';
                            status.style.fontWeight = '500';
                            status.style.padding = '2px 6px';
                            status.style.borderRadius = '4px';
                            status.style.textTransform = 'capitalize';
                            status.style.marginLeft = '8px';
                            status.style.color = '#fff';
                            status.style.userSelect = 'none';

                            if (a.progress >= 100) {
                              status.textContent = "✅ Voltooid";
                              status.style.background = '#43a047';
                            } else if (a.progress <= 0) {
                              status.textContent = "🔒 Niet gestart";
                              status.style.background = '#757575';
                            } else {
                              status.textContent = "⏳ Bezig";
                              status.style.background = '#f57c00';
                            }

                            topRow.appendChild(status);
                            item.appendChild(topRow);

                            const desc = document.createElement('span');
                            desc.textContent = a.desc;
                            desc.style.fontSize = '0.85rem';
                            desc.style.color = '#666';
                            desc.style.marginBottom = '8px';
                            desc.style.marginTop = '4px';
                            desc.style.lineHeight = '1.3';
                            item.appendChild(desc);

                            const barContainer = document.createElement('div');
                            barContainer.style.width = '100%';
                            barContainer.style.height = '8px';
                            barContainer.style.borderRadius = '4px';
                            barContainer.style.background = '#e0e0e0';
                            barContainer.style.overflow = 'hidden';

                            const bar = document.createElement('div');
                            bar.style.height = '100%';
                            bar.style.width = `${a.progress}%`;
                            bar.style.background =
                              a.progress >= 100
                                ? 'linear-gradient(90deg, #2e7d32, #43a047)'
                                : a.progress <= 0
                                  ? '#bdbdbd'
                                  : 'linear-gradient(90deg, #f57c00, #ffa726)';
                            bar.style.transition = 'width 0.3s ease';

                            barContainer.appendChild(bar);
                            item.appendChild(barContainer);

                            scrollContainer.appendChild(item);
                          });

                          menu.appendChild(scrollContainer);
                          menuWrapper.appendChild(menu);

                          // Toggle open/sluiten
                          button.addEventListener('click', () => {
                            const isOpen = !menuWrapper.hidden;
                            document.querySelectorAll('.topnav__menu-wrapper').forEach(el => el.hidden = true);
                            menuWrapper.hidden = isOpen;
                            button.setAttribute('aria-expanded', String(!isOpen));
                          });

                          // Klik buiten popup = sluiten
                          document.addEventListener('click', (e) => {
                            if (!wrapper.contains(e.target)) {
                              menuWrapper.hidden = true;
                              button.setAttribute('aria-expanded', 'false');
                            }
                          });

                          // Voeg knop toe
                          messagesBtn.parentNode.insertBefore(wrapper, messagesBtn);
                          wrapper.appendChild(button);
                          wrapper.appendChild(menuWrapper);

                        }); // visitPlanner
                      }); // visitResults
                    }); // visitOnlineSessions
                  }); // visitHandleiding
                }); // visitMyDocs
              }); // visitMail
            }); // visitNews
          }); // apiAssignmentFinishCallCount
        }); // hundredPercentCount
      }); // buizenCount
    }
  }, 200);
})();
