/**
 * main.js — GuiltMeter Application Entry Point
 * ES2020+ ESM entry point. Imports all modules and wires up the DOM.
 */

import '../scss/main.scss';
import 'bootstrap';

import { initGauge, updateGauge } from './gauge.js';
import { initAudio, playJimmy, adjustVolume, triggerConfetti, initKeyboardShortcut } from './audio.js';
import { calculateGuiltScore, simulatePowerSampling } from './calculations.js';
import {
    applyUserRemedy,
    applyManagementRemedy,
    applySecUnlockedRemedy,
    applySecPhishingTestRemedy,
    applySecRealPhishingRemedy,
    toggleViolationRemedies,
    updateDynamicSuggestions,
    resetGuiltMeter,
} from './remedies.js';
import {
    PersistenceManager,
    exportData,
    importData,
    backupData,
    restoreData,
} from './storage.js';
import {
    validateInput,
    toggleTheme,
    showStatus,
    recordEvent,
} from './ui.js';

// ===== EXPOSE FUNCTIONS TO WINDOW (for HTML onclick/onchange handlers) =====
window.playJimmy = playJimmy;
window.adjustVolume = adjustVolume;
window.applyUserRemedy = applyUserRemedy;
window.applyManagementRemedy = applyManagementRemedy;
window.applySecUnlockedRemedy = applySecUnlockedRemedy;
window.applySecPhishingTestRemedy = applySecPhishingTestRemedy;
window.applySecRealPhishingRemedy = applySecRealPhishingRemedy;
window.toggleViolationRemedies = toggleViolationRemedies;
window.resetGuiltMeter = resetGuiltMeter;
window.exportData = exportData;
window.importData = importData;
window.backupData = backupData;
window.restoreData = restoreData;
window.toggleTheme = toggleTheme;
window.validateInput = validateInput;

// ===== DOM INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize D3 gauge
    initGauge();

    // Initialize audio
    initAudio();

    // Initialize keyboard shortcut (Ctrl+E)
    initKeyboardShortcut();

    // Initialize persistence manager
    const persistenceManager = new PersistenceManager();
    persistenceManager.initialize();

    // Restore last event display from localStorage
    const savedEvent = localStorage.getItem('lastEvent');
    const lastEventEl = document.getElementById('lastEvent');
    if (savedEvent && lastEventEl) {
        lastEventEl.textContent = savedEvent;
    }

    // Attach real-time input listeners
    document.querySelectorAll('.inputs input').forEach((input) => {
        input.addEventListener('input', calculateGuiltScore);
        input.addEventListener('change', calculateGuiltScore);

        // Add validation for range inputs
        if (input.type === 'range') {
            input.addEventListener('input', () => validateInput(input));
        }
    });

    // Run initial validation on range inputs
    document.querySelectorAll(".inputs input[type='range']").forEach(validateInput);

    // Initialize dynamic suggestions
    updateDynamicSuggestions();

    // Initialize violation remedy visibility
    toggleViolationRemedies();

    // Initial score calculation
    calculateGuiltScore();

    // Start power sampling (every 5 seconds)
    setInterval(simulatePowerSampling, 5000);

    // Backup on page unload
    window.addEventListener('beforeunload', () => backupData(false));

    console.log('🎯 GuiltMeter initialized — ES2020+ ESM + Bootstrap 5');
});

// ===== EXPORT FOR TESTING =====
export { calculateGuiltScore };

// Initialize all button event listeners
function initializeDemoFunctions() {
    // Array methods
    document.getElementById('arrayMapBtn')?.addEventListener('click', demoArrayMap);
    document.getElementById('arrayFilterBtn')?.addEventListener('click', demoArrayFilter);
    document.getElementById('arrayReduceBtn')?.addEventListener('click', demoArrayReduce);

    // String and DOM
    document.getElementById('stringMethodsBtn')?.addEventListener('click', demoStringMethods);
    document.getElementById('domManipBtn')?.addEventListener('click', demoDOM);

    // Events and async
    document.getElementById('eventHandlerBtn')?.addEventListener('click', demoEventHandler);
    document.getElementById('asyncAwaitBtn')?.addEventListener('click', demoAsyncAwait);

    // Clear button
    document.getElementById('clearOutputBtn')?.addEventListener('click', () => {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '<p style="color: #666;">Output cleared. Click a button above to run a demo!</p>';
    });
}