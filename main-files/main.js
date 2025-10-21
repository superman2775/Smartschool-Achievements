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

      const refMenu = shortcutsMenu.querySelector('.topnav__menu');
      const menu = document.createElement('div');
      menu.className = 'topnav__menu topnav__menu--shortcuts js-achievements-container js-autosize';
      menu.style.minWidth = getComputedStyle(refMenu).minWidth || getComputedStyle(refMenu).width;
      menu.style.maxHeight = getComputedStyle(refMenu).maxHeight || '480px';
      menu.style.maxWidth = '420px';
      menu.style.overflow = 'hidden';
      menu.style.display = 'flex';
      menu.style.flexDirection = 'column';

      const header = document.createElement('div');
      header.className = 'topnav__menu__hdr';
      header.innerHTML = `<h2 class="topnav__menu__title" style="margin-left:10px;">Achievements</h2>`;
      header.style.flex = '0 0 auto';
      menu.appendChild(header);

      // === XP + Level sectie ===
      const xpContainer = document.createElement('div');
      xpContainer.style.margin = '0 10px 10px 10px';
      xpContainer.style.display = 'flex';
      xpContainer.style.flexDirection = 'column';
      xpContainer.style.gap = '4px';

      const xpDisplay = document.createElement('div');
      xpDisplay.style.fontWeight = '600';
      xpDisplay.style.color = '#f9a825';
      xpDisplay.textContent = '🌟 Totaal XP: 0';

      const levelDisplay = document.createElement('div');
      levelDisplay.style.fontWeight = '600';
      levelDisplay.style.color = '#29b6f6';
      levelDisplay.textContent = '🧠 Level 0 (0 / 100 XP)';

      const levelBarContainer = document.createElement('div');
      levelBarContainer.style.width = '100%';
      levelBarContainer.style.height = '8px';
      levelBarContainer.style.borderRadius = '4px';
      levelBarContainer.style.background = '#e0e0e0';
      levelBarContainer.style.overflow = 'hidden';

      const levelBar = document.createElement('div');
      levelBar.style.height = '100%';
      levelBar.style.width = '0%';
      levelBar.style.background = 'linear-gradient(90deg, #29b6f6, #0288d1)';
      levelBar.style.transition = 'width 0.3s ease';

      levelBarContainer.appendChild(levelBar);
      xpContainer.appendChild(xpDisplay);
      xpContainer.appendChild(levelDisplay);
      xpContainer.appendChild(levelBarContainer);
      menu.appendChild(xpContainer);

      const scrollContainer = document.createElement('div');
      scrollContainer.style.flex = '1 1 auto';
      scrollContainer.style.overflowY = 'auto';
      scrollContainer.style.maxHeight = '400px';
      scrollContainer.style.paddingRight = '4px';

      const separator = document.createElement('hr');
      separator.style.border = 'none';
      separator.style.height = '1px';
      separator.style.background = '#ddd';
      separator.style.margin = '8px 10px';
      menu.appendChild(separator);

      // === DATA OPHALEN ===
      chrome.storage.local.get(["buizenCount", "hundredPercentCount", "apiAssignmentFinishCallCount", "visitNews", "visitMail", "visitMyDocs", "visitHandleiding", "visitOnlineSessions", "visitResults", "visitPlanner", "redeemedCodes", "bonusXP"], (res) => {

        const buizen = res.buizenCount || 0;
        const hundredPercent = res.hundredPercentCount || 0;
        const apiAssignmentFinishCallCount = res.apiAssignmentFinishCallCount || 0;
        const visitNews = res.visitNews || 0;
        const visitMail = res.visitMail || 0;
        const visitMyDocs = res.visitMyDocs || 0;
        const visitHandleiding = res.visitHandleiding || 0;
        const visitOnlineSessions = res.visitOnlineSessions || 0;
        const visitResults = res.visitResults || 0;
        const visitPlanner = res.visitPlanner || 0;

        // === ACHIEVEMENTS (zoals bij jou) ===
        const achievements = [
           {
              title: "😩 One of many",
              desc: "Buis op 1 toets.",
              progress: Math.min((buizen / 1) * 100, 100),
              xp: 10
            },
            {
              title: "😩 Five of many",
              desc: "Buis op 5 toetsen.",
              progress: Math.min((buizen / 5) * 100, 100),
              xp: 25
            },
            {
              title: "😩 Ten of many",
              desc: "Buis op 10 toetsen.",
              progress: Math.min((buizen / 10) * 100, 100),
              xp: 50
            },
            {
              title: "😩 Twenty-five of many",
              desc: "Buis op 25 toetsen.",
              progress: Math.min((buizen / 25) * 100, 100),
              xp: 75
            },
            {
              title: "😩 Just too many",
              desc: "Buis op 50 toetsen.",
              progress: Math.min((buizen / 50) * 100, 100),
              xp: 100
            },
            {
              title: "😩 Way too many",
              desc: "Buis op 100 toetsen.",
              progress: Math.min((buizen / 100) * 100, 100),
              xp: 125
            },
            {
              title: "🤓 Beginners luck",
              desc: "Haal 100% op 1 toets.",
              progress: Math.min((hundredPercent / 1) * 100, 100),
              xp: 10
            },
            {
              title: "🤓 Just lucky",
              desc: "Haal 100% op 20 toetsen.",
              progress: Math.min((hundredPercent / 20) * 100, 100),
              xp: 25
            },
            {
              title: "🤓 Teacher loves me ig",
              desc: "Haal 100% op 50 toetsen.",
              progress: Math.min((hundredPercent / 50) * 100, 100),
              xp: 50
            },
            {
              title: "🤓 Big brain",
              desc: "Haal 100% op 100 toetsen.",
              progress: Math.min((hundredPercent / 100) * 100, 100),
              xp: 75
            },
            {
              title: "🤓 Teacher's pet",
              desc: "Haal 100% op 250 toetsen.",
              progress: Math.min((hundredPercent / 250) * 100, 100),
              xp: 100
            },
            {
              title: "🤓 Nerd",
              desc: "Haal 100% op 500 toetsen.",
              progress: Math.min((hundredPercent / 500) * 100, 100),
              xp: 125
            },
            {
              title: "🤓 No life 💀",
              desc: "Haal 100% op 1000 toetsen.",
              progress: Math.min((hundredPercent / 1000) * 100, 100),
              xp: 150
            },
            {
              title: "⬇️ + 200 XP!",
              desc: "Download Smartschool Achievements.",
              progress: 100,
              xp: 200
            },
            {
              title: "✅ One down!",
              desc: "Werk 1 taak af.",
              progress: Math.min((apiAssignmentFinishCallCount / 1) * 100, 100),
              xp: 10
            },
            {
              title: "✅ Keep it going",
              desc: "Werk 10 taken af.",
              progress: Math.min((apiAssignmentFinishCallCount / 10) * 100, 100),
              xp: 25
            },
            {
              title: "✅ They see me rollin'",
              desc: "Werk 50 taken af.",
              progress: Math.min((apiAssignmentFinishCallCount / 50) * 100, 100),
              xp: 50
            },
            {
              title: "✅ Taskmaster",
              desc: "Werk 100 taken af.",
              progress: Math.min((apiAssignmentFinishCallCount / 100) * 100, 100),
              xp: 75
            },
            {
              title: "✅ Multitasker",
              desc: "Werk 250 taken af.",
              progress: Math.min((apiAssignmentFinishCallCount / 250) * 100, 100),
              xp: 100
            },
            {
              title: "✅ Task legend",
              desc: "Werk 500 taken af.",
              progress: Math.min((apiAssignmentFinishCallCount / 500) * 100, 100),
              xp: 125
            },
            {
              title: "✅ Task god",
              desc: "Werk 1000 taken af.",
              progress: Math.min((apiAssignmentFinishCallCount / 1000) * 100, 100),
              xp: 150
            },
            {
              title: "📰 What's the news?",
              desc: "Bekijk het vaknieuws.",
              progress: visitNews * 100,
              secret: true,
              xp: 20
            },
            {
              title: "📧 OMG I GOT A MESSAGE!",
              desc: "Bekijk je berichten.",
              progress: visitMail * 100,
              secret: true,
              xp: 10
            },
            {
              title: "📁 Fake OneDrive",
              desc: "Bekijk Mijn Documenten.",
              progress: visitMyDocs * 100,
              secret: true,
              xp: 20
            },
            {
              title: "🤔 Who even uses this??",
              desc: "Bekijk de handleiding.",
              progress: visitHandleiding * 100,
              secret: true,
              xp: 25
            },
            {
              title: "🎥 2020 flashback",
              desc: "Bekijk Online Sessies.",
              progress: visitOnlineSessions * 100,
              secret: true,
              xp: 25
            },
            {
              title: "📝 FAILURE", // For those who don't know: it is a reference to Steven He
              desc: "Bekijk Resultaten.",
              progress: visitResults * 100,
              secret: true,
              xp: 10
            },
            {
              title: "✍️ Oh no I have homework!",
              desc: "Bekijk de Planner.",
              progress: visitPlanner * 100,
              secret: true,
              xp: 10
            },
            {
              title: "🌡️ Room temperature IQ", //Steven He reference again
              desc: "Krijg 250 buizen",
              progress: Math.min((buizen / 250) * 100, 100),
              secret: true,
              xp: 200
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

        // === TOTAAL XP (inclusief bonusXP van codes) ===
        const bonusXP = res.bonusXP || 0;
        const totalXP = achievements.reduce((sum, a) => sum + ((a.progress >= 100) ? (a.xp || 0) : 0), 0) + bonusXP;
        xpDisplay.textContent = `🌟 Totaal XP: ${totalXP}`;

        // === LEVEL berekenen ===
        const baseXP = 100;
        let level = 0;
        let xpLeft = totalXP;
        let xpNeededForNextLevel = baseXP + (level * 100);

        while (xpLeft >= xpNeededForNextLevel) {
          xpLeft -= xpNeededForNextLevel;
          level++;
          xpNeededForNextLevel = baseXP + (level * 100);
        }

        const progressPercent = (xpLeft / xpNeededForNextLevel) * 100;
        levelDisplay.textContent = `🧠 Level ${level} (${xpLeft} / ${xpNeededForNextLevel} XP naar level ${level + 1})`;
        levelBar.style.width = `${progressPercent}%`;

        // === ACHIEVEMENTS MAKEN ===
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
          bar.style.background = a.progress >= 100
            ? 'linear-gradient(90deg, #2e7d32, #43a047)'
            : a.progress <= 0
              ? '#bdbdbd'
              : 'linear-gradient(90deg, #f57c00, #ffa726)';
          bar.style.transition = 'width 0.3s ease';

          barContainer.appendChild(bar);
          item.appendChild(barContainer);
          scrollContainer.appendChild(item);
        });

        // === 💥 TOEVOEGING: Code inwisselen ===
        const redeemContainer = document.createElement('div');
        redeemContainer.className = 'achievement-item topnav__menuitem';
        redeemContainer.style.display = 'flex';
        redeemContainer.style.flexDirection = 'column';
        redeemContainer.style.alignItems = 'flex-start';
        redeemContainer.style.width = '100%';
        redeemContainer.style.padding = '10px 14px';
        redeemContainer.style.boxSizing = 'border-box';
        redeemContainer.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        redeemContainer.style.background = '#fafafa';

        const redeemTitle = document.createElement('span');
        redeemTitle.textContent = '🎁 Code inwisselen';
        redeemTitle.style.fontWeight = '600';
        redeemTitle.style.marginBottom = '6px';
        redeemContainer.appendChild(redeemTitle);

        const redeemDesc = document.createElement('span');
        redeemDesc.textContent = 'Voer een code in om XP te verdienen.';
        redeemDesc.style.fontSize = '0.85rem';
        redeemDesc.style.color = '#666';
        redeemDesc.style.marginBottom = '8px';
        redeemContainer.appendChild(redeemDesc);

        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.width = '100%';
        inputRow.style.gap = '6px';

        const codeInput = document.createElement('input');
        codeInput.type = 'text';
        codeInput.placeholder = 'Voer code in...';
        codeInput.style.flex = '1';
        codeInput.style.padding = '6px 8px';
        codeInput.style.border = '1px solid #ccc';
        codeInput.style.borderRadius = '4px';
        codeInput.style.fontSize = '0.85rem';

        const redeemBtn = document.createElement('button');
        redeemBtn.textContent = 'Inwisselen';
        redeemBtn.style.background = '#43a047';
        redeemBtn.style.color = '#fff';
        redeemBtn.style.border = 'none';
        redeemBtn.style.borderRadius = '4px';
        redeemBtn.style.padding = '6px 10px';
        redeemBtn.style.cursor = 'pointer';
        redeemBtn.style.fontWeight = '600';

        inputRow.appendChild(codeInput);
        inputRow.appendChild(redeemBtn);
        redeemContainer.appendChild(inputRow);

        const redeemStatus = document.createElement('span');
        redeemStatus.style.fontSize = '0.8rem';
        redeemStatus.style.color = '#555';
        redeemStatus.style.marginTop = '6px';
        redeemContainer.appendChild(redeemStatus);

        scrollContainer.appendChild(redeemContainer);

        const validCodes = {
          "WHOPPER": 100,
          "TEAMSMARTSCHOOLACHIEVEMENTSISGREAT": 1000,
          "HAPPYNEWYEAR2026": 500,
          "ILOVECOOKIES": 50
        };

        let redeemed = res.redeemedCodes || [];
        let currentBonusXP = bonusXP;

        redeemBtn.addEventListener('click', () => {
          const code = codeInput.value.trim().toUpperCase();
          if (!code) {
            redeemStatus.textContent = "⚠️ Vul eerst een code in.";
            redeemStatus.style.color = "#f57c00";
            return;
          }

          if (redeemed.includes(code)) {
            redeemStatus.textContent = "❌ Code al gebruikt.";
            redeemStatus.style.color = "#e53935";
            return;
          }

          if (validCodes[code]) {
            const gainedXP = validCodes[code];
            currentBonusXP += gainedXP;
            redeemed.push(code);

            chrome.storage.local.set({ redeemedCodes: redeemed, bonusXP: currentBonusXP }, () => {
              redeemStatus.textContent = `✅ ${gainedXP} XP toegevoegd!`;
              redeemStatus.style.color = "#43a047";
              codeInput.value = '';
              setTimeout(() => location.reload(), 800);
            });
          } else {
            redeemStatus.textContent = "❌ Ongeldige code.";
            redeemStatus.style.color = "#e53935";
          }
        });
        // === EINDE TOEVOEGING ===

        menu.appendChild(scrollContainer);
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
      });
    }
  }, 200);
})();
