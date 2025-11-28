/* This file is part of Smartschool Achievements.
Don't use this file without permission
Author: @superman2775 + @broodje565
*/

//this script works, so don't touch it
function updateDailyStreak() {
    const today = new Date();
    const todayKey = today.toDateString(); // e.g. "Mon Jan 01 2025"

    // Load stored values
    const lastLogin = localStorage.getItem("lastLogin");
    let streak = parseInt(localStorage.getItem("streak") || "0");
    let highestStreak = parseInt(localStorage.getItem("highestStreak") || "0");

    // First time login ever
    if (!lastLogin) {
        streak = 1;
        highestStreak = 1;
        localStorage.setItem("lastLogin", todayKey);
        localStorage.setItem("streak", streak);
        localStorage.setItem("highestStreak", highestStreak);
        return { streak, highestStreak, firstLogin: true };
    }

    // Convert date strings to actual dates
    const last = new Date(lastLogin);

    // Check difference in days
    const diffTime = today - last;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Already logged in today – no change
        return { streak, highestStreak, alreadyLoggedToday: true };
    } 
    
    if (diffDays === 1) {
        // Logged in yesterday → increase streak
        streak += 1;
    } else {
        // Missed one or more days → reset streak
        streak = 1;
    }

    // Update highest streak
    if (streak > highestStreak) {
        highestStreak = streak;
    }

    // Save updates
    localStorage.setItem("lastLogin", todayKey);
    localStorage.setItem("streak", streak);
    localStorage.setItem("highestStreak", highestStreak);

    return { streak, highestStreak, updated: true };
}
