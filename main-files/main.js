//JavaScript here.


//This should add the achievements button.
(function() {
    'use strict';

    // Wacht tot de topnav geladen is
    const waitForNav = setInterval(() => {
        const linksBtnWrapper = document.querySelector('[data-links]');
        const messagesBtn = document.querySelector('.js-btn-messages');

        if (linksBtnWrapper && messagesBtn) {
            clearInterval(waitForNav);

            // Nieuwe button-wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'topnav__btn-wrapper';

            // Button zelf
            const button = document.createElement('button');
            button.className = 'js-btn-custom topnav__btn';
            button.innerHTML = 'Extra';
            button.setAttribute('aria-haspopup', 'true');
            button.setAttribute('aria-expanded', 'false');

            // Menu-wrapper (popup)
            const menuWrapper = document.createElement('div');
            menuWrapper.id = 'customMenu';
            menuWrapper.className = 'topnav__menu-wrapper';
            menuWrapper.tabIndex = -1;
            menuWrapper.hidden = true;
            menuWrapper.role = 'menu';

            // Inhoud van popup
            const menu = document.createElement('div');
            menu.className = 'topnav__menu topnav__menu--shortcuts';
            menu.innerHTML = `
                <a href="#" class="topnav__menuitem topnav__menuitem--icon module-news--24" role="menuitem">Item 1</a>
                <a href="#" class="topnav__menuitem topnav__menuitem--icon module-results--24" role="menuitem">Item 2</a>
                <a href="#" class="topnav__menuitem topnav__menuitem--icon module-planner--24" role="menuitem">Item 3</a>
            `;
            menuWrapper.appendChild(menu);

            // Toggle gedrag (zoals “Ga naar”)
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

            // Plaats de knop tussen Links en Berichten
            messagesBtn.parentNode.insertBefore(wrapper, messagesBtn);
            wrapper.appendChild(button);
            wrapper.appendChild(menuWrapper);
        }
    }, 200);
})();
