/**
 * @module format
 * @description Formatting utilities for numbers, time, and display values.
 */

/**
 * Format a number with commas for thousands.
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Format seconds into human-readable duration.
 * @param {number} secs - Seconds
 * @returns {string} e.g., "2m 30s" or "45s"
 */
export function formatDuration(secs) {
    if (secs < 60) return secs + 's';
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return mins + 'm ' + remainSecs + 's';
}

/**
 * Format a percentage with optional decimal places.
 * @param {number} value - Value (0-100 or 0-1)
 * @param {number} decimals - Decimal places (default 0)
 * @param {boolean} isRatio - If true, value is 0-1 ratio
 * @returns {string} e.g., "85%"
 */
export function formatPercent(value, decimals = 0, isRatio = false) {
    const pct = isRatio ? value * 100 : value;
    return pct.toFixed(decimals) + '%';
}

/**
 * Get today's date as YYYY-MM-DD string.
 * @returns {string}
 */
export function getTodayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + 
           String(d.getMonth() + 1).padStart(2, '0') + '-' + 
           String(d.getDate()).padStart(2, '0');
}

export default {
    formatNumber,
    formatDuration,
    formatPercent,
    getTodayStr
};
