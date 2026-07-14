# Testing Protocol - Yard Wars

**MANDATORY:** Follow this protocol before every TestFlight upload.

## Pre-Upload Checklist

### ✅ Step 1: Simulator Testing (5-10 minutes)

**Never skip this step.** Catch crashes and UI issues before they reach TestFlight.

```bash
cd ~/Projects/yard-wars

# Option A: Expo dev client
npx expo start --ios

# Option B: React Native CLI (faster for quick checks)
npx react-native run-ios --simulator="iPhone 16 Pro"
```

**Test these flows:**

1. **App Launch**
   - [ ] App loads past "Loading..." screen (no hang)
   - [ ] Game type selector appears
   - [ ] All 4 game cards render with icons

2. **Disc Golf Flow**
   - [ ] Select Disc Golf
   - [ ] Setup screen shows deck picker + Ace Pot toggle
   - [ ] Enter 2 players, set skins value
   - [ ] Start round → active scoring screen appears
   - [ ] +/- buttons work for score entry
   - [ ] Navigate to next hole (hole counter increments)
   - [ ] End round → settlement screen shows

3. **Cornhole Flow**
   - [ ] Back to game selector
   - [ ] Select Cornhole
   - [ ] Setup shows points-to-win (21) + cancellation toggle
   - [ ] Start round → scoring works

4. **Quick Smoke Test**
   - [ ] Horseshoes game type loads
   - [ ] Custom game type loads
   - [ ] No JavaScript errors in Metro console

**If ANY test fails:** Fix it before proceeding to Step 2.

---

### ✅ Step 2: Build Archive

Only run after simulator tests pass.

```bash
cd ~/Projects/yard-wars

# Increment build number
cd ios && agvtool next-version -all && cd ..

# Archive + upload
./scripts/archive-and-upload.sh
```

**Watch for:**
- Archive succeeds (check console output)
- Export succeeds
- Upload succeeds

---

### ✅ Step 3: TestFlight Verification (15 minutes)

After upload completes:

1. **Wait for processing** (~10-15 min)
   - Check appstoreconnect.apple.com → Yard Wars → TestFlight
   - Status changes from "Processing" to ready

2. **Complete Export Compliance** (if prompted)
   - Yard Wars uses standard encryption (HTTPS only)
   - Select "No" for added encryption

3. **Add to testing group**
   - Internal Testing → Add build

4. **Download on device**
   - iPhone 11 Pro: Open TestFlight app
   - Install new build
   - **Test same flows as Step 1 on real device**

---

## When Builds Fail

### Loading Screen Hang
**Symptom:** App stuck on "Loading..." forever

**Causes:**
- Uncaught exception in `App.tsx` init function
- `autoHealthCheck()` crashing
- `RoundRepository.initialize()` failing

**Fix:** Wrap init steps in try/catch, log errors, fallback to game selector

**Verify:**
```bash
# Check metro console for errors
# Look for red error screens in simulator
```

---

### TypeScript Errors Block Archive
**Symptom:** Archive fails with bundling error

**Causes:**
- Missing dependencies (`@expo/vector-icons`, etc.)
- Import path typos
- Type mismatches

**Fix:**
```bash
# Install missing deps
npm install <missing-package>

# Verify compilation
npx tsc --noEmit

# Check metro bundler
npx expo start --clear
```

---

### Build Number Already Used
**Symptom:** Upload fails with "bundle version already used"

**Causes:**
- Forgot to increment build number
- `agvtool` incremented to wrong number

**Fix:**
```bash
cd ~/Projects/yard-wars/ios
agvtool new-version -all <next-number>
# Then re-run archive script
```

---

## Build History

Track what went wrong in each build so we don't repeat mistakes:

| Build | Date | Issue | Fix | Lesson |
|-------|------|-------|-----|--------|
| 2 | 2026-07-09 | Worked | - | First successful upload |
| 3 | 2026-07-13 | Build number conflict | Manual increment | - |
| 4 | 2026-07-13 | Build number conflict | Manual increment | - |
| 5 | 2026-07-13 | Missing `@expo/vector-icons` | `npm install` | Always test imports locally first |
| 6 | 2026-07-13 | Loading screen hang | Error handling in App.tsx | **Test in simulator before ASC upload** |

---

## Quick Reference

**Simulator test:** 5-10 min  
**Archive + upload:** 3-5 min  
**ASC processing:** 10-15 min  
**Total cycle:** 20-30 min per build

**Cost of skipping simulator test:** 20-30 min wasted + bad build in TestFlight

**Ports:**
- Expo metro: 8081 (may conflict with Hone)
- Alt port: 8082 (`PORT=8082 npx expo start`)

**GitHub repo:** https://github.com/charlieseay/yard-wars  
**ASC:** https://appstoreconnect.apple.com

---

## Automation TODO

Future improvements to this protocol:

- [ ] Pre-commit hook: Block commit if `npx tsc --noEmit` fails
- [ ] CI: Auto-run TypeScript + linter on every push
- [ ] Script: Combine simulator test + archive into one command
- [ ] E2E: Detox tests for critical flows (game selection → scoring → settlement)

---

**Last Updated:** 2026-07-13  
**Owner:** Claude Code + Charlie
