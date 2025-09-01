#!/bin/bash

echo "🚀 Starting InvestiGuard..."
echo "================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://investiguard:investiguard123@localhost:5433/investiguard

# Redis Configuration
REDIS_URL=redis://localhost:6379

# API Keys (for production)
SEC_API_KEY=your_sec_api_key_here
FINRA_API_KEY=your_finra_api_key_here

# AI Service Configuration
AI_SERVICE_URL=http://localhost:8001

# Environment
NODE_ENV=development
ENVIRONMENT=development
EOF
    echo "✅ .env file created"
fi

echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "🌐 Services are starting up:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   AI Service: http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""

echo "📊 Checking service health..."
echo "   Frontend: $(curl -s http://localhost:3000 > /dev/null && echo "✅ Running" || echo "❌ Not ready")"
echo "   Backend: $(curl -s http://localhost:3001/health > /dev/null && echo "✅ Running" || echo "❌ Not ready")"
echo "   AI Service: $(curl -s http://localhost:8001/health > /dev/null && echo "✅ Running" || echo "❌ Not ready")"

echo ""
echo "🎉 InvestiGuard is starting up!"
echo "   Open http://localhost:3000 in your browser to access the application."
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo ""
