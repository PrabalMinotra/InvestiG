#!/bin/bash

echo "🔧 Starting InvestiGuard Backend Service..."
echo "==========================================="

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Please run this script from the InvestiGuard root directory"
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting Backend Service on http://localhost:3001"
echo "🏥 Health Check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Start the service
npm run dev
