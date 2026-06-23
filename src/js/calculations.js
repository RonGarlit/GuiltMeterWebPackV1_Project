/**
 * calculations.js — Guilt Score Calculation Engine
 * Computes guilt scores from environmental factors and security violations.
 */

import { updateGauge } from './gauge.js';
import { setWfhApproved, getWfhApproved } from './state.js';
import { recordEvent, updateSliderFill } from './ui.js';

const THRESHOLD = 70;
const SEVERE_THRESHOLD = 90;

/**
 * Read all input values and calculate the guilt score.
 * Updates the score display, status message, donut alert, and gauge.
 * @returns {number} The calculated guilt score (0–100)
 */
export function calculateGuiltScore() {
    // Environmental factors
    const lighting = (10 - Number(document.getElementById('lighting').value)) * 3;
    const noise = Number(document.getElementById('noise').value) * 3;
    const acWorking = document.getElementById('acWorking').checked ? 0 : 25;
    const powerLevel = (10 - Number(document.getElementById('powerLevel').value)) * 2.5;
    const upsWorking = document.getElementById('upsWorking').checked ? 0 : 15;
    const fireAlarm = document.getElementById('fireAlarm').checked ? 35 : 0;
    const badReview = document.getElementById('badReview').checked ? 20 : 0;

    const daysSince = Math.max(0, Number(document.getElementById('daysSince').value));
    const timeScore = Math.max(0, 10 - daysSince);

    // Security violations (highest takes priority)
    const secViolationRealPhishing = document.getElementById('secViolationRealPhishing').checked ? 100 : 0;
    const secViolationPhishingTest = document.getElementById('secViolationPhishingTest').checked ? 85 : 0;
    const secViolationUnlocked = document.getElementById('secViolationUnlocked').checked ? 70 : 0;
    const securityScore = Math.max(secViolationUnlocked, secViolationPhishingTest, secViolationRealPhishing);

    // Environmental total
    const envScore = lighting + noise + acWorking + powerLevel + upsWorking + fireAlarm + badReview + timeScore;

    // Final score: security floor + 20% of environmental, or just environmental
    const score =
        securityScore > 0
            ? Math.min(100, Math.round(securityScore + envScore * 0.2))
            : Math.min(100, Math.round(envScore));

    // Update display
    document.getElementById('score').textContent = score;

    // Status message
    const statusEl = document.getElementById('status');
    const donutAlert = document.getElementById('donutAlert');

    if (score < 30) {
        statusEl.textContent = "Low guilt — you're crushing it!";
        statusEl.style.color = '#4caf50';
        statusEl.classList.remove('warning-flash');
        donutAlert.style.display = 'none';
    } else if (score < 70) {
        statusEl.textContent = 'Moderate guilt — keep an eye on it.';
        statusEl.style.color = '#fb8c00';
        statusEl.classList.remove('warning-flash');
        donutAlert.style.display = 'none';
    } else if (score < 90) {
        statusEl.textContent = '⚠️ High guilt — threshold breached!';
        statusEl.style.color = '#d32f2f';
        statusEl.classList.add('warning-flash');
        donutAlert.textContent = '🚨 Complimentary Donut Cart Deployed!';
        donutAlert.style.display = 'block';
    } else {
        statusEl.textContent = '🔥 IMMINENT FAILURE DETECTED!';
        statusEl.style.color = '#b71c1c';
        statusEl.classList.add('warning-flash');
        donutAlert.textContent = '🚑 Sandwich Cart En Route – Evacuate Snacks!';
        donutAlert.style.display = 'block';
    }

    // Update gauge
    updateGauge(score);

    // Check threshold crossing
    checkThreshold(score);

    // Celebrate WFH if approved and guilt drops
    if (getWfhApproved() && score < 30) {
        triggerWfhCelebration();
        setWfhApproved(false);
    }

    return score;
}

/**
 * Check if the guilt score crossed the threshold and record it.
 * @param {number} score
 */
export function checkThreshold(score) {
    if (score > THRESHOLD) {
        localStorage.setItem('lastThreshold', new Date().toISOString());
        const now = new Date().toLocaleString();
        const event = `Guilt threshold crossed on ${now}`;
        localStorage.setItem('lastEvent', event);
        document.getElementById('lastEvent').textContent = event;
    }
}

/**
 * Simulate real-time power sampling — fluctuates power level every 5 seconds.
 */
export function simulatePowerSampling() {
    const powerLevel = document.getElementById('powerLevel');
    const fluctuation = Math.random() > 0.7 ? -1 : 0;
    const current = Math.max(0, Math.min(10, Number(powerLevel.value) + fluctuation));
    powerLevel.value = current;
    updateSliderFill(powerLevel);
    calculateGuiltScore();
}

/**
 * Trigger the WFH celebration overlay.
 */
function triggerWfhCelebration() {
    const celebration = document.getElementById('wfhCelebration');
    if (celebration) {
        celebration.classList.add('active');
        setTimeout(() => {
            celebration.classList.remove('active');
        }, 5000);
    }
}

/**
 * Get the threshold value.
 * @returns {number}
 */
export function getThreshold() {
    return THRESHOLD;
}

/**
 * Get the severe threshold value.
 * @returns {number}
 */
export function getSevereThreshold() {
    return SEVERE_THRESHOLD;
}
