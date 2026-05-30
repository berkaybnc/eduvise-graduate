import httpx
import sys

base_url = "http://localhost:8000"

print("--- 1. Testing Auth Service (Registration & Login) ---")
try:
    res = httpx.post(f"{base_url}/auth/register", json={
        "email": "test@student.com",
        "password": "password123",
        "full_name": "Test Student",
        "role": "student"
    })
    print("Register Response:", res.status_code, res.text)
    
    res = httpx.post(f"{base_url}/auth/login", data={
        "username": "test@student.com",
        "password": "password123"
    })
    print("Login Response:", res.status_code, res.text)
    token = res.json().get("access_token")
    
    res = httpx.get(f"{base_url}/auth/me", headers={"Authorization": f"Bearer {token}"})
    print("Get Me Response:", res.status_code, res.text)
except Exception as e:
    print("Auth error:", e)

print("\n--- 2. Testing Course Service ---")
try:
    res = httpx.post(f"{base_url}/knowledge-nodes/", json={
        "topic_name": "Python Basics",
        "difficulty_level": 1
    })
    print("Create Node Response:", res.status_code, res.text)
    node_id = res.json().get("id") if res.status_code == 200 else "dummy_id"
    
    res = httpx.post(f"{base_url}/diagnostic/submit", params={
        "student_id": "test_student",
        "knowledge_node_id": node_id,
        "score": 45.0
    })
    print("Submit Diagnostic Response:", res.status_code, res.text)
except Exception as e:
    print("Course error:", e)

print("\n--- 3. Testing AI Service ---")
try:
    res = httpx.post(f"{base_url}/ai/generate-roadmap", json={
        "student_id": "test_student",
        "interests": ["Python", "Backend"],
        "career_goals": ["Backend Developer"],
        "current_knowledge_state": [
            {"knowledge_node_id": node_id, "topic_name": "Python Basics", "mastery_score": 45.0}
        ]
    })
    print("Generate Roadmap Response:", res.status_code, res.text)
except Exception as e:
    print("AI error:", e)

print("\n--- 4. Testing Analytics Service ---")
try:
    res = httpx.post(f"{base_url}/analytics/log-activity", json={
        "student_id": "test_student",
        "module_id": "module_1",
        "action_type": "watch_video",
        "watch_time_seconds": 120
    })
    print("Log Activity Response:", res.status_code, res.text)
except Exception as e:
    print("Analytics error:", e)
