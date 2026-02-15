/**
 * @module Buffs
 * @description Pet and garden buff calculations.
 * 
 * @fileoverview Calculates active buffs from pet happiness/hunger and garden state.
 * 
 * ## Dependency Graph
 * ```
 * Buffs (this file)
 *   ↓ imports
 *   └── js/gamification/state.js → getState(), isEnabled()
 * 
 *   ↑ used by
 *   ├── js/gamification/index.js → re-exports getActiveBuffs, applyBuffScalars
 *   └── index.html:
 *       ├── Gamification.getActiveBuffs()   → inline mirror
 *       ├── Gamification.applyBuffScalars() → inline mirror
 *       ├── Home.updateMetaSummary()        → renders buff pills
 *       └── Gamification.updateBuddyWidget()→ shows buffs in pet panel
 * ```
 * 
 * ## Buff Sources
 * ```
 * Pet System (state.buddy)
 *   ├── happiness >= 80 → +10% XP (Happy Pet)
 *   ├── happiness >= 50 → +5% XP (Content Pet)
 *   └── hunger >= 80    → +5% Coins (Well Fed)
 * 
 * Garden System (state.garden)
 *   └── 3+ ready crops  → +8% Yield (Bountiful Garden)
 * ```
 * 
 * ## Integration Points
 * - Called by awardXp/awardCoins (inline) to apply multipliers
 * - Rendered in Home meta panel as pill badges
 * - Displayed in buddy widget sidebar
 * 
 * ## Related Files
 * - js/gamification/state.js - Reads buddy/garden state
 * - index.html#Gamification - Inline version with UI
 * - index.html#Garden - Garden system that affects buffs
 */

import { getState, isEnabled } from './state.js';

/**
 * Get all active buffs from pet and garden systems.
 * @returns {Array<{icon: string, label: string, value: string, description: string, source: string}>}
 */
export function getActiveBuffs() {
    const state = getState();
    const buffs = [];
    
    if (!state.settings?.petBuffs) return buffs;
    
    const buddy = state.buddy;
    if (buddy && !buddy.sick) {
        // Happiness buff
        if (buddy.happiness >= 80) {
            buffs.push({
                icon: '😊',
                label: 'Happy Pet',
                value: '+10% XP',
                multiplier: 1.10,
                description: 'Your pet is happy! +10% XP bonus.',
                source: 'Pet'
            });
        } else if (buddy.happiness >= 50) {
            buffs.push({
                icon: '🙂',
                label: 'Content Pet',
                value: '+5% XP',
                multiplier: 1.05,
                description: 'Your pet is content. +5% XP bonus.',
                source: 'Pet'
            });
        }
        
        // Well-fed buff
        if (buddy.hunger >= 80) {
            buffs.push({
                icon: '🍖',
                label: 'Well Fed',
                value: '+5% Coins',
                multiplier: 1.05,
                description: 'Your pet is well fed! +5% coin bonus.',
                source: 'Pet'
            });
        }
    }
    
    // Garden buffs
    if (state.settings?.gardenBuffs && state.garden) {
        const activePlots = state.garden.plots?.filter(p => p && p.crop && p.stage === 'ready') || [];
        if (activePlots.length >= 3) {
            buffs.push({
                icon: '🌻',
                label: 'Bountiful Garden',
                value: '+8% Yield',
                multiplier: 1.08,
                description: '3+ ready crops! +8% garden yield.',
                source: 'Garden'
            });
        }
    }
    
    return buffs;
}

/**
 * Apply buff multipliers to a base amount.
 * @param {number} baseAmount - Base reward amount
 * @returns {{amount: number, amountDelta: number, breakdown: string}}
 */
export function applyBuffScalars(baseAmount) {
    if (!isEnabled()) {
        return { amount: baseAmount, amountDelta: 0, breakdown: '' };
    }
    
    let amount = baseAmount;
    const buffs = getActiveBuffs();
    const parts = [];
    
    buffs.forEach(buff => {
        const pct = /([0-9]{1,3})%/.exec(buff.value || '');
        if (pct && buff.multiplier) {
            const before = amount;
            amount = Math.floor(amount * buff.multiplier);
            if (amount > before) {
                parts.push(`${buff.icon} ${buff.label}: +${amount - before}`);
            }
        }
    });
    
    return {
        amount,
        amountDelta: amount - baseAmount,
        breakdown: parts.join(', ')
    };
}

export default {
    getActiveBuffs,
    applyBuffScalars
};
