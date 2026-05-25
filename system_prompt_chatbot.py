import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL = "qwen2.5-coder:7b"

SYSTEM_PROMPT = """
You are an elite senior Python engineer.
Always explain code clearly.
Keep answers concise and practical.
"""

conversation_history = []

print("System Prompt AI Chatbot Started")
print("Type 'exit' to quit.\n")

while True:
    prompt = input("You: ")

    if prompt.lower() == "exit":
        break

    conversation_history.append(f"User: {prompt}")

    full_prompt = SYSTEM_PROMPT + "\n\n" + "\n".join(conversation_history)

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": full_prompt
        },
        stream=True
    )

    print("\nAI: ", end="", flush=True)

    assistant_response = ""

    for line in response.iter_lines():
        if line:
            data = json.loads(line)

            if "response" in data:
                chunk = data["response"]

                assistant_response += chunk

                print(chunk, end="", flush=True)

    print("\n")

    conversation_history.append(f"AI: {assistant_response}")