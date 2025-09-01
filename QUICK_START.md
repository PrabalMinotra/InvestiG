# 🚀 InvestiGuard Quick Start Guide

## Prerequisites

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (optional)

## 🐳 Option 1: Docker (Recommended)

### Start all services:
```bash
# Make sure Docker is running
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Access points:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 🖥️ Option 2: Local Development

### 1. Start AI Service (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 2. Start Backend Service (Node.js)
```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Test the /analyze Endpoint

### Using the test script:
```bash
python test_endpoint.py
```

### Using curl:
```bash
# Test text analysis
curl -X POST "http://localhost:8001/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a guaranteed investment opportunity!"}'

# Test link analysis
curl -X POST "http://localhost:8001/analyze" \
  -H "Content-Type: application/json" \
  -d '{"link": "https://example.com/investment"}'
```

### Expected Response Format:
```json
{
  "fraud_alert": "Suspicious",
  "credibility_score": 42,
  "advisor_verified": false,
  "deepfake_detected": true
}
```

## 🔍 Frontend Integration

The React frontend now:
1. **Auto-detects** if input is text or URL
2. **Calls the `/analyze` endpoint** dynamically
3. **Displays results** in real-time with beautiful animations
4. **Shows toast notifications** for analysis completion
5. **Handles errors gracefully** with fallback mock data

## 🛠️ Troubleshooting

### Service not starting?
- Check if ports 3000, 3001, 8001 are available
- Ensure all dependencies are installed
- Check Docker logs: `docker-compose logs [service-name]`

### Frontend can't connect to AI service?
- Verify AI service is running on port 8001
- Check CORS settings in FastAPI
- Ensure network connectivity between services

### Analysis not working?
- Check browser console for errors
- Verify the `/analyze` endpoint is responding
- Test with the provided test script

## 📱 Features

✅ **Text Analysis**: Paste any text content  
✅ **URL Analysis**: Analyze web pages and links  
✅ **Real-time Results**: Dynamic fraud detection display  
✅ **Beautiful UI**: Modern, responsive design with animations  
✅ **Error Handling**: Graceful fallbacks and user feedback  
✅ **Auto-detection**: Smart input type recognition  

## 🎯 Next Steps

1. **Start the AI service** first (FastAPI)
2. **Start the frontend** (React)
3. **Test with sample text** or URLs
4. **View results** in the beautiful dashboard
5. **Explore the API docs** at http://localhost:8001/docs

Happy analyzing! 🚀
