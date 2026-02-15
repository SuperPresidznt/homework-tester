# Project Decisions & Design Rationale

## Overview
WGU Practice is a gamified study tool for WGU students. It combines spaced repetition, AI-generated questions, and pet/garden systems to make studying engaging.

---

## Gameplay Design

### Gamification Loop
- **XP & Levels:** Actions award XP (correct answers, streaks, daily goals). Levels unlock cosmetics and features.
- **Coins:** Earned alongside XP, spent in shop for pets, garden items, and consumables.
- **Combo System:** Consecutive correct answers build combo multiplier (up to 2x). Resets on wrong answer.
- **Momentum:** Batch-size rewards give temporary XP/coin multipliers for committing to longer study sessions (5/10/15/20+ questions).

### Batch Momentum Tiers
| Batch Size | XP/Coin Multiplier | Icon |
|------------|-------------------|------|
| 5+ | +5% | 📦 |
| 10+ | +12% | 🚀 |
| 15+ | +20% | 🔥 |
| 20+ | +30% | ⚡ |

**Rationale:** Encourages longer focused sessions without punishing short ones. Multipliers are modest to avoid feeling mandatory.

### Pet System (Buddy)
- Pets have hunger and happiness stats that decay over time.
- Feeding and playing with pets grants buffs to XP/coins.
- Sick pets provide no buffs until healed.
- **Design goal:** Create a low-pressure Tamagotchi loop that rewards daily check-ins.

### Garden System
- Plant crops, water them, harvest for items.
- Harvested items can feed pets or be sold.
- **Closed loop:** Garden → Pet → Buffs → Better rewards → More coins → Garden expansion.

---

## Removed Experiments

### Pet Bowls (removed)
- Original design had separate food/water bowls with individual decay timers.
- **Why removed:** Too granular, felt like chores rather than fun. Simplified to single hunger stat.

### Time Skips (removed)
- Allowed spending coins to skip crop growth timers.
- **Why removed:** Undermined the daily check-in loop. Players would skip everything and lose engagement.

### Elden Mode (removed)
- Hardcore mode where wrong answers dealt "damage" and could end sessions.
- **Why removed:** Too punishing for a study tool. Anxiety-inducing rather than motivating.

---

## Economy & Balance

### XP Values
| Action | XP |
|--------|-----|
| Correct answer | 10 |
| Combo bonus (per streak) | 2 |
| Daily goal complete | 50 |
| Perfect session | 100 |

### Coin Values
| Action | Coins |
|--------|-------|
| Correct answer | 1 |
| Daily goal complete | 10 |
| Achievement unlock | varies |

### Buff Multipliers
- Pet happiness buffs: +5% to +15% XP/coins
- Garden buffs: +3% to +10% yield
- Momentum buffs: +5% to +30% (stacks with pet buffs)

**Balance philosophy:** Buffs should feel rewarding but not required. A player ignoring pets/garden should still progress at a reasonable pace.

---

## UX Learnings

### Home Screen Layout
- **Desktop:** Two-column layout with question banks prominent, stats sidebar sticky.
- **Mobile:** Single column, stats collapsed into expandable panel.
- **Logo:** Clickable to return home and clear session state.

### Dark Mode
- Respects system preference via `prefers-color-scheme`.
- Manual toggle available in settings.
- All colors use CSS custom properties for easy theming.

### Accessibility
- Focus-visible outlines on interactive elements.
- ARIA labels on icon-only buttons.
- Keyboard navigation for all modals.

---

## Technical Considerations

### State Persistence
All state stored in localStorage with these keys:
- `wgu_gamification` — XP, coins, level, achievements, pet, garden, settings
- `wgu_questionTracker` — Per-question performance data (streak, ease, interval, nextDue)
- `wgu_session_state` — Active session for resume functionality

### Performance
- Question banks loaded via fetch from `/banks/*.json`.
- Fallback embedded bank data for `file://` protocol.
- InlineChart uses Canvas for graph rendering.
- No external dependencies (vanilla JS).

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge).
- No IE11 support.
- Service worker for offline use (future).

---

## Future Work Queue

### High Priority
- [ ] **Modularize codebase** — Extract giant script block into `/js/` modules
- [ ] **Add build tooling** — esbuild/Vite for bundling, ESLint for linting

### Medium Priority
- [ ] **Animated backgrounds** — Scene controller for unlockable backgrounds
- [ ] **Trinkets/Backpack** — Collectible desk items with placement UI
- [ ] **Garden callouts** — Show harvest → pet feed loop in UI

### Low Priority / Ideas
- [ ] **Adaptive XP 2.0** — Dynamic XP based on question difficulty and user history
- [ ] **Narrative quests** — Story-driven study goals
- [ ] **Advanced momentum** — Streak-based momentum that persists across sessions
- [ ] **Multiplayer challenges** — Compare progress with friends
- [ ] **Mobile app wrapper** — PWA or Capacitor for app store distribution

---

## Changelog Tie-ins
- See `docs/urgent-task-plan.md` for feature completion status.
- See `docs/refactor-plan.md` for modularization roadmap.
