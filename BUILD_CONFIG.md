# Yard Wars Build Configuration

## Apple Developer Settings

- **Bundle ID:** `com.seayniclabs.yardwars`
- **Development Team:** `7NSS5CJL9E` (Charles Seay - cseay@live.com)
- **App Store Connect:** https://appstoreconnect.apple.com
- **TestFlight:** Internal testing group

## Build & Archive

```bash
# Increment build number
cd ios && agvtool next-version -all

# Archive and upload
./scripts/archive-and-upload.sh
```

## Known Issues

- After `npx expo prebuild --clean`, must re-add DEVELOPMENT_TEAM to Xcode project
- App icon sometimes shows as default in TestFlight (ASC caching issue)

## Build History

See [TESTING-PROTOCOL.md](TESTING-PROTOCOL.md) for full build history and troubleshooting.
