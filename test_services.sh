#!/bin/bash

echo "🧪 Testing InvestiGuard Services Individually"
echo "=============================================="

# Test if ports are available
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $port is already in use by another service"
        echo "   Please stop any services using port $port before continuing"
        return 1
    else
        echo "✅ Port $port is available for $service"
        return 0
    fi
}

echo ""
echo "🔍 Checking port availability..."
check_port 3000 "Frontend" || exit 1
check_port 3001 "Backend" || exit 1
check_port 8001 "AI Service" || exit 1
check_port 5432 "PostgreSQL" || exit 1
check_port 6379 "Redis" || exit 1

echo ""
echo "🐍 Testing Python dependencies..."
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 is available"
    python3 --version
else
    echo "❌ Python 3 is not available"
    echo "   Please install Python 3.9+ before continuing"
    exit 1
fi

echo ""
echo "📦 Testing Node.js dependencies..."
if command -v node &> /dev/null; then
    echo "✅ Node.js is available"
    node --version
else
    echo "❌ Node.js is not available"
    echo "   Please install Node.js 18+ before continuing"
    exit 1
fi

if command -v npm &> /dev/null; then
    echo "✅ npm is available"
    npm --version
else
    echo "❌ npm is not available"
    echo "   Please install npm before continuing"
    exit 1
fi

echo ""
echo "🐳 Testing Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is available"
    docker --version
    
    if docker info > /dev/null 2>&1; then
        echo "✅ Docker daemon is running"
    else
        echo "❌ Docker daemon is not running"
        echo "   Please start Docker before continuing"
        exit 1
    fi
else
    echo "❌ Docker is not available"
    echo "   Please install Docker before continuing"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is available"
    docker-compose --version
else
    echo "❌ Docker Compose is not available"
    echo "   Please install Docker Compose before continuing"
    exit 1
fi

echo ""
echo "📁 Testing project structure..."
if [ -d "frontend" ] && [ -d "backend" ] && [ -d "ai-service" ]; then
    echo "✅ Project structure is correct"
else
    echo "❌ Project structure is incomplete"
    echo "   Missing required directories"
    exit 1
fi

echo ""
echo "🎯 All checks passed! You can now run:"
echo "   docker-compose up -d"
echo ""
echo "   Or start services individually:"
echo "   1. cd ai-service && uvicorn main:app --reload --port 8001"
echo "   2. cd backend && npm install && npm run dev"
echo "   3. cd frontend && npm install && npm run dev"
echo ""
