/**
 * remedies.js — Remedy System
 * Manages self-help, management, and violation remedies.
 */

import { calculateGuiltScore } from './calculations.js';
import { recordEvent } from './ui.js';
import { setWfhApproved } from './state.js';

// ===== REMEDY DATA =====

const userRemedies = {
    testUps: '🔌 Testing UPS... Status: Stable (for now).',
    testDock: '💻 Docking station reconnected. All monitors lit up!',
    coffee: '☕ Brewing coffee... Aroma spreading. Morale +10%',
    fan: '🌀 Fan turned on. Airflow restored. Brain rebooting.',
    lights: '💡 Lights toggled. Illumination optimized.',
    ping: '📡 Pinging gateway... Reply from 192.168.1.1: time=1ms',
    outlook: "📩 Outlook alert sent: 'System under stress. Send help.'",
    reset: '🔁 System timeout applied. 5-minute reset initiated.',
    stretch: '🧘 2-minute stretch complete. Circulation restored.',
    pushups: '💪 10 push-ups done. Adrenaline +5%.',
    breath: '🌬️ Deep breath taken. Calm restored.',
    walk: '🚶 15-minute walk scheduled. Nature therapy activated.',
    shoes: '👣 Shoes off! Toes curled into plush shag carpet — just like McClane in Nakatomi Plaza. Stress melting away.',
    beach: "🌊 Close your eyes… waves lapping, palm trees swaying, steel drum music… It's 5 o'clock somewhere. Breathe it in.",
    buyDonuts: "🍩 You've bought donuts for the team! Everyone enjoys a sweet treat.",
    writtenUp: "📝 You've accepted a written warning. HR has been notified.",
    happyHour: "🍹 You've paid for the team's happy hour bar tab on Friday! Cheers!",
};

const managementRemedies = {
    donut: '🍩 Krispy Kreme order placed! Donuts arriving in 30 mins.',
    sub: '🥪 Jason Deli subs en route! Feast in 45 mins.',
    wfh: "🏡 Work From Home approved for the rest of the day! Pack your laptop!",
    dayoff: "🎉 You've been granted the rest of the day off! Enjoy freedom!",
    vacation: '🔄 Vacation day swapped! Today is yours — work tomorrow.',
};

const secUnlockedRemedies = {
    buyDonutsWeek: "🍩 You've committed to buying donuts for the team for a full week! Everyone will be glued to their chairs (and the glucose).",
    writtenUpPersonal: "📝 You've accepted a written warning placed in your personal file. HR has been notified. Very brave.",
};

const secPhishingTestRemedies = {
    buyDonutsWeekPt: "🍩 You've committed to buying donuts for the team for a full week! At least the calories distract from the embarrassment.",
    twoRoundsDrinks: "🍻 You've bought two rounds of drinks for everyone at Friday team happy hour! The team forgives (mostly).",
};

const secRealPhishingRemedies = {
    twoRoundsDrinks4Weeks: '🍻🍻 You\'ve committed to buying two rounds of drinks for everyone at Friday team happy hour over FOUR WEEKS! Your wallet is empty but your sacrifice is noted.',
    begMercy: '😱 You publicly begged for mercy from management and volunteered as tester for every project. A humbling day indeed.',
};

// ===== APPLY FUNCTIONS =====

/**
 * Apply the selected self-help remedy.
 */
export function applyUserRemedy() {
    const key = document.getElementById('userRemedy').value;
    const output = document.getElementById('remedyOutput');
    output.innerHTML = `<strong>✅ Self-Help Applied:</strong><br>${userRemedies[key]}`;
    output.style.display = 'block';
    recordEvent(`User applied: ${key}`);
    calculateGuiltScore();
}

/**
 * Apply the selected management remedy.
 */
export function applyManagementRemedy() {
    const key = document.getElementById('managementRemedy').value;
    const output = document.getElementById('remedyOutput');
    output.innerHTML = `<strong>💼 Management Action:</strong><br>${managementRemedies[key]}`;
    output.style.display = 'block';
    recordEvent(`Management applied: ${key}`);
    if (key === 'wfh') setWfhApproved(true);
    calculateGuiltScore();
}

/**
 * Apply the selected unlocked-workstation violation remedy.
 */
export function applySecUnlockedRemedy() {
    const key = document.getElementById('secUnlockedSelect').value;
    const output = document.getElementById('remedyOutput');
    output.innerHTML = `<strong>🛡️ Violation Remedy Applied:</strong><br>${secUnlockedRemedies[key]}`;
    output.style.display = 'block';
    recordEvent(`Violation remedy applied: ${key}`);
    calculateGuiltScore();
}

/**
 * Apply the selected phishing-test violation remedy.
 */
export function applySecPhishingTestRemedy() {
    const key = document.getElementById('secPhishingTestSelect').value;
    const output = document.getElementById('remedyOutput');
    output.innerHTML = `<strong>🛡️ Violation Remedy Applied:</strong><br>${secPhishingTestRemedies[key]}`;
    output.style.display = 'block';
    recordEvent(`Violation remedy applied: ${key}`);
    calculateGuiltScore();
}

/**
 * Apply the selected real-phishing violation remedy.
 */
export function applySecRealPhishingRemedy() {
    const key = document.getElementById('secRealPhishingSelect').value;
    const output = document.getElementById('remedyOutput');
    output.innerHTML = `<strong>🛡️ Violation Remedy Applied:</strong><br>${secRealPhishingRemedies[key]}`;
    output.style.display = 'block';
    recordEvent(`Violation remedy applied: ${key}`);
    calculateGuiltScore();
}

// ===== TOGGLE & SUGGESTIONS =====

/**
 * Toggle visibility of self-help vs violation remedy sections
 * based on security violation checkbox states.
 */
export function toggleViolationRemedies() {
    const unlocked = document.getElementById('secViolationUnlocked').checked;
    const phishingTest = document.getElementById('secViolationPhishingTest').checked;
    const realPhishing = document.getElementById('secViolationRealPhishing').checked;
    const anyViolation = unlocked || phishingTest || realPhishing;

    document.getElementById('selfHelpSection').style.display = anyViolation ? 'none' : 'block';
    document.getElementById('violationRemediesSection').style.display = anyViolation ? 'block' : 'none';

    document.getElementById('secUnlockedRemedies').style.display = unlocked ? 'block' : 'none';
    document.getElementById('secPhishingTestRemedies').style.display = phishingTest ? 'block' : 'none';
    document.getElementById('secRealPhishingRemedies').style.display = realPhishing ? 'block' : 'none';

    updateDynamicSuggestions();
}

/**
 * Update dynamic smart suggestions based on current input combinations.
 */
export function updateDynamicSuggestions() {
    const unlocked = document.getElementById('secViolationUnlocked').checked;
    const phishingTest = document.getElementById('secViolationPhishingTest').checked;
    const realPhishing = document.getElementById('secViolationRealPhishing').checked;

    // Ensure suggestions container exists
    let suggestionBox = document.getElementById('dynamicSuggestions');
    if (!suggestionBox) {
        const container = document.querySelector('.inputs');
        if (!container) return;
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'dynamicSuggestions';
        suggestionBox.classList.add('suggestions-panel');
        container.appendChild(suggestionBox);
    }

    suggestionBox.innerHTML = '';

    const suggestions = [];

    if (unlocked && !document.getElementById('acWorking').checked) {
        suggestions.push('💡 Tip: Since your workstation is unlocked AND AC is not working, consider improving your workspace environment to reduce guilt.');
    }

    if (phishingTest && document.getElementById('badReview').checked) {
        suggestions.push('📧 Security awareness and performance concerns compound guilt. Focus on one area at a time.');
    }

    if (realPhishing && document.getElementById('fireAlarm').checked) {
        suggestions.push('🚨 Multiple critical issues detected. Consider immediate action on the fire alarm first for safety.');
    }

    if (Number(document.getElementById('lighting').value) < 3) {
        suggestions.push('💡 Poor lighting increases eye strain guilt. Consider improving workspace lighting.');
    }

    if (Number(document.getElementById('noise').value) > 7) {
        suggestions.push('🔇 High noise levels can increase stress. Consider noise-cancelling headphones or quiet time.');
    }

    if (Number(document.getElementById('powerLevel').value) < 3) {
        suggestions.push('⚡ Low power level detected. Consider UPS maintenance or backup power solutions.');
    }

    if (suggestions.length > 0) {
        suggestionBox.innerHTML = '<strong>🎯 Smart Suggestions:</strong><br>' + suggestions.join('<br>');
    }
}

// ===== RESET =====

/**
 * Reset all inputs to defaults, clear storage, and recalculate.
 */
export function resetGuiltMeter() {
    // Reset all inputs
    document.getElementById('lighting').value = 5;
    document.getElementById('noise').value = 5;
    document.getElementById('acWorking').checked = true;
    document.getElementById('powerLevel').value = 10;
    document.getElementById('upsWorking').checked = true;
    document.getElementById('fireAlarm').checked = false;
    document.getElementById('badReview').checked = false;
    document.getElementById('daysSince').value = 0;
    document.getElementById('secViolationUnlocked').checked = false;
    document.getElementById('secViolationPhishingTest').checked = false;
    document.getElementById('secViolationRealPhishing').checked = false;

    // Reset remedy dropdowns
    document.getElementById('userRemedy').selectedIndex = 0;
    document.getElementById('managementRemedy').selectedIndex = 0;
    document.getElementById('secUnlockedSelect').selectedIndex = 0;
    document.getElementById('secPhishingTestSelect').selectedIndex = 0;
    document.getElementById('secRealPhishingSelect').selectedIndex = 0;

    // Hide remedy output
    document.getElementById('remedyOutput').style.display = 'none';

    // Clear stored events
    localStorage.removeItem('lastEvent');
    localStorage.removeItem('lastThreshold');
    document.getElementById('lastEvent').textContent = 'Never';

    // Toggle UI state
    toggleViolationRemedies();

    // Recalculate
    calculateGuiltScore();
}
