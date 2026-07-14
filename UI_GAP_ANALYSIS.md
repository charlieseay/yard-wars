# Yard Wars UI Gap Analysis

**Date:** 2026-07-13  
**Research Base:** Golf Games & Side Bets-FORMAT, BEEZER Golf, GolfPad, SwingU, 55k+ game UI patterns

---

## Critical Gaps (Blocking User Flow)

### 1. ❌ No Way to Exit/Pause Game
**Current:** User is trapped in active round with no escape  
**Standard:** Bottom-right pause button → modal with Resume/Save & Exit/Abandon  
**Impact:** Cannot test multiple game types without force-closing app

**Fix Required:**
- Add hamburger menu icon (top-right or bottom tab bar)
- Pause overlay modal with 3 options:
  - Resume Round (green, center-bottom)
  - Save & Exit (gray, below resume)
  - Abandon Round (red, destructive, top-right X)

---

### 2. ❌ Card Assignment Broken (Still)
**Current:** Alert says "Tap a player" but tapping does nothing  
**Root Cause:** `disabled={!selectedChipId}` blocks touch when chip IS selected (inverse logic)  
**Standard:** Tap-to-select pattern with visual feedback (#1, #2 badges)

**Fix Required:**
```typescript
// WRONG (current):
<TouchableOpacity disabled={!selectedChipId} onPress={handlePlayerPress}>

// CORRECT:
<TouchableOpacity 
  disabled={false}  // Always allow touch
  onPress={() => selectedChipId ? assignChip(playerId) : null}
  style={[
    styles.playerRow,
    selectedChipId && styles.playerRowHighlighted  // Visual feedback
  ]}
>
```

**Visual Feedback Needed:**
- Selected chip shows #1 badge
- Player rows highlight when chip is selected (border glow)
- Toast notification on successful assignment: "Skin assigned to Alice"

---

### 3. ❌ App Icon Missing
**Current:** Default blue triangle shows in TestFlight  
**Likely Cause:** Asset catalog not regenerated after `expo prebuild --clean`  
**Standard:** 1024×1024 PNG in `app.json` → EAS auto-generates variants

**Debug Steps:**
1. Verify icon exists: `file assets/icon-1024.png` → must be PNG
2. Check `app.json`: `"ios": { "icon": "./assets/icon-1024.png" }`
3. Rebuild asset catalog: `npx expo prebuild --clean --platform ios`
4. Inspect build: `ls ios/YardWars/Images.xcassets/AppIcon.appiconset/`
5. Upload new build (Build 8) and wait 10 min for ASC cache refresh

---

## Major UX Gaps (Navigation & Polish)

### 4. ⚠️ No Bottom Tab Bar
**Current:** Single-screen app with no navigation structure  
**Standard:** 4-5 bottom tabs for primary actions  
**Impact:** Cannot access game history, player management, settings

**Recommended Tab Structure:**
```
[Scorecard] [Game Types] [History] [Players] [Menu]
```

**Priority:** Medium (after pause menu works)

---

### 5. ⚠️ No Splash Screen
**Current:** White screen during app load (2-3 seconds)  
**Standard:** Animated brand splash with loading indicator  
**Impact:** Feels unpolished, no brand presence

**Implementation:**
- Use `expo-splash-screen` (already installed)
- Create 1242×2688 splash image (disc golf theme)
- Add fade-out animation after load
- Show "Loading..." text only if >2 seconds

---

### 6. ⚠️ Visual Polish Needed
**Current Issues:**
- No visual feedback on button press (activeOpacity inconsistent)
- Player rows have no spacing/padding (cramped)
- Colors lack hierarchy (everything is neon)
- No empty states ("No active round" shown, but plain text)

**Polish Checklist:**
- [ ] Add subtle shadows to player cards (elevation)
- [ ] Increase spacing between player rows (8px → 16px)
- [ ] Add haptic feedback on critical actions (score change, chip assign)
- [ ] Improve typography hierarchy (player names bold, scores larger)
- [ ] Add loading states (skeleton screens while data loads)
- [ ] Add empty states with illustrations (no rounds, no players)

---

## Research-Backed Patterns to Implement

### Navigation (Bottom Tab Bar)
**2026 Best Practice:** Hidden hamburger menus decrease task completion by 21%  
**Solution:** Bottom tab bar for primary actions (thumb-friendly)

**Placement:**
- Bottom 40% of screen = thumb zone (critical controls here)
- Top 20% = secondary (settings, info)

---

### Card Assignment (Tap-to-Select)
**Pattern:** Tap chip → tap player → visual confirmation  
**Why:** Drag-and-drop fails on mobile (patent research shows terminals too small)

**Flow:**
1. User taps chip in pool → chip highlights with #1 badge
2. User taps player → chip moves to player's row
3. Toast shows: "Power-up assigned to Alice"
4. Swipe left on assigned chip to undo

---

### Pause Menu (Pushdown Automata)
**Pattern:** Pause state = push new state onto stack  
**Why:** Enables seamless return with full state retention

**Modal Layout:**
```
┌─────────────────────────┐
│         PAUSED          │
│                         │
│  [Resume Round]  (green)│
│  [Save & Exit]   (gray) │
│  [Abandon Round] (red)  │
│                         │
│  X (top-right close)    │
└─────────────────────────┘
```

---

### App Icon Fix (Asset Catalog)
**Required:** `AppIcon.appiconset/Contents.json` must have all sizes  
**EAS Build:** Should auto-generate from `app.json` ios.icon  
**Fallback:** Manually regenerate with `npx expo prebuild --clean`

---

## Implementation Priority

### Sprint 1 (This Session) - Critical Blockers
1. ✅ Fix card assignment touch handler (inverse logic bug)
2. ✅ Add pause/exit menu (modal overlay)
3. ✅ Fix app icon (rebuild asset catalog)

### Sprint 2 (Next Session) - Navigation
4. Add bottom tab bar (Scorecard | Game Types | History | Menu)
5. Add hamburger menu (Settings, About, Help)
6. Add game type switcher (return to game selector)

### Sprint 3 (Polish Pass) - UX Refinement
7. Add splash screen (animated logo)
8. Polish visual design (spacing, shadows, typography)
9. Add haptic feedback (score changes, assignments)
10. Add empty states (no rounds, no players)

---

## Testing Checklist (Before Build 8)

**App Icon:**
- [ ] Run `file assets/icon-1024.png` → verify PNG format
- [ ] Run `npx expo prebuild --clean --platform ios`
- [ ] Check `ios/YardWars/Images.xcassets/AppIcon.appiconset/` has multiple sizes
- [ ] Build locally and inspect .ipa

**Card Assignment:**
- [ ] Tap chip → chip highlights with badge
- [ ] Tap player → chip moves to player row
- [ ] Toast shows "Assigned to [player]"
- [ ] Swipe left on chip → removes assignment

**Pause Menu:**
- [ ] Tap hamburger → modal shows
- [ ] Tap Resume → returns to scorecard
- [ ] Tap Save & Exit → returns to game selector, round saved
- [ ] Tap Abandon → confirmation, round deleted

**Visual Polish:**
- [ ] Player cards have spacing (16px)
- [ ] Buttons have consistent activeOpacity (0.7)
- [ ] Score buttons have haptic feedback
- [ ] Empty states show helpful text

---

## Sources

See research agent output above for full source list (55 URLs across navigation, card assignment, game state, app icons, and mobile UX patterns).
