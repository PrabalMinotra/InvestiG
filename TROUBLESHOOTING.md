# 🛠️ InvestiGuard Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Python Environment Issues

#### **Error: "externally-managed-environment"**
This is a macOS security feature (PEP 668). 

**Solution:**
```bash
# Run the setup script (recommended)
./setup_dev.sh

# Or manually create virtual environment
python3 -m venv venv
source venv/bin/activate
cd ai-service
pip install -r requirements.txt
```

#### **Error: "command not found: uvicorn"**
Uvicorn is not installed or virtual environment not activated.

**Solution:**
```bash
# Activate virtual environment
source venv/bin/activate

# Install uvicorn
pip install uvicorn[standard]

# Or use the start script
./start_ai_service.sh
```

### 2. Node.js Issues

#### **Error: "Missing script: dev"**
The package.json files are correct, but npm might be looking in wrong directory.

**Solution:**
```bash
# Use the start scripts (recommended)
./start_backend.sh
./start_frontend.sh

# Or manually navigate and run
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

#### **Error: "cd: no such file or directory"**
You're not in the correct directory.

**Solution:**
```bash
# Make sure you're in the InvestiGuard root directory
pwd  # Should show /path/to/InvestiGuard
ls   # Should show ai-service, backend, frontend directories

# If not, navigate to the correct directory
cd /path/to/InvestiGuard
```

### 3. Docker Issues

#### **Error: "Cannot connect to Docker daemon"**
Docker is not running.

**Solution:**
```bash
# Start Docker Desktop (macOS)
open -a Docker

# Wait for Docker to start, then run
docker-compose up -d
```

#### **Error: "npm ci --only=production"**
This was fixed in the updated Dockerfiles.

**Solution:**
```bash
# Pull latest changes and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 4. Port Conflicts

#### **Error: "Port already in use"**
Another service is using the required ports.

**Solution:**
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :8001  # AI Service

# Kill the processes or use different ports
kill -9 <PID>
```

## 🚀 Quick Start Solutions

### **Option 1: Use Setup Script (Recommended)**
```bash
# 1. Run setup script
./setup_dev.sh

# 2. Start services in separate terminals
./start_ai_service.sh      # Terminal 1
./start_backend.sh         # Terminal 2
./start_frontend.sh        # Terminal 3
```

### **Option 2: Manual Setup**
```bash
# 1. Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install Python dependencies
cd ai-service
pip install -r requirements.txt
cd ..

# 3. Install Node.js dependencies
cd backend
npm install
cd ../frontend
npm install
cd ..

# 4. Start services
source venv/bin/activate
cd ai-service && uvicorn main:app --reload --port 8001 &
cd ../backend && npm run dev &
cd ../frontend && npm run dev &
```

### **Option 3: Docker (if available)**
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🔍 Debugging Steps

### **1. Check Service Status**
```bash
# Test AI Service
curl http://localhost:8001/health

# Test Backend
curl http://localhost:3001/health

# Test Frontend
curl http://localhost:3000
```

### **2. Check Logs**
```bash
# AI Service logs (if using start script)
# Look in the terminal where you ran ./start_ai_service.sh

# Backend logs (if using start script)
# Look in the terminal where you ran ./start_backend.sh

# Frontend logs (if using start script)
# Look in the terminal where you ran ./start_frontend.sh
```

### **3. Verify Dependencies**
```bash
# Check Python packages
source venv/bin/activate
pip list | grep -E "(fastapi|uvicorn)"

# Check Node.js packages
cd backend && npm list --depth=0
cd ../frontend && npm list --depth=0
```

## 📱 Testing the Application

### **1. Test AI Service Endpoint**
```bash
# Test text analysis
curl -X POST "http://localhost:8001/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a guaranteed investment opportunity!"}'

# Expected response:
# {
#   "fraud_alert": "Suspicious",
#   "credibility_score": 42,
#   "advisor_verified": false,
#   "deepfake_detected": true
# }
```

### **2. Test Frontend Integration**
1. Open http://localhost:3000 in your browser
2. Enter sample text or URL
3. Click "Analyze"
4. Check browser console for any errors
5. Verify results are displayed

## 🆘 Still Having Issues?

### **1. Check System Requirements**
- **Python**: 3.9+ (check with `python3 --version`)
- **Node.js**: 18+ (check with `node --version`)
- **npm**: Latest version (check with `npm --version`)

### **2. Reset Everything**
```bash
# Stop all services
pkill -f "uvicorn"
pkill -f "npm"

# Remove virtual environment
rm -rf venv

# Remove node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Start fresh
./setup_dev.sh
```

### **3. Get Help**
- Check the browser console for JavaScript errors
- Check terminal output for Python/Node.js errors
- Verify all services are running on correct ports
- Ensure no firewall is blocking the ports

## 🎯 Success Indicators

✅ **AI Service**: http://localhost:8001/health returns `{"status": "healthy"}`  
✅ **Backend**: http://localhost:3001/health returns `{"status": "healthy"}`  
✅ **Frontend**: http://localhost:3000 loads without errors  
✅ **Analysis**: Frontend can analyze text/URLs and display results  
✅ **API Docs**: http://localhost:8001/docs shows FastAPI documentation  

Happy debugging! 🚀
