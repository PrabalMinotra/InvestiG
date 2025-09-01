#!/usr/bin/env python3
"""
Test script for the InvestiGuard FastAPI /analyze endpoint
"""

import requests
import json

# Test the /analyze endpoint
def test_analyze_endpoint():
    base_url = "http://localhost:8001"
    
    print("🧪 Testing InvestiGuard FastAPI /analyze endpoint")
    print("=" * 60)
    
    # Test 1: Text analysis
    print("\n📝 Test 1: Text Analysis")
    text_payload = {
        "text": "This is a guaranteed investment opportunity with no risk and double your money in 30 days!"
    }
    
    try:
        response = requests.post(f"{base_url}/analyze", json=text_payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Success!")
            print(f"   Fraud Alert: {result['fraud_alert']}")
            print(f"   Credibility Score: {result['credibility_score']}")
            print(f"   Advisor Verified: {result['advisor_verified']}")
            print(f"   Deepfake Detected: {result['deepfake_detected']}")
        else:
            print(f"❌ Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - make sure the FastAPI service is running on port 8001")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Link analysis
    print("\n🔗 Test 2: Link Analysis")
    link_payload = {
        "link": "https://example.com/investment-opportunity"
    }
    
    try:
        response = requests.post(f"{base_url}/analyze", json=link_payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Success!")
            print(f"   Fraud Alert: {result['fraud_alert']}")
            print(f"   Credibility Score: {result['credibility_score']}")
            print(f"   Advisor Verified: {result['advisor_verified']}")
            print(f"   Deepfake Detected: {result['deepfake_detected']}")
        else:
            print(f"❌ Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - make sure the FastAPI service is running on port 8001")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Health check
    print("\n🏥 Test 3: Health Check")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            result = response.json()
            print("✅ Service is healthy!")
            print(f"   Status: {result['status']}")
            print(f"   Models: {list(result['models'].keys())}")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - make sure the FastAPI service is running on port 8001")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_analyze_endpoint()
