
import requests
import json

url = "http://localhost:8001/api/chat"
headers = {"Content-Type": "application/json"}
data = {"message": "Who can transfer property?"}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response received:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")

except Exception as e:
    print(f"Connection failed: {e}")
