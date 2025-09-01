#!/bin/bash

echo "🤖 Starting InvestiGuard AI Service..."
echo "======================================"

# Check if we're in the right directory
if [ ! -d "ai-service" ]; then
    echo "❌ Please run this script from the InvestiGuard root directory"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run ./setup_dev.sh first"
    exit 1
fi

# Activate virtual environment
echo "🐍 Activating Python virtual environment..."
source venv/bin/activate

# Check if uvicorn is installed
if ! command -v uvicorn &> /dev/null; then
    echo "📦 Installing uvicorn..."
    pip install uvicorn[standard]
fi

# Navigate to ai-service directory
cd ai-service

echo "🚀 Starting AI Service on http://localhost:8001"
echo "📚 API Documentation: http://localhost:8001/docs"
echo "🏥 Health Check: http://localhost:8001/health"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Start the service
uvicorn main:app --reload --host 0.0.0.0 --port 8001
