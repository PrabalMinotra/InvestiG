#!/bin/bash

echo "🎨 Starting InvestiGuard Frontend Service..."
echo "============================================"

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the InvestiGuard root directory"
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting Frontend Service on http://localhost:3000"
echo "🔗 Backend API: http://localhost:3001"
echo "🤖 AI Service: http://localhost:8001"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Start the service
npm run dev
