import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL = "qwen2.5-coder:7b"

SYSTEM_PROMPT = """
You are a JSON-only assistant.

Always respond in valid JSON.

Format:
{
  "answer": "...",
  "summary": "...",
  "confidence": "high"
}
"""

print("JSON AI Chatbot Started")
print("Type 'exit' to quit.\n")

while True:
    prompt = input("You: ")

    if prompt.lower() == "exit":
        break

    full_prompt = SYSTEM_PROMPT + "\n\nUser: " + prompt

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": full_prompt,
            "stream": False
        }
    )

    data = response.json()

    raw_response = data["response"]

    print("\nRAW AI OUTPUT:")
    print(raw_response)

    cleaned_response = raw_response.strip()

if cleaned_response.startswith("```json"):
    cleaned_response = cleaned_response.replace("```json", "", 1).strip()

if cleaned_response.startswith("```"):
    cleaned_response = cleaned_response.replace("```", "", 1).strip()

if cleaned_response.endswith("```"):
    cleaned_response = cleaned_response[:-3].strip()

parsed = json.loads(cleaned_response)

print("\nPARSED JSON:")
print(json.dumps(parsed, indent=2))