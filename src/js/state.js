/**
 * state.js — Shared Application State
 * Simple shared state to avoid circular dependencies between modules.
 */

let wfhApproved = false;

/**
 * Set the WFH approved flag.
 * @param {boolean} value
 */
export function setWfhApproved(value) {
    wfhApproved = value;
}

/**
 * Get the WFH approved flag.
 * @returns {boolean}
 */
export function getWfhApproved() {
    return wfhApproved;
}
