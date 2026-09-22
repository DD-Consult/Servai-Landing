#!/usr/bin/env python3
"""
Backend test for POST /api/demo-request endpoint.
Tests the following requirements:
1. ROUTING / NO 404: Valid payload returns HTTP 503 (not 404) with exact JSON detail
2. VALIDATION: Empty body, missing fields, invalid email all return 422
3. NO DB WRITE: MongoDB demo_requests collection count does NOT increase after POST
4. SANITY: GET /api/ returns {"message":"Hello World"}
"""

import requests
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

# Get URLs
FRONTEND_ENV = Path(__file__).parent / "frontend" / ".env"
with open(FRONTEND_ENV) as f:
    for line in f:
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip()
            break

API_BASE = f"{BASE_URL}/api"

# MongoDB connection
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']

print("=" * 80)
print("BACKEND TEST: POST /api/demo-request")
print("=" * 80)
print(f"API Base URL: {API_BASE}")
print(f"MongoDB: {MONGO_URL} / {DB_NAME}")
print("=" * 80)

# Test data
VALID_PAYLOAD = {
    "name": "John Doe",
    "email": "john@restaurant.com",
    "phone": "+1 (555) 000-0000",
    "restaurant": "The Grand Bistro",
    "country": "London, UK"
}

INVALID_EMAIL_PAYLOAD = {
    "name": "J",
    "email": "notanemail",
    "phone": "1",
    "restaurant": "B",
    "country": "UK"
}

MISSING_COUNTRY_PAYLOAD = {
    "name": "John Doe",
    "email": "john@restaurant.com",
    "phone": "+1 (555) 000-0000",
    "restaurant": "The Grand Bistro"
}

# Test results
results = []

def test_result(test_name, passed, details):
    """Record test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    results.append({
        "test": test_name,
        "passed": passed,
        "details": details
    })
    print(f"\n{status}: {test_name}")
    print(f"Details: {details}")

# ============================================================================
# TEST 4: SANITY CHECK - GET /api/
# ============================================================================
print("\n" + "=" * 80)
print("TEST 4: SANITY CHECK - GET /api/")
print("=" * 80)

try:
    response = requests.get(f"{API_BASE}/", timeout=10)
    expected_body = {"message": "Hello World"}
    
    if response.status_code == 200 and response.json() == expected_body:
        test_result(
            "GET /api/ sanity check",
            True,
            f"Status: {response.status_code}, Body: {response.json()}"
        )
    else:
        test_result(
            "GET /api/ sanity check",
            False,
            f"Status: {response.status_code}, Body: {response.text[:200]}"
        )
except Exception as e:
    test_result("GET /api/ sanity check", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2a: VALIDATION - Empty body
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2a: VALIDATION - Empty body should return 422")
print("=" * 80)

try:
    response = requests.post(f"{API_BASE}/demo-request", json={}, timeout=10)
    
    if response.status_code == 422:
        test_result(
            "POST {} returns 422",
            True,
            f"Status: {response.status_code}, Body preview: {response.text[:150]}"
        )
    else:
        test_result(
            "POST {} returns 422",
            False,
            f"Expected 422, got {response.status_code}. Body: {response.text[:200]}"
        )
except Exception as e:
    test_result("POST {} returns 422", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2b: VALIDATION - Missing country field
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2b: VALIDATION - Missing 'country' field should return 422")
print("=" * 80)

try:
    response = requests.post(f"{API_BASE}/demo-request", json=MISSING_COUNTRY_PAYLOAD, timeout=10)
    
    if response.status_code == 422:
        test_result(
            "POST missing 'country' returns 422",
            True,
            f"Status: {response.status_code}, Body preview: {response.text[:150]}"
        )
    else:
        test_result(
            "POST missing 'country' returns 422",
            False,
            f"Expected 422, got {response.status_code}. Body: {response.text[:200]}"
        )
except Exception as e:
    test_result("POST missing 'country' returns 422", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2c: VALIDATION - Invalid email format
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2c: VALIDATION - Invalid email format should return 422")
print("=" * 80)

try:
    response = requests.post(f"{API_BASE}/demo-request", json=INVALID_EMAIL_PAYLOAD, timeout=10)
    
    if response.status_code == 422:
        test_result(
            "POST invalid email returns 422",
            True,
            f"Status: {response.status_code}, Body preview: {response.text[:150]}"
        )
    else:
        test_result(
            "POST invalid email returns 422",
            False,
            f"Expected 422, got {response.status_code}. Body: {response.text[:200]}"
        )
except Exception as e:
    test_result("POST invalid email returns 422", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 3: NO DB WRITE - MongoDB count should NOT increase
# ============================================================================
print("\n" + "=" * 80)
print("TEST 3: NO DB WRITE - MongoDB demo_requests count should NOT increase")
print("=" * 80)

try:
    # Connect to MongoDB
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DB_NAME]
    collection = db.demo_requests
    
    # Get count BEFORE
    count_before = collection.count_documents({})
    print(f"Count BEFORE POST: {count_before}")
    
    # POST valid payload
    response = requests.post(f"{API_BASE}/demo-request", json=VALID_PAYLOAD, timeout=10)
    print(f"POST response status: {response.status_code}")
    print(f"POST response body preview: {response.text[:120]}")
    
    # Get count AFTER
    count_after = collection.count_documents({})
    print(f"Count AFTER POST: {count_after}")
    
    # Verify count is UNCHANGED
    if count_before == count_after:
        test_result(
            "NO DB WRITE - count unchanged",
            True,
            f"Count before: {count_before}, Count after: {count_after} (UNCHANGED ✓)"
        )
    else:
        test_result(
            "NO DB WRITE - count unchanged",
            False,
            f"Count before: {count_before}, Count after: {count_after} (INCREASED by {count_after - count_before})"
        )
    
    mongo_client.close()
    
except Exception as e:
    test_result("NO DB WRITE - count unchanged", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 1: ROUTING / NO 404 - Valid payload should return 503 with JSON
# ============================================================================
print("\n" + "=" * 80)
print("TEST 1: ROUTING / NO 404 - Valid payload should return 503 with JSON")
print("=" * 80)

try:
    response = requests.post(f"{API_BASE}/demo-request", json=VALID_PAYLOAD, timeout=10)
    
    # Check status code
    status_ok = response.status_code == 503
    
    # Check response is JSON (not HTML)
    body_preview = response.text[:120]
    is_json = response.text.startswith("{")
    is_not_html = not response.text.startswith("<!DOCTYPE") and not response.text.startswith("<html")
    
    # Check exact detail message
    expected_detail = "Something went wrong. Please try again or email us directly at info@serv-ai.com."
    try:
        json_body = response.json()
        detail_match = json_body.get("detail") == expected_detail
    except:
        detail_match = False
        json_body = None
    
    if status_ok and is_json and is_not_html and detail_match:
        test_result(
            "ROUTING / NO 404 - Valid payload returns 503 with JSON",
            True,
            f"Status: {response.status_code}, Body starts with: {body_preview}, Detail matches: {detail_match}"
        )
    else:
        test_result(
            "ROUTING / NO 404 - Valid payload returns 503 with JSON",
            False,
            f"Status: {response.status_code} (expected 503: {status_ok}), "
            f"Is JSON: {is_json}, Not HTML: {is_not_html}, Detail match: {detail_match}, "
            f"Body preview: {body_preview}"
        )
except Exception as e:
    test_result("ROUTING / NO 404 - Valid payload returns 503 with JSON", False, f"Exception: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)

passed_count = sum(1 for r in results if r["passed"])
total_count = len(results)

for result in results:
    status = "✅ PASS" if result["passed"] else "❌ FAIL"
    print(f"{status}: {result['test']}")

print("=" * 80)
print(f"TOTAL: {passed_count}/{total_count} tests passed")
print("=" * 80)

if passed_count == total_count:
    print("\n🎉 ALL TESTS PASSED!")
    exit(0)
else:
    print(f"\n⚠️  {total_count - passed_count} test(s) failed")
    exit(1)
