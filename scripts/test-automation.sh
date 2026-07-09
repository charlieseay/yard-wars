#!/bin/bash
#
# Master test automation script
# Orchestrates pre-flight → server start → monitoring → report generation

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🎯 Birdies and Bourbon - Automated Testing Suite"
echo "=================================================="
echo ""

# Step 1: Pre-flight validation
echo "Step 1/3: Pre-flight Validation"
echo "--------------------------------"
bash "$PROJECT_ROOT/scripts/pre-flight.sh" || {
    echo ""
    echo "❌ Pre-flight failed - fix errors and try again"
    exit 1
}
echo ""

# Step 2: Start dev server (will run until Ctrl+C)
echo "Step 2/3: Starting Dev Server"
echo "------------------------------"
echo ""
echo "⏰ Server will run until you press Ctrl+C"
echo "📱 Scan QR code with your iPhone to begin testing"
echo ""
echo "Press Ctrl+C when testing is complete..."
echo ""

# Trap Ctrl+C to run report generation
trap 'echo ""; echo ""; echo "Step 3/3: Generating Report"; echo "----------------------------"; bash "$PROJECT_ROOT/scripts/generate-test-report.sh"; exit 0' INT

# Run server
bash "$PROJECT_ROOT/scripts/start-test-server.sh"
