# Automated Testing Guide

**Everything you need to test Birdies and Bourbon on your iPhone with zero manual setup.**

## One-Command Testing

```bash
cd ~/Projects/birdies-and-bourbon
./scripts/test-automation.sh
```

That's it. The script will:

1. ✅ **Pre-flight validation** - Check TypeScript, dependencies, Expo CLI
2. 🚀 **Start dev server** - Launch Expo with automated monitoring
3. 📱 **Wait for device** - Monitor for iPhone connection
4. 🔍 **Auto health check** - App runs File API validation on device
5. 📊 **Generate report** - When you Ctrl+C, creates consolidated test report

## What Happens on Device

When you scan the QR code and the app loads, it automatically runs a health check:

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
```

**No interaction required** - just scan, wait for console output, start testing.

## Test Report

When you press Ctrl+C, you'll get a markdown report:

```
📊 Test Report
===============

✅ All health checks passed

Tested:
  - File System API (expo-file-system SDK 57)
  - SQLite API (expo-sqlite SDK 57)
  - Storage read/write capability

Device: iPhone 11 Pro
Platform: iOS 18
Session: 2026-07-08 15:30:45

Recommendations:
  → Test core game flow (setup → scoring → settlement)
  → Test custom game builder
  → Test bourbon passport
  → Test offline functionality (airplane mode)
```

Saved to `.test-data/reports/test-report-YYYYMMDD-HHMMSS.md`

## Manual Control

### Run individual steps:

```bash
# Pre-flight only
./scripts/pre-flight.sh

# Start server only
./scripts/start-test-server.sh

# Generate report only (after testing)
./scripts/generate-test-report.sh
```

### Read logs directly:

```bash
# Device connection log
cat .test-data/logs/connections-*.log

# Error log
cat .test-data/logs/errors-*.log

# Health check results
cat .test-data/health-check-result.json
```

## Troubleshooting

### "No device connection"

1. iPhone and Mac must be on **same WiFi network**
2. Check firewall isn't blocking **port 8081**
3. Update **Expo Go** app from App Store
4. Clear cache: `npx expo start -c`

### "Health checks failed"

1. Check **Expo SDK 57 compatibility** (current version)
2. Verify device **storage permissions** (Settings → Expo Go)
3. Try **reinstalling Expo Go**
4. Check for **iOS version compatibility**

### "TypeScript errors in pre-flight"

```bash
# See detailed errors
npx tsc --noEmit

# Fix reported files
# Re-run pre-flight
./scripts/pre-flight.sh
```

## What Gets Tested

### Automated (on app load)
- ✅ File System API availability
- ✅ SQLite API availability
- ✅ Storage write capability
- ✅ Storage read capability
- ✅ JSON serialization

### Manual (after health check passes)
- Core game flow (setup → scoring → settlement)
- Custom game builder
- Bourbon passport
- Offline functionality (airplane mode)
- Crash recovery (kill app mid-round)

## Next Steps After Passing

1. **Setup screen** - Enter 2-4 players, select deck, set skins value
2. **Active round** - Score holes, advance through 18 holes
3. **Settlement** - View payouts, Venmo links (placeholder)
4. **Custom game** - Create deck, add chips/cards, save, use in round
5. **Bourbon passport** - View career stats, recent rounds
6. **Offline test** - Enable airplane mode, complete full round
7. **Crash recovery** - Kill app mid-round, verify resume on reopen

## Full Documentation

- **Main README**: `README.md` - Project overview
- **Testing Guide**: `TESTING.md` - Manual testing procedures
- **Design System**: `PREMIUM-DESIGN.md` - UI/UX specs
- **Script Docs**: `scripts/README.md` - Detailed automation docs

---

**Ready to test?** Run `./scripts/test-automation.sh` and scan the QR code.
