import requests
import json
import os

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:7b"

SYSTEM_PROMPT = """
You are an expert AI coding assistant.

Rules:
- Return clean Python code.
- Explain briefly.
- Use markdown formatting.
"""

print("Local Code Assistant Started")
print("Type 'exit' to quit.\n")

while True:
    prompt = input("You: ")

    if prompt.lower() == "exit":
        break

    full_prompt = f"""
{SYSTEM_PROMPT}

User request:
{prompt}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": full_prompt,
            "stream": False
        }
    )

    data = response.json()

    print("\nAI:\n")
    print(data["response"])
    print()