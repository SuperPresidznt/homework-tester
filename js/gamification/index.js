/**
 * @module Gamification
 * @description Main entry point for gamification system.
 * Re-exports all gamification modules for convenient access.
 */

export * from './state.js';
export * from './xp.js';
export * from './coins.js';
export * from './buffs.js';
export * from './momentum.js';

// Default export combines all modules
import State from './state.js';
import XP from './xp.js';
import Coins from './coins.js';
import Buffs from './buffs.js';
import Momentum from './momentum.js';

export default {
    ...State,
    ...XP,
    ...Coins,
    ...Buffs,
    ...Momentum
};
