import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL = "qwen2.5-coder:7b"

print("Streaming Local AI Chatbot Started")
print("Type 'exit' to quit.\n")

while True:
    prompt = input("You: ")

    if prompt.lower() == "exit":
        break

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt
        },
        stream=True
    )

    print("\nAI: ", end="", flush=True)

    for line in response.iter_lines():
        if line:
            data = json.loads(line)

            if "response" in data:
                print(data["response"], end="", flush=True)

    print("\n")