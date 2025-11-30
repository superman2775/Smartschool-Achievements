/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

//this script works, so don't touch it
function updateDailyStreak() {
    const today = new Date();
    const todayKey = today.toDateString(); // e.g. "Mon Jan 01 2025"

    return new Promise((resolve) => {
        chrome.storage.local.get(
            ["lastLogin", "streak", "highestStreak"],
            (data) => {

                const lastLogin = data.lastLogin || null;
                let streak = parseInt(data.streak || "0");
                let highestStreak = parseInt(data.highestStreak || "0");

                // First time login ever
                if (!lastLogin) {
                    streak = 1;
                    highestStreak = 1;
                    chrome.storage.local.set({
                        lastLogin: todayKey,
                        streak,
                        highestStreak
                    }, () => {
                        resolve({ streak, highestStreak, firstLogin: true });
                    });
                    return;
                }

                const last = new Date(lastLogin);

                const diffTime = today - last;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    // Already logged in today – no change
                    resolve({ streak, highestStreak, alreadyLoggedToday: true });
                    return;
                }

                if (diffDays === 1) {
                    streak += 1; // increase streak
                } else {
                    streak = 1; // reset streak
                }

                if (streak > highestStreak) {
                    highestStreak = streak;
                }

                chrome.storage.local.set({
                    lastLogin: todayKey,
                    streak,
                    highestStreak
                }, () => {
                    resolve({ streak, highestStreak, updated: true });
                });
            }
        );
    });
}
