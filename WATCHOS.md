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

## Current State

- ✅ Type definitions added (`WatchSyncPayload` in `src/types/game.ts`)
- ✅ Documentation captured in this file
- ⏸️ Xcode Watch target creation deferred to post-v1.0

## Next Steps (Post-Launch)

1. Create watchOS target in Xcode (`File → New → Target → watchOS → Watch App`)
2. Add Watch Connectivity entitlement to both iOS and watchOS targets
3. Implement `WatchConnectivityManager` (Swift)
4. Build minimal watch UI with score entry
5. Test on paired devices (iPhone + Apple Watch)
6. Submit as app update with "watchOS support" in release notes
