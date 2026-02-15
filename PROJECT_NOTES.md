# WGU Practice App - Project Notes

**Current Version: v2.50** | Last Updated: Feb 15, 2026

## Overview
A comprehensive study tool for WGU assessments with gamification, AI-powered practice, Elden Ring-style boss battles, idle business system, housing, animated backgrounds, and detailed metrics tracking.

---

## Core Features

### 1. Study Modes
- **Test Mode**: Timed practice tests with scoring
- **Drill Mode**: Spaced repetition with SM-2 algorithm
- **Review Mode**: Browse all questions with filters
- **AI Practice Mode**: AI-generated questions targeting weak areas
- **Speed Mode**: Timed hot-seat questions with coin multipliers based on answer speed
- **Boss Battle Mode**: Elden Ring-style battles where correct answers deal damage

### 2. Gamification System (`Gamification` object)
- **XP & Levels**: Earn XP for correct answers, level up
- **Coins**: Currency for shop, housing, businesses
- **💎 Gems**: Premium currency (harder to earn)
  - Earn: Level up (2/level, 7 every 5 levels), achievements (1), perfect tests (5), boss kills (10)
  - Spend: Premium backgrounds, premium businesses, future items
- **Streaks & Combos**: Daily streaks, answer combos with multipliers
- **Achievements**: Unlock badges for milestones
- **Titles**: Earn titles based on level
- **Pet System**: Virtual study buddies with moods, hunger, happiness, sickness, death
- **Garden**: Plant and grow items with coins
- **Category Mastery**: Bronze/Silver/Gold/Platinum badges per category
- **Housing System**: Buy houses with XP bonuses, deterioration, repair services
- **Idle Business System**: Passive income from businesses with automation

### 3. AI Practice Mode (`AIPractice` object)
- **Pre-generation Buffer**: Generates 2-3 questions ahead (`BUFFER_SIZE: 3`)
- **Weak Area Targeting**: Analyzes drill data + test history to find weak categories
- **Adaptive Difficulty**: 
  - Increases difficulty when accuracy ≥75%
  - Decreases difficulty when accuracy <50%
- **Dynamic Re-evaluation**: Every 5 questions, re-analyzes weak areas based on session performance
- **Buffer Clearing**: Clears pre-generated questions when performance changes significantly

### 4. Metrics Dashboard (`Progress` object)
Located at: Progress button on home screen

**Sections:**
1. **🎮 Player Stats**: Level, XP, coins, streaks, achievements
2. **Overall Performance**: Accuracy %, total attempts, avg time/question
3. **Score Trend**: Line chart of last 20 test scores
4. **📈 Daily Accuracy Trend**: Line chart of daily accuracy (14 days)
5. **📚 Study Time vs Test Scores**: Scatter plot with correlation analysis
   - Shows if more study time = better scores
   - Calculates Pearson correlation coefficient
   - Displays trend line
6. **Test History**: Last 10 tests with expandable details
7. **Most Missed Questions**: Top 8 frequently missed
8. **Category Accuracy**: Bar chart with mastery badges
9. **⏱️ Time by Category**: Total time, avg/question, accuracy per category
10. **Category Performance**: Drill-based category stats
11. **Mastery Progress**: Mastered/Learning/New counts
12. **Study Time (Last 7 Days)**: Bar chart of daily study minutes

**Overall Trend Indicator** (top right):
- 📈 Trending Up / 📉 Trending Down / ➡️ Stable

---

## Time Tracking

### Activity-Based Tracking (`Session` object)
- **Idle Timeout**: 60 seconds (`IDLE_TIMEOUT: 60000`)
- **Activity Events**: mousemove, mousedown, keydown, touchstart, scroll, click
- **Active Seconds**: Only counts time when user is active
- **Storage**: `studyByDay` (per day), `globalStats.totalStudyMins` (total)

### Per-Category Time Tracking
- Stored in `Gamification.categoryMastery[category].totalTimeMs`
- Updated via `Gamification.updateCategoryMastery()`
- Uses `Gamification.getQuestionTime()` to measure time per question

---

## AI Chat System (`Chat` object)

### Context Provided to AI
- Current question context (if in a mode)
- Comprehensive stats via `AIPractice.getComprehensiveStats()`:
  - Level, XP, coins
  - Streaks, combos
  - Questions answered, tests completed
  - Study time (today, total)
  - Per-category stats with time
  - Weak areas
  - Current session stats
- **Knowledge Gaps**: Tracks user confusion phrases and provides context on similar questions

### Response Style (v2.44+)
- MAX 2-3 sentences unless detail requested
- Answer first, then brief explanation
- No filler phrases ("Great question!", etc.)
- Talks like a friend, not a textbook

### 📊 Chart Rendering
AI can generate charts in responses using syntax:
```
[CHART:type:title:label1,value1;label2,value2;...]
```
- **Types**: `bar`, `pie`, `line`
- **Example**: `[CHART:bar:Category Scores:Algebra,85;Geometry,72;Stats,90]`
- Renders as canvas chart in chat

### 🔊 Text-to-Speech
- Prefers Google/Microsoft/Samantha/Alex voices
- Rate: 1.0, Pitch: 1.0, Volume: 1.0
- Click speaker icon on any AI response

### Text Formatting (`_stripMarkdown`)
Cleans AI responses:
- Removes markdown: bold, italic, headings, code blocks
- Removes LaTeX: $math$, \frac{}, \times, \sqrt{}, etc.
- Fixes concatenated text patterns
- Collapses multiple spaces

---

## Data Storage (localStorage)

### Keys
- `wgu_gamification`: Full gamification state
- `wgu_studyByDay`: Daily study minutes
- `wgu_globalStats`: Global statistics
- `wgu_drillProgress`: SM-2 drill data per question
- `wgu_testHistory_[bankId]`: Test history per bank
- `wgu_questionTracker`: Per-question attempt history
- `wgu_anthropicKey` / `wgu_openaiKey`: API keys
- `wgu_provider`: AI provider selection
- `wgu_theme`: Theme preference

---

## Settings Options

### Data Management
- **Clear Study Time**: Resets `studyByDay` and `totalStudyMins`
- **Reset All Metrics**: Clears all gamification data, XP, levels, achievements
- **Export/Import**: Backup and restore all data

---

## Version History

- **v2.50**: Idle business system, 12 new animated backgrounds, graph year fix
- **v2.49**: Housing deterioration system with laborers and repair services
- **v2.48**: Pet housing, user housing, furniture, vehicles, pet death/graveyard
- **v2.47**: Shop expansion with multiple categories
- **v2.46**: Backpack/trinkets system, scene manager improvements
- **v2.45**: Boss battle system enhancements
- **v2.44**: AI chat charts, concise responses, better TTS voice selection
- **v2.43**: Gems premium currency, lava lamp background, gem earning conditions
- **v2.42**: Header gems/coins display, scene purchase system
- **v2.41**: Speed Mode with timed questions and coin multipliers
- **v2.40**: Knowledge gap tracking in AI chat, combo display fixes
- **v2.39**: Intelligent correlation detection with insights panel, improved AI text formatting
- **v2.38**: Study time vs score correlation chart, project notes
- **v2.37**: Adaptive AI drill, comprehensive metrics dashboard, study time vs score chart
- **v2.36**: Enhanced Progress dashboard with gamification stats, time by category
- **v2.35**: Per-category time tracking, comprehensive AI stats
- **v2.34**: Activity-based time tracking, hours display, clear time button
- **v2.33**: Metrics reset feature

---

## Correlation Detection System

The app automatically detects and surfaces strong correlations (r ≥ 0.4) between:

1. **Study Time vs Test Scores**: Does more study time = better scores?
2. **Drill Practice vs Category Scores**: Do drilled categories perform better on tests?
3. **AI Practice vs Improvement**: Is AI-targeted practice improving scores over time?
4. **Streak vs Performance**: Does consistency correlate with better scores?
5. **Time per Question vs Accuracy**: Should you take more time or trust instincts?

Only shows insights when correlations are statistically meaningful (minimum data points required).

---

## Animated Backgrounds (SceneManager)

### Static Backgrounds
- **Classic** (default): Clean, minimal
- **Cozy Desk**: Warm study nook (unlocked)

### CSS Animated
- **Night Sky**: Twinkling stars (unlock: Level 5)
- **Forest Glade**: Sunlit particles (unlock: Level 10)
- **Synthwave**: Retro neon grid (unlock: Night Owl achievement)

### Canvas Animated (Live Wallpapers)
- **Rainy Window**: Rain drops on glass (unlock: 7-day streak)
- **🌈 Lava Lamp** (Premium): Floating colorful blobs (25 💎)
- **🐟 Aquarium**: Swimming fish with bubbles (Level 3)
- **✨ Fireflies**: Glowing fireflies in summer night (Level 7)
- **❄️ Snowfall**: Gentle snow drifting down (3-day streak)
- **🌌 Aurora Borealis**: Dancing northern lights (Level 15)
- **🫧 Bubbles**: Floating rainbow soap bubbles (Free)
- **💻 Matrix**: Digital rain code (Level 12)
- **🪼 Jellyfish** (Premium): Graceful jellyfish floating (15 💎)
- **🔥 Campfire**: Crackling fire with sparks (14-day streak)
- **🌊 Ocean Waves**: Calming layered ocean waves (Level 8)
- **🌸 Cherry Blossom** (Premium): Falling sakura petals (20 💎)
- **🌌 Galaxy**: Swirling cosmic nebula with stars (Level 20)
- **🐠 Koi Pond** (Premium): Colorful koi with lily pads (30 💎)

Toggle animations in Settings or via SceneManager.toggleAnimation()

### Premium Scene Purchases
- Gem-based scenes stored in `wgu_purchased_scenes`
- `SceneManager.purchaseScene(sceneId)` deducts gems and unlocks

---

## Technical Notes

### AI Question Generation
- Uses Anthropic Claude or OpenAI GPT
- System prompt includes category, difficulty, sample questions
- Response must be valid JSON with question, options, correctAnswer, explanation
- Validates response structure before displaying

### Adaptive Algorithm
```javascript
// Every 5 questions, re-evaluate weak areas
if (sessionStats.total % 5 === 0) {
    _updateWeakAreasFromSession();
}

// Blend historical weakness (30%) with session performance (70%)
const blendedScore = (originalScore * 0.3) + (sessionAccuracy * 0.7);

// Clear buffer when performance changes
if (_questionBuffer.length > 1) {
    _questionBuffer = _questionBuffer.slice(0, 1);
}
```

### Correlation Analysis
```javascript
// Pearson correlation for study time vs scores
const correlation = (n * sumXY - sumX * sumY) / 
    Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
```

---

---

## Speed Mode (`SpeedMode` object)

### Time Limits by Difficulty
- **Easy**: 30 seconds
- **Medium**: 20 seconds  
- **Hard**: 15 seconds

### Coin Multipliers (based on remaining time)
- **4x**: 80%+ time remaining
- **3x**: 60%+ time remaining
- **2x**: 40%+ time remaining
- **1x**: Otherwise

### Streak Bonuses
- **5+ streak**: +1 multiplier
- **10+ streak**: +2 multiplier

### Question Selection
- Weighted by mastery from drill progress (SM-2 data)
- Lower ease factor = higher selection weight

---

## Boss Battle System (`Battle` object)

### Mechanics
- Elden Ring-style boss encounters
- Correct answers deal damage to boss
- Wrong answers = boss attacks player
- Boss HP scales with difficulty
- Player has limited HP

### Rewards
- **10 gems** per boss defeated
- XP and coins based on performance
- Achievement unlocks

---

## UI Components

### Header (visible on all pages)
- **💎 Gems**: Purple gradient badge, click to open shop
- **🪙 Coins**: Gold gradient badge, click to open shop
- Home, Settings, Help buttons

### Combo Display
- Shows current combo multiplier during active sessions
- Resets when returning to home screen
- Hidden on non-question screens

---

## Housing System (`House` object)

### Available Houses
| House | Price | XP Bonus | Decay Rate |
|-------|-------|----------|------------|
| 🏕️ Tent | 100 | +2% | 0.5%/day |
| 🏠 Cabin | 500 | +5% | 0.4%/day |
| 🏡 House | 2,000 | +10% | 0.3%/day |
| 🏰 Mansion | 10,000 | +20% | 0.25%/day |
| 🏯 Castle | 50,000 | +35% | 0.2%/day |

### Deterioration System
- Houses decay over time (condition 0-100%)
- Condition affects XP bonus
- Visual condition bar with color coding:
  - Green (75-100%): Excellent/Good
  - Orange (50-75%): Fair
  - Yellow (25-50%): Poor
  - Red (0-25%): Dilapidated/Condemned

### Repair Services
| Service | Cost | Effect |
|---------|------|--------|
| Laborer (1 day) | 50 | +10%/day |
| Handyman (3 days) | 120 | +15%/day |
| Contractor (7 days) | 250 | +20%/day |
| Quick Repair | 25 | Instant +25% |
| Full Renovation | 100 | Restore to 100% |

---

## Idle Business System (`Business` object)

### Available Businesses
| Business | Price | Income | Cycle | Manager Cost |
|----------|-------|--------|-------|--------------|
| 🍋 Lemonade Stand | 50 | 0.1 | 60s | 100 |
| 📰 Paper Route | 150 | 0.3 | 120s | 300 |
| 🚿 Car Wash | 500 | 1 | 180s | 1,000 |
| 🥐 Bakery | 1,500 | 3 | 300s | 3,000 |
| 🍕 Pizzeria | 4,000 | 8 | 600s | 8,000 |
| 🕹️ Arcade | 10,000 | 20 | 900s | 20,000 |
| 🏋️ Gym | 25,000 | 50 | 1,200s | 50,000 |
| 🏨 Hotel | 75,000 | 150 | 1,800s | 150,000 |
| 💻 Tech Startup | 200,000 | 500 | 3,600s | 400,000 |
| 🛸 Space Port | 1,000,000 | 2,500 | 7,200s | 2,000,000 |

### Mechanics
- **Manual Collection**: Progress bar fills, click to collect when full
- **Upgrades**: Each level costs 15% more, increases income proportionally
- **Managers**: Hire to auto-collect income even while away
- **Passive Income**: Automated businesses generate coins/sec
- **Offline Progress**: Calculates income earned while away

---

## Pet System (`Garden.decayPetStats`)

### Pet Stats
- **Hunger**: Decays over time, feed to restore
- **Happiness**: Decays over time, play/interact to restore
- **Sickness**: Triggers when both hunger & happiness < 15%
- **Death**: Pets can die from prolonged neglect (moved to graveyard)

### Pet Housing Items
- Food bowls, water bowls, beds, toys
- Reduce decay rates and provide comfort bonuses

### Graveyard
- Deceased pets are memorialized
- Names are retired (can't reuse)

---

## Shop Categories

### Consumables
- **Food**: Feed pets (apple, fish, steak, cake, golden apple)
- **Seeds**: Plant in garden (sunflower, cactus, bonsai, crystal, rainbow)
- **Garden Items**: Water, fertilizer, magic dust, evo stone
- **Battle Items**: Health potion, shield charm, power berry

### Permanent Items
- **Pet Housing**: Food bowls, water bowls, beds, toys
- **User Housing**: Tent, cabin, house, mansion, castle
- **Furniture**: Desk, lamp, bookshelf, bed, couch
- **Vehicles**: Bicycle → Spaceship (7 tiers)
- **Decorations**: Cosmetic items
- **Pet Accessories**: Hats, collars, etc.

---

## Outstanding Items
1. ~~Batch-size rewards with momentum UI feedback~~ (partially done)
2. Surface pet/garden buffs and linkage
3. ~~Implement animated backgrounds~~ ✅ (19 backgrounds)
4. ~~Trinkets/backpack UI~~ ✅
5. ~~Add project decision bullet doc~~ ✅
6. ~~Housing system with deterioration~~ ✅
7. ~~Idle business system~~ ✅
8. Final polish and testing

---

## Future Feature Ideas

### AI Question Injection in Practice/Test Mode
**Problem**: Static question banks lead to memorization of specific answers rather than true concept mastery. Users recognize questions by their exact wording/numbers.

**Proposed Solutions**:

1. **AI Question Sprinkles** (Recommended)
   - During practice/test mode, randomly inject AI-generated questions (weighted, e.g., 10-20% of questions)
   - AI questions target same category/concept as surrounding questions
   - Marked subtly so user knows it's AI-generated
   - Prevents pure memorization by introducing novel variations

2. **Number/Value Manipulation**
   - AI modifies numerical values in existing questions while keeping the concept intact
   - E.g., "Calculate 15% of 200" becomes "Calculate 18% of 350"
   - Requires recalculating correct answers dynamically
   - More complex to implement but maintains question structure

3. **Hybrid Approach**
   - Use existing AI Drill for dedicated AI practice
   - Add "Mixed Mode" option that blends bank questions with AI-generated ones
   - User can set AI injection percentage (0%, 10%, 25%, 50%)

**Implementation Notes**:
- Could leverage existing `AIPractice` pre-generation buffer
- Weight AI questions toward categories with high accuracy (user has "memorized" those)
- Track separately: bank question accuracy vs AI question accuracy
- AI Drill already exists for pure AI practice - this would be for "sprinkling" into regular practice

**Current State**: AI Drill mode exists for dedicated AI-generated questions. This feature would integrate AI questions into standard practice/test modes to combat memorization.
