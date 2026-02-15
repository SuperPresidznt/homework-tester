/**
 * @module SceneManager
 * @description Manages animated backgrounds with CSS/Canvas layers.
 * Supports unlockable backgrounds with fallback static mode.
 * 
 * @fileoverview Controls visual themes and animated backgrounds.
 * 
 * ## Dependency Graph
 * ```
 * SceneManager (this file)
 *   ↓ imports
 *   └── js/core/store.js → Store.get(), Store.set()
 * 
 *   ↑ used by
 *   ├── js/scene/index.js → re-exports SceneManager, BACKGROUNDS
 *   └── index.html:
 *       ├── SceneManager (inline mirror)
 *       ├── init() → SceneManager.init()
 *       └── Home quick actions → SceneManager.openModal()
 * ```
 * 
 * ## Available Backgrounds
 * ```
 * ID           │ Animated │ Unlock Condition
 * ─────────────┼──────────┼─────────────────────
 * default      │    No    │ Always unlocked
 * cozy-desk    │    No    │ Always unlocked
 * night-sky    │   CSS    │ Level 5
 * rain-window  │  Canvas  │ 7-day streak
 * forest-glade │   CSS    │ Level 10
 * synthwave    │   CSS    │ 'night_owl' achievement
 * ```
 * 
 * ## Animation Types
 * - **CSS**: Uses ::before/::after pseudo-elements with keyframe animations
 * - **Canvas**: Uses #sceneCanvas element with requestAnimationFrame
 * 
 * ## Integration Points
 * - CSS classes applied to document.body (e.g., .scene-night-sky)
 * - Canvas element: #sceneCanvas (fixed position, pointer-events: none)
 * - Settings toggle for animation enable/disable
 * - Respects prefers-reduced-motion media query
 * 
 * ## Related Files
 * - js/core/store.js - Persistence via wgu_scene key
 * - js/scene/styles.css - CSS for all background themes
 * - index.html CSS - Inline styles for backgrounds
 * - index.html#SceneManager - Inline mirror with modal UI
 */

import Store from '../core/store.js';

const STORAGE_KEY = 'wgu_scene';

/**
 * Available background definitions.
 */
export const BACKGROUNDS = [
    {
        id: 'default',
        name: 'Classic',
        description: 'Clean, minimal background',
        unlocked: true,
        css: 'scene-default',
        animated: false
    },
    {
        id: 'cozy-desk',
        name: 'Cozy Desk',
        description: 'Warm study nook with soft lighting',
        unlocked: true,
        css: 'scene-cozy-desk',
        animated: false
    },
    {
        id: 'night-sky',
        name: 'Night Sky',
        description: 'Twinkling stars and gentle aurora',
        unlocked: false,
        unlockCondition: { type: 'level', value: 5 },
        css: 'scene-night-sky',
        animated: true,
        animationType: 'css'
    },
    {
        id: 'rain-window',
        name: 'Rainy Window',
        description: 'Peaceful rain on glass',
        unlocked: false,
        unlockCondition: { type: 'streak', value: 7 },
        css: 'scene-rain-window',
        animated: true,
        animationType: 'canvas'
    },
    {
        id: 'forest-glade',
        name: 'Forest Glade',
        description: 'Sunlit clearing with floating particles',
        unlocked: false,
        unlockCondition: { type: 'level', value: 10 },
        css: 'scene-forest-glade',
        animated: true,
        animationType: 'css'
    },
    {
        id: 'synthwave',
        name: 'Synthwave',
        description: 'Retro neon grid with pulsing colors',
        unlocked: false,
        unlockCondition: { type: 'achievement', value: 'night_owl' },
        css: 'scene-synthwave',
        animated: true,
        animationType: 'css'
    }
];

const SceneManager = {
    currentBackground: 'default',
    animationEnabled: true,
    canvasCtx: null,
    animationFrame: null,

    /**
     * Initialize scene manager.
     */
    init() {
        const saved = Store.get(STORAGE_KEY, {});
        this.currentBackground = saved.background || 'default';
        this.animationEnabled = saved.animationEnabled !== false;
        this.applyBackground(this.currentBackground);
    },

    /**
     * Get scene state.
     */
    getState() {
        return {
            background: this.currentBackground,
            animationEnabled: this.animationEnabled
        };
    },

    /**
     * Save scene state.
     */
    saveState() {
        Store.set(STORAGE_KEY, this.getState());
    },

    /**
     * Get all backgrounds with unlock status.
     * @param {object} gamificationState - Current gamification state for unlock checks
     */
    getBackgrounds(gamificationState = {}) {
        return BACKGROUNDS.map(bg => {
            let unlocked = bg.unlocked;
            if (!unlocked && bg.unlockCondition) {
                const cond = bg.unlockCondition;
                if (cond.type === 'level' && gamificationState.level >= cond.value) {
                    unlocked = true;
                } else if (cond.type === 'streak' && gamificationState.streak >= cond.value) {
                    unlocked = true;
                } else if (cond.type === 'achievement' && gamificationState.achievements?.includes(cond.value)) {
                    unlocked = true;
                }
            }
            return { ...bg, unlocked };
        });
    },

    /**
     * Apply a background by ID.
     * @param {string} backgroundId - Background ID
     */
    applyBackground(backgroundId) {
        const bg = BACKGROUNDS.find(b => b.id === backgroundId);
        if (!bg) return;

        // Remove all scene classes
        const body = document.body;
        BACKGROUNDS.forEach(b => body.classList.remove(b.css));

        // Stop any running canvas animation
        this.stopCanvasAnimation();

        // Apply new background
        body.classList.add(bg.css);
        this.currentBackground = backgroundId;

        // Start animation if enabled and background supports it
        if (this.animationEnabled && bg.animated) {
            if (bg.animationType === 'canvas') {
                this.startCanvasAnimation(bg.id);
            }
            body.classList.add('scene-animated');
        } else {
            body.classList.remove('scene-animated');
        }

        this.saveState();
    },

    /**
     * Toggle animation on/off.
     */
    toggleAnimation() {
        this.animationEnabled = !this.animationEnabled;
        this.applyBackground(this.currentBackground);
        return this.animationEnabled;
    },

    /**
     * Set animation enabled state.
     * @param {boolean} enabled
     */
    setAnimationEnabled(enabled) {
        this.animationEnabled = enabled;
        this.applyBackground(this.currentBackground);
    },

    /**
     * Start canvas-based animation.
     * @param {string} backgroundId
     */
    startCanvasAnimation(backgroundId) {
        const canvas = document.getElementById('sceneCanvas');
        if (!canvas) return;

        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvasCtx = canvas.getContext('2d');

        if (backgroundId === 'rain-window') {
            this.runRainAnimation();
        }
    },

    /**
     * Stop canvas animation.
     */
    stopCanvasAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        const canvas = document.getElementById('sceneCanvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    },

    /**
     * Rain animation loop.
     */
    runRainAnimation() {
        const ctx = this.canvasCtx;
        const canvas = ctx.canvas;
        const drops = [];

        // Initialize drops
        for (let i = 0; i < 100; i++) {
            drops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
            ctx.lineWidth = 1;

            drops.forEach(drop => {
                ctx.globalAlpha = drop.opacity;
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;
                if (drop.y > canvas.height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * canvas.width;
                }
            });

            ctx.globalAlpha = 1;
            this.animationFrame = requestAnimationFrame(animate);
        };

        animate();
    },

    /**
     * Handle window resize for canvas.
     */
    handleResize() {
        const canvas = document.getElementById('sceneCanvas');
        if (canvas && canvas.style.display !== 'none') {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
};

export default SceneManager;
