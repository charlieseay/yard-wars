# watchOS Target Setup - Complete Guide

**Status**: All code written, ready for Xcode target creation  
**Time Required**: ~15 minutes (manual Xcode GUI steps)  
**Prerequisites**: Xcode, paired Apple Watch, Apple Developer account

---

## 🎯 Goal

Add the watchOS companion app to Yard Wars so players can quickly enter scores from their Apple Watch during play (like UDisc's watch app).

## 📁 Files Already Created

All Swift code is written and committed:

```
ios/YardWarsWatch/
├── YardWarsWatchApp.swift           # Watch app entry point
├── ContentView.swift                 # Main UI (waiting/disconnected states)
├── ActiveRoundView.swift             # Score entry with Digital Crown
└── WatchConnectivityManager.swift    # Watch-side connectivity

ios/YardWars/
└── WatchConnectivityManager.swift    # iPhone-side connectivity
```

## 🔧 Step-by-Step Xcode Setup

### 1. Open Project in Xcode

```bash
cd ~/Projects/yard-wars/ios
open YardWars.xcworkspace
```

**Important**: Open `.xcworkspace` (not `.xcodeproj`) because the project uses CocoaPods.

---

### 2. Add watchOS Target

**In Xcode:**

1. Select **YardWars** project (blue icon at top of navigator)
2. At bottom of targets list, click **+** button
3. In template chooser:
   - Platform: **watchOS**
   - Application: **Watch App**
   - Click **Next**

4. Configure target:
   | Field | Value |
   |-------|-------|
   | Product Name | `YardWarsWatch` |
   | Organization Identifier | `com.seayniclabs` |
   | Bundle Identifier | `com.seayniclabs.yardwars.watchkitapp` (auto-filled) |
   | Language | **Swift** |
   | User Interface | **SwiftUI** |
   | Include Notification Scene | ❌ Unchecked |
   | Include Complication | ✅ Checked |

5. Click **Finish**

6. Dialog: "Activate 'YardWarsWatch' scheme?"
   - Click **Activate**

**Result**: Xcode creates `YardWarsWatch` folder with template files.

---

### 3. Remove Template Files (We Have Better Ones)

Xcode generates basic templates. Delete them - our pre-written code is better.

**In Xcode Project Navigator:**

1. Expand `YardWarsWatch` folder
2. Select these files (⌘-click to multi-select):
   - `ContentView.swift` (template version)
   - `YardWarsWatchApp.swift` (template version)
3. Right-click → **Delete**
4. Choose **Move to Trash**

**Do NOT delete:**
- `Assets.xcassets` (keep this folder)
- `Preview Content` folder (keep this)

---

### 4. Add Our Pre-Written Swift Files

Our files are already in `ios/YardWarsWatch/` on disk. Add them to the Xcode target:

**In Xcode:**

1. Right-click `YardWarsWatch` group in navigator
2. Choose **Add Files to "YardWarsWatch"...**
3. Navigate to: `~/Projects/yard-wars/ios/YardWarsWatch/`
4. Select all `.swift` files:
   - ✅ `YardWarsWatchApp.swift`
   - ✅ `ContentView.swift`
   - ✅ `ActiveRoundView.swift`
   - ✅ `WatchConnectivityManager.swift`
5. **Options at bottom of dialog**:
   - ✅ **Copy items if needed**: UNCHECKED (files already in correct location)
   - ✅ **Added folders**: Create groups
   - ✅ **Add to targets**: Check `YardWarsWatch` only
6. Click **Add**

**Verify**: Project navigator should show 4 Swift files under `YardWarsWatch` group.

---

### 5. Add iPhone Watch Connectivity

The iPhone app needs Watch Connectivity to talk to the Watch.

**In Xcode:**

1. Right-click `YardWars` group in navigator
2. Choose **Add Files to "YardWars"...**
3. Navigate to: `~/Projects/yard-wars/ios/YardWars/`
4. Select: `WatchConnectivityManager.swift`
5. **Options**:
   - ✅ **Add to targets**: Check `YardWars` (iPhone target)
6. Click **Add**

---

### 6. Configure Signing (Both Targets)

**For YardWars (iPhone):**

1. Select **YardWars** target
2. Go to **Signing & Capabilities** tab
3. **Team**: Select your Apple Developer account
4. **Bundle Identifier**: Should be `com.seayniclabs.yardwars` (already set)
5. Click **+ Capability** button
6. Add **Background Modes**
7. Under Background Modes, check:
   - ✅ **Remote notifications** (required for Watch Connectivity)

**For YardWarsWatch (Watch):**

1. Select **YardWarsWatch** target
2. Go to **Signing & Capabilities** tab
3. **Team**: Select same Apple Developer account
4. **Bundle Identifier**: Should be `com.seayniclabs.yardwars.watchkitapp` (auto-set)
5. No additional capabilities needed (Watch Connectivity works automatically)

---

### 7. Build Watch App

**In Xcode toolbar:**

1. Click scheme dropdown (should say "YardWarsWatch")
2. If not, select **YardWarsWatch** scheme
3. Next dropdown: Select **Your Apple Watch** (must be paired to Mac via iPhone)
4. Click **Run** button (▶️) or press **⌘R**

**What happens:**
1. Xcode builds Watch app (~30 seconds)
2. App installs on your Apple Watch
3. Watch shows "Yard Wars" icon
4. App launches automatically

**If build fails:**
- Check **Signing & Capabilities** - Team must be selected
- Verify Apple Watch is paired and unlocked
- Check iPhone is nearby and unlocked

---

### 8. Test Round Sync

**On iPhone:**

1. Open Yard Wars app
2. Start a new round (any players, any course)
3. Begin playing (enter some scores)

**On Apple Watch:**

1. Open Yard Wars Watch app
2. Should see:
   - Current hole number
   - Skins pot value
   - Ace pot (if enabled)
   - Player list (swipe to change)
   - Current player's score (large number)

**To update score from Watch:**

1. Turn **Digital Crown** to adjust score (haptic click per change)
2. OR tap **+/-** buttons
3. Tap **Update** button
4. Score syncs to iPhone automatically

**To advance hole:**

1. On iPhone, tap "Next Hole"
2. Watch updates automatically to new hole

---

## 🎨 Watch App Features

### Quick Score Entry
- **Digital Crown**: Scroll to adjust score (1-15)
- **+/- Buttons**: Tap to increment/decrement
- **Haptic Feedback**: Click on every change
- **Update Button**: Send score to iPhone

### Live Stats
- **Hole Number**: Top left (e.g., "Hole 5")
- **Skins Pot**: Center, green dollar sign
- **Ace Pot**: Top right (if enabled), green target icon
- **Player Switcher**: Swipe or use ← → buttons

### Connection States
- **Connected + Active Round**: Shows score entry screen
- **Connected + No Round**: "Start a round on iPhone"
- **Disconnected**: "iPhone not connected - Open Yard Wars on iPhone"

---

## 🔍 Troubleshooting

### "iPhone not connected" on Watch

**Causes:**
- iPhone out of Bluetooth range
- Yard Wars not running on iPhone
- Watch Connectivity not activated

**Fix:**
1. Ensure iPhone is nearby (within 30 feet)
2. Open Yard Wars on iPhone
3. Start a round
4. Wait 3-5 seconds for connection

### Build fails: "Signing requires a development team"

**Fix:**
1. Select **YardWarsWatch** target
2. Go to **Signing & Capabilities**
3. Choose your **Team** from dropdown
4. Xcode auto-generates provisioning profile

### Watch app doesn't appear on Watch

**Fix:**
1. Check Watch is paired: **Watch app on iPhone** → **My Watch** → verify paired
2. Rebuild: Clean build folder (**⌘⇧K**), then Run (**⌘R**)
3. Check iPhone: **Watch app** → **My Watch** → scroll to **Yard Wars** → ensure "Show App on Apple Watch" is ON

### Scores don't sync from Watch to iPhone

**Causes:**
- Watch Connectivity not initialized
- Background modes not enabled

**Fix:**
1. Verify **YardWars** target has **Background Modes** capability
2. Under Background Modes, **Remote notifications** must be checked
3. Rebuild both targets

---

## 📦 Uploading to App Store Connect

Once Watch target is added and tested:

1. **Select iPhone scheme** (not Watch scheme):
   - Scheme dropdown → **YardWars**
   - Destination dropdown → **Any iOS Device (arm64)**

2. **Archive**:
   ```bash
   cd ~/Projects/yard-wars
   ./scripts/archive-and-upload.sh
   ```

3. **Result**: Archive includes BOTH iPhone app AND Watch app
   - Single `.xcarchive` contains both binaries
   - Upload sends both to App Store Connect
   - TestFlight users get Watch app automatically if they have Apple Watch

---

## 🚀 Post-Upload

**In App Store Connect:**

1. Build processing includes Watch app (~15-20 min instead of 10-15)
2. TestFlight: Watch app appears automatically for testers with paired watches
3. App Store: List "Apple Watch" as supported device
4. Screenshots: Add Watch screenshots to App Store listing

**On User Devices:**

- User downloads Yard Wars from App Store
- If they have Apple Watch paired, Watch app auto-installs
- Watch app appears on Watch home screen
- No separate download required

---

## ✅ Verification Checklist

Before uploading:

- [ ] Both `YardWars` and `YardWarsWatch` targets build without errors
- [ ] Watch app runs on physical Apple Watch
- [ ] Starting round on iPhone updates Watch within 3 seconds
- [ ] Changing score on Watch updates iPhone when "Update" tapped
- [ ] Digital Crown adjusts score with haptic feedback
- [ ] Ace pot displays correctly (if enabled)
- [ ] Connection states show correctly (connected/disconnected/waiting)
- [ ] Scheme set to **YardWars** (not YardWarsWatch) before archiving

---

## 📝 Next Session Quick Start

If you added the Watch target and want to build/upload:

```bash
cd ~/Projects/yard-wars
./scripts/archive-and-upload.sh
```

Archive will include both iPhone and Watch apps automatically.

---

## 🎯 Summary

**What's Ready:**
- ✅ All Swift code written
- ✅ Watch UI complete (score entry, Digital Crown, player switcher)
- ✅ iPhone-Watch connectivity implemented
- ✅ Haptic feedback for all interactions
- ✅ Connection state handling

**What's Manual:**
- ⚠️ Xcode GUI: Add watchOS target (15 min, one-time)
- ⚠️ Hardware: Test on paired Apple Watch

**Time Investment:**
- Initial setup: 15 minutes (follow this guide)
- Testing: 5 minutes (start round, verify sync)
- Build & upload: Same as before (archive includes Watch automatically)

**Result:**
- v1.1 ships with full Apple Watch support
- Users with Apple Watch get companion app automatically
- No extra download or setup required for end users
