# Urgent Feature Work Plan

## 1. Batch-Size Rewards & Momentum UI ✅ COMPLETE
- ✅ **Reward tiers:** `BATCH_TIERS` defines 5/10/15/20+ with XP/Coin multipliers
- ✅ **Session metadata:** `App._applyBatchMeta()` persists batch size and multipliers
- ✅ **Momentum pills:** `getMomentumPillMarkup()` renders pill badges with tooltips
- ✅ **Consistency checks:** `handleMomentumBreak()` revokes momentum on combo reset/exit

## 2. Pet/Garden Buff Linkage Surfaced ✅ COMPLETE
- ✅ **Buddy widget buffs:** `#buddyBuffs` element shows active buffs via `getActiveBuffs()`
- ✅ **Buff math:** `applyBuffScalars()` applies pet/garden multipliers to XP/coins
- ✅ **Home meta panel:** Buff pills rendered in `#metaBuffGlance`
- ⚠️ **Garden callouts:** Harvest → pet feed loop reminders not yet implemented (nice-to-have)

## 3. Animated Backgrounds + Desk Trinkets/Backpack ✅ COMPLETE
- ✅ **Scene manager:** `SceneManager` object with 6 backgrounds (default, cozy-desk, night-sky, rain-window, forest-glade, synthwave)
- ✅ **Trinket inventory:** `Backpack` object with 16 trinkets across 5 rarity tiers, modal UI for viewing/equipping
- ✅ **Settings wiring:** Animation toggle in background modal, instant apply without reload
- ✅ **Persistence:** `wgu_scene` and `wgu_trinkets` localStorage keys for state
- ✅ **Desk trinkets:** Equipped trinkets render on home screen with bobbing animation
- ✅ **Unlock conditions:** Backgrounds unlock via level, streak, or achievement progress

## 4. Project Decisions / Ideas Document ✅ COMPLETE
- ✅ **Location & format:** Created `/docs/project-decisions.md`
- ✅ **Content structure:** Includes gameplay design, economy/balance, UX learnings, technical considerations
- ✅ **Future work queue:** Documented with priority tags (high/medium/low)
- ✅ **Change log tie-in:** References `urgent-task-plan.md` and `refactor-plan.md`
