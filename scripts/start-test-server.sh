#!/bin/bash
#
# Start Expo dev server with automated health monitoring
# Logs device connections and runs health checks automatically

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

LOG_DIR="$PROJECT_ROOT/.test-data/logs"
mkdir -p "$LOG_DIR"

SESSION_ID="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$LOG_DIR/dev-server-$SESSION_ID.log"

echo "🚀 Starting Birdies and Bourbon Test Server"
echo "==========================================="
echo ""
echo "Session ID: $SESSION_ID"
echo "Logs: $LOG_FILE"
echo ""

# Run pre-flight first
if [ -f "./scripts/pre-flight.sh" ]; then
    echo "Running pre-flight validation..."
    bash ./scripts/pre-flight.sh || {
        echo "❌ Pre-flight failed"
        exit 1
    }
    echo ""
fi

echo "📱 Scan QR code with your iPhone Camera app"
echo "   App will open in Expo Go automatically"
echo ""
echo "⏳ Waiting for device connection..."
echo ""

# Start Expo with logging
npx expo start 2>&1 | tee "$LOG_FILE" | while IFS= read -r line; do
    # Monitor for device connections
    if echo "$line" | grep -q "Opening on"; then
        DEVICE=$(echo "$line" | sed 's/.*Opening on //')
        echo "✅ Device connected: $DEVICE" | tee -a "$LOG_DIR/connections-$SESSION_ID.log"
        echo "$(date -Iseconds)|CONNECTED|$DEVICE" >> "$LOG_DIR/device-events.log"
    fi

    # Monitor for Metro bundling complete
    if echo "$line" | grep -q "Finished building JavaScript bundle"; then
        echo "✅ Bundle loaded on device" | tee -a "$LOG_DIR/connections-$SESSION_ID.log"
        echo "$(date -Iseconds)|BUNDLE_COMPLETE" >> "$LOG_DIR/device-events.log"
    fi

    # Monitor for errors
    if echo "$line" | grep -qE "(ERROR|Failed|Cannot)"; then
        echo "⚠️  Error detected: $line" | tee -a "$LOG_DIR/errors-$SESSION_ID.log"
    fi

    echo "$line"
done

echo ""
echo "Server stopped"
