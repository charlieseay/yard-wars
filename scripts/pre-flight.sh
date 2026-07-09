#!/bin/bash
#
# Pre-flight validation for Birdies and Bourbon
# Runs before starting dev server to catch issues early

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔍 Pre-flight Validation"
echo "========================"
echo ""

# Check Node/npm versions
echo "✓ Node version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# TypeScript syntax check
echo "📝 Running TypeScript check..."
if npx tsc --noEmit; then
    echo "✓ TypeScript validation passed"
else
    echo "❌ TypeScript errors found - fix before testing"
    exit 1
fi
echo ""

# Dependency audit
echo "🔒 Checking dependencies..."
npm list --depth=0 > /dev/null 2>&1 || {
    echo "⚠️  Missing dependencies - running npm install"
    npm install
}
echo "✓ Dependencies OK"
echo ""

# Check for required Expo packages
echo "📦 Verifying Expo SDK..."
required_pkgs=("expo-file-system" "expo-sqlite" "expo-status-bar")
for pkg in "${required_pkgs[@]}"; do
    if ! npm list "$pkg" > /dev/null 2>&1; then
        echo "❌ Missing required package: $pkg"
        exit 1
    fi
    echo "✓ $pkg installed"
done
echo ""

# Check Expo CLI
echo "🚀 Verifying Expo CLI..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found - install Node.js"
    exit 1
fi
echo "✓ Expo CLI ready"
echo ""

# Create test data directory if needed
TEST_DATA_DIR="$PROJECT_ROOT/.test-data"
if [ ! -d "$TEST_DATA_DIR" ]; then
    mkdir -p "$TEST_DATA_DIR"
    echo "✓ Created test data directory: $TEST_DATA_DIR"
fi
echo ""

# Write device health check API endpoint config
cat > "$PROJECT_ROOT/.test-data/health-endpoint.json" <<EOF
{
  "endpoint": "/api/health",
  "checks": [
    "fileSystemAvailable",
    "sqliteAvailable",
    "storageWritable",
    "storageReadable"
  ],
  "timestamp": "$(date -Iseconds)"
}
EOF
echo "✓ Health check config written"
echo ""

echo "✅ Pre-flight validation complete"
echo ""
echo "Next steps:"
echo "  1. Run ./scripts/start-test-server.sh"
echo "  2. Scan QR code with your iPhone"
echo "  3. Health check will auto-run on device"
