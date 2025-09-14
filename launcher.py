# launcher.py

import threading
import subprocess
import requests
import os
import sys
from flask import Flask, request, jsonify
from prompt import generate_prompt


# === Flask Proxy Server Setup ===
app = Flask(__name__)
ANYTHINGLLM_API_URL = "http://localhost:3001/api/v1/workspace/healthmate/chat"
token = "your_token_here"  # Replace with your actual token
@app.route('/ask', methods=['POST'])
def handle_ask():
    data = request.get_json()
    print(f"[INFO] Received from .exe: {data}")

    if not data or "question" not in data or "chatId" not in data:
        return jsonify({"error": "Missing 'question' or 'chatId' in payload"}), 400

    try:
        response = requests.post(ANYTHINGLLM_API_URL, json=data,headers={"Authorization": f"Bearer {token}"})
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 502

def run_proxy():
    app.run(host="127.0.0.1", port=8888)

# === Launcher Starts Here ===
if __name__ == "__main__":
    print("[INFO] Starting proxy server...")
    proxy_thread = threading.Thread(target=run_proxy, daemon=True)
    proxy_thread.start()

    # === Launch your actual .exe application ===
    exe_path = os.path.abspath("your_app.exe")  # Change this to match your .exe filename

    if not os.path.exists(exe_path):
        print(f"[ERROR] Could not find your_app.exe at {exe_path}")
        sys.exit(1)

    print(f"[INFO] Launching {exe_path} ...")
    try:
        subprocess.run([exe_path])  # Waits until .exe exits
    except Exception as e:
        print(f"[ERROR] Failed to run .exe: {e}")

    print("[INFO] Application exited. Proxy will shut down with script.")
