/**
 * @module XP
 * @description XP calculation and level progression logic.
 * 
 * @fileoverview Handles XP awards, level calculations, and progression.
 * 
 * ## Dependency Graph
 * ```
 * XP (this file)
 *   ↓ imports
 *   └── js/gamification/state.js → getState(), saveState(), isEnabled()
 * 
 *   ↑ used by
 *   ├── js/gamification/index.js → re-exports awardXp, XP_VALUES
 *   └── index.html (Gamification.awardXp) → inline version calls this logic
 * ```
 * 
 * ## Data Flow
 * ```
 * User Action (correct answer, daily goal, etc.)
 *       ↓
 * awardXp(action, options)
 *       ↓
 * ┌─────────────────────────────────────┐
 * │ 1. Check isEnabled()                │
 * │ 2. Get base XP from XP_VALUES       │
 * │ 3. Apply multipliers:               │
 * │    - options.multiplier             │
 * │    - state.momentum.xpMultiplier    │  ← from momentum.js
 * │    - state.combo.multiplier         │
 * │    - doubleXpRemaining              │
 * │ 4. Add combo bonus if withCombo     │
 * │ 5. Update state.xp                  │
 * │ 6. Check level up                   │
 * │ 7. saveState()                      │
 * └─────────────────────────────────────┘
 *       ↓
 * Returns XP amount awarded
 * ```
 * 
 * ## Related Files
 * - js/gamification/state.js - State persistence
 * - js/gamification/coins.js - Similar pattern for coins
 * - js/gamification/buffs.js - Pet/garden buffs (applied in inline version)
 * - js/gamification/momentum.js - Momentum multipliers
 * - index.html#Gamification.awardXp - Inline version with UI updates
 */

import { getState, saveState, isEnabled } from './state.js';

/**
 * XP values for different actions.
 */
export const XP_VALUES = {
    correctAnswer: 25,
    firstTryCorrect: 50,
    drillGotIt: 40,
    drillStruggled: 15,
    testComplete: 100,
    perfectTest: 500,
    comboBonus: 10,
    dailyGoalReached: 200,
    weeklyGoalReached: 500,
    achievementUnlock: 100,
    streakMilestone: 150
};

/**
 * Calculate XP required for a given level.
 * @param {number} level - Target level
 * @returns {number} XP required
 */
export function xpForLevel(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate total XP required to reach a level from level 1.
 * @param {number} level - Target level
 * @returns {number} Total XP
 */
export function totalXpForLevel(level) {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += xpForLevel(i);
    }
    return total;
}

/**
 * Get level from total XP.
 * @param {number} totalXp - Total XP earned
 * @returns {number} Current level
 */
export function getLevelFromXp(totalXp) {
    let level = 1;
    let xpNeeded = 0;
    while (xpNeeded + xpForLevel(level) <= totalXp) {
        xpNeeded += xpForLevel(level);
        level++;
    }
    return level;
}

/**
 * Award XP for an action.
 * @param {string} action - Action key from XP_VALUES
 * @param {object} options - { multiplier, withCombo }
 * @returns {number} XP awarded
 */
export function awardXp(action, options = {}) {
    if (!isEnabled()) return 0;
    
    const state = getState();
    let xpAmount = XP_VALUES[action] || 0;
    
    // Apply custom multiplier
    if (options.multiplier) {
        xpAmount = Math.floor(xpAmount * options.multiplier);
    }
    
    // Apply momentum multiplier
    if (state.momentum?.active && state.momentum.xpMultiplier > 1) {
        xpAmount = Math.floor(xpAmount * state.momentum.xpMultiplier);
    }
    
    // Apply combo multiplier
    if (state.combo.multiplier > 1) {
        xpAmount = Math.floor(xpAmount * state.combo.multiplier);
    }
    
    // Apply double XP
    if (state.doubleXpRemaining > 0) {
        xpAmount *= 2;
        state.doubleXpRemaining--;
    }
    
    // Add combo bonus
    if (options.withCombo && state.combo.current > 0) {
        xpAmount += XP_VALUES.comboBonus * state.combo.current;
    }
    
    // Update state
    state.xp += xpAmount;
    
    // Check for level up
    const newLevel = getLevelFromXp(state.xp);
    const leveledUp = newLevel > state.level;
    if (leveledUp) {
        state.level = newLevel;
    }
    
    saveState(state);
    
    return xpAmount;
}

export default {
    XP_VALUES,
    xpForLevel,
    totalXpForLevel,
    getLevelFromXp,
    awardXp
};
