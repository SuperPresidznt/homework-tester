# Project Notes

## Study Buddy Mechanics
- **Visibility & Activation**: `Gamification.updateBuddyWidget()` toggles the widget based on `state.settings.pet` and populates sprite, name, mood, and progress.
- **Dragging & Position Persistence**: `_applyBuddyPosition` and `_ensureBuddyDraggable` handle pointer-based dragging with clamped bounds and save the position in `state.settings.buddyPosition`. Long-presses longer than ~350 ms no longer trigger the buddy modal; quick taps do.
- **Hover/Drag Styling**: `.study-buddy` styles live around line 1078 of `index.html`. Hover scaling is scoped to `(hover:hover)` devices, while `.study-buddy.dragging` applies only a shadow to avoid stretch during touch drags.

## Evolution & Care System
- **State Fields**: `studyBuddy` includes `totalXpFed`, `careMinutes`, `studyMinutes`, `hunger`, `happiness`, etc., all persisted within the gamification state object.
- **Progression Logic**: `feedBuddy(xp)` (line ~2680) increments XP and care, heals the buddy, and loops through `BUDDY_STAGES` to evolve when both XP and care thresholds are met.
- **Achievements**: Evolution triggers `showAchievementToast` and may award evolution stones via level rewards around lines 2570–2580.

## Garden Water Meter & Feedback
- **Rendering**: `Garden.updateWaterMeter()` updates `.garden-water-meter` fill, text, and status colors based on `state.garden.waterLevel`.
- **Feedback Pulse**: `Garden.flashWaterMeter()` adds a CSS pulse class for 800 ms when watering succeeds. `_meterPulseTimer` prevents overlapping pulses.
- **Water Usage**: `Garden.useWater()` decrements inventory water, raises the meter up to 100, persists state, re-renders, and calls `flashWaterMeter()`.

## Reward & Engagement UX
- **Answer Rewards**: `Gamification.showAnswerReward(reward)` populates the toast (`#rewardToast`) with icons/values and auto-hides after 2 s.
- **Combo Tracking**: `incrementCombo()` and `updateComboDisplay()` keep the streak widget updated; combo multipliers cap at 3×.
- **XP/Coin Popups**: `showXpPopup` and `showCoinPopup` spawn temporary DOM elements to visualize gains when enabled.

## Initialization & Persistence
- **State Derivation**: `getDefaultState()` seeds settings, garden, study buddy, and inventory defaults. A deep merge pulls from saved localStorage data safely.
- **Saving**: `saveState` debounces writes and syncs `state.studyBuddy` back into the `pets` array so multi-pet setups stay consistent.
- **Unload Hook**: `window.beforeunload` triggers `Session.end()` and `Gamification.saveStateImmediate()` ensuring drag positions and progression persist.
