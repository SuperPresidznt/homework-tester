/**
 * @module GamificationState
 * @description State management for gamification system.
 * Handles loading, saving, and default state structure.
 * 
 * @fileoverview Central state hub for all gamification data.
 * 
 * ## Dependency Graph
 * ```
 * GamificationState (this file)
 *   ↓ imports
 *   └── js/core/store.js           → Store.get(), Store.set()
 * 
 *   ↑ used by
 *   ├── js/gamification/xp.js      → getState(), saveState(), isEnabled()
 *   ├── js/gamification/coins.js   → getState(), saveState(), isEnabled()
 *   ├── js/gamification/buffs.js   → getState(), isEnabled()
 *   ├── js/gamification/momentum.js→ getState(), saveState()
 *   └── index.html (Gamification)  → mirrors these functions inline
 * ```
 * 
 * ## State Shape
 * See DEFAULT_STATE below for full structure including:
 * - xp, level, coins, combo
 * - buddy (pet system)
 * - garden (plots, inventory)
 * - momentum (batch rewards)
 * - settings (feature toggles)
 * 
 * ## Related Files
 * - index.html#Gamification - Inline version with UI methods
 * - js/gamification/xp.js - XP award logic
 * - js/gamification/coins.js - Coin economy
 * - js/gamification/buffs.js - Pet/garden buff calculations
 * - js/gamification/momentum.js - Batch momentum system
 */

import Store from '../core/store.js';

const STORAGE_KEY = 'wgu_gamification';

/**
 * Default gamification state structure.
 */
const DEFAULT_STATE = {
    xp: 0,
    level: 1,
    coins: 0,
    combo: { current: 0, multiplier: 1.0 },
    doubleXpRemaining: 0,
    achievements: [],
    unlockedTitles: ['Novice'],
    currentTitle: 'Novice',
    buddy: {
        name: 'Buddy',
        species: 'fox',
        hunger: 100,
        happiness: 100,
        lastFed: Date.now(),
        lastPlayed: Date.now(),
        sick: false
    },
    garden: {
        plots: [],
        unlockedPlots: 1,
        inventory: {}
    },
    momentum: {
        active: false,
        tier: null,
        xpMultiplier: 1,
        coinMultiplier: 1,
        label: null,
        pillIcon: null
    },
    settings: {
        gamificationEnabled: true,
        soundEnabled: true,
        petBuffs: true,
        gardenBuffs: true,
        momentumEnabled: true,
        disastersEnabled: false,
        animatedBackgrounds: true,
        trinketsEnabled: true
    }
};

/**
 * Get current gamification state from storage.
 * @returns {object} State object with defaults applied
 */
export function getState() {
    const stored = Store.get(STORAGE_KEY, {});
    return { ...DEFAULT_STATE, ...stored };
}

/**
 * Save gamification state to storage.
 * @param {object} state - State to save
 */
export function saveState(state) {
    Store.set(STORAGE_KEY, state);
}

/**
 * Reset gamification state to defaults.
 */
export function resetState() {
    Store.set(STORAGE_KEY, DEFAULT_STATE);
}

/**
 * Check if gamification is enabled.
 * @returns {boolean}
 */
export function isEnabled() {
    const state = getState();
    return state.settings?.gamificationEnabled !== false;
}

export default {
    getState,
    saveState,
    resetState,
    isEnabled,
    DEFAULT_STATE,
    STORAGE_KEY
};
