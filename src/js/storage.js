/**
 * storage.js — Data Persistence & Export/Import
 * Manages localStorage backup/restore and JSON file export/import.
 */

import { calculateGuiltScore } from './calculations.js';
import { showDataStatus, showStatus } from './ui.js';

const BACKUP_KEY = 'guiltMeterBackup';
const EVENT_KEY = 'lastEvent';
const THRESHOLD_KEY = 'lastThreshold';
const VERSION = '2.0';

/**
 * Collect the current state of all inputs and score.
 * @returns {Object} Current state object
 */
export function collectCurrentState() {
    return {
        timestamp: new Date().toISOString(),
        guiltScore: document.getElementById('score').textContent,
        inputs: {
            lighting: document.getElementById('lighting').value,
            noise: document.getElementById('noise').value,
            acWorking: document.getElementById('acWorking').checked,
            powerLevel: document.getElementById('powerLevel').value,
            upsWorking: document.getElementById('upsWorking').checked,
            fireAlarm: document.getElementById('fireAlarm').checked,
            badReview: document.getElementById('badReview').checked,
            daysSince: document.getElementById('daysSince').value,
            secViolationUnlocked: document.getElementById('secViolationUnlocked').checked,
            secViolationPhishingTest: document.getElementById('secViolationPhishingTest').checked,
            secViolationRealPhishing: document.getElementById('secViolationRealPhishing').checked,
        },
        history: localStorage.getItem(EVENT_KEY) || 'Never',
        version: VERSION,
    };
}

/**
 * Get the last saved state from localStorage.
 * @returns {Object|null}
 */
function getLastState() {
    const lastBackup = localStorage.getItem(BACKUP_KEY);
    return lastBackup ? JSON.parse(lastBackup) : null;
}

/**
 * Check if the state has changed since last backup.
 * @param {Object} current
 * @param {Object|null} last
 * @returns {boolean}
 */
function hasStateChanged(current, last) {
    if (!last) return true;
    return current.guiltScore !== last.guiltScore;
}

/**
 * Save state to localStorage.
 * @param {Object} state
 */
async function saveState(state) {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
}

/**
 * Validate backup data integrity.
 * @param {Object} data
 * @returns {boolean}
 */
function validateBackup(data) {
    return !!(data && data.inputs && data.guiltScore && data.version && data.version === VERSION);
}

/**
 * Restore inputs from backup data object.
 * @param {Object} data
 */
export function restoreFromData(data) {
    const inputIds = [
        'lighting', 'noise', 'acWorking', 'powerLevel', 'upsWorking',
        'fireAlarm', 'badReview', 'daysSince',
        'secViolationUnlocked', 'secViolationPhishingTest', 'secViolationRealPhishing',
    ];

    inputIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && data.inputs[id] !== undefined) {
            if (el.type === 'checkbox') {
                el.checked = data.inputs[id];
            } else {
                el.value = data.inputs[id];
            }
        }
    });

    calculateGuiltScore();
}

/**
 * PersistenceManager — Handles auto-save, restore, and backup scheduling.
 */
export class PersistenceManager {
    constructor() {
        this.backupKey = BACKUP_KEY;
        this.eventKey = EVENT_KEY;
        this.thresholdKey = THRESHOLD_KEY;
        this.version = VERSION;
        this.backupTimeout = null;
    }

    /**
     * Initialize persistence — check for existing data and restore or set defaults.
     */
    async initialize() {
        const hasData = await this.checkExistingData();

        if (hasData) {
            await this.restoreSession();
            showStatus('Session restored', 'success');
        } else {
            this.setupDefaults();
            showStatus('New session started', 'info');
            // Create initial silent backup
            const initialState = collectCurrentState();
            localStorage.setItem(this.backupKey, JSON.stringify(initialState));
        }

        this.startAutoSave();
    }

    /**
     * Check if persisted data exists.
     * @returns {Promise<boolean>}
     */
    async checkExistingData() {
        const backup = localStorage.getItem(this.backupKey);
        const event = localStorage.getItem(this.eventKey);

        if (backup) {
            try {
                const data = JSON.parse(backup);
                return validateBackup(data);
            } catch (error) {
                console.warn('Invalid backup found, starting fresh');
                return false;
            }
        }

        return !!event;
    }

    /**
     * Restore session from backup.
     */
    async restoreSession() {
        try {
            const backup = localStorage.getItem(this.backupKey);
            if (backup) {
                const data = JSON.parse(backup);
                restoreFromData(data);
            }
        } catch (error) {
            console.error('Session restoration failed:', error);
            this.setupDefaults();
        }
    }

    /**
     * Start auto-save interval (every 30 seconds).
     */
    startAutoSave() {
        setInterval(() => this.smartBackup(), 30000);
        this.setupInputListeners();
    }

    /**
     * Listen for input changes to schedule debounced backups.
     */
    setupInputListeners() {
        const inputs = document.querySelectorAll('.inputs input, .inputs select, .inputs checkbox');
        inputs.forEach((input) => {
            input.addEventListener('input', () => this.scheduleBackup());
            input.addEventListener('change', () => this.scheduleBackup());
        });
    }

    /**
     * Schedule a debounced backup (2-second delay).
     */
    scheduleBackup() {
        clearTimeout(this.backupTimeout);
        this.backupTimeout = setTimeout(() => this.smartBackup(), 2000);
    }

    /**
     * Perform a smart backup — only saves if score has changed.
     */
    async smartBackup() {
        const currentState = collectCurrentState();
        const lastState = getLastState();

        if (hasStateChanged(currentState, lastState)) {
            await saveState(currentState);
            // Silent auto-save — no notification
        }
    }

    /**
     * Set up default state for a new session.
     */
    setupDefaults() {
        const defaults = {
            lighting: 5,
            noise: 5,
            acWorking: true,
            powerLevel: 10,
            upsWorking: true,
            fireAlarm: false,
            badReview: false,
            daysSince: 0,
            secViolationUnlocked: false,
            secViolationPhishingTest: false,
            secViolationRealPhishing: false,
        };

        Object.keys(defaults).forEach((key) => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = defaults[key];
                } else {
                    element.value = defaults[key];
                }
            }
        });

        localStorage.removeItem(this.eventKey);
        localStorage.removeItem(this.thresholdKey);
        calculateGuiltScore();
    }
}

/**
 * Export current data as a JSON file download.
 */
export function exportData() {
    const data = collectCurrentState();
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportName = `guilt-meter-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();

    showDataStatus('✅ Data exported successfully!', 'success');
}

/**
 * Import data from a JSON file.
 * @param {Event} event — File input change event
 */
export function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            if (!data.inputs || !data.guiltScore) {
                throw new Error('Invalid data format');
            }

            restoreFromData(data);
            showDataStatus('✅ Data imported successfully!', 'success');
        } catch (error) {
            showDataStatus('❌ Error importing data: ' + error.message, 'error');
        }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

/**
 * Manual backup to localStorage.
 * @param {boolean} showFeedback
 */
export function backupData(showFeedback = false) {
    const state = collectCurrentState();
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    if (showFeedback) {
        showStatus('💾 Data backed up successfully!', 'success');
    }
}

/**
 * Restore from localStorage backup.
 */
export function restoreData() {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (!backup) {
        showStatus('⚠️ No backup data found!', 'error');
        return;
    }

    try {
        const data = JSON.parse(backup);

        if (!data.inputs) {
            throw new Error('Backup missing inputs');
        }

        restoreFromData(data);

        if (data.history && data.history !== 'Never') {
            localStorage.setItem(EVENT_KEY, data.history);
            const lastEventEl = document.getElementById('lastEvent');
            if (lastEventEl) lastEventEl.textContent = data.history;
        }

        // Update UI state
        if (typeof window.toggleViolationRemedies === 'function') {
            window.toggleViolationRemedies();
        }

        // Re-run validation
        document.querySelectorAll(".inputs input[type='range']").forEach((input) => {
            if (typeof window.validateInput === 'function') {
                window.validateInput(input);
            }
        });

        showStatus('📂 Restored your previous session', 'success');
    } catch (error) {
        console.error('Restore failed:', error);
        showStatus('❌ Error restoring: ' + error.message, 'error');
    }
}
