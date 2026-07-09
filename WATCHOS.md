# watchOS Companion App - Implementation Guide

## Overview

Yard Wars will include an Apple Watch companion app for quick score entry during play (similar to UDisc's watch app).

## Phase 1 Features (Future Implementation)

### Quick Score Entry
- **Current Hole Display**: Show hole number, par, and current scores
- **Score Adjustment**: Digital crown scroll or +/- buttons to adjust score
- **Player Switch**: Swipe between players or tap to select
- **Haptic Feedback**: Subtle taps for score changes, strong pulse for ace detection

### Live Stats Display
- **Skins Pot**: Real-time pot value
- **Ace Pot**: Current ace pot total (if enabled)
- **Round Progress**: Holes remaining, current leader

### Watch Complications
- **Circular**: Hole number + skins pot value
- **Rectangular**: Full round status with player count
- **Corner**: Compact hole number only

## Technical Architecture

### Watch Connectivity
```swift
import WatchConnectivity

class WatchConnectivityManager: NSObject, WCSessionDelegate {
    static let shared = WatchConnectivityManager()
    private let session = WCSession.default
    
    func activateSession() {
        if WCSession.isSupported() {
            session.delegate = self
            session.activate()
        }
    }
    
    // Send round state from iPhone to Watch
    func syncRoundState(_ payload: WatchSyncPayload) {
        if session.isReachable {
            try? session.updateApplicationContext([
                "roundState": encodePayload(payload)
            ])
        }
    }
    
    // Receive score updates from Watch
    func session(_ session: WCSession, 
                 didReceiveMessage message: [String: Any]) {
        if let playerId = message["playerId"] as? String,
           let score = message["score"] as? Int {
            // Update score on iPhone
            NotificationCenter.default.post(
                name: .watchScoreUpdate,
                object: ["playerId": playerId, "score": score]
            )
        }
    }
}
```

### Data Sync Protocol
- **iPhone → Watch**: Push round state on hole advance, score change
- **Watch → iPhone**: Send score updates immediately
- **Bidirectional**: Both devices can initiate score changes
- **Conflict Resolution**: Last write wins (timestamp-based)

### Battery Optimization
- **No GPS tracking**: All location data comes from iPhone
- **Minimal screen updates**: Only redraw on actual state change
- **Background app refresh**: Disabled when round not active
- **Complication updates**: Throttled to every 30 seconds max

## Implementation Phases

### Phase 1: Xcode Watch Target
- [ ] Add watchOS target to Xcode project
- [ ] Configure Watch Connectivity framework
- [ ] Set up shared data models (WatchSyncPayload)
- [ ] Enable WatchKit extension in app.json

### Phase 2: Core Watch UI
- [ ] Home screen: Round status summary
- [ ] Score entry screen: Digital crown + buttons
- [ ] Player list: Swipe navigation
- [ ] Ace detection alert

### Phase 3: Complications
- [ ] Circular complication family
- [ ] Rectangular complication family
- [ ] Corner complication family
- [ ] Timeline provider for updates

### Phase 4: Polish
- [ ] Haptic feedback for all interactions
- [ ] Watch face integration
- [ ] Force touch menu (end round, view stats)
- [ ] Accessibility (VoiceOver, larger text)

## Why Defer Full Implementation?

**For v1.0 launch**: Focus on core iOS app features first. watchOS companion adds significant complexity:
- Separate Xcode target (doubles build time)
- Watch Connectivity debugging (requires paired physical devices)
- Complication timeline management
- watchOS-specific UI frameworks (SwiftUI or WatchKit)

**Post-launch priority**: Add watchOS after core iOS app is stable and user-tested.

## Current State (2026-07-09)

- ✅ Type definitions added (`WatchSyncPayload` in `src/types/game.ts`)
- ✅ **All Swift code written and ready**:
  - `ios/YardWarsWatch/YardWarsWatchApp.swift` - Watch app entry point
  - `ios/YardWarsWatch/ContentView.swift` - Main watch UI
  - `ios/YardWarsWatch/ActiveRoundView.swift` - Score entry screen with Digital Crown
  - `ios/YardWarsWatch/WatchConnectivityManager.swift` - Watch-side connectivity
  - `ios/YardWars/WatchConnectivityManager.swift` - iPhone-side connectivity
- ⚠️ **Requires manual Xcode setup**: Watch target must be added via Xcode GUI (cannot automate)
- ⏸️ **Testing requires hardware**: Paired Apple Watch needed for validation
- 📋 **Complete Xcode setup guide below**

## How to Add watchOS Target (Manual Xcode Steps)

### Prerequisites
- Xcode 15+ installed
- Apple Watch paired to your iPhone
- Apple Developer account with watchOS capability

### Step 1: Add Watch App Target

1. Open `~/Projects/yard-wars/ios/YardWars.xcworkspace` in Xcode
2. Select YardWars project in navigator (top item)
3. Click **+** button at bottom of targets list
4. Choose **watchOS** → **Watch App**
5. Configure:
   - **Product Name**: `YardWarsWatch`
   - **Organization Identifier**: `com.seayniclabs`
   - **Bundle Identifier**: `com.seayniclabs.yardwars.watchkitapp`
   - **Language**: Swift
   - **User Interface**: SwiftUI
   - **Include Notification Scene**: No
   - **Include Complication**: Yes
6. Click **Finish**
7. When prompted "Activate 'YardWarsWatch' scheme?", click **Activate**

### Step 2: Replace Generated Files

Xcode creates template files. Replace them with our pre-written code:

```bash
# Delete Xcode-generated files
cd ~/Projects/yard-wars/ios
rm -rf YardWarsWatch/ContentView.swift
rm -rf YardWarsWatch/YardWarsWatchApp.swift

# Our files are already in place at:
# - YardWarsWatch/YardWarsWatchApp.swift
# - YardWarsWatch/ContentView.swift
# - YardWarsWatch/ActiveRoundView.swift
# - YardWarsWatch/WatchConnectivityManager.swift
```

### Step 3: Add Files to Xcode Target

1. In Xcode Project Navigator, right-click `YardWarsWatch` folder
2. Choose **Add Files to "YardWarsWatch"...**
3. Navigate to `ios/YardWarsWatch/`
4. Select all `.swift` files:
   - `YardWarsWatchApp.swift`
   - `ContentView.swift`
   - `ActiveRoundView.swift`
   - `WatchConnectivityManager.swift`
5. Ensure **Target Membership**: Check `YardWarsWatch`
6. Click **Add**

### Step 4: Add Watch Connectivity to iPhone Target

1. Select `YardWars` target
2. Go to **Build Phases** → **Compile Sources**
3. Click **+** button
4. Add `YardWars/WatchConnectivityManager.swift`
5. Go to **Signing & Capabilities**
6. Click **+ Capability**
7. Add **Background Modes**
8. Check **Remote notifications** (required for Watch Connectivity)

### Step 5: Configure Capabilities

**For YardWars (iPhone) target:**
1. **Signing & Capabilities** tab
2. Ensure **Team** is set to your Apple Developer account
3. Verify **Background Modes** capability exists
4. Check: ✅ Remote notifications

**For YardWarsWatch target:**
1. **Signing & Capabilities** tab
2. Set **Team** to your Apple Developer account
3. Bundle ID should be: `com.seayniclabs.yardwars.watchkitapp`

### Step 6: Build and Run

1. Select **YardWarsWatch** scheme in Xcode toolbar
2. Choose your **Apple Watch** as destination
3. Click **Run** (⌘R)
4. App installs on Watch
5. On iPhone, ensure Yard Wars is running
6. Start a round on iPhone
7. Watch app should show round state

## Next Steps (Post-v1.0 Launch)

1. Create watchOS target in Xcode (`File → New → Target → watchOS → Watch App`)
2. Add Watch Connectivity entitlement to both iOS and watchOS targets
3. Implement `WatchConnectivityManager` (Swift)
4. Build minimal watch UI with score entry
5. Test on paired devices (iPhone + Apple Watch)
6. Submit as app update with "watchOS support" in release notes
