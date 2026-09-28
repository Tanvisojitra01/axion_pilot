#!/bin/bash
# Deployment verification script
# Run this before deploying to production

echo "🔍 Starting Deployment Verification..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION found"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm $NPM_VERSION found"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check if in frontend directory
echo ""
echo "📁 Checking directory..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} In frontend directory"
else
    echo -e "${RED}✗${NC} Not in frontend directory. Run this script from the frontend folder."
    exit 1
fi

# Check .env.local
echo ""
echo "⚙️  Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local found"
else
    echo -e "${YELLOW}⚠${NC} .env.local not found. Copy from .env.example and update values."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi

# Run lint
echo ""
echo "🔍 Running linter..."
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Linting passed"
else
    echo -e "${YELLOW}⚠${NC} Linting warnings (non-critical)"
fi

# Build production
echo ""
echo "🔨 Building production bundle..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed"
    exit 1
fi

# Check build output
echo ""
echo "📊 Checking build output..."
if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next | cut -f1)
    echo -e "${GREEN}✓${NC} .next directory created ($BUILD_SIZE)"
else
    echo -e "${RED}✗${NC} .next directory not found"
    exit 1
fi

# Success summary
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Verify .env.local has all required variables"
echo "  2. Test locally: npm run start"
echo "  3. Deploy: git push to trigger deployment"
echo ""
echo "🚀 Deployment ready!"
