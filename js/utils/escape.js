/**
 * @module escape
 * @description HTML escaping utility to prevent XSS.
 */

/**
 * Escape HTML special characters in a string.
 * @param {string} str - Input string
 * @returns {string} Escaped string safe for HTML insertion
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export default escapeHtml;
