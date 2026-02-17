# Xooper's Battleground - Changelog

## v2.88 (Feb 17, 2026)
### Penalty System Update
- **Gentle penalty now ONLY applies to Speed Mode**
- Drill Mode and AI Practice now use full reset (quality 1) for wrong answers
- Rationale: Speed Mode has time pressure, so wrong answers may be due to running out of time rather than not knowing the material
- Other modes have no time pressure, so wrong answers indicate you need to review

| Mode | Wrong Answer | Effect |
|------|--------------|--------|
| Speed Mode | Quality 2 | Reduces reps by 1 (gentle) |
| Drill Mode | Quality 1 | Resets reps to 0 (harsh) |
| AI Practice | Quality 1 | Resets reps to 0 (harsh) |

---

## v2.87 (Feb 17, 2026)
### Progress Page Chart Fixes
- Added explicit `height` to progress page canvas elements
- Fixed Score Trend, Daily Accuracy, and Study Time vs Score charts
- Charts now render at proper 200-220px height

---

## v2.86 (Feb 16, 2026)
### House Interior View
- **New interior view** when you own a house
- Room tabs to switch between rooms (varies by house type)
- Furniture display showing owned items in each room
- Pet appears inside the house with mood indicator

### Penthouse Housing Type
- New penthouse option (🏙️ - 25,000 coins)
- 9 rooms: Foyer, Living, Kitchen, Dining, Master Suite, Guest Room, Bathroom, Office, Terrace
- Animated city skyline window view
- Slowest decay rate (0.15%/day)

### Room Layouts by House Type
| House | Rooms |
|-------|-------|
| Tent | Sleeping |
| Cabin | Living, Sleeping |
| House | Living, Kitchen, Bedroom, Bathroom |
| Mansion | Foyer, Living, Kitchen, Dining, Bedroom, Bathroom, Study |
| Penthouse | Foyer, Living, Kitchen, Dining, Master, Guest, Bathroom, Office, Terrace |
| Castle | Throne Room, Great Hall, Kitchen, Dining, Master, Guest, Tower, Library, Courtyard |

### Graph Display Improvements
- Increased margins for better label visibility
- Larger fonts for titles and axis labels
- Taller canvas (260-400px)
- Text truncation with "..." for long labels

---

## v2.85 and Earlier
- Speed Mode math delimiter fix ($ symbols no longer parsed as math)
- Drill Mode randomization improvements
- Date parsing fixes for progress tracking
- Various bug fixes and UI improvements

---

## Outstanding Items (TODO)
1. Batch-size rewards with momentum UI feedback
2. Surface pet/garden buffs and linkage in UI
3. Implement animated backgrounds + trinkets/backpack UI
4. Add project decision bullet doc
5. Final comprehensive testing pass
