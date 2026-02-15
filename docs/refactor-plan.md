# Refactor Plan

## Status Summary
- **Tasks 1 & 2 from urgent plan:** ✅ Complete (batch momentum UI, pet/garden buffs)
- **Tasks 3 & 4 from urgent plan:** ❌ Not started (animated backgrounds/trinkets, project decisions doc)

---

## Phase 1: Documentation & Cleanup (Low effort, high value)

### 1.1 Create Project Decisions Document
- [ ] Create `/docs/project-decisions.md`
- [ ] Document gameplay design rationale (momentum, buffs, gamification loop)
- [ ] Document removed experiments (pet bowls, time skips, Elden mode)
- [ ] Add economy/balance notes (XP curves, coin values, batch multipliers)
- [ ] Add UX learnings (home layout, mobile vs desktop)
- [ ] Add technical notes (state persistence, localStorage keys)
- [ ] Add future work queue with priorities

### 1.2 Code Comments & JSDoc
- [ ] Add JSDoc headers to major objects (Gamification, App, Home, AIPractice, etc.)
- [ ] Document state shape for `wgu_gamification`, `wgu_questionTracker`
- [ ] Add inline comments for complex logic (buff calculations, momentum decay)

---

## Phase 2: Modularization (Medium effort)

### 2.1 Extract Core Modules
Current state: Everything lives in one giant `<script>` block in `index.html`.

Proposed structure:
```
/js/
  core/
    store.js          # localStorage helpers
    router.js         # showScreen, navigation
    session.js        # SessionState, timer logic
  gamification/
    state.js          # getState, saveState
    xp.js             # awardXp, level calculations
    coins.js          # awardCoins, spendCoins
    buffs.js          # getActiveBuffs, applyBuffScalars
    momentum.js       # batch tiers, momentum activation
    achievements.js   # achievement definitions, unlock logic
  components/
    home.js           # Home.render, renderBanks
    app.js            # Test/Practice engine
    drill.js          # Drill mode
    ai-practice.js    # AI question generation
    garden.js         # Garden system
    shop.js           # Shop UI
    battle.js         # Battle system
  utils/
    escape.js         # escapeHtml
    chart.js          # InlineChart
    sound.js          # SoundFX
```

### 2.2 Build System Setup
- [ ] Add `package.json` with build scripts
- [ ] Configure esbuild/Vite for bundling
- [ ] Add ESLint + Prettier config
- [ ] Set up dev server with hot reload

---

## Phase 3: Feature Work (Higher effort)

### 3.1 Animated Backgrounds + Trinkets (from urgent plan)
- [ ] Create `/js/scene/manager.js` for background controller
- [ ] Define background unlock conditions in gamification state
- [ ] Create `/js/trinkets/backpack.js` for inventory modal
- [ ] Add trinket slot placement on home screen
- [ ] Wire to settings toggles
- [ ] Add persistence to state

### 3.2 Garden Loop Callouts (nice-to-have from task 2)
- [ ] Show harvest → pet feed reminders
- [ ] Display source crop/item when feeding pets
- [ ] Auto-refresh garden meters on pet stat changes

---

## Phase 4: Testing & Polish

### 4.1 Manual Test Checklist
- [ ] Verify all study modes work (Test, Practice, Drill, Review, AI)
- [ ] Verify gamification rewards (XP, coins, buffs, momentum)
- [ ] Verify pet/garden systems
- [ ] Verify session persistence and resume
- [ ] Test on mobile viewport
- [ ] Test dark mode

### 4.2 Automated Tests (future)
- [ ] Unit tests for gamification math
- [ ] Integration tests for session flow
- [ ] E2E tests with Playwright

---

## Priority Order
1. **Project Decisions Doc** — Quick win, helps future contributors
2. **Code Comments** — Low effort, improves maintainability
3. **Modularization** — Medium effort, enables future scaling
4. **Animated Backgrounds/Trinkets** — Feature work, can defer
5. **Automated Tests** — Nice-to-have, defer until modularized

---

## Next Action
Start with Phase 1.1: Create `/docs/project-decisions.md`
