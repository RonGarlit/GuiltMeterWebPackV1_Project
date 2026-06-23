/**
 * ui.js — UI Helpers
 * Validation, theming, toast notifications, and event recording.
 */

import { calculateGuiltScore } from './calculations.js';
import { toggleViolationRemedies, updateDynamicSuggestions } from './remedies.js';

/**
 * Validate a range input and show contextual help text.
 * @param {HTMLInputElement} input
 * @returns {boolean} Whether the input is valid
 */
export function validateInput(input) {
    const value = parseFloat(input.value);
    const inputGroup = input.closest('.input-group');
    const helpText = inputGroup ? inputGroup.querySelector('.input-help') : null;
    const validationMsg = inputGroup ? inputGroup.querySelector('.validation-message') : null;

    // Remove existing validation classes
    if (inputGroup) inputGroup.classList.remove('warning', 'error');
    if (validationMsg) validationMsg.style.display = 'none';

    let isValid = true;
    let message = '';
    let messageType = '';

    if (input.type === 'range') {
        if (input.id === 'lighting' && value < 3) {
            isValid = false;
            message = '💡 Poor lighting (below 3) increases eye strain guilt. Consider improving workspace lighting.';
            messageType = 'warning';
        } else if (input.id === 'noise' && value > 7) {
            isValid = false;
            message = '🔇 High noise levels (above 7) can increase stress. Consider noise-cancelling headphones or quiet time.';
            messageType = 'warning';
        } else if (input.id === 'powerLevel' && value < 3) {
            isValid = false;
            message = '⚡ Low power level (below 3) detected. Consider UPS maintenance or backup power solutions.';
            messageType = 'warning';
        } else if (input.id === 'daysSince' && value > 10) {
            isValid = false;
            message = '📅 Days since last guilt threshold crossed should not exceed 10.';
            messageType = 'error';
        }
    }

    if (!isValid) {
        if (inputGroup) inputGroup.classList.add(messageType);
        if (validationMsg) {
            validationMsg.textContent = message;
            validationMsg.className = `validation-message ${messageType}`;
            validationMsg.style.display = 'block';
        }
        if (helpText) {
            helpText.textContent = message;
            helpText.style.color = messageType === 'error' ? '#c62828' : '#e65100';
        }
    } else {
        if (helpText) {
            setHelpText(helpText, input.id, value);
            helpText.style.color = '#666';
        }
    }

    return isValid;
}

/**
 * Update the color fill of a range slider based on its current value.
 * Sets the --value-percent CSS variable for the gradient track.
 * Also updates the value badge if one exists.
 * @param {HTMLInputElement} input
 */
export function updateSliderFill(input) {
    if (!input || input.type !== 'range') return;

    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || 100;
    const value = parseFloat(input.value);
    const percent = ((value - min) / (max - min)) * 100;

    input.style.setProperty('--value-percent', `${percent}%`);

    // Update value badge if one exists
    const badge = document.getElementById(`${input.id}Value`);
    if (badge) {
        badge.textContent = `${value}/${max}`;
    }
}

/**
 * Set contextual help text for a valid input.
 * @param {HTMLElement} helpText
 * @param {string} id
 * @param {number} value
 */
function setHelpText(helpText, id, value) {
    switch (id) {
        case 'lighting':
            if (value < 3) helpText.textContent = '⚠️ Poor lighting - increases guilt';
            else if (value < 5) helpText.textContent = '🌤️ Dim lighting - moderate guilt impact';
            else if (value < 8) helpText.textContent = '☀️ Good lighting - low guilt impact';
            else helpText.textContent = '✨ Perfect lighting - no guilt impact';
            break;
        case 'noise':
            if (value < 3) helpText.textContent = '🔇 Quiet environment - good for focus';
            else if (value < 5) helpText.textContent = '🔊 Moderate noise - some distraction';
            else if (value < 8) helpText.textContent = '🔊 Loud environment - high distraction';
            else helpText.textContent = '🔊 Very loud - significant distraction';
            break;
        case 'powerLevel':
            if (value < 3) helpText.textContent = '⚡ Low power - risk of shutdown';
            else if (value < 5) helpText.textContent = '🔋 Moderate power - stable';
            else if (value < 8) helpText.textContent = '🔋 Good power - optimal';
            else helpText.textContent = '🔋 Excellent power - no concerns';
            break;
        case 'daysSince':
            if (value === 0) helpText.textContent = '📅 Fresh start - guilt reset opportunity';
            else if (value < 5) helpText.textContent = '📅 Recent threshold crossing';
            else helpText.textContent = '📅 Long time since last guilt event';
            break;
    }
}

/**
 * Enhance input groups by wrapping labels in styled containers
 * with help text and validation message elements.
 */
export function enhanceInputGroups() {
    const inputs = document.querySelectorAll('.inputs label');

    inputs.forEach((label) => {
        const input = label.querySelector('input, select, checkbox');
        if (!input) return;

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        if (label.classList.contains('security-label')) {
            inputGroup.classList.add('security-input-group');
        }

        const labelText = label.textContent.trim();

        const enhancedLabel = document.createElement('label');
        enhancedLabel.innerHTML = labelText;
        enhancedLabel.style.display = 'block';
        enhancedLabel.style.marginBottom = '5px';
        enhancedLabel.style.fontWeight = '500';

        if (label.classList.contains('security-label')) {
            enhancedLabel.classList.add('security-label');
        }

        const helpText = document.createElement('span');
        helpText.className = 'input-help';
        helpText.style.fontSize = '0.85em';
        helpText.style.color = '#666';
        helpText.style.marginTop = '4px';
        helpText.style.display = 'block';

        const validationMsg = document.createElement('div');
        validationMsg.className = 'validation-message';
        validationMsg.style.fontSize = '0.9em';
        validationMsg.style.marginTop = '8px';
        validationMsg.style.padding = '6px 10px';
        validationMsg.style.borderRadius = '4px';
        validationMsg.style.display = 'none';

        label.parentNode.replaceChild(inputGroup, label);
        inputGroup.appendChild(enhancedLabel);
        inputGroup.appendChild(input);
        inputGroup.appendChild(helpText);
        inputGroup.appendChild(validationMsg);

        if (input.type === 'range') {
            validateInput(input);
        }
    });
}

/**
 * Toggle dark/light theme using Bootstrap 5 data-bs-theme.
 */
export function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', newTheme);

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {string} type — 'success' | 'error' | 'info'
 */
export function showStatus(message, type = 'info') {
    const status = document.createElement('div');
    status.className = `status-notification ${type}`;
    status.textContent = message;
    status.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 2000;
    animation: slideUp 0.3s ease;
    ${type === 'success'
            ? 'background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);'
            : type === 'error'
                ? 'background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #333;'
                : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
        }
  `;

    document.body.appendChild(status);

    setTimeout(() => {
        status.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            if (status.parentNode) status.parentNode.removeChild(status);
        }, 300);
    }, 3000);
}

/**
 * Show data status message in the export controls area.
 * @param {string} message
 * @param {string} type — 'success' | 'error'
 */
export function showDataStatus(message, type) {
    let statusDiv = document.getElementById('dataStatus');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'dataStatus';
        statusDiv.className = 'data-status';
        const exportControls = document.querySelector('.export-controls');
        if (exportControls) exportControls.appendChild(statusDiv);
    }

    statusDiv.textContent = message;
    statusDiv.className = `data-status ${type}`;

    setTimeout(() => {
        if (statusDiv.parentNode) {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                if (statusDiv.parentNode) statusDiv.parentNode.removeChild(statusDiv);
            }, 300);
        }
    }, 5000);
}

/**
 * Record an action to the history display.
 * @param {string} action
 */
export function recordEvent(action) {
    const now = new Date().toLocaleString();
    const event = `${now}: ${action}`;
    localStorage.setItem('lastEvent', event);
    document.getElementById('lastEvent').textContent = event;
}
