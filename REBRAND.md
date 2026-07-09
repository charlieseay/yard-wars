# Rebranding: Birdies and Bourbon → Yard Wars

**Decision Date:** 2026-07-08  
**Final Name:** **Yard Wars** (two words)

---

## Why the Change

**Problems with "Birdies and Bourbon":**
- Too niche (not everyone drinks bourbon, alienates non-drinkers)
- Activity-specific ("Birdies" locks us to disc golf only)
- Limited expansion (can't add cornhole, horseshoes, other yard games)
- Not memorable enough for the competitive side-bet vibe

**Why "Yard Wars" Works:**
- Activity-agnostic (works for disc golf, cornhole, horseshoes, anything)
- High energy and competitive (perfect for card modifiers and bets)
- Memorable, easy to spell and pronounce
- "Wars" fits the sabotage/shield/attack mechanics perfectly
- Two words = clear pronunciation, no ambiguity

---

## Trademark Clearance

**App Store Status:** ✅ **CLEAR**
- No active mobile apps named "Yard Wars" on iOS or Android
- No direct competitor apps

**Trademark Status:** ⚠️ **MEDIUM RISK (ACCEPTABLE)**
- YARDWARZ trademark exists (online auctions) - doesn't conflict with score tracking
- Yard Wars entertainment business (Nerf events) - different industry
- No federal trademark for "Yard Wars" in mobile apps/games

**Domain:** Not needed (product page will be on seayniclabs.com)

**Decision:** Proceed with Yard Wars. Risk is low given different industries.

---

## Brand Identity

### Name
**Yard Wars** (capitalized, two words, space between)

### Tagline
**"Friendly games. Serious stakes."**

Alternatives:
- "Settle the bets. Rule the yard."
- "Bring card-based chaos to the course."
- "Lawn games, custom cards, real payouts."

### Logo Concept (Selected)
**The Tactical Shield**
- Modern coat-of-arms crest optimized for OLED
- Sharp geometric shield with crossed disc basket and cornhole board
- High-contrast neon green on true black (#000000)
- Gamified, competitive, clean aesthetic

### Color Palette (Unchanged)
- **True Black:** #000000 (OLED optimized)
- **Neon Green:** #00FF00 (skins, primary actions)
- **Bourbon Amber:** #FF8C00 (accent, rewards)
- **Neon Cyan:** #00FFFF (secondary accent, ice)
- **Neon Red:** #FF0044 (penalties, alerts)
- **Pure White:** #FFFFFF (primary text)

---

## Repository & File Changes

### Directory Rename
```bash
# After committing current state
mv ~/Projects/birdies-and-bourbon ~/Projects/yard-wars
cd ~/Projects/yard-wars
git remote set-url origin https://github.com/charlieseay/yard-wars.git
```

### GitHub Repository
- Create new repo: `yard-wars`
- Archive old repo: `birdies-and-bourbon` (set to archived, keep for reference)
- Update remote URL in local clone

### Files to Update
- [ ] `package.json` - Change `"name": "birdies-and-bourbon"` → `"name": "yard-wars"`
- [ ] `app.json` - Change `"name": "Birdies and Bourbon"` → `"name": "Yard Wars"`
- [ ] `app.json` - Change `"slug": "birdies-and-bourbon"` → `"slug": "yard-wars"`
- [ ] `README.md` - Update title and all references
- [ ] `AUTOMATED-TESTING.md` - Update project name
- [ ] `READY-TO-TEST.md` - Update project name
- [ ] All source files with hardcoded strings
- [ ] Icon and splash screen assets (regenerate with new branding)

### Vault Updates
- [ ] Rename project folder: `Projects/Birdies and Bourbon/` → `Projects/Yard Wars/`
- [ ] Update all vault notes referencing the old name
- [ ] Update NotebookLM sources
- [ ] Update AI Handoff entries

---

## Next Steps

1. **Update all project files** (package.json, app.json, README, etc.)
2. **Regenerate app icons** with Yard Wars branding
3. **Create new GitHub repository** (`yard-wars`)
4. **Rename local directory** and update git remote
5. **Update vault project folder** and all references
6. **Test automation suite** with new name
7. **Commit and push** to new repository

---

## Asset Files

Current branding assets (will be updated):
- `assets/icon-source.svg` - App icon master file
- `assets/splash-source.svg` - Launch screen template
- `assets/branding-guide.html` - Complete brand documentation
- `assets/yardwars-analysis.html` - Name analysis and logo concepts

All existing technical work (automated testing, health checks, TypeScript, etc.) remains unchanged - only branding is affected.

---

**Status:** Ready to execute rebrand. No code changes required, only strings and assets.
