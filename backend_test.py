#!/usr/bin/env python3
"""
Backend API Test Suite for ServAI Demo Request Endpoint
Tests POST /api/demo-request validation, MongoDB storage, and error handling
"""

import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime

# Load environment variables
backend_env = Path('/app/backend/.env')
frontend_env = Path('/app/frontend/.env')

load_dotenv(backend_env)
load_dotenv(frontend_env)

# Get configuration
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME')

print("=" * 80)
print("BACKEND API TEST SUITE - POST /api/demo-request")
print("=" * 80)
print(f"Backend URL: {BACKEND_URL}")
print(f"MongoDB URL: {MONGO_URL}")
print(f"Database: {DB_NAME}")
print("=" * 80)
print()

# Test counters
tests_passed = 0
tests_failed = 0
test_results = []


def log_test(test_name, passed, details=""):
    """Log test result"""
    global tests_passed, tests_failed
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")
    print()
    
    if passed:
        tests_passed += 1
    else:
        tests_failed += 1
    
    test_results.append({
        "test": test_name,
        "passed": passed,
        "details": details
    })


# ============================================================================
# TEST 0: Sanity Check - GET /api/ endpoint
# ============================================================================
print("TEST 0: Sanity Check - GET /api/ endpoint")
print("-" * 80)
try:
    response = requests.get(f"{BACKEND_URL}/api/", timeout=10)
    expected_response = {"message": "Hello World"}
    
    if response.status_code == 200 and response.json() == expected_response:
        log_test(
            "GET /api/ sanity check",
            True,
            f"Status: {response.status_code}, Response: {response.json()}"
        )
    else:
        log_test(
            "GET /api/ sanity check",
            False,
            f"Status: {response.status_code}, Response: {response.text}"
        )
except Exception as e:
    log_test("GET /api/ sanity check", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 1: Validation - Empty body {}
# ============================================================================
print("TEST 1: Validation - Empty body {}")
print("-" * 80)
try:
    response = requests.post(
        f"{BACKEND_URL}/api/demo-request",
        json={},
        timeout=10
    )
    
    if response.status_code == 422:
        log_test(
            "Empty body validation",
            True,
            f"Status: {response.status_code}, Error snippet: {response.text[:200]}"
        )
    else:
        log_test(
            "Empty body validation",
            False,
            f"Expected 422, got {response.status_code}. Response: {response.text[:200]}"
        )
except Exception as e:
    log_test("Empty body validation", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 2: Validation - Missing one field (country)
# ============================================================================
print("TEST 2: Validation - Missing one field (country)")
print("-" * 80)
try:
    response = requests.post(
        f"{BACKEND_URL}/api/demo-request",
        json={
            "name": "John Doe",
            "email": "john@restaurant.com",
            "phone": "+1 555-0000",
            "restaurant": "The Grand Bistro"
            # Missing "country"
        },
        timeout=10
    )
    
    if response.status_code == 422:
        log_test(
            "Missing field validation",
            True,
            f"Status: {response.status_code}, Error snippet: {response.text[:200]}"
        )
    else:
        log_test(
            "Missing field validation",
            False,
            f"Expected 422, got {response.status_code}. Response: {response.text[:200]}"
        )
except Exception as e:
    log_test("Missing field validation", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 3: Validation - Invalid email format
# ============================================================================
print("TEST 3: Validation - Invalid email format")
print("-" * 80)
try:
    response = requests.post(
        f"{BACKEND_URL}/api/demo-request",
        json={
            "name": "John",
            "email": "notanemail",  # Invalid email
            "phone": "+1 555",
            "restaurant": "Bistro",
            "country": "UK"
        },
        timeout=10
    )
    
    if response.status_code == 422:
        log_test(
            "Invalid email validation",
            True,
            f"Status: {response.status_code}, Error snippet: {response.text[:200]}"
        )
    else:
        log_test(
            "Invalid email validation",
            False,
            f"Expected 422, got {response.status_code}. Response: {response.text[:200]}"
        )
except Exception as e:
    log_test("Invalid email validation", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 4a: Valid payload via external URL - Should return 503 (SMTP creds empty)
# ============================================================================
print("TEST 4a: Valid payload via external URL - Should return 503 (SMTP creds empty)")
print("-" * 80)
try:
    valid_payload = {
        "name": "John Doe",
        "email": "john@restaurant.com",
        "phone": "+1 (555) 000-0000",
        "restaurant": "The Grand Bistro",
        "country": "London, UK"
    }
    
    response = requests.post(
        f"{BACKEND_URL}/api/demo-request",
        json=valid_payload,
        timeout=10
    )
    
    expected_detail = "Something went wrong. Please try again or email us directly at info@serv-ai.com."
    
    print(f"    Response status code: {response.status_code}")
    print(f"    Response body (first 120 chars): {response.text[:120]}")
    print()
    
    if response.status_code == 503:
        try:
            response_json = response.json()
            actual_detail = response_json.get("detail", "")
            
            if actual_detail == expected_detail:
                log_test(
                    "Valid payload via external URL returns 503 with correct JSON",
                    True,
                    f"Status: {response.status_code}, Detail: '{actual_detail}', Body starts with: {response.text[:120]}"
                )
            else:
                log_test(
                    "Valid payload via external URL returns 503 with correct JSON",
                    False,
                    f"Status: {response.status_code}, Expected detail: '{expected_detail}', Got: '{actual_detail}'"
                )
        except Exception as json_error:
            # Check if response is HTML (ingress interference)
            if response.text.strip().startswith("<!DOCTYPE") or response.text.strip().startswith("<html"):
                log_test(
                    "Valid payload via external URL returns 503 with correct JSON",
                    False,
                    f"⚠️ CRITICAL: Status 503 correct, but response is HTML not JSON. Ingress/proxy still intercepting. Response starts with: '{response.text[:120]}'"
                )
            else:
                log_test(
                    "Valid payload via external URL returns 503 with correct JSON",
                    False,
                    f"Status: {response.status_code} (correct), but failed to parse JSON response. Error: {json_error}. Response text: '{response.text[:120]}'"
                )
    else:
        log_test(
            "Valid payload via external URL returns 503 with correct JSON",
            False,
            f"Expected 503, got {response.status_code}. Response: {response.text[:120]}"
        )
except Exception as e:
    log_test("Valid payload via external URL returns 503 with correct JSON", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 4b: Valid payload via localhost - Verify backend returns correct JSON
# ============================================================================
print("TEST 4b: Valid payload via localhost - Verify backend returns correct JSON")
print("-" * 80)
try:
    valid_payload = {
        "name": "Jane Smith",
        "email": "jane@bistro.com",
        "phone": "+44 20 1234 5678",
        "restaurant": "London Bistro",
        "country": "United Kingdom"
    }
    
    response = requests.post(
        "http://localhost:8001/api/demo-request",
        json=valid_payload,
        timeout=10
    )
    
    expected_detail = "Something went wrong. Please try again or email us directly at info@serv-ai.com."
    
    if response.status_code == 503:
        try:
            response_json = response.json()
            actual_detail = response_json.get("detail", "")
            
            if actual_detail == expected_detail:
                log_test(
                    "Valid payload via localhost returns 503 with correct JSON",
                    True,
                    f"✓ Backend implementation correct: Status {response.status_code}, Detail: '{actual_detail}'"
                )
            else:
                log_test(
                    "Valid payload via localhost returns 503 with correct JSON",
                    False,
                    f"Status: {response.status_code}, Expected detail: '{expected_detail}', Got: '{actual_detail}'"
                )
        except Exception as json_error:
            log_test(
                "Valid payload via localhost returns 503 with correct JSON",
                False,
                f"Status: {response.status_code}, but failed to parse JSON. Error: {json_error}. Response: '{response.text[:300]}'"
            )
    else:
        log_test(
            "Valid payload via localhost returns 503 with correct JSON",
            False,
            f"Expected 503, got {response.status_code}. Response: {response.text[:300]}"
        )
except Exception as e:
    log_test("Valid payload via localhost returns 503 with correct JSON", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 5: MongoDB Storage - Verify document was inserted
# ============================================================================
print("TEST 5: MongoDB Storage - Verify document was inserted")
print("-" * 80)
try:
    # Connect to MongoDB
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DB_NAME]
    collection = db.demo_requests
    
    # Find the most recent document with our test data
    query = {
        "name": "John Doe",
        "email": "john@restaurant.com",
        "restaurant": "The Grand Bistro"
    }
    
    document = collection.find_one(query, sort=[("submitted_at", -1)])
    
    if document:
        # Verify all fields
        checks = []
        checks.append(("name", document.get("name") == "John Doe"))
        checks.append(("email", document.get("email") == "john@restaurant.com"))
        checks.append(("phone", document.get("phone") == "+1 (555) 000-0000"))
        checks.append(("restaurant", document.get("restaurant") == "The Grand Bistro"))
        checks.append(("country", document.get("country") == "London, UK"))
        checks.append(("id", "id" in document and len(document["id"]) > 0))
        checks.append(("submitted_at", "submitted_at" in document))
        
        all_passed = all(check[1] for check in checks)
        failed_checks = [check[0] for check in checks if not check[1]]
        
        if all_passed:
            log_test(
                "MongoDB storage verification",
                True,
                f"Document found with all correct fields. ID: {document.get('id')}, Submitted: {document.get('submitted_at')}"
            )
        else:
            log_test(
                "MongoDB storage verification",
                False,
                f"Document found but some fields incorrect. Failed checks: {failed_checks}"
            )
    else:
        log_test(
            "MongoDB storage verification",
            False,
            "No document found in demo_requests collection matching the test data"
        )
    
    mongo_client.close()
    
except Exception as e:
    log_test("MongoDB storage verification", False, f"Exception: {str(e)}")


# ============================================================================
# TEST 6: Routing - Verify /api prefix is required
# ============================================================================
print("TEST 6: Routing - Verify /api prefix is required")
print("-" * 80)
try:
    # Try to access without /api prefix (should fail or 404)
    response = requests.post(
        f"{BACKEND_URL}/demo-request",  # No /api prefix
        json={
            "name": "Test",
            "email": "test@test.com",
            "phone": "+1 555",
            "restaurant": "Test",
            "country": "Test"
        },
        timeout=10
    )
    
    # Should NOT reach the endpoint (404 or similar)
    if response.status_code in [404, 405]:
        log_test(
            "Routing requires /api prefix",
            True,
            f"Without /api prefix: Status {response.status_code} (endpoint not reachable as expected)"
        )
    elif response.status_code in [502, 503]:
        log_test(
            "Routing requires /api prefix",
            False,
            f"Without /api prefix: Got {response.status_code} (endpoint was reached, should have been blocked by ingress)"
        )
    else:
        log_test(
            "Routing requires /api prefix",
            False,
            f"Without /api prefix: Got unexpected status {response.status_code}"
        )
except Exception as e:
    # Connection error or timeout is also acceptable (ingress blocks it)
    if "404" in str(e) or "Not Found" in str(e):
        log_test(
            "Routing requires /api prefix",
            True,
            f"Without /api prefix: Request blocked (404/Not Found)"
        )
    else:
        log_test("Routing requires /api prefix", False, f"Exception: {str(e)}")


# ============================================================================
# SUMMARY
# ============================================================================
print("=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total Tests: {tests_passed + tests_failed}")
print(f"Passed: {tests_passed}")
print(f"Failed: {tests_failed}")
print("=" * 80)
print()

if tests_failed == 0:
    print("✅ ALL TESTS PASSED")
else:
    print("❌ SOME TESTS FAILED")
    print("\nFailed tests:")
    for result in test_results:
        if not result["passed"]:
            print(f"  - {result['test']}")
            if result["details"]:
                print(f"    {result['details']}")

print()
print("=" * 80)
