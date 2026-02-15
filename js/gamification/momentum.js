/**
 * @module Momentum
 * @description Batch-size momentum rewards system.
 * 
 * @fileoverview Manages batch-tier momentum that rewards longer study sessions.
 * 
 * ## Dependency Graph
 * ```
 * Momentum (this file)
 *   ↓ imports
 *   └── js/gamification/state.js → getState(), saveState(), isEnabled()
 * 
 *   ↑ used by
 *   ├── js/gamification/index.js → re-exports all momentum functions
 *   └── index.html:
 *       ├── Gamification.activateBatchMomentum() → inline mirror
 *       ├── Gamification.handleMomentumBreak()   → inline mirror
 *       ├── Gamification.getMomentumPillMarkup() → inline mirror
 *       ├── App._applyBatchMeta()                → activates on session start
 *       └── Gamification.resetCombo()            → calls handleMomentumBreak
 * ```
 * 
 * ## Batch Tiers
 * ```
 * Questions │ Multiplier │ Icon │ Label
 * ──────────┼────────────┼──────┼─────────
 *    5+     │   +5%      │  📦  │ Batch 5
 *   10+     │  +12%      │  🚀  │ Batch 10
 *   15+     │  +20%      │  🔥  │ Batch 15
 *   20+     │  +30%      │  ⚡  │ Batch 20+
 * ```
 * 
 * ## Momentum Lifecycle
 * ```
 * Session Start → App._applyBatchMeta(count)
 *       ↓
 * activateBatchMomentum(count) → sets state.momentum
 *       ↓
 * During session: XP/coins multiplied by momentum.xpMultiplier
 *       ↓
 * On combo break/exit → handleMomentumBreak(reason)
 *       ↓
 * clearMomentum() → resets state.momentum
 * ```
 * 
 * ## Related Files
 * - js/gamification/state.js - Stores momentum in state.momentum
 * - js/gamification/xp.js - Reads momentum.xpMultiplier
 * - js/gamification/coins.js - Reads momentum.coinMultiplier
 * - index.html#App._applyBatchMeta - Activates momentum on session start
 */

import { getState, saveState, isEnabled } from './state.js';

/**
 * Batch tier definitions.
 */
export const BATCH_TIERS = [
    { id: 'batch5', minQuestions: 5, label: 'Batch 5', xpMultiplier: 1.05, coinMultiplier: 1.05, pillIcon: '📦', description: '+5% rewards for 5-question runs.' },
    { id: 'batch10', minQuestions: 10, label: 'Batch 10', xpMultiplier: 1.12, coinMultiplier: 1.12, pillIcon: '🚀', description: '+12% rewards for double-digit focus.' },
    { id: 'batch15', minQuestions: 15, label: 'Batch 15', xpMultiplier: 1.2, coinMultiplier: 1.2, pillIcon: '🔥', description: '+20% rewards once you clear 15.' },
    { id: 'batch20', minQuestions: 20, label: 'Batch 20+', xpMultiplier: 1.3, coinMultiplier: 1.3, pillIcon: '⚡', description: '+30% rewards for marathon sessions.' }
];

/**
 * Get the batch tier for a given question count.
 * @param {number} count - Number of questions
 * @returns {object|null} Tier object or null
 */
export function getBatchTier(count) {
    if (!count) return null;
    const tiers = [...BATCH_TIERS].sort((a, b) => b.minQuestions - a.minQuestions);
    return tiers.find(t => count >= t.minQuestions) || null;
}

/**
 * Activate batch momentum for a session.
 * @param {number} batchSize - Number of questions in batch
 * @param {object} options - { questionGoal }
 * @returns {object|null} Activated momentum state or null
 */
export function activateBatchMomentum(batchSize, options = {}) {
    const state = getState();
    const tier = getBatchTier(batchSize);
    
    if (!tier) {
        return null;
    }
    
    if (!state.settings?.momentumEnabled) {
        return null;
    }
    
    state.momentum = {
        active: true,
        tier: tier.id,
        xpMultiplier: tier.xpMultiplier,
        coinMultiplier: tier.coinMultiplier,
        label: tier.label,
        pillIcon: tier.pillIcon,
        description: tier.description,
        questionGoal: options.questionGoal || batchSize,
        startedAt: Date.now()
    };
    
    saveState(state);
    return state.momentum;
}

/**
 * Clear active momentum.
 * @param {string} reason - Reason for clearing
 */
export function clearMomentum(reason = 'manual') {
    const state = getState();
    state.momentum = {
        active: false,
        tier: null,
        xpMultiplier: 1,
        coinMultiplier: 1,
        label: null,
        pillIcon: null,
        clearedReason: reason,
        clearedAt: Date.now()
    };
    saveState(state);
}

/**
 * Handle momentum break with reason messaging.
 * @param {string} reason - 'incorrect' | 'exit' | 'combo' | 'session_end' | 'manual'
 */
export function handleMomentumBreak(reason) {
    const state = getState();
    if (!state.momentum || !state.momentum.active) return;
    
    clearMomentum(reason);
}

/**
 * Get current momentum state.
 * @returns {object}
 */
export function getMomentumState() {
    return getState().momentum || { active: false };
}

/**
 * Generate HTML markup for momentum pill display.
 * @param {object} meta - Momentum metadata (optional)
 * @returns {string} HTML string
 */
export function getMomentumPillMarkup(meta) {
    const tier = meta && meta.active ? meta : getMomentumState();
    if (tier && tier.active) {
        const pct = Math.round(((tier.xpMultiplier || 1) - 1) * 100);
        return `<span class="meta-pill momentum-pill" title="${tier.description || ''}">${tier.pillIcon || '🔥'} ${tier.label || 'Momentum'} <span>+${pct}%</span></span>`;
    }
    return '';
}

export default {
    BATCH_TIERS,
    getBatchTier,
    activateBatchMomentum,
    clearMomentum,
    handleMomentumBreak,
    getMomentumState,
    getMomentumPillMarkup
};
