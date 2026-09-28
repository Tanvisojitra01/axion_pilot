#!/bin/bash
# Complete startup script for the entire application
# Run this from the project root: bash start-all.sh

set -e

echo "🚀 Starting AxionX Application..."
echo ""

# =============================================================================
# BACKEND SETUP
# =============================================================================
echo "📦 Setting up Backend..."

cd backend

# Install dependencies
echo "   Installing Python dependencies..."
pip install -q -r requirements.txt 2>/dev/null || {
    echo "   ⚠️  Some packages failed, but continuing..."
}

# Run migrations if needed
echo "   Checking database..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)" 2>/dev/null || true

# Test import
echo "   Validating backend imports..."
python -c "from app.main import app; print('   ✅ Backend imports OK')" || {
    echo "   ❌ Backend import failed!"
    exit 1
}

echo "   ✅ Backend ready"
echo ""

# =============================================================================
# FRONTEND SETUP
# =============================================================================
echo "📦 Setting up Frontend..."

cd ../frontend

# Install dependencies
echo "   Installing Node packages..."
npm install --quiet 2>/dev/null || {
    echo "   ⚠️  Some packages failed, but continuing..."
}

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
    echo "   Creating .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
    echo "   ✅ .env.local created"
else
    echo "   ✅ .env.local exists"
fi

echo "   ✅ Frontend ready"
echo ""

# =============================================================================
# START SERVERS
# =============================================================================
echo "🎯 Starting Servers..."
echo ""
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

# Start backend in background
cd ../backend
echo "   Starting Backend..."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "   ❌ Backend failed to start!"
    cat /tmp/backend.log
    exit 1
fi
echo "   ✅ Backend running (PID: $BACKEND_PID)"

# Start frontend in background
cd ../frontend
echo "   Starting Frontend..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "   ❌ Frontend failed to start!"
    cat /tmp/frontend.log
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi
echo "   ✅ Frontend running (PID: $FRONTEND_PID)"
echo ""

# Wait for both processes
wait
