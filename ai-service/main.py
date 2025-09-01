from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import os
import json
import time
from datetime import datetime
import uuid
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import re

# Global alerts storage for real-time notifications
alerts_history = []
alert_id_counter = 1

# Enhanced NLP models and analysis functions
class EnhancedFraudDetector:
    def __init__(self):
        # Initialize sentiment analysis pipeline
        try:
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                return_all_scores=True
            )
            print("✅ Sentiment analysis model loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load sentiment model: {e}")
            self.sentiment_analyzer = None
        
        # Suspicious financial patterns
        self.suspicious_patterns = [
            r"guaranteed\s+(?:returns?|profit|income|money)",
            r"get\s+rich\s+quick",
            r"limited\s+time\s+(?:offer|opportunity|deal)",
            r"insider\s+(?:information|tips?|knowledge)",
            r"no\s+risk\s+(?:investment|trading|opportunity)",
            r"double\s+(?:your\s+)?money",
            r"100%\s+(?:guaranteed|safe|secure)",
            r"exclusive\s+(?:opportunity|offer|deal)",
            r"act\s+now\s+or\s+miss\s+out",
            r"once\s+in\s+a\s+lifetime\s+opportunity",
            r"secret\s+(?:strategy|method|system)",
            r"overnight\s+(?:success|profit|wealth)",
            r"risk\s+free\s+(?:investment|trading)",
            r"government\s+(?:secret|hidden|classified)",
            r"millionaire\s+(?:secret|formula|blueprint)"
        ]
        
        # Positive financial patterns (reduce suspicion)
        self.positive_patterns = [
            r"diversified\s+(?:portfolio|investment)",
            r"long\s+term\s+(?:investment|strategy)",
            r"thorough\s+(?:research|analysis)",
            r"regulated\s+(?:investment|advisor)",
            r"transparent\s+(?:fees|costs|risks)",
            r"past\s+performance\s+disclaimer",
            r"consult\s+(?:advisor|professional)",
            r"careful\s+(?:consideration|evaluation)"
        ]
    
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Enhanced text analysis using sentiment and pattern detection"""
        text_lower = text.lower()
        
        # Sentiment analysis
        sentiment_score = self._analyze_sentiment(text)
        
        # Pattern detection
        suspicious_count = self._count_suspicious_patterns(text_lower)
        positive_count = self._count_positive_patterns(text_lower)
        
        # Calculate risk score
        risk_score = self._calculate_risk_score(sentiment_score, suspicious_count, positive_count)
        
        # Determine fraud alert level
        fraud_alert = self._determine_fraud_alert(risk_score)
        
        # Calculate credibility score
        credibility_score = max(10, 100 - risk_score)
        
        return {
            "fraud_alert": fraud_alert,
            "credibility_score": credibility_score,
            "risk_score": risk_score,
            "sentiment_score": sentiment_score,
            "suspicious_patterns_found": suspicious_count,
            "positive_patterns_found": positive_count,
            "analysis": self._generate_analysis(fraud_alert, suspicious_count, positive_count, sentiment_score),
            "confidence": min(95, max(60, 100 - suspicious_count * 5 + positive_count * 2))
        }
    
    def _analyze_sentiment(self, text: str) -> float:
        """Analyze sentiment using Hugging Face model"""
        if self.sentiment_analyzer is None:
            # Fallback to simple heuristic
            positive_words = ["good", "great", "excellent", "positive", "profitable", "successful"]
            negative_words = ["bad", "terrible", "negative", "risky", "dangerous", "suspicious"]
            
            text_lower = text.lower()
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            if positive_count > negative_count:
                return 0.7
            elif negative_count > positive_count:
                return 0.3
            else:
                return 0.5
        
        try:
            # Use Hugging Face sentiment analysis
            results = self.sentiment_analyzer(text)
            
            # Extract negative sentiment score (higher = more negative)
            negative_score = results[0][0]['score'] if results[0][0]['label'] == 'NEGATIVE' else results[0][1]['score']
            
            # Convert to 0-1 scale where 1 = very positive, 0 = very negative
            sentiment_score = 1 - negative_score
            
            return sentiment_score
            
        except Exception as e:
            print(f"⚠️ Sentiment analysis failed: {e}")
            return 0.5  # Neutral fallback
    
    def _count_suspicious_patterns(self, text: str) -> int:
        """Count suspicious financial patterns"""
        count = 0
        for pattern in self.suspicious_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                count += 1
        return count
    
    def _count_positive_patterns(self, text: str) -> int:
        """Count positive/reassuring patterns"""
        count = 0
        for pattern in self.positive_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                count += 1
        return count
    
    def _calculate_risk_score(self, sentiment_score: float, suspicious_count: int, positive_count: int) -> int:
        """Calculate overall risk score"""
        # Base risk from sentiment (negative sentiment = higher risk)
        sentiment_risk = (1 - sentiment_score) * 40  # 0-40 points
        
        # Risk from suspicious patterns
        pattern_risk = min(50, suspicious_count * 15)  # 0-50 points
        
        # Reduction from positive patterns
        positive_reduction = min(20, positive_count * 5)  # 0-20 points reduction
        
        # Calculate final risk score
        risk_score = sentiment_risk + pattern_risk - positive_reduction
        
        return max(0, min(100, int(risk_score)))
    
    def _determine_fraud_alert(self, risk_score: int) -> str:
        """Determine fraud alert level based on risk score"""
        if risk_score >= 70:
            return "Suspicious"
        elif risk_score >= 40:
            return "Warning"
        else:
            return "Likely Safe"
    
    def _generate_analysis(self, fraud_alert: str, suspicious_count: int, positive_count: int, sentiment_score: float) -> str:
        """Generate detailed analysis text"""
        if fraud_alert == "Likely Safe":
            return f"Content analysis suggests legitimate investment content. Sentiment is {'positive' if sentiment_score > 0.6 else 'neutral'}, with {positive_count} reassuring patterns detected."
        elif fraud_alert == "Warning":
            return f"Moderate risk detected. Found {suspicious_count} suspicious patterns. Sentiment analysis shows {'negative' if sentiment_score < 0.4 else 'mixed'} tone. Exercise caution."
        else:
            return f"High risk of fraud detected. Multiple suspicious patterns ({suspicious_count}) found. Sentiment analysis indicates negative tone. Avoid this investment."

# Initialize enhanced models
enhanced_fraud_detector = EnhancedFraudDetector()

# Mock AI models and analysis functions (for backward compatibility)
class MockFraudDetector:
    def __init__(self):
        self.fraud_patterns = [
            "guaranteed returns", "get rich quick", "limited time offer",
            "insider information", "no risk investment", "double your money"
        ]
    
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Mock text analysis for fraud detection"""
        text_lower = text.lower()
        
        # Simple pattern matching (in real app, this would be ML models)
        detected_patterns = [pattern for pattern in self.fraud_patterns if pattern in text_lower]
        
        # Calculate risk score based on patterns
        risk_score = min(100, len(detected_patterns) * 25)
        
        # Determine fraud alert level
        if risk_score >= 75:
            fraud_alert = "Suspicious"
        elif risk_score >= 50:
            fraud_alert = "Warning"
        else:
            fraud_alert = "Safe"
        
        # Generate mock analysis
        analysis = self._generate_analysis(fraud_alert, detected_patterns)
        
        return {
            "fraud_alert": fraud_alert,
            "credibility_score": max(10, 100 - risk_score),
            "risk_score": risk_score,
            "detected_patterns": detected_patterns,
            "analysis": analysis,
            "confidence": min(95, max(60, 100 - len(detected_patterns) * 10))
        }
    
    def _generate_analysis(self, fraud_alert: str, patterns: List[str]) -> str:
        """Generate mock analysis text"""
        if fraud_alert == "Safe":
            return "Content analysis reveals no immediate fraud indicators. Content appears legitimate."
        elif fraud_alert == "Warning":
            return f"Moderate risk detected. Found patterns: {', '.join(patterns)}. Exercise caution."
        else:
            return f"High risk of fraud detected. Multiple concerning patterns: {', '.join(patterns)}. Avoid this investment."

class MockDeepfakeDetector:
    def __init__(self):
        self.indicators = [
            "unnatural_face_movements", "inconsistent_lighting", "audio_sync_issues",
            "blurred_edges", "repetitive_patterns", "metadata_inconsistencies"
        ]
    
    def detect_deepfake(self, content_type: str) -> Dict[str, Any]:
        """Mock deepfake detection"""
        # Simulate detection process
        detected_indicators = [ind for ind in self.indicators if hash(content_type) % 3 == 0]
        
        is_deepfake = len(detected_indicators) > 2
        
        return {
            "is_deepfake": is_deepfake,
            "confidence": min(95, max(60, len(detected_indicators) * 15)),
            "detected_indicators": detected_indicators,
            "analysis": f"AI analysis suggests content is {'artificially generated' if is_deepfake else 'authentic'}."
        }

class MockAdvisorVerifier:
    def __init__(self):
        self.verified_advisors = {
            "john smith": {"credentials": ["CFP", "CFA"], "registration": "SEC123456"},
            "sarah johnson": {"credentials": ["CFP"], "registration": "FINRA789012"},
            "mike williams": {"credentials": [], "registration": "UNREGISTERED"}
        }
    
    def verify_advisor(self, name: str) -> Dict[str, Any]:
        """Mock advisor verification"""
        name_lower = name.lower()
        advisor = self.verified_advisors.get(name_lower, {
            "credentials": [],
            "registration": "UNREGISTERED"
        })
        
        is_verified = advisor["registration"] != "UNREGISTERED" and len(advisor["credentials"]) > 0
        
        return {
            "verified": is_verified,
            "credentials": advisor["credentials"],
            "registration": advisor["registration"],
            "status": "active" if is_verified else "unknown",
            "risk_level": "low" if is_verified else "high"
        }

# Initialize models
fraud_detector = MockFraudDetector()  # Keep for backward compatibility
deepfake_detector = MockDeepfakeDetector()
advisor_verifier = MockAdvisorVerifier()

# Pydantic models
class TextAnalysisRequest(BaseModel):
    content: str
    content_type: str = "text"

class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    link: Optional[str] = None

class AnalyzeResponse(BaseModel):
    fraud_alert: str
    credibility_score: int
    advisor_verified: bool
    deepfake_detected: bool

class NLPAnalyzeRequest(BaseModel):
    text: str

class NLPAnalyzeResponse(BaseModel):
    fraud_alert: str
    credibility_score: int
    advisor_verified: bool
    deepfake_detected: bool



class AnalysisResponse(BaseModel):
    id: str
    content_type: str
    fraud_alert: str
    credibility_score: int
    advisor_verified: bool
    deepfake_detected: bool
    analysis: str
    risk_score: int
    confidence: float
    timestamp: str
    processing_time: float

# FastAPI app
app = FastAPI(
    title="InvestiGuard AI Service",
    description="AI-powered fraud detection and content analysis service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "InvestiGuard AI Service",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "InvestiGuard AI Service",
        "timestamp": datetime.now().isoformat(),
        "models": {
            "fraud_detector": "ready",
            "deepfake_detector": "ready",
            "advisor_verifier": "ready"
        }
    }

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_content(request: AnalyzeRequest):
    """Main analyze endpoint that accepts text or link and returns fraud analysis"""
    start_time = time.time()
    
    try:
        # Determine content type and extract content
        if request.text:
            content = request.text
            content_type = "text"
        elif request.link:
            content = f"Content extracted from {request.link}. This is a simulated analysis of the webpage content."
            content_type = "link"
        else:
            raise HTTPException(status_code=400, detail="Either text or link must be provided")
        
        # Perform fraud detection
        fraud_analysis = fraud_detector.analyze_text(content)
        
        # Perform deepfake detection
        deepfake_analysis = deepfake_detector.detect_deepfake(content_type)
        
        # Mock advisor verification (extract names from text)
        advisor_names = [word for word in content.split() if word.istitle() and len(word) > 2]
        advisor_verified = False
        if advisor_names:
            advisor_verification = advisor_verifier.verify_advisor(advisor_names[0])
            advisor_verified = advisor_verification["verified"]
        
        # Return the exact format requested
        return AnalyzeResponse(
            fraud_alert=fraud_analysis["fraud_alert"],
            credibility_score=fraud_analysis["credibility_score"],
            advisor_verified=advisor_verified,
            deepfake_detected=deepfake_analysis["is_deepfake"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/nlp-analyze", response_model=NLPAnalyzeResponse)
async def nlp_analyze_content(request: NLPAnalyzeRequest):
    """Enhanced NLP analysis endpoint using Hugging Face transformers"""
    start_time = time.time()
    
    try:
        # Perform enhanced fraud detection using sentiment analysis
        fraud_analysis = enhanced_fraud_detector.analyze_text(request.text)
        
        # Mock advisor verification (random for now)
        import random
        advisor_verified = random.choice([True, False])
        
        # Deepfake detection is always false for text content
        deepfake_detected = False
        
        processing_time = (time.time() - start_time) * 1000
        
        print(f"🔍 NLP Analysis completed in {processing_time:.2f}ms")
        print(f"   Text: {request.text[:100]}...")
        print(f"   Fraud Alert: {fraud_analysis['fraud_alert']}")
        print(f"   Credibility Score: {fraud_analysis['credibility_score']}")
        print(f"   Sentiment Score: {fraud_analysis['sentiment_score']:.3f}")
        print(f"   Suspicious Patterns: {fraud_analysis['suspicious_patterns_found']}")
        print(f"   Positive Patterns: {fraud_analysis['positive_patterns_found']}")
        
        return NLPAnalyzeResponse(
            fraud_alert=fraud_analysis["fraud_alert"],
            credibility_score=fraud_analysis["credibility_score"],
            advisor_verified=advisor_verified,
            deepfake_detected=deepfake_detected
        )
        
    except Exception as e:
        print(f"❌ NLP Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"NLP analysis failed: {str(e)}")

@app.post("/api/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text content for fraud detection"""
    start_time = time.time()
    
    try:
        # Perform fraud detection
        fraud_analysis = fraud_detector.analyze_text(request.content)
        
        # Perform deepfake detection (for text, this is usually not applicable)
        deepfake_analysis = deepfake_detector.detect_deepfake(request.content)
        
        # Mock advisor verification (extract names from text)
        advisor_names = [word for word in request.content.split() if word.istitle() and len(word) > 2]
        advisor_verified = False
        if advisor_names:
            advisor_verification = advisor_verifier.verify_advisor(advisor_names[0])
            advisor_verified = advisor_verification["verified"]
        
        processing_time = (time.time() - start_time) * 1000
        
        return AnalysisResponse(
            id=str(uuid.uuid4()),
            content_type=request.content_type,
            fraud_alert=fraud_analysis["fraud_alert"],
            credibility_score=fraud_analysis["credibility_score"],
            advisor_verified=advisor_verified,
            deepfake_detected=deepfake_analysis["is_deepfake"],
            analysis=fraud_analysis["analysis"],
            risk_score=fraud_analysis["risk_score"],
            confidence=fraud_analysis["confidence"],
            timestamp=datetime.now().isoformat(),
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/analyze/document")
async def analyze_document(
    file: UploadFile = File(...),
    content_type: str = Form("document")
):
    """Analyze uploaded document for fraud detection"""
    start_time = time.time()
    
    try:
        # Read file content (in real app, process based on file type)
        content = await file.read()
        
        # For demo purposes, convert to string
        if isinstance(content, bytes):
            content = content.decode('utf-8', errors='ignore')
        
        # Perform analysis
        fraud_analysis = fraud_detector.analyze_text(content)
        deepfake_analysis = deepfake_detector.detect_deepfake(content_type)
        
        processing_time = (time.time() - start_time) * 1000
        
        return {
            "id": str(uuid.uuid4()),
            "filename": file.filename,
            "content_type": content_type,
            "fraud_alert": fraud_analysis["fraud_alert"],
            "credibility_score": fraud_analysis["credibility_score"],
            "deepfake_detected": deepfake_analysis["is_deepfake"],
            "analysis": fraud_analysis["analysis"],
            "risk_score": fraud_analysis["risk_score"],
            "confidence": fraud_analysis["confidence"],
            "timestamp": datetime.now().isoformat(),
            "processing_time": processing_time
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")

@app.post("/api/analyze/url")
async def analyze_url(url: str = Form(...)):
    """Analyze content from URL for fraud detection"""
    start_time = time.time()
    
    try:
        # Mock URL content extraction
        mock_content = f"Content extracted from {url}. This is a simulated analysis of the webpage content."
        
        # Perform analysis
        fraud_analysis = fraud_detector.analyze_text(mock_content)
        deepfake_analysis = deepfake_detector.detect_deepfake("webpage")
        
        processing_time = (time.time() - start_time) * 1000
        
        return {
            "id": str(uuid.uuid4()),
            "url": url,
            "content_type": "url",
            "fraud_alert": fraud_analysis["fraud_alert"],
            "credibility_score": fraud_analysis["credibility_score"],
            "deepfake_detected": deepfake_analysis["is_deepfake"],
            "analysis": fraud_analysis["analysis"],
            "risk_score": fraud_analysis["risk_score"],
            "confidence": fraud_analysis["confidence"],
            "timestamp": datetime.now().isoformat(),
            "processing_time": processing_time
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL analysis failed: {str(e)}")

@app.post("/api/verify/advisor")
async def verify_advisor(name: str = Form(...)):
    """Verify advisor credentials"""
    try:
        verification_result = advisor_verifier.verify_advisor(name)
        
        return {
            "success": True,
            "data": {
                "advisor_name": name,
                **verification_result,
                "timestamp": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advisor verification failed: {str(e)}")

@app.get("/alerts")
async def get_alerts():
    """Get real-time fraud alerts"""
    global alerts_history
    
    # Generate new mock alerts periodically (simulating real-time detection)
    current_time = datetime.now()
    
    if len(alerts_history) == 0:
        should_generate = True
    else:
        # Parse the last alert's timestamp properly
        try:
            last_alert_time = datetime.fromisoformat(alerts_history[-1]["timestamp"].replace('Z', '+00:00'))
            time_diff = (current_time - last_alert_time).total_seconds()
            should_generate = time_diff > 30
        except (ValueError, KeyError):
            # If timestamp parsing fails, generate a new alert
            should_generate = True
    
    if should_generate:
        # Generate new alert
        new_alert = generate_mock_alert()
        alerts_history.append(new_alert)
        
        # Keep only last 50 alerts
        if len(alerts_history) > 50:
            alerts_history = alerts_history[-50:]
    
    return {
        "alerts": alerts_history,
        "total_count": len(alerts_history),
        "new_alerts": len([a for a in alerts_history if a.get("is_new", False)]),
        "timestamp": current_time.isoformat()
    }

def generate_mock_alert():
    """Generate a mock fraud alert"""
    global alert_id_counter
    
    # Mock company names
    companies = [
        "TechGrowth Inc", "GreenEnergy Ltd", "BioPharma Solutions", "CryptoMining Corp",
        "RealEstate Ventures", "OilExploration Co", "MiningResources Ltd", "StartupXYZ Inc"
    ]
    
    # Mock alert types
    alert_types = ["Suspicious", "Warning", "High Risk"]
    
    # Generate random alert
    company = companies[hash(str(alert_id_counter)) % len(companies)]
    alert_type = alert_types[hash(str(alert_id_counter)) % len(alert_types)]
    credibility_score = max(10, min(90, hash(str(alert_id_counter)) % 100))
    
    alert = {
        "id": f"alert_{alert_id_counter}",
        "company": company,
        "alert_type": alert_type,
        "credibility_score": credibility_score,
        "description": f"Suspicious activity detected for {company}",
        "details": {
            "source": "AI Monitoring System",
            "patterns_detected": ["unusual_volume", "suspicious_patterns", "credibility_concerns"],
            "risk_factors": ["low_credibility", "suspicious_source", "pattern_anomaly"],
            "recommendation": "Investigate further before making investment decisions"
        },
        "timestamp": datetime.now().isoformat(),
        "is_new": True
    }
    
    alert_id_counter += 1
    return alert



@app.get("/api/models/status")
async def get_models_status():
    """Get status of AI models"""
    return {
        "models": {
            "fraud_detector": {
                "status": "ready",
                "version": "1.0.0",
                "capabilities": ["text_analysis", "pattern_detection", "risk_scoring"]
            },
            "deepfake_detector": {
                "status": "ready",
                "version": "1.0.0",
                "capabilities": ["image_analysis", "video_analysis", "audio_analysis"]
            },
            "advisor_verifier": {
                "status": "ready",
                "version": "1.0.0",
                "capabilities": ["credential_verification", "regulatory_checks"]
            }
        },
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
