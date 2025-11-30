/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

(function () {
  'use strict';

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TIMEZONE = 'Europe/Brussels'; // CET/CEST
  const KEYS = ['lastLogin', 'streak', 'highestStreak'];

  // return YYYY-MM-DD in CET/CEST
  function dateIsoInCET(date = new Date()) {
    return new Date(date).toLocaleDateString('en-CA', { timeZone: TIMEZONE });
  }

  // convert YYYY-MM-DD to day count (UTC days)
  function isoToDayCount(iso) {
    if (!iso || typeof iso !== 'string') return null;
    const p = iso.split('-').map(Number);
    if (p.length !== 3 || p.some(isNaN)) return null;
    return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / MS_PER_DAY);
  }

  // normalize stored value to YYYY-MM-DD (CET) if possible
  function normalizeStoredDate(val) {
    if (!val) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return dateIsoInCET(d);
  }

  function updateDailyStreak() {
    const todayIso = dateIsoInCET();
    const todayDay = isoToDayCount(todayIso);

    return new Promise((resolve) => {
      chrome.storage.local.get(KEYS, (data) => {
        try {
          const rawLast = data.lastLogin || null;
          let streak = Number.isFinite(Number(data.streak)) ? parseInt(data.streak, 10) : 0;
          let highest = Number.isFinite(Number(data.highestStreak)) ? parseInt(data.highestStreak, 10) : 0;

          if (!rawLast) {
            streak = 1;
            highest = Math.max(highest, streak);
            chrome.storage.local.set({ lastLogin: todayIso, streak, highestStreak: highest }, () => {
              resolve({ streak, highest, firstLogin: true });
            });
            return;
          }

          const lastIso = normalizeStoredDate(rawLast);
          if (!lastIso) {
            streak = 1;
            highest = Math.max(highest, streak);
            chrome.storage.local.set({ lastLogin: todayIso, streak, highestStreak: highest }, () => {
              resolve({ streak, highest, fixedMalformedDate: true });
            });
            return;
          }

          const lastDay = isoToDayCount(lastIso);
          if (lastDay === null) {
            streak = 1;
            highest = Math.max(highest, streak);
            chrome.storage.local.set({ lastLogin: todayIso, streak, highestStreak: highest }, () => {
              resolve({ streak, highest, fallbackReset: true });
            });
            return;
          }

          const diff = todayDay - lastDay;

          if (diff === 0) {
            resolve({ streak, highest, alreadyLoggedToday: true });
            return;
          }

          if (diff === 1) streak = streak + 1;
          else streak = 1;

          if (streak > highest) highest = streak;

          chrome.storage.local.set({ lastLogin: todayIso, streak, highestStreak: highest }, () => {
            resolve({ streak, highest, updated: true });
          });
        } catch (err) {
          console.error('[streak] update failed', err);
          resolve({ error: String(err) });
        }
      });
    });
  }

  // auto-run on load
  updateDailyStreak().then(res => console.debug('[streak] result', res));

  // expose for manual testing
  window.__Streak = { updateDailyStreak, dateIsoInCET };
})();