/**
 * @module Router
 * @description Simple screen-based navigation for single-page app.
 */

const Router = {
    currentScreen: 'home',

    /**
     * Show a screen by ID, hiding all others.
     * @param {string} screenId - ID of screen element (without 'screen-' prefix)
     */
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(el => {
            el.classList.remove('active');
        });
        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.classList.add('active');
            this.currentScreen = screenId;
        } else {
            console.warn(`Router: screen-${screenId} not found`);
        }
    },

    /**
     * Navigate to home screen.
     */
    goHome() {
        this.showScreen('home');
        if (typeof Home !== 'undefined' && Home.render) {
            Home.render();
        }
    },

    /**
     * Get current screen ID.
     * @returns {string}
     */
    getCurrent() {
        return this.currentScreen;
    }
};

export default Router;
