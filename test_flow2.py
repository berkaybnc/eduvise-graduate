import httpx
import random
import string

base_url = 'http://localhost:8000'
suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))

print('\n--- 1. Testing Auth Service ---')
try:
    httpx.post(f'{base_url}/auth/register', json={'email': f'test_{suffix}@student.com', 'password': 'password123', 'full_name': 'Test Student', 'role': 'student'})
    res = httpx.post(f'{base_url}/auth/login', data={'username': f'test_{suffix}@student.com', 'password': 'password123'})
    token = res.json().get('access_token')
    res2 = httpx.get(f'{base_url}/auth/me', headers={'Authorization': f'Bearer {token}'})
    print('Auth Service is OK. Status:', res2.status_code)
except Exception as e:
    print('Auth err:', e)

print('\n--- 2. Testing Course Service ---')
try:
    res = httpx.post(f'{base_url}/knowledge-nodes/', json={'topic_name': f'Python Basics {suffix}', 'difficulty_level': 1})
    node_id = res.json().get('id') if res.status_code == 200 else 'dummy'
    res2 = httpx.post(f'{base_url}/diagnostic/submit', params={'student_id': f'test_{suffix}', 'knowledge_node_id': node_id, 'score': 75.0})
    print('Course Service is OK. Status:', res2.status_code)
except Exception as e:
    print('Course err:', e)

print('\n--- 3. Testing AI Service ---')
try:
    res = httpx.post(f'{base_url}/ai/generate-roadmap', json={
        'student_id': f'test_{suffix}', 'interests': ['Python'], 'career_goals': ['Backend'],
        'current_knowledge_state': [{'knowledge_node_id': node_id, 'topic_name': f'Python Basics {suffix}', 'mastery_score': 75.0}]
    })
    print('AI Service is OK. Steps generated:', len(res.json().get('personalized_learning_path', [])))
except Exception as e:
    print('AI err:', e)

print('\n--- 4. Testing Analytics Service ---')
try:
    res = httpx.post(f'{base_url}/analytics/log-activity', json={'student_id': f'test_{suffix}', 'module_id': 'module_1', 'action_type': 'watch_video', 'watch_time_seconds': 120})
    print('Analytics Service is OK. Message:', res.json().get('msg'))
except Exception as e:
    print('Analytics err:', e)
