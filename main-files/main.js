/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775
*/

//Life is like a GitHub repo: nothing is gonna change if you don't commit.
(function () {
  'use strict';

  const SUPABASE_URL = 'https://gyyijtmbnnfjnywajbcg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5eWlqdG1ibm5mam55d2FqYmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjkxMzUsImV4cCI6MjA4OTAwNTEzNX0.FRs1eH7rAZ_EW2dyHtpKfKKsoe5nHQHvSUmZv5TeJCE';
  const LEADERBOARD_TABLE = 'leaderboard';
  const LEADERBOARD_SYNC_MS = 6 * 60 * 60 * 1000;
  const LEADERBOARD_URL = 'https://superman2775.github.io/Smartschool-Achievements/website/';

  const LEADERBOARD_NAME_PARTS = {
        adj: [
          'Brisk', 'Quiet', 'Solar', 'Nova', 'Iron', 'Swift', 'Wild', 'Lunar', 'Sharp', 'Bold',
          'Bright', 'Silent', 'Mighty', 'Clever', 'Fierce', 'Noble', 'Sly', 'Vivid', 'Daring', 'Stealthy',
          'Golden', 'Crimson', 'Azure', 'Amber', 'Emerald', 'Crystal', 'Shadowed', 'Stormy', 'Radiant', 'Frosty',
          'Glowing', 'Rugged', 'Curious', 'Fearless', 'Gentle', 'Hollow', 'Jovial', 'Keen', 'Lucky', 'Mellow'
        ],
        noun: [
          'Falcon', 'Comet', 'River', 'Pine', 'Echo', 'Orbit', 'Signal', 'Harbor', 'Glade', 'Forge',
          'Shadow', 'Blaze', 'Canyon', 'Meadow', 'Storm', 'Peak', 'Valley', 'Wolf', 'Hawk', 'Sparrow',
          'Cinder', 'Flare', 'Vortex', 'Summit', 'Beacon', 'Drift', 'Cascade', 'Harrier', 'Wanderer', 'Trail',
          'Grove', 'Mariner', 'Outrider', 'Quill', 'Ridge', 'Sage', 'Tide', 'Voyager', 'Zephyr', 'Anchor'
        ]
      };

  function createLeaderboardName() {
    const adj = LEADERBOARD_NAME_PARTS.adj[Math.floor(Math.random() * LEADERBOARD_NAME_PARTS.adj.length)];
    const noun = LEADERBOARD_NAME_PARTS.noun[Math.floor(Math.random() * LEADERBOARD_NAME_PARTS.noun.length)];
    const suffix = Math.floor(10 + Math.random() * 90);
    return `${adj}${noun}${suffix}`;
  }

  function isSupabaseConfigured() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
    if (SUPABASE_URL.includes('YOUR_') || SUPABASE_ANON_KEY.includes('YOUR_')) return false;
    return SUPABASE_URL.startsWith('https://');
  }

  function syncLeaderboardScore(xp, level) {
    if (!isSupabaseConfigured()) return;
    if (!Number.isFinite(xp)) return;

    chrome.storage.local.get([
      'ssaLeaderboardClientId',
      'ssaLeaderboardName',
      'ssaLeaderboardLastSync',
      'ssaLeaderboardLastXp'
    ], (res) => {
      const lastSync = res.ssaLeaderboardLastSync || 0;
      const lastXp = typeof res.ssaLeaderboardLastXp === 'number' ? res.ssaLeaderboardLastXp : -1;
      const shouldSync = (xp !== lastXp) || (Date.now() - lastSync > LEADERBOARD_SYNC_MS);
      if (!shouldSync) return;

      const clientId = res.ssaLeaderboardClientId
        || (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36));

      const name = res.ssaLeaderboardName || createLeaderboardName();

      fetch(`${SUPABASE_URL}/rest/v1/${LEADERBOARD_TABLE}?on_conflict=client_id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          client_id: clientId,
          name,
          xp,
          level,
          updated_at: new Date().toISOString()
        })
      }).then((resp) => {
        if (!resp.ok) throw new Error(`Leaderboard sync failed: ${resp.status}`);
        chrome.storage.local.set({
          ssaLeaderboardClientId: clientId,
          ssaLeaderboardName: name,
          ssaLeaderboardLastSync: Date.now(),
          ssaLeaderboardLastXp: xp
        });
      }).catch((err) => {
        console.warn('[Achievements] Leaderboard sync failed', err);
      });
    });
  }

  const waitForNav = setInterval(() => {
    const linksBtnWrapper = document.querySelector('[data-courses]');
    const messagesBtn = document.querySelector('[data-links]');
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
      button.style.position = 'relative';

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
      header.style.flex = '0 0 auto';
      header.style.setProperty('display', 'block', 'important');

      const titleRow = document.createElement('div');
      titleRow.style.display = 'flex';
      titleRow.style.alignItems = 'center';
      titleRow.style.justifyContent = 'space-between';
      titleRow.style.gap = '8px';
      titleRow.style.flexWrap = 'nowrap';
      titleRow.style.marginBottom = '12px';

      const titleEl = document.createElement('h2');
      titleEl.className = 'topnav__menu__title';
      titleEl.textContent = 'Achievements';
      titleEl.style.margin = '0';
      titleEl.style.display = 'inline-flex';
      titleEl.style.alignItems = 'center';
      titleEl.style.flex = '0 0 auto';
      titleEl.style.whiteSpace = 'nowrap';

      const leaderboardBtn = document.createElement('button');
      leaderboardBtn.type = 'button';
      leaderboardBtn.textContent = 'Leaderboard';
      leaderboardBtn.style.marginLeft = '0';
      leaderboardBtn.style.marginRight = '0';
      leaderboardBtn.style.display = 'inline-flex';
      leaderboardBtn.style.alignItems = 'center';
      leaderboardBtn.style.flex = '0 0 auto';
      leaderboardBtn.style.padding = '4px 10px';
      leaderboardBtn.style.borderRadius = '6px';
      leaderboardBtn.style.border = '1px solid #ccc';
      leaderboardBtn.style.background = '#fff';
      leaderboardBtn.style.cursor = 'pointer';
      leaderboardBtn.style.fontSize = '0.8rem';
      leaderboardBtn.style.fontWeight = '600';
      leaderboardBtn.style.color = '#333';
      titleRow.appendChild(titleEl);
      titleRow.appendChild(leaderboardBtn);
      header.appendChild(titleRow);
      menu.appendChild(header);

      let leaderboardOverlay = null;

        let leaderboardIframe = null;

        function buildLeaderboardUrl(clientId) {
          if (!clientId) return LEADERBOARD_URL;
          const joiner = LEADERBOARD_URL.includes('?') ? '&' : '?';
          return `${LEADERBOARD_URL}${joiner}cid=${encodeURIComponent(clientId)}`;
        }

        function openLeaderboardPopup() {
          const root = document.body || document.documentElement;
          if (!root) return;
          const showOverlay = (clientId) => {
            if (!leaderboardOverlay) {
              leaderboardOverlay = document.createElement('div');
              leaderboardOverlay.id = 'ssa-leaderboard-overlay';
              leaderboardOverlay.style.position = 'fixed';
              leaderboardOverlay.style.inset = '0';
              leaderboardOverlay.style.background = 'rgba(0, 0, 0, 0.45)';
              leaderboardOverlay.style.zIndex = '2147483647';
              leaderboardOverlay.style.display = 'flex';
              leaderboardOverlay.style.alignItems = 'center';
              leaderboardOverlay.style.justifyContent = 'center';
              leaderboardOverlay.style.padding = '20px';

              const panel = document.createElement('div');
              panel.style.width = 'min(960px, 100%)';
              panel.style.height = 'min(80vh, 720px)';
              panel.style.background = '#fff';
              panel.style.borderRadius = '12px';
              panel.style.boxShadow = '0 18px 40px rgba(0,0,0,0.2)';
              panel.style.position = 'relative';
              panel.style.overflow = 'hidden';

              const closeBtn = document.createElement('button');
              closeBtn.type = 'button';
              closeBtn.textContent = 'Close';
              closeBtn.style.position = 'absolute';
              closeBtn.style.top = '12px';
              closeBtn.style.right = '12px';
              closeBtn.style.zIndex = '2';
              closeBtn.style.padding = '6px 10px';
              closeBtn.style.borderRadius = '6px';
              closeBtn.style.border = '1px solid #ccc';
              closeBtn.style.background = '#fff';
              closeBtn.style.cursor = 'pointer';
              closeBtn.style.fontWeight = '600';

              leaderboardIframe = document.createElement('iframe');
              leaderboardIframe.title = 'Leaderboard';
              leaderboardIframe.style.width = '100%';
              leaderboardIframe.style.height = '100%';
              leaderboardIframe.style.border = 'none';

              closeBtn.addEventListener('click', () => {
                leaderboardOverlay.remove();
                leaderboardOverlay = null;
                leaderboardIframe = null;
              });

              leaderboardOverlay.addEventListener('click', (event) => {
                if (event.target === leaderboardOverlay) {
                  leaderboardOverlay.remove();
                  leaderboardOverlay = null;
                  leaderboardIframe = null;
                }
              });

              panel.appendChild(closeBtn);
              panel.appendChild(leaderboardIframe);
              leaderboardOverlay.appendChild(panel);
            }

            if (leaderboardIframe) {
              leaderboardIframe.src = buildLeaderboardUrl(clientId);
            }

            root.appendChild(leaderboardOverlay);
          };

          chrome.storage.local.get(['ssaLeaderboardClientId'], (res) => {
            let clientId = res.ssaLeaderboardClientId;
            if (!clientId) {
              clientId = (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2) + Date.now().toString(36);
              chrome.storage.local.set({ ssaLeaderboardClientId: clientId });
            }

            showOverlay(clientId);
          });
        }

      leaderboardBtn.addEventListener('click', openLeaderboardPopup);

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
      chrome.storage.local.get([
        "buizenCount", 
        "hundredPercentCount", 
        "apiAssignmentFinishCallCount", 
        "visitNews", 
        "visitMail", 
        "visitMyDocs", 
        "visitHandleiding", 
        "visitOnlineSessions", 
        "visitResults", 
        "visitPlanner", 
        "visitIntradesk", 
        "visitWopiCount", 
        "authorizedPlatformsCount",
        "visitLoginCount", 
        "highestStreak", 
        "redeemedCodes", 
        "bonusXP", 
        "joinedDiscord",
        "ssaNotificationLog"], (res) => {

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
        const visitIntradesk = res.visitIntradesk || 0;
        const visitWopiCount = res.visitWopiCount || 0;
        const authorizedPlatformsCount = res.authorizedPlatformsCount || 0;
        const visitLoginCount = res.visitLoginCount || 0;
        const highestStreak = res.highestStreak || 0;

        // === ACHIEVEMENTS ===
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
              title: "🗂️ File explorer",
              desc: "Open 1 bestand.",
              progress: Math.min((visitWopiCount / 1) * 100, 100),
              xp: 10
            },
            {
              title: "🗂️ File user",
              desc: "Open 10 bestanden.",
              progress: Math.min((visitWopiCount / 10) * 100, 100),
              xp: 25
            },
            {
              title: "🗂️ File ninja",
              desc: "Open 25 bestanden.",
              progress: Math.min((visitWopiCount / 25) * 100, 100),
              xp: 50
            },
            {
              title: "🗂️ File master",
              desc: "Open 50 bestanden.",
              progress: Math.min((visitWopiCount / 50) * 100, 100),
              xp: 75
            },
            {
              title: "🗂️ File monster",
              desc: "Open 100 bestanden.",
              progress: Math.min((visitWopiCount / 100) * 100, 100),
              xp: 100
            },
            {
              title: "🗂️ Final file",
              desc: "Open 250 bestanden.",
              progress: Math.min((visitWopiCount / 250) * 100, 100),
              xp: 150
            },
            {
              title: "🔗 Connected",
              desc: "Verbind je account met 1 platform.",
              progress: Math.min((authorizedPlatformsCount / 1) * 100, 100),
              xp: 10
            },
            {
              title: "🔗 Networker",
              desc: "Verbind je account met 5 platformen.",
              progress: Math.min((authorizedPlatformsCount / 5) * 100, 100),
              xp: 25
            },
            {
              title: "🔗 Interconnected",
              desc: "Verbind je account met 10 platformen.",
              progress: Math.min((authorizedPlatformsCount / 10) * 100, 100),
              xp: 50
            },
            {
              title: "🔗 Always connected",
              desc: "Verbind je account met 15 platformen.",
              progress: Math.min((authorizedPlatformsCount / 15) * 100, 100),
              xp: 100
            },
            {
              title: "🔑 Welcome!",
              desc: "Log 1 keer in op Smartschool.",
              progress: Math.min((visitLoginCount / 1) * 100, 100),
              xp: 10
            },
            {
              title: "🔑 Remember password?",
              desc: "Log 5 keer in op Smartschool.",
              progress: Math.min((visitLoginCount / 5) * 100, 100),
              xp: 25
            },
            {
              title: "🔑 Back!",
              desc: "Log 10 keer in op Smartschool.",
              progress: Math.min((visitLoginCount / 10) * 100, 100),
              xp: 50
            },
            {
              title: "🔑 Routine",
              desc: "Log 50 keer in op Smartschool.",
              progress: Math.min((visitLoginCount / 50) * 100, 100),
              xp: 75
            },
            {
              title: "🔑 Ah sh*t, here we go again",
              desc: "Log 250 keer in op Smartschool.",
              progress: Math.min((visitLoginCount / 250) * 100, 100),
              xp: 100
            },
            {
              title: "🔑 SCHOOL IS FREAKING ME OUT!",
              desc: "Log 500 keer in op Smartschool.",
              progress: Math.min((visitLoginCount / 500) * 100, 100),
              xp: 200
            },
            {
              title: "⬇️ + 200 XP!",
              desc: "Download Smartschool Achievements.",
              progress: 100,
              xp: 200
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
              title: "🗂️ Fake OneDrive 2.0",
              desc: "Bekijk de Intradesk.",
              progress: visitIntradesk * 100,
              secret: true,
              xp: 20
            },
            {
              title: "🌡️ Room temperature IQ", //Steven He reference again
              desc: "Krijg 250 buizen",
              progress: Math.min((buizen / 250) * 100, 100),
              secret: true,
              xp: 200
            },
            {
              title: "💬 Join the Discord",
              desc: "Join de Discord server.",
              progress: res.joinedDiscord ? 100 : 0, //standaard niet behaald, maar wordt toegekend via code "JOINTHEDISCORDANDGETACHIEVEMENT"
              secret: true,
              xp: 1000
            },
            {
              title: "🔥 3 in a row!",
              desc: "Log 3 dagen achter elkaar in op Smartschool.",
              progress: Math.min((highestStreak / 3) * 100, 100),
              secret: true,
              xp: 10
            },
            {
              title: "🔥 Full week streak!",
              desc: "Log 7 dagen achter elkaar in op Smartschool.",
              progress: Math.min((highestStreak / 7) * 100, 100),
              secret: true,
              xp: 25
            },
            {
              title: "🔥 2 weeks in a row!",
              desc: "Log 14 dagen achter elkaar in op Smartschool.",
              progress: Math.min((highestStreak / 14) * 100, 100),
              secret: true,
              xp: 50
            },
            {
              title: "🔥 A MONTH?!",
              desc: "Log 30 dagen achter elkaar in op Smartschool.",
              progress: Math.min((highestStreak / 30) * 100, 100),
              secret: true,
              xp: 100
            },
            {
              title: "🔥 Addicted",
              desc: "Log 60 dagen achter elkaar in op Smartschool.",
              progress: Math.min((highestStreak / 60) * 100, 100),
              secret: true,
              xp: 250
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
        syncLeaderboardScore(totalXP, level);

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
            status.textContent = "❌ Niet gestart";
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

        // === Code inwisselen ===
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
          "TEAMSMARTSCHOOLACHIEVEMENTS1000": 1000,
          "HAPPYNEWYEAR2027": 500,
          "SUMMERVIBES2026": 250,
          "BACK2SCHOOL2026": 250,
          "LUCKYUSER1000": 1000,
          "LUCKYUSER500": 500,
          "JOINTHEDISCORDANDGETACHIEVEMENT": 0,
          "ITLEARNISAMAZING": 1000,
          "SMARTSCHOOLISLIFE": 100,
          "EASTER2026": 250,
          "HALLOWEEN2026": 250,
          "ANNIVERSARY2026": 500,
          "SUPERMANBIRTHDAY2026": 1000
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

          if (code === "JOINTHEDISCORDANDGETACHIEVEMENT") { //bruh i made a huge miss steak here
            chrome.storage.local.set({ joinedDiscord: true }, () => {
              redeemStatus.textContent = "✅ Discord achievement ontgrendeld!";
              redeemStatus.style.color = "#43a047";
              codeInput.value = '';
              setTimeout(() => location.reload(), 800);
            });
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

        // === SSA NOTIFICATION SYSTEM (LOCAL) ===
        (function () {
          const NOTIF_DURATION = 5000;
          const NOTIF_GAP = 10;
          const MAX_LOG = 50;

          function createId() {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
            return Math.random().toString(36).slice(2) + Date.now().toString(36);
          }

          function nowIso() {
            return new Date().toISOString();
          }

          function typeColor(type) {
            if (type === 'level') return '#29b6f6';
            if (type === 'info') return '#6d4c41';
            return '#43a047';
          }

          function ensureNotificationStyles() {
            if (document.getElementById('ssa-achievements-notification-styles')) return;

            const style = document.createElement('style');
            style.id = 'ssa-achievements-notification-styles';
            style.textContent = `
#ssa-achievements-notifications .ssa-toast {
  background: #ffffff !important;
  background-color: #ffffff !important;
}
.ssa-notifications-panel {
  background: #fafafa !important;
  background-color: #fafafa !important;
}
.ssa-notification-row {
  background: #ffffff !important;
  background-color: #ffffff !important;
}
`;
            const styleRoot = document.head || document.documentElement;
            if (styleRoot) {
              styleRoot.appendChild(style);
            } else {
              document.addEventListener('DOMContentLoaded', () => {
                if (!document.getElementById('ssa-achievements-notification-styles')) {
                  (document.head || document.documentElement).appendChild(style);
                }
              }, { once: true });
            }
          }

          function ensureContainer() {
            ensureNotificationStyles();
            let container = document.getElementById('ssa-achievements-notifications');
            if (container) return container;

            container = document.createElement('div');
            container.id = 'ssa-achievements-notifications';
            container.className = 'notifs-toaster js-focus-trap-allow-outside-click';
            container.style.position = 'fixed';
            container.style.right = '16px';
            container.style.bottom = '16px';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = `${NOTIF_GAP}px`;
            container.style.zIndex = '2147483647';
            container.style.pointerEvents = 'none';

            const root = document.body || document.documentElement;
            if (!root) {
              const attachLater = () => {
                const lateRoot = document.body || document.documentElement;
                if (lateRoot && !document.getElementById('ssa-achievements-notifications')) {
                  lateRoot.appendChild(container);
                }
              };

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', attachLater, { once: true });
              } else {
                setTimeout(attachLater, 0);
              }

              return container;
            }

            root.appendChild(container);
            return container;
          }

          function buildToast(data) {
            const toast = document.createElement('div');
            toast.className = 'ssa-toast notifs-toaster__toast modern-ui';
            toast.style.background = '#ffffff';
            toast.style.border = '1px solid rgba(0,0,0,0.08)';
            toast.style.borderLeft = `4px solid ${typeColor(data.type)}`;
            toast.style.borderRadius = '8px';
            toast.style.padding = '14px 16px';
            toast.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
            toast.style.maxWidth = '380px';
            toast.style.fontSize = '0.95rem';
            toast.style.color = '#333';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
            toast.style.pointerEvents = 'auto';

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.justifyContent = 'space-between';
            header.style.gap = '8px';

            const title = document.createElement('div');
            title.textContent = data.title;
            title.style.fontWeight = '600';
            title.style.display = 'flex';
            title.style.alignItems = 'center';
            title.style.gap = '6px';

            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.textContent = 'x';
            closeBtn.style.background = 'transparent';
            closeBtn.style.border = 'none';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '1rem';
            closeBtn.style.lineHeight = '1';
            closeBtn.style.color = '#777';

            header.appendChild(title);
            header.appendChild(closeBtn);
            toast.appendChild(header);

            const body = document.createElement('div');
            body.textContent = data.body;
            body.style.marginTop = '4px';
            body.style.color = '#555';
            toast.appendChild(body);

            closeBtn.addEventListener('click', () => {
              toast.remove();
            });

            const showToast = () => {
              toast.style.opacity = '1';
              toast.style.transform = 'translateY(0)';
            };

            if (typeof requestAnimationFrame === 'function') {
              requestAnimationFrame(showToast);
            } else {
              setTimeout(showToast, 0);
            }

            setTimeout(() => {
              toast.style.opacity = '0';
              toast.style.transform = 'translateY(8px)';
              setTimeout(() => toast.remove(), 200);
            }, NOTIF_DURATION);

            return toast;
          }

          function formatTime(iso) {
            try {
              const date = new Date(iso);
              if (Number.isNaN(date.getTime())) return '';
              return date.toLocaleString();
            } catch {
              return '';
            }
          }

          let notificationLog = Array.isArray(res.ssaNotificationLog) ? res.ssaNotificationLog : [];
          const initialNow = Date.now();
          notificationLog = notificationLog.map(item => ({
            ...item,
            expiresAt: item.expiresAt || (initialNow + NOTIF_DURATION)
          }));

          function pruneExpired() {
            const now = Date.now();
            const nextLog = notificationLog.filter(item => !item.expiresAt || item.expiresAt > now);
            if (nextLog.length !== notificationLog.length) {
              notificationLog = nextLog;
              chrome.storage.local.set({ ssaNotificationLog: notificationLog });
              return true;
            }
            return false;
          }

          chrome.storage.local.get(["seenAchievements", "lastLevel"], (old) => {
            const seen = old.seenAchievements || [];
            const lastLevel = old.lastLevel || 0;

            const newlyCompleted = achievements.filter(a => a.progress >= 100 && !seen.includes(a.title));
            const hasLevelUp = level > lastLevel;

            const generated = [];

            newlyCompleted.forEach(a => {
              generated.push({
                id: createId(),
                type: 'achievement',
                title: 'Achievement unlocked',
                body: `${a.title} - ${a.desc} (+${a.xp} XP)`,
                ts: nowIso(),
                expiresAt: Date.now() + NOTIF_DURATION
              });
              seen.push(a.title);
            });

            if (hasLevelUp) {
              generated.push({
                id: createId(),
                type: 'level',
                title: 'Level up',
                body: `You reached level ${level}.`,
                ts: nowIso(),
                expiresAt: Date.now() + NOTIF_DURATION
              });
            }

            if (generated.length > 0) {
              const container = ensureContainer();
              generated.forEach((item) => {
                const toast = buildToast({
                  type: item.type,
                  title: item.title,
                  body: item.body
                });
                container.appendChild(toast);
              });

              const merged = generated.concat(notificationLog).slice(0, MAX_LOG);
              chrome.storage.local.set({
                ssaNotificationLog: merged,
                seenAchievements: seen,
                lastLevel: level
              }, () => {
                notificationLog = merged;
                setTimeout(() => {
                  pruneExpired();
                }, NOTIF_DURATION + 300);
              });
            }
          });
        })();

      });
    }
  }, 200);
})();

