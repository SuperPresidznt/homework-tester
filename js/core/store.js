/**
 * @module Store
 * @description localStorage wrapper with JSON serialization and error handling.
 * 
 * @fileoverview Core persistence layer for all app state.
 * 
 * ## Dependency Graph
 * ```
 * Store (this file)
 *   ↑ used by
 *   ├── js/gamification/state.js    → getState(), saveState()
 *   ├── js/gamification/momentum.js → activateBatchMomentum(), clearMomentum()
 *   ├── js/scene/manager.js         → init(), saveState()
 *   ├── js/trinkets/backpack.js     → getState(), saveState()
 *   └── index.html (inline)         → Settings, SessionState, QuestionTracker
 * ```
 * 
 * ## Storage Keys Used
 * - `wgu_gamification` - XP, coins, level, achievements, pet, garden
 * - `wgu_questionTracker` - Per-question spaced repetition data
 * - `wgu_session_state` - Active session for resume
 * - `wgu_scene` - Background selection and animation toggle
 * - `wgu_trinkets` - Trinket inventory and desk placement
 * - `wgu_settings` - User preferences
 * - `wgu_theme` - Dark/light mode
 */

const Store = {
    /**
     * Get a value from localStorage, parsed as JSON.
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default if key doesn't exist
     * @returns {*} Parsed value or default
     */
    get(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : defaultValue;
        } catch (e) {
            console.warn(`Store.get error for key "${key}":`, e);
            return defaultValue;
        }
    },

    /**
     * Set a value in localStorage as JSON.
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Store.set error for key "${key}":`, e);
        }
    },

    /**
     * Remove a key from localStorage.
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn(`Store.remove error for key "${key}":`, e);
        }
    },

    /**
     * Clear all localStorage data.
     */
    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Store.clear error:', e);
        }
    }
};

export default Store;
