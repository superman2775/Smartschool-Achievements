//JavaScript here.

(function() {
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
            menu.style.maxWidth = '420px'; // <== Maximale breedte toegevoegd
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

            // Achievement data
            //How to make achievements:
            /* {
                    title: "Some random title",
                    desc: "Some random description.",
                    progress: value,
                    status: "bezig" (still needs to be automated)
                }, */
            const achievements = [
                {
                    title: "🏅 Eerste 10 taken ingeleverd",
                    desc: "Lever tien opdrachten in om deze badge te verdienen.",
                    progress: 80,
                    status: "bezig"
                },
                {
                    title: "📚 100 keer ingelogd",
                    desc: "Je bent een vaste bezoeker van Smartschool.",
                    progress: 100,
                    status: "voltooid"
                },
                {
                    title: "💬 5 berichten verstuurd",
                    desc: "Gebruik het berichtenplatform actief om te communiceren.",
                    progress: 100,
                    status: "voltooid"
                },
                {
                    title: "🎯 20 lessen gevolgd",
                    desc: "Voltooi twintig lesmodules in het leerplatform.",
                    progress: 30,
                    status: "bezig"
                },
                {
                    title: "🧠 50 quizzen voltooid",
                    desc: "Behaal een score in vijftig verschillende quizzen.",
                    progress: 0,
                    status: "vergrendeld"
                },
                {
                    title: "🚀 Actief in 5 vakken",
                    desc: "Werk regelmatig in minstens vijf verschillende vakken.",
                    progress: 60,
                    status: "bezig"
                }
            ];

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

                // Titelrij met status rechts
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

                if (a.status === "voltooid") {
                    status.textContent = "✅ Voltooid";
                    status.style.background = '#43a047';
                } else if (a.status === "bezig") {
                    status.textContent = "🔸 Bezig";
                    status.style.background = '#f57c00';
                } else {
                    status.textContent = "🔒 Vergrendeld";
                    status.style.background = '#757575';
                }

                topRow.appendChild(status);
                item.appendChild(topRow);

                // Beschrijving
                const desc = document.createElement('span');
                desc.textContent = a.desc;
                desc.style.fontSize = '0.85rem';
                desc.style.color = '#666';
                desc.style.marginBottom = '8px';
                desc.style.marginTop = '4px';
                desc.style.lineHeight = '1.3';
                item.appendChild(desc);

                // Voortgangsbalk
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
                    a.status === 'voltooid'
                        ? 'linear-gradient(90deg, #2e7d32, #43a047)'
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

            // Voeg knop toe tussen “Links” en “Berichten”
            messagesBtn.parentNode.insertBefore(wrapper, messagesBtn);
            wrapper.appendChild(button);
            wrapper.appendChild(menuWrapper);
        }
    }, 200);
})();

