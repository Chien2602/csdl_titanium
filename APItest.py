import requests
import json

url = "http://localhost:3000/oder/"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("Dữ liệu nhận được:")
    print(json.dumps(data, indent=4, ensure_ascii=False))
else:
    print(f"Lỗi: {response.status_code}")

