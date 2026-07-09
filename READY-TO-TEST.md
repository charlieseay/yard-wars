# Birdies and Bourbon - Ready to Test

**Everything is automated. Just run one command and scan the QR code.**

---

## Start Testing Now

```bash
cd ~/Projects/birdies-and-bourbon
./scripts/test-automation.sh
```

**What happens:**

1. ✅ Pre-flight validation (TypeScript, dependencies, Expo CLI)
2. 🚀 Dev server starts with monitoring
3. 📱 QR code appears — **scan with iPhone Camera app**
4. 🔍 App loads → health check auto-runs (you'll see console output)
5. 🎮 Start testing the game
6. 📊 Press Ctrl+C when done → report auto-generates

---

## What Gets Validated Automatically

### On Mac (before server starts)
- TypeScript syntax (all source files)
- npm dependencies installed
- Expo CLI available
- Required packages present (expo-file-system, expo-sqlite)

### On Device (when app loads)
- **File System API** - Paths.document available (Expo SDK 57)
- **SQLite API** - Database creation works
- **Storage Write** - Can write JSON to device
- **Storage Read** - Can read back written data

All results appear in console immediately.

---

## Console Output You'll See

```
🔍 Running device health check...
===================================
Platform: ios
Checks:
  File System API: ✅
  SQLite API: ✅
  Storage Write: ✅
  Storage Read: ✅

✅ All health checks passed
===================================
📝 Health check results saved to: file:///...
```

If you see this → **all systems go, start testing.**

---

## Test Report

When you press Ctrl+C, you get:

```
📊 Generating Test Report
==========================

✅ Report generated: .test-data/reports/test-report-20260708-153045.md
```

Open the report to see:
- Health check results (JSON)
- Device connection log
- Any errors detected
- Recommendations for next steps

---

## What to Test After Health Check Passes

### 1. Core Game Flow
- Setup screen: Enter 2-4 players
- Select game deck (Retribution/Redemption/Loaded)
- Set skins value (e.g., $1)
- Start round → score holes → advance through 18
- Settlement screen: View standings + payouts

### 2. Custom Game Builder
- Open from setup screen
- Create new deck with chips and cards
- Save deck
- Use in a round

### 3. Bourbon Passport
- Open from setup screen
- View career stats
- Check recent rounds list
- (Distillery check-ins not yet wired)

### 4. Offline Functionality
- Enable airplane mode
- Complete full round
- Verify data persists after closing app

### 5. Crash Recovery
- Start round → score a few holes
- Kill app (swipe up)
- Reopen app
- Verify round resumes from last state

---

## If Something Fails

### Health check fails

Check the error in console:
- `File System API: ❌` → Expo SDK version issue
- `SQLite API: ❌` → Device permissions or SDK issue
- `Storage Write: ❌` → Storage permissions issue
- `Storage Read: ❌` → File API compatibility issue

**Fix:** See `AUTOMATED-TESTING.md` troubleshooting section

### TypeScript errors

```bash
npx tsc --noEmit
# Fix reported errors
./scripts/pre-flight.sh
```

### Device won't connect

1. Verify iPhone and Mac on same WiFi
2. Check firewall not blocking port 8081
3. Update Expo Go from App Store
4. Clear cache: `npx expo start -c`

---

## Files Generated

After testing you'll have:

```
.test-data/
├── logs/
│   ├── dev-server-20260708-153045.log       # Full server output
│   ├── connections-20260708-153045.log      # Device connections
│   ├── errors-20260708-153045.log           # Errors (if any)
│   └── device-events.log                    # Event timeline
├── reports/
│   └── test-report-20260708-153045.md       # Consolidated report
└── health-check-result.json                 # Latest health check

```

All logs are timestamped and preserved for debugging.

---

## Documentation

- **This file** - Quick start guide (you are here)
- **AUTOMATED-TESTING.md** - Full automation documentation
- **scripts/README.md** - Individual script details
- **TESTING.md** - Manual testing procedures
- **README.md** - Project overview
- **PREMIUM-DESIGN.md** - UI/UX design system

---

## Ready?

```bash
cd ~/Projects/birdies-and-bourbon
./scripts/test-automation.sh
```

**Scan the QR code and watch the console for health check results.**

When you see ✅ All health checks passed → start playing the game.

Press Ctrl+C when done to generate report.

**That's it.**
