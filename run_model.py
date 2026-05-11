import requests
import json

# Your settings
LOCAL_URL = "http://localhost:9001/rvm-nyu70/1"
API_KEY = "ADD_YOUR_API_KEY"
IMAGE_PATH = "img4.webp"

# Read the image and send it to your local Docker container
with open(IMAGE_PATH, "rb") as image_file:
    response = requests.post(
        LOCAL_URL,
        params={"api_key": API_KEY},
        files={"file": image_file}
    )

# Print the result
if response.status_code == 200:
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.status_code}")
    print(response.text)
