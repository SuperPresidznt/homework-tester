/**
 * @module Coins
 * @description Coin economy management.
 * 
 * @fileoverview Handles coin awards, spending, and balance tracking.
 * 
 * ## Dependency Graph
 * ```
 * Coins (this file)
 *   ↓ imports
 *   └── js/gamification/state.js → getState(), saveState(), isEnabled()
 * 
 *   ↑ used by
 *   ├── js/gamification/index.js → re-exports awardCoins, spendCoins
 *   └── index.html:
 *       ├── Gamification.awardCoins() → inline version with UI
 *       ├── Gamification.spendCoins() → inline version
 *       └── Shop.purchaseItem()       → calls spendCoins
 * ```
 * 
 * ## Coin Flow
 * ```
 * Earning:
 *   User Action → awardCoins(action)
 *       ↓
 *   Apply momentum.coinMultiplier
 *       ↓
 *   state.coins += amount
 * 
 * Spending:
 *   Shop.purchaseItem() → spendCoins(amount)
 *       ↓
 *   Check balance >= amount
 *       ↓
 *   state.coins -= amount
 * ```
 * 
 * ## Related Files
 * - js/gamification/state.js - Stores coins in state.coins
 * - js/gamification/momentum.js - Provides coinMultiplier
 * - index.html#Shop - Spending interface
 * - index.html#Gamification.awardCoins - Inline version with popups
 */

import { getState, saveState, isEnabled } from './state.js';

/**
 * Coin values for different actions.
 */
export const COIN_VALUES = {
    correctAnswer: 5,
    firstTryCorrect: 10,
    drillGotIt: 8,
    drillStruggled: 3,
    testComplete: 25,
    perfectTest: 100,
    dailyGoalReached: 50,
    achievementUnlock: 25
};

/**
 * Award coins for an action.
 * @param {string} action - Action key from COIN_VALUES
 * @param {object} options - { multiplier }
 * @returns {number} Coins awarded
 */
export function awardCoins(action, options = {}) {
    if (!isEnabled()) return 0;
    
    const state = getState();
    let coinAmount = COIN_VALUES[action] || 0;
    
    // Apply custom multiplier
    if (options.multiplier) {
        coinAmount = Math.floor(coinAmount * options.multiplier);
    }
    
    // Apply momentum multiplier
    if (state.momentum?.active && state.momentum.coinMultiplier > 1) {
        coinAmount = Math.floor(coinAmount * state.momentum.coinMultiplier);
    }
    
    // Update state
    state.coins += coinAmount;
    saveState(state);
    
    return coinAmount;
}

/**
 * Spend coins if user has enough.
 * @param {number} amount - Amount to spend
 * @returns {boolean} True if successful
 */
export function spendCoins(amount) {
    const state = getState();
    if (state.coins < amount) return false;
    
    state.coins -= amount;
    saveState(state);
    return true;
}

/**
 * Get current coin balance.
 * @returns {number}
 */
export function getBalance() {
    return getState().coins;
}

export default {
    COIN_VALUES,
    awardCoins,
    spendCoins,
    getBalance
};
