# Birdies and Bourbon 🥏🥃

**Offline-first disc golf companion for skins games, chips, and bourbon passport tracking**

<img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue" />
<img src="https://img.shields.io/badge/React%20Native-Expo-000020" />
<img src="https://img.shields.io/badge/Architecture-Local--First-green" />

---

## Features

### ✅ Implemented (MVP)

- **Setup Flow** - Quick player entry, game deck selection, skins configuration
- **Live Scoring** - Hole-by-hole with massive outdoor-friendly tap targets
- **Chip Economy** - Assign penalty/reward chips to players
- **Skins Tracking** - Automatic pot calculation with pushed skins
- **Settlement** - Final standings + peer-to-peer payout matrix
- **OLED Optimized** - True black (#000000) for battery savings
- **Crash Recovery** - Resume mid-round if app dies
- **Offline-First** - Zero network calls, 100% local storage

### 🚧 Planned

- Drag-drop chip UI (currently tap-to-assign)
- QR code peer sync for multi-device scorecards
- Custom game builder workshop
- Bourbon distillery passport + expedition tracking
- Venmo deep-link integration

---

## Quick Start

### Automated Testing (Recommended)

**One command to validate everything:**

```bash
./scripts/test-automation.sh
```

Runs pre-flight validation → starts dev server → monitors device connection → generates test report.

See [AUTOMATED-TESTING.md](./AUTOMATED-TESTING.md) for full details.

### Manual Setup

```bash
# Install dependencies
npm install

# Start dev server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
```

See [TESTING.md](./TESTING.md) for detailed device setup.

---

## Architecture

**Design Philosophy**: Following NotebookLM spec for local-first disc golf companion

### State Management
- **Unidirectional Data Flow (UDF)** state machine
- State-driven router (no nav stack complexity)
- Immutable state with pure calculation functions

### Storage
- **Atomic JSON writes** with backup-and-swap pattern
- Schema versioning for safe migrations
- Crash recovery via unfinalized round detection

### Battery Optimization
- OLED true black background = pixels off
- No GPS tracking (unlike UDisc)
- No network calls (pure local)
- Result: All-day battery life

---

## Tech Stack

- **Framework**: React Native (Expo SDK 57)
- **Language**: TypeScript (strict mode)
- **Storage**: Expo FileSystem (atomic writes)
- **State**: Custom UDF coordinator
- **UI**: OLED-optimized theme with neon accents

---

## Game Decks

### Retribution Deck (Ript Revenge style)
High-chaos group sabotage with off-hand shots, standstills, and penalty cards.

### Duel Deck (Ript Showdown style)  
Tactical head-to-head with timing-based modifiers and format flips.

### Custom Decks
Workshop coming soon - build your own chips and cards.

---

## Project Structure

```
src/
├── types/          # TypeScript definitions
├── state/          # RoundCoordinator + default decks
├── storage/        # Atomic file repository
├── ui/
│   ├── theme/      # OLED colors + typography
│   ├── screens/    # Setup, Active, Settlement
│   └── components/ # ChipTray, etc.
└── utils/          # UUID generation

App.tsx             # Main coordinator wiring
```

---

## Design System

### Colors (OLED Optimized)
- **Background**: `#000000` (true black - pixels off)
- **Skins**: `#00FF00` (neon green)
- **Penalties**: `#FF0044` (neon red)
- **Rewards**: `#00FFFF` (neon cyan)

### Typography
- **Score displays**: 72pt bold
- **Headings**: 32pt / 24pt
- **Body**: 18pt medium
- **Min tap targets**: 48dp

---

## Testing on Your Devices

### iPhone 11 Pro
```bash
npx expo start
# Scan QR with Camera app
```

### Android (Emulator or Device)
```bash
# Start Android emulator first, then:
npx expo start --android
```

See [TESTING.md](./TESTING.md) for complete device setup guide.

---

## Development

```bash
# Type check
npx tsc --noEmit

# Start with cache clear
npx expo start -c

# Run on specific platform
npx expo start --ios
npx expo start --android
```

---

## Roadmap

- [x] Core scoring flow (setup → play → settle)
- [x] Chip assignment system
- [x] OLED theme implementation
- [x] Atomic storage with crash recovery
- [ ] Drag-drop chip UI
- [ ] QR sync for peer scorecards
- [ ] Custom game workshop
- [ ] Bourbon passport tracking
- [ ] Regional course atlas
- [ ] Venmo integration

---

## License

MIT

---

## Credits

Architecture design based on collaborative NotebookLM session exploring offline-first disc golf companion patterns.

**Built for**: Outdoor play with maximum battery efficiency and fat-finger usability.
