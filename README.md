# InvestiGuard 🔒

A comprehensive investment fraud detection and advisor verification platform that uses AI/ML to scan and analyze investment opportunities, documents, and advisor credentials.

## 🚀 Features

- **Multi-format Scanning**: Upload or paste text, video, and audio links for AI-powered analysis
- **AI Fraud Detection**: Advanced ML models to identify potential investment scams and fraudulent schemes
- **Regulatory Compliance**: Cross-verification with regulatory databases and compliance APIs
- **Real-time Dashboard**: Live fraud alerts, credibility scores, and advisor verification status
- **Instant Notifications**: Real-time toast alerts for critical findings
- **Mobile Ready**: Flutter mobile app (placeholder for future development)

## 🏗️ Architecture

- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python) for AI/ML inference + Node.js for API services
- **Mobile**: Flutter (placeholder)
- **Infrastructure**: Docker containers for easy local development

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form
- React Query

### Backend
- **FastAPI (Python)**: AI/ML inference engine
- **Node.js**: REST API services
- **PostgreSQL**: Data persistence
- **Redis**: Caching and real-time features

### AI/ML
- Mock fraud detection models (ready for real ML integration)
- Document analysis pipeline
- Audio/video transcription (placeholder)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd InvestiGuard
```

### 2. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Local Development Setup
```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install
cd ../ai-service && pip install -r requirements.txt

# Start services (in separate terminals)
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev

# Terminal 3 - AI Service
cd ai-service && uvicorn main:app --reload --port 8001
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 📱 Features Walkthrough

### 1. Content Scanning
- Upload documents (PDF, images)
- Paste text content
- Input video/audio URLs
- Batch processing support

### 2. AI Analysis
- Fraud pattern detection
- Document authenticity verification
- Advisor credential validation
- Risk scoring algorithms

### 3. Regulatory Checks
- SEC database verification
- FINRA advisor lookup
- State regulatory compliance
- International regulatory bodies

### 4. Dashboard
- Real-time fraud alerts
- Credibility scores (0-100)
- Advisor verification status
- Historical analysis reports

### 5. Notifications
- Toast notifications for alerts
- Email notifications (configurable)
- SMS alerts (future feature)
- Webhook integrations

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/investiguard

# Redis
REDIS_URL=redis://localhost:6379

# API Keys (for production)
SEC_API_KEY=your_sec_api_key
FINRA_API_KEY=your_finra_api_key

# AI Service
AI_SERVICE_URL=http://localhost:8001
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# AI service tests
cd ai-service && pytest
```

## 📊 API Endpoints

### Content Analysis
- `POST /api/scan/text` - Analyze text content
- `POST /api/scan/document` - Upload and analyze documents
- `POST /api/scan/url` - Analyze content from URLs

### Advisor Verification
- `GET /api/advisor/{id}` - Get advisor details
- `POST /api/advisor/verify` - Verify advisor credentials
- `GET /api/advisor/search` - Search advisors

### Reports
- `GET /api/reports/{id}` - Get analysis report
- `GET /api/reports/history` - Get user's report history
- `POST /api/reports/export` - Export report data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue for bugs or feature requests
- Check the documentation at `/docs`
- Contact the development team

## 🔮 Roadmap

- [ ] Real ML model integration
- [ ] Advanced fraud detection algorithms
- [ ] Mobile app development
- [ ] Real-time collaboration features
- [ ] Advanced reporting and analytics
- [ ] Integration with more regulatory bodies
- [ ] Machine learning model training pipeline
- [ ] API rate limiting and authentication
- [ ] Multi-tenant architecture
- [ ] Advanced user management and roles
