/**
 * @module Backpack
 * @description Trinket inventory and desk placement system.
 * Manages collectible items with rarity, equipping, and persistence.
 * 
 * @fileoverview Collectible trinket system with inventory and desk placement.
 * 
 * ## Dependency Graph
 * ```
 * Backpack (this file)
 *   ↓ imports
 *   └── js/core/store.js → Store.get(), Store.set()
 * 
 *   ↑ used by
 *   ├── js/trinkets/index.js → re-exports Backpack, TRINKETS, RARITY
 *   └── index.html:
 *       ├── Backpack (inline mirror)
 *       ├── init() → Backpack.renderDeskTrinkets()
 *       ├── Home quick actions → Backpack.openModal()
 *       └── Achievements (future) → Backpack.awardRandomTrinket()
 * ```
 * 
 * ## Rarity Tiers
 * ```
 * Rarity    │ Drop Weight │ Color
 * ──────────┼─────────────┼─────────
 * Common    │     60%     │ #9ca3af
 * Uncommon  │     25%     │ #22c55e
 * Rare      │     10%     │ #3b82f6
 * Epic      │      4%     │ #a855f7
 * Legendary │      1%     │ #f59e0b
 * ```
 * 
 * ## Trinket Lifecycle
 * ```
 * Achievement/Milestone unlocked
 *       ↓
 * awardRandomTrinket() → rollTrinket() based on rarity weights
 *       ↓
 * addTrinket(id) → adds to inventory
 *       ↓
 * showTrinketToast() → displays award notification
 *       ↓
 * User opens Backpack modal
 *       ↓
 * handleTrinketClick() → select trinket
 *       ↓
 * handleSlotClick() → equip to desk slot
 *       ↓
 * renderDeskTrinkets() → shows on home screen
 * ```
 * 
 * ## Desk Slots
 * 5 slots positioned along bottom of screen:
 * - slot-1: Left (10%)
 * - slot-2: Center-Left (30%)
 * - slot-3: Center (50%)
 * - slot-4: Center-Right (70%)
 * - slot-5: Right (90%)
 * 
 * ## Related Files
 * - js/core/store.js - Persistence via wgu_trinkets key
 * - js/trinkets/styles.css - Modal and trinket card styles
 * - index.html CSS - Inline styles for backpack modal
 * - index.html#Backpack - Inline mirror with full UI
 */

import Store from '../core/store.js';

const STORAGE_KEY = 'wgu_trinkets';

/**
 * Trinket rarity tiers.
 */
export const RARITY = {
    common: { label: 'Common', color: '#9ca3af', weight: 60 },
    uncommon: { label: 'Uncommon', color: '#22c55e', weight: 25 },
    rare: { label: 'Rare', color: '#3b82f6', weight: 10 },
    epic: { label: 'Epic', color: '#a855f7', weight: 4 },
    legendary: { label: 'Legendary', color: '#f59e0b', weight: 1 }
};

/**
 * Available trinket definitions.
 */
export const TRINKETS = [
    // Common
    { id: 'pencil', name: 'Pencil', icon: '✏️', rarity: 'common', description: 'A trusty #2 pencil.' },
    { id: 'eraser', name: 'Eraser', icon: '🧽', rarity: 'common', description: 'For those inevitable mistakes.' },
    { id: 'paperclip', name: 'Paperclip', icon: '📎', rarity: 'common', description: 'Keeps things together.' },
    { id: 'sticky-note', name: 'Sticky Note', icon: '📝', rarity: 'common', description: 'Don\'t forget!' },
    { id: 'coffee-cup', name: 'Coffee Cup', icon: '☕', rarity: 'common', description: 'Fuel for late nights.' },
    
    // Uncommon
    { id: 'calculator', name: 'Calculator', icon: '🔢', rarity: 'uncommon', description: 'Crunch those numbers.' },
    { id: 'globe', name: 'Mini Globe', icon: '🌍', rarity: 'uncommon', description: 'The world at your fingertips.' },
    { id: 'plant', name: 'Desk Plant', icon: '🪴', rarity: 'uncommon', description: 'A touch of green.' },
    { id: 'lamp', name: 'Desk Lamp', icon: '💡', rarity: 'uncommon', description: 'Light up your studies.' },
    
    // Rare
    { id: 'trophy', name: 'Mini Trophy', icon: '🏆', rarity: 'rare', description: 'You earned this!' },
    { id: 'snow-globe', name: 'Snow Globe', icon: '🔮', rarity: 'rare', description: 'Shake it up.' },
    { id: 'hourglass', name: 'Hourglass', icon: '⏳', rarity: 'rare', description: 'Time is precious.' },
    
    // Epic
    { id: 'crystal', name: 'Study Crystal', icon: '💎', rarity: 'epic', description: 'Radiates focus energy.' },
    { id: 'owl-statue', name: 'Owl Statue', icon: '🦉', rarity: 'epic', description: 'Wisdom incarnate.' },
    
    // Legendary
    { id: 'golden-pen', name: 'Golden Pen', icon: '🖊️', rarity: 'legendary', description: 'Writes destiny itself.' },
    { id: 'phoenix-feather', name: 'Phoenix Feather', icon: '🪶', rarity: 'legendary', description: 'Rise from any failure.' }
];

/**
 * Desk slot positions for trinket placement.
 */
export const DESK_SLOTS = [
    { id: 'slot-1', label: 'Left', x: 10, y: 80 },
    { id: 'slot-2', label: 'Center-Left', x: 30, y: 85 },
    { id: 'slot-3', label: 'Center', x: 50, y: 80 },
    { id: 'slot-4', label: 'Center-Right', x: 70, y: 85 },
    { id: 'slot-5', label: 'Right', x: 90, y: 80 }
];

const Backpack = {
    /**
     * Get trinket state from storage.
     */
    getState() {
        return Store.get(STORAGE_KEY, {
            inventory: [],
            equipped: {},  // { slotId: trinketId }
            seen: []       // trinket IDs user has seen (for "new" badge)
        });
    },

    /**
     * Save trinket state.
     */
    saveState(state) {
        Store.set(STORAGE_KEY, state);
    },

    /**
     * Get all trinkets in inventory with metadata.
     */
    getInventory() {
        const state = this.getState();
        return state.inventory.map(id => {
            const trinket = TRINKETS.find(t => t.id === id);
            if (!trinket) return null;
            return {
                ...trinket,
                rarityData: RARITY[trinket.rarity],
                isNew: !state.seen.includes(id),
                isEquipped: Object.values(state.equipped).includes(id)
            };
        }).filter(Boolean);
    },

    /**
     * Add a trinket to inventory.
     * @param {string} trinketId
     */
    addTrinket(trinketId) {
        const state = this.getState();
        if (!state.inventory.includes(trinketId)) {
            state.inventory.push(trinketId);
            this.saveState(state);
        }
    },

    /**
     * Mark trinket as seen (removes "new" badge).
     * @param {string} trinketId
     */
    markSeen(trinketId) {
        const state = this.getState();
        if (!state.seen.includes(trinketId)) {
            state.seen.push(trinketId);
            this.saveState(state);
        }
    },

    /**
     * Equip a trinket to a desk slot.
     * @param {string} trinketId
     * @param {string} slotId
     */
    equip(trinketId, slotId) {
        const state = this.getState();
        
        // Remove from any existing slot
        Object.keys(state.equipped).forEach(slot => {
            if (state.equipped[slot] === trinketId) {
                delete state.equipped[slot];
            }
        });
        
        // Equip to new slot
        state.equipped[slotId] = trinketId;
        this.saveState(state);
    },

    /**
     * Unequip a trinket from its slot.
     * @param {string} trinketId
     */
    unequip(trinketId) {
        const state = this.getState();
        Object.keys(state.equipped).forEach(slot => {
            if (state.equipped[slot] === trinketId) {
                delete state.equipped[slot];
            }
        });
        this.saveState(state);
    },

    /**
     * Get equipped trinkets with slot info.
     */
    getEquipped() {
        const state = this.getState();
        const equipped = [];
        
        DESK_SLOTS.forEach(slot => {
            const trinketId = state.equipped[slot.id];
            if (trinketId) {
                const trinket = TRINKETS.find(t => t.id === trinketId);
                if (trinket) {
                    equipped.push({
                        ...trinket,
                        slot,
                        rarityData: RARITY[trinket.rarity]
                    });
                }
            }
        });
        
        return equipped;
    },

    /**
     * Roll for a random trinket based on rarity weights.
     * @returns {object} Trinket definition
     */
    rollTrinket() {
        const totalWeight = Object.values(RARITY).reduce((sum, r) => sum + r.weight, 0);
        let roll = Math.random() * totalWeight;
        
        let selectedRarity = 'common';
        for (const [rarity, data] of Object.entries(RARITY)) {
            roll -= data.weight;
            if (roll <= 0) {
                selectedRarity = rarity;
                break;
            }
        }
        
        const pool = TRINKETS.filter(t => t.rarity === selectedRarity);
        return pool[Math.floor(Math.random() * pool.length)];
    },

    /**
     * Award a random trinket to the player.
     * @returns {object} Awarded trinket with isNew flag
     */
    awardRandomTrinket() {
        const trinket = this.rollTrinket();
        const state = this.getState();
        const isNew = !state.inventory.includes(trinket.id);
        
        this.addTrinket(trinket.id);
        
        return {
            ...trinket,
            rarityData: RARITY[trinket.rarity],
            isNew
        };
    },

    /**
     * Render backpack modal HTML.
     */
    renderModal() {
        const inventory = this.getInventory();
        const equipped = this.getEquipped();
        
        let html = `
            <div class="backpack-modal">
                <div class="backpack-header">
                    <h2>🎒 Backpack</h2>
                    <button class="backpack-close" onclick="Backpack.closeModal()">&times;</button>
                </div>
                
                <div class="backpack-desk">
                    <h3>Your Desk</h3>
                    <div class="desk-slots">
        `;
        
        DESK_SLOTS.forEach(slot => {
            const trinket = equipped.find(t => t.slot.id === slot.id);
            html += `
                <div class="desk-slot" data-slot="${slot.id}" style="left:${slot.x}%;top:${slot.y}%">
                    ${trinket ? `
                        <span class="trinket-icon" style="color:${trinket.rarityData.color}" title="${trinket.name}">${trinket.icon}</span>
                    ` : `
                        <span class="slot-empty">+</span>
                    `}
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
                
                <div class="backpack-inventory">
                    <h3>Inventory (${inventory.length})</h3>
                    <div class="trinket-grid">
        `;
        
        if (inventory.length === 0) {
            html += `<p class="empty-inventory">No trinkets yet! Complete achievements to earn some.</p>`;
        } else {
            inventory.forEach(trinket => {
                html += `
                    <div class="trinket-card ${trinket.isEquipped ? 'equipped' : ''}" 
                         data-trinket="${trinket.id}"
                         style="border-color:${trinket.rarityData.color}">
                        ${trinket.isNew ? '<span class="new-badge">NEW</span>' : ''}
                        <span class="trinket-icon">${trinket.icon}</span>
                        <span class="trinket-name">${trinket.name}</span>
                        <span class="trinket-rarity" style="color:${trinket.rarityData.color}">${trinket.rarityData.label}</span>
                    </div>
                `;
            });
        }
        
        html += `
                    </div>
                </div>
            </div>
        `;
        
        return html;
    },

    /**
     * Open backpack modal.
     */
    openModal() {
        let modal = document.getElementById('backpackModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'backpackModal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        modal.innerHTML = this.renderModal();
        modal.classList.add('active');
        
        // Mark all as seen
        const inventory = this.getInventory();
        inventory.forEach(t => this.markSeen(t.id));
    },

    /**
     * Close backpack modal.
     */
    closeModal() {
        const modal = document.getElementById('backpackModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    /**
     * Render desk trinkets on home screen.
     */
    renderDeskTrinkets() {
        const container = document.getElementById('deskTrinkets');
        if (!container) return;
        
        const equipped = this.getEquipped();
        container.innerHTML = equipped.map(trinket => `
            <div class="desk-trinket" 
                 style="left:${trinket.slot.x}%;bottom:${100 - trinket.slot.y}%"
                 title="${trinket.name}: ${trinket.description}">
                <span style="color:${trinket.rarityData.color}">${trinket.icon}</span>
            </div>
        `).join('');
    }
};

export default Backpack;
