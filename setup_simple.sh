#!/bin/bash

echo "🚀 Setting up InvestiGuard (Simple Version)"
echo "============================================"

# Check if we're in the right directory
if [ ! -d "ai-service" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the InvestiGuard root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Create Python virtual environment
echo ""
echo "🐍 Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✅ Virtual environment activated"

# Install minimal Python dependencies
echo ""
echo "📦 Installing minimal Python dependencies..."
cd ai-service
pip install --upgrade pip
pip install fastapi uvicorn[standard] pydantic python-multipart python-dotenv
cd ..
echo "✅ Python dependencies installed"

# Install Node.js dependencies
echo ""
echo "📦 Installing Node.js dependencies..."

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Node.js dependencies installed"

# Create .env file if it doesn't exist
echo ""
echo "📝 Setting up environment variables..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Environment
NODE_ENV=development
ENVIRONMENT=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:8001

# Backend Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000

# AI Service Configuration
AI_SERVICE_PORT=8001
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Simple setup complete!"
echo ""
echo "📋 To start the services, run the following in separate terminals:"
echo ""
echo "Terminal 1 (AI Service):"
echo "  source venv/bin/activate"
echo "  cd ai-service"
echo "  uvicorn main:app --reload --port 8001"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 3 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "🌐 Access points:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:3001"
echo "  AI Service: http://localhost:8001"
echo "  API Docs: http://localhost:8001/docs"
echo ""
