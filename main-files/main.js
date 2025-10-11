//JavaScript here.


//This should add the achievements button.
(function() {
    'use strict';

    const waitForNav = setInterval(() => {
        const linksBtnWrapper = document.querySelector('[data-links]');
        const messagesBtn = document.querySelector('.js-btn-messages');

        if (linksBtnWrapper && messagesBtn) {
            clearInterval(waitForNav);

            const wrapper = document.createElement('div');
            wrapper.className = 'topnav__btn-wrapper';

            const button = document.createElement('button');
            button.className = 'js-btn-achievements topnav__btn';
            button.innerHTML = 'Achievements';
            button.setAttribute('aria-haspopup', 'true');
            button.setAttribute('aria-expanded', 'false');

            const menuWrapper = document.createElement('div');
            menuWrapper.id = 'achievementsMenu';
            menuWrapper.className = 'topnav__menu-wrapper';
            menuWrapper.tabIndex = -1;
            menuWrapper.hidden = true;
            menuWrapper.role = 'menu';

            const menu = document.createElement('div');
            menu.className = 'topnav__menu topnav__menu--shortcuts js-achievements-container';
            menu.innerHTML = `
                <div class="topnav__menu__hdr">
                    <h2 class="topnav__menu__title" style="margin-left:10px;">Achievements</h2>
                </div>
                <a href="#" class="topnav__menuitem topnav__menuitem--icon module-results--24" role="menuitem">
                    🏅 Eerste 10 taken ingeleverd
                </a>
                <a href="#" class="topnav__menuitem topnav__menuitem--icon module-planner--24" role="menuitem">
                    📚 100 keer ingelogd
                </a>
                <a href="#" class="topnav__menuitem topnav__menuitem--icon module-news--24" role="menuitem">
                    💬 5 berichten verstuurd
                </a>
                <hr class="menu-divider">
                <a href="#" class="topnav__menuitem topnav__menuitem--icon module-manual--24" role="menuitem">
                    Bekijk alle achievements
                </a>
            `;
            menuWrapper.appendChild(menu);

            button.addEventListener('click', () => {
                const isOpen = !menuWrapper.hidden;
                document.querySelectorAll('.topnav__menu-wrapper').forEach(el => el.hidden = true);
                menuWrapper.hidden = isOpen;
                button.setAttribute('aria-expanded', String(!isOpen));
            });

            document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                    menuWrapper.hidden = true;
                    button.setAttribute('aria-expanded', 'false');
                }
            });

            messagesBtn.parentNode.insertBefore(wrapper, messagesBtn);
            wrapper.appendChild(button);
            wrapper.appendChild(menuWrapper);
        }
    }, 200);
})();

