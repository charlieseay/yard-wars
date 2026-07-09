# Birdies and Bourbon - Testing Guide

## Testing on iOS (iPhone 11 Pro)

### Method 1: Expo Go App (Easiest)

1. **Install Expo Go** from the App Store (if not already installed)
2. **Start the dev server** on your Mac:
   ```bash
   cd ~/Projects/birdies-and-bourbon
   npx expo start
   ```
3. **Scan the QR code** that appears in terminal with your iPhone camera
4. App will open in Expo Go

### Method 2: Development Build (For production testing)

```bash
cd ~/Projects/birdies-and-bourbon
npx expo run:ios
```

This builds and installs directly to your iPhone (requires Xcode).

---

## Testing on Android

### Method 1: Expo Go App (Easiest)

1. **Install Expo Go** from Google Play Store
2. **Start the dev server** on your Mac (same as iOS):
   ```bash
   cd ~/Projects/birdies-and-bourbon
   npx expo start
   ```
3. **Scan the QR code** with Expo Go app (not camera - use the scan function in Expo Go)
4. App will load

### Method 2: Android Emulator (No physical device needed)

1. **Install Android Studio** if not already installed
2. **Create an emulator** (AVD):
   - Open Android Studio → Device Manager
   - Create Virtual Device → Pick a phone (Pixel 5 recommended)
   - Download system image (Android 13+)
3. **Start emulator**:
   ```bash
   # List available emulators
   ~/Library/Android/sdk/emulator/emulator -list-avds
   
   # Start one
   ~/Library/Android/sdk/emulator/emulator -avd Pixel_5_API_33
   ```
4. **Run the app**:
   ```bash
   cd ~/Projects/birdies-and-bourbon
   npx expo start --android
   ```

### Method 3: Physical Android Phone via USB

1. **Enable Developer Options** on Android phone:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"
2. **Connect via USB** and accept debugging prompt
3. **Run the app**:
   ```bash
   cd ~/Projects/birdies-and-bourbon
   npx expo run:android
   ```

---

## Multi-Device Testing (Same Network)

When running `npx expo start`, Expo creates a local dev server accessible to all devices on your WiFi network.

**To test on multiple devices simultaneously:**

1. Start dev server on Mac:
   ```bash
   npx expo start
   ```

2. Note the **LAN URL** in terminal (e.g., `exp://192.168.68.80:8081`)

3. **On each device**, scan QR code or manually enter URL in Expo Go

All devices will connect to the same instance - changes you make hot-reload across all devices!

---

## Current Dev Server Status

The Expo dev server is currently running. Check:

```bash
cd ~/Projects/birdies-and-bourbon
npx expo start
```

You should see:
- QR code for scanning
- `i` - open iOS simulator
- `a` - open Android emulator
- `w` - open web browser
- `r` - reload app

---

## Testing Checklist

### Core Flow
- [ ] Setup screen: Enter 2-4 players
- [ ] Setup screen: Select game deck (Retribution/Redemption/Loaded)
- [ ] Setup screen: Set skins value
- [ ] Active round: Score updates work (+/- buttons)
- [ ] Active round: Hole navigation (next/back)
- [ ] Active round: Skins pot updates correctly
- [ ] Chip assignment: Tap chip → tap player
- [ ] Chip display: Chips show on player rows
- [ ] Settlement: Final standings correct
- [ ] Settlement: Payout matrix calculated
- [ ] New round button returns to setup

### Custom Game Builder
- [ ] Open custom game builder from setup screen
- [ ] Create new deck with name and description
- [ ] Add chips with different weights
- [ ] Add cards with timing windows and modifiers
- [ ] Save custom deck
- [ ] Custom deck appears in setup screen deck selector
- [ ] Use custom deck in a round

### Bourbon Passport
- [ ] Open passport from setup screen
- [ ] View career stats (rounds, holes, earnings)
- [ ] Recent rounds list shows completed rounds
- [ ] Round details show course name, date, player count
- [ ] Distillery passport section (empty state)
- [ ] Expeditions section (coming soon state)
- [ ] Back button returns to setup

### Card Modifiers
- [ ] Open card panel during round
- [ ] Draw card from deck
- [ ] Select target player
- [ ] Card applies to player (stroke added/removed)
- [ ] Card shows as active modifier
- [ ] Card expires after timing window
- [ ] Cards reset between holes (if "currentHole" timing)

### OLED Optimization
- [ ] True black background (#000000)
- [ ] High contrast text visible in sunlight
- [ ] Large tap targets easy to hit
- [ ] Neon colors pop on dark background

### Offline Functionality
- [ ] App works with WiFi off
- [ ] Scores save during round
- [ ] Can complete full round offline
- [ ] Crash recovery (kill app mid-round, reopen)

---

## Known Issues / Not Yet Implemented

- **Venmo links**: Placeholder only - needs Venmo username integration
- **Course data**: Using default 18-hole par-3 course
- **QR Sync**: Needs compression library (pako or lz-string) - minification pipeline is built
- **Custom games**: ✅ Workshop built, ready to test
- **Bourbon passport**: ✅ Career stats screen built - needs location permission for distillery check-ins
- **Regional packs**: Kentucky Bourbon Trail data embedded, needs geofencing integration
- **Expeditions**: UI placeholder only, needs multi-round tracking logic

---

## Development URLs

- **Local dev server**: http://localhost:8081
- **LAN dev server**: exp://192.168.68.80:8081 (check terminal for actual IP)
- **Expo dashboard**: https://expo.dev

---

## Troubleshooting

### "Unable to connect to Metro"
- Check firewall isn't blocking port 8081
- Ensure phone and Mac on same WiFi network
- Try restarting dev server: `npx expo start -c` (clear cache)

### "Incompatible Expo version"
- Update Expo Go app from App Store/Play Store
- Or run: `npx expo install expo@latest`

### TypeScript errors
```bash
npx tsc --noEmit
```

### Clear cache and rebuild
```bash
npx expo start -c
```
