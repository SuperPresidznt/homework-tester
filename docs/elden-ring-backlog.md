# Elden Ring-Inspired Feature Backlog

## Theme & Narrative Layer
1. **Lore-Wrapped Regions**  
   - *Goal*: Give each algebra category its own micro-biome (palette, iconography, tooltip lore).  
   - *Tasks*: (a) pick 4 pilot regions, (b) draft lore blurbs, (c) design lightweight CSS tokens.
2. **NPC Mentor System**  
   - *Goal*: Create recurring guide characters (“MPCs”) that surface hints, encouragement, or side quests.  
   - *Tasks*: (a) define 3 archetypes, (b) script trigger conditions, (c) wire up dialogue component.
3. **Story Beats & Questlines**  
   - *Goal*: Deliver short narrative arcs tied to progression (e.g., unlocks after clearing a region).  
   - *Tasks*: (a) outline act structure, (b) map beats to milestones, (c) update save schema for quest flags.

## Progression & Challenge
4. **Heroic Question Variants**  
   - *Goal*: Optional harder mode per question with prestige rewards.  
   - *Tasks*: (a) tagging schema in JSON, (b) UI toggle, (c) reward logic + telemetry.
5. **Fogged Roadmap / Unlock Gates**  
   - *Goal*: Reveal future content gradually to preserve mystery.  
   - *Tasks*: (a) design progression map, (b) gate question list by mastery, (c) add UI for upcoming unlocks.
6. **Prestige Signals**  
   - *Goal*: Surface streaks, fastest clears, “table-perfect” badges.  
   - *Tasks*: (a) extend stats tracking, (b) leaderboard/summary UI, (c) sharing hooks.

## UX & Systems
7. **Environmental Hints for Tables/Graphs**  
   - *Goal*: Replace blunt instructions with contextual highlights guiding attention to embedded media.  
   - *Tasks*: (a) design inline glyph component, (b) add `hintAnchors` metadata to JSON, (c) update renderer.
8. **Custom Goals / Challenge Pins**  
   - *Goal*: Learners author their own quests (“no hints run”, “graph marathon”).  
   - *Tasks*: (a) goal schema + persistence, (b) UI for goal creation, (c) progress tracking widget.
9. **NPC-driven Micro-events**  
   - *Goal*: Inject surprise moments (buddy delivers clue, NPC drops lore fragment) after streaks or idle time.  
   - *Tasks*: (a) event trigger matrix, (b) notification UI, (c) cooldown tuning.

## First Two Action Items (In Flight)
- **A1. NPC Archetype Draft (Due next work session)**: define names, personalities, and hint styles for three mentors.  
- **A2. Region Theme Pilot**: select initial module (e.g., Quadratics) and describe biome aesthetics + narrative hook.
