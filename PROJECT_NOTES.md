# WGU Practice App - Project Notes

## Overview
A comprehensive study tool for WGU assessments with gamification, AI-powered practice, and detailed metrics tracking.

---

## Core Features

### 1. Study Modes
- **Test Mode**: Timed practice tests with scoring
- **Drill Mode**: Spaced repetition with SM-2 algorithm
- **Review Mode**: Browse all questions with filters
- **AI Practice Mode**: AI-generated questions targeting weak areas

### 2. Gamification System (`Gamification` object)
- **XP & Levels**: Earn XP for correct answers, level up
- **Coins**: Currency for vending machine rewards
- **Streaks & Combos**: Daily streaks, answer combos
- **Achievements**: Unlock badges for milestones
- **Titles**: Earn titles based on level
- **Pet System**: Virtual study buddy with moods
- **Garden**: Plant and grow items with coins
- **Category Mastery**: Bronze/Silver/Gold/Platinum badges per category

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

Available backgrounds:
- **Classic** (default): Clean, minimal
- **Cozy Desk**: Warm study nook (unlocked)
- **Night Sky**: Twinkling stars (unlock: Level 5)
- **Rainy Window**: Canvas rain animation (unlock: 7-day streak)
- **Forest Glade**: Sunlit particles (unlock: Level 10)
- **Synthwave**: Retro neon grid (unlock: Night Owl achievement)

Toggle animations in Settings or via SceneManager.toggleAnimation()

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

## Outstanding Items (from memory)
1. Batch-size rewards with momentum UI feedback
2. Surface pet/garden buffs and linkage
3. Implement animated backgrounds plus trinkets/backpack UI
4. Add project decision bullet doc
5. Final git push
