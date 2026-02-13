# Project Decision Bullet Doc

## Context
- Goal: refresh WGU practice experience with deeper gamification, cosmetic layers, and transparent reward feedback before handoff.
- Scope left after this doc: finalize doc set + perform final git push (feature work already merged locally).

## Completed Decisions
- **Momentum + Batch Feedback**  
  - Surface session pacing systems (momentum streak + batch run) directly in the XP bar meta pills.  
  - Record reward metadata per answer and reuse it in the reward toast for clarity.  
  - Rationale: learners immediately see why XP spikes occur, preventing “hidden math” confusion.
- **Pet & Garden Buff Visibility**  
  - Added pet buff pill near XP bar and bonus chips in reward toast (🐾), alongside momentum/batch chips.  
  - Keeps pet care relevant and ties garden harvest effects back into study rewards.
- **Animated Background Toggle**  
  - When enabled, the home hero swaps to a layered gradient sky with floating orbs + darker palette, tied to the existing toggle in Settings.  
  - Gives “immersion bump” without impacting other screens.
- **Trinkets & Backpack UI**  
  - Adds shelf/backpack visuals (chips + slots) in the home sidebar when trinkets are enabled.  
  - Sets stage for future collectible drops; currently decorative but wired to toggle/state.

## In-Progress / Next
- **Documentation**: this bullet doc satisfies backlog item “project decision doc.”  
- **Final Git Push**: pending after quick regression sweep.

## Notes for Handoff
- Momentum, batch, pet buffs all rely on `state.stats.lastRewardMeta`—keep structure stable if adding new reward modifiers.  
- Animated backgrounds + trinkets only require toggling existing settings; no additional data migrations needed.  
- Garden, battle, and AI practice screens unaffected by cosmetic toggles.
