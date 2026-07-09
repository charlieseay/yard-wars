#!/bin/bash
#
# Generate test report from health check results and device logs
# Run this after testing on device to see consolidated results

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

LOG_DIR="$PROJECT_ROOT/.test-data/logs"
REPORT_DIR="$PROJECT_ROOT/.test-data/reports"
mkdir -p "$REPORT_DIR"

REPORT_FILE="$REPORT_DIR/test-report-$(date +%Y%m%d-%H%M%S).md"

echo "📊 Generating Test Report"
echo "========================="
echo ""

# Report header
cat > "$REPORT_FILE" <<EOF
# Birdies and Bourbon - Device Test Report

**Generated:** $(date '+%Y-%m-%d %H:%M:%S %Z')
**Project:** Birdies and Bourbon
**Platform:** iOS (Expo Go)

---

## Summary

EOF

# Check for health check results
HEALTH_CHECK_FILE="$PROJECT_ROOT/.test-data/health-check-result.json"
if [ -f "$HEALTH_CHECK_FILE" ]; then
    cat >> "$REPORT_FILE" <<EOF
### Health Check Results

\`\`\`json
$(cat "$HEALTH_CHECK_FILE")
\`\`\`

EOF
else
    cat >> "$REPORT_FILE" <<EOF
### Health Check Results

⚠️ No health check results found. Device may not have connected yet.

EOF
fi

# Device connection log
LATEST_CONNECTION_LOG=$(ls -t "$LOG_DIR"/connections-*.log 2>/dev/null | head -1 || echo "")
if [ -n "$LATEST_CONNECTION_LOG" ]; then
    cat >> "$REPORT_FILE" <<EOF
### Device Connections

\`\`\`
$(cat "$LATEST_CONNECTION_LOG")
\`\`\`

EOF
else
    cat >> "$REPORT_FILE" <<EOF
### Device Connections

No device connections logged yet.

EOF
fi

# Error log
LATEST_ERROR_LOG=$(ls -t "$LOG_DIR"/errors-*.log 2>/dev/null | head -1 || echo "")
if [ -n "$LATEST_ERROR_LOG" ] && [ -s "$LATEST_ERROR_LOG" ]; then
    cat >> "$REPORT_FILE" <<EOF
### Errors Detected

\`\`\`
$(cat "$LATEST_ERROR_LOG")
\`\`\`

EOF
else
    cat >> "$REPORT_FILE" <<EOF
### Errors Detected

✅ No errors detected during testing.

EOF
fi

# Add recommendations section
cat >> "$REPORT_FILE" <<EOF
---

## Recommendations

EOF

# Parse health check results if available
if [ -f "$HEALTH_CHECK_FILE" ]; then
    SUCCESS=$(cat "$HEALTH_CHECK_FILE" | grep -o '"success": [^,}]*' | cut -d' ' -f2)
    if [ "$SUCCESS" = "true" ]; then
        cat >> "$REPORT_FILE" <<EOF
✅ **All health checks passed** - device is ready for full testing.

### Next Steps
1. Test core game flow (setup → scoring → settlement)
2. Test custom game builder
3. Test bourbon passport
4. Test offline functionality (airplane mode)
5. Test crash recovery (kill app mid-round)

EOF
    else
        cat >> "$REPORT_FILE" <<EOF
⚠️ **Some health checks failed** - review errors above.

### Troubleshooting
- Check Expo SDK version compatibility
- Verify device permissions (storage, file system)
- Try clearing app cache and rebuilding
- Check for Expo Go app updates

EOF
    fi
else
    cat >> "$REPORT_FILE" <<EOF
⚠️ **Device did not connect** - verify WiFi network and QR scan.

### Troubleshooting
1. Ensure iPhone and Mac are on same WiFi network
2. Check firewall isn't blocking port 8081
3. Try restarting dev server: \`npx expo start -c\`
4. Verify Expo Go app is up to date

EOF
fi

# Footer
cat >> "$REPORT_FILE" <<EOF
---

## Files

- **Health Check:** \`$HEALTH_CHECK_FILE\`
- **Logs:** \`$LOG_DIR\`
- **This Report:** \`$REPORT_FILE\`

EOF

echo "✅ Report generated: $REPORT_FILE"
echo ""

# Print summary to console
if [ -f "$HEALTH_CHECK_FILE" ]; then
    SUCCESS=$(cat "$HEALTH_CHECK_FILE" | grep -o '"success": [^,}]*' | cut -d' ' -f2)
    if [ "$SUCCESS" = "true" ]; then
        echo "✅ All health checks passed"
    else
        echo "⚠️ Some health checks failed - see report for details"
    fi
else
    echo "⚠️ No health check results yet"
fi

echo ""
echo "View full report:"
echo "  cat $REPORT_FILE"
echo ""
echo "Or open in browser:"
echo "  open $REPORT_FILE"
