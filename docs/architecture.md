# WGU Practice - Architecture Overview

## Project Structure

```
wgu-practice/
├── index.html              # Main app (all inline JS/CSS for now)
├── package.json            # Build tooling config
├── banks/                  # Question bank JSON files
│   └── algebra-fxo1.json
├── docs/
│   ├── architecture.md     # This file
│   ├── project-decisions.md # Design rationale
│   ├── refactor-plan.md    # Modularization roadmap
│   └── urgent-task-plan.md # Feature completion status
└── js/                     # Modular code (future build target)
    ├── core/
    │   ├── index.js        # Re-exports
    │   ├── store.js        # localStorage wrapper
    │   └── router.js       # Screen navigation
    ├── gamification/
    │   ├── index.js        # Re-exports all gamification
    │   ├── state.js        # Central state management
    │   ├── xp.js           # XP calculations
    │   ├── coins.js        # Coin economy
    │   ├── buffs.js        # Pet/garden buffs
    │   └── momentum.js     # Batch momentum system
    ├── scene/
    │   ├── index.js        # Re-exports
    │   ├── manager.js      # Background controller
    │   └── styles.css      # Background CSS
    ├── trinkets/
    │   ├── index.js        # Re-exports
    │   ├── backpack.js     # Trinket inventory
    │   └── styles.css      # Trinket UI CSS
    └── utils/
        ├── index.js        # Re-exports
        ├── escape.js       # HTML escaping
        └── format.js       # Number/time formatting
```

---

## Module Dependency Graph

```
                    ┌─────────────────────────────────────┐
                    │           index.html                │
                    │  (inline versions of all modules)   │
                    └─────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │   Scene   │   │ Trinkets  │   │Gamification│
            │  Manager  │   │ Backpack  │   │  System   │
            └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                  │               │               │
                  │               │       ┌───────┴───────┐
                  │               │       ▼               ▼
                  │               │   ┌───────┐     ┌─────────┐
                  │               │   │  XP   │     │  Coins  │
                  │               │   └───┬───┘     └────┬────┘
                  │               │       │              │
                  │               │       ▼              ▼
                  │               │   ┌───────────────────────┐
                  │               │   │        Buffs          │
                  │               │   └───────────┬───────────┘
                  │               │               │
                  │               │               ▼
                  │               │   ┌───────────────────────┐
                  │               │   │      Momentum         │
                  │               │   └───────────┬───────────┘
                  │               │               │
                  └───────────────┴───────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │     State     │
                            │  (state.js)   │
                            └───────┬───────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │     Store     │
                            │  (store.js)   │
                            └───────┬───────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ localStorage  │
                            └───────────────┘
```

---

## Data Flow

### XP Award Flow
```
User answers correctly
        ↓
App.checkAnswer() / Drill.grade()
        ↓
Gamification.awardXp('correctAnswer', { withCombo: true })
        ↓
┌─────────────────────────────────────────────┐
│ 1. getState() from localStorage             │
│ 2. Get base XP from XP_VALUES               │
│ 3. Apply multipliers:                       │
│    • options.multiplier (custom)            │
│    • state.momentum.xpMultiplier (batch)    │
│    • state.combo.multiplier (streak)        │
│    • doubleXpRemaining (consumable)         │
│ 4. Apply buff scalars (pet/garden)          │
│ 5. Add combo bonus                          │
│ 6. Update state.xp                          │
│ 7. Check level up                           │
│ 8. saveState() to localStorage              │
│ 9. Update UI (XP bar, popups)               │
└─────────────────────────────────────────────┘
        ↓
Gamification.awardCoins() (similar flow)
```

### Session Lifecycle
```
User selects bank + mode + question count
        ↓
App.start(bank, mode, count)
        ↓
App._applyBatchMeta(count) → activateBatchMomentum()
        ↓
Session.start()
        ↓
┌─────────────────────────────────────────────┐
│ Question Loop:                              │
│   App.render() → display question           │
│   User selects answer                       │
│   App.checkAnswer() / App.next()            │
│   Award XP/coins on correct                 │
│   Update combo                              │
│   QuestionTracker.record()                  │
└─────────────────────────────────────────────┘
        ↓
App.submitTest() or session exit
        ↓
handleMomentumBreak('session_end')
        ↓
DailyGoal.recordQuestions()
        ↓
Home.render()
```

---

## Storage Keys

| Key | Description | Module |
|-----|-------------|--------|
| `wgu_gamification` | XP, coins, level, achievements, pet, garden, settings | state.js |
| `wgu_questionTracker` | Per-question spaced repetition data | QuestionTracker |
| `wgu_session_state` | Active session for resume | SessionState |
| `wgu_scene` | Background selection, animation toggle | SceneManager |
| `wgu_trinkets` | Trinket inventory, equipped slots | Backpack |
| `wgu_settings` | User preferences | Settings |
| `wgu_theme` | Dark/light mode | Theme |

---

## Key Objects (index.html inline)

| Object | Lines | Purpose |
|--------|-------|---------|
| `Store` | ~2050 | localStorage wrapper |
| `Gamification` | ~2094-3500 | XP, coins, buffs, achievements, pet/garden |
| `SceneManager` | ~4168-4327 | Animated backgrounds |
| `Backpack` | ~4336-4537 | Trinket inventory |
| `Shop` | ~4543-4800 | Item purchasing |
| `Garden` | ~4800-5500 | Crop planting/harvesting |
| `Battle` | ~5500-5900 | Battle system |
| `BankManager` | ~6077-6120 | Question bank loading |
| `Home` | ~6135-6245 | Home screen rendering |
| `App` | ~6268-7217 | Test/Practice engine |
| `Drill` | ~7238-7600 | SM-2 spaced repetition |
| `AIPractice` | ~7653-8200 | AI question generation |
| `QuestionTracker` | ~9920-10050 | Per-question telemetry |

---

## CSS Architecture

### Theme Variables (`:root`)
- Colors: `--navy`, `--blue`, `--green`, `--red`, `--orange`, `--yellow`
- Grays: `--gray-50` through `--gray-900`
- Layout: `--radius`, `--shadow`

### Dark Mode
- Triggered by `.dark` class on `<html>` or `prefers-color-scheme: dark`
- Overrides `--bg`, `--white`, `--gray-*` variables

### Scene Backgrounds
- Applied via `.scene-*` classes on `<body>`
- Animated via `.scene-animated` modifier
- Canvas animations use `#sceneCanvas` element

---

## Future Migration Path

1. **Phase 1** (current): All code inline in index.html, `/js/` modules exist but unused
2. **Phase 2**: Add Vite build, import `/js/` modules, remove inline duplicates
3. **Phase 3**: Split CSS into separate files, add CSS modules or Tailwind
4. **Phase 4**: Add TypeScript for type safety
5. **Phase 5**: Add unit tests for gamification math
