"""
APIs + JSON Foundations — JSONPlaceholder Post Fetcher

Fetches a public API response, parses JSON, and writes a summary file.

Requires: pip install requests (see repo requirements.txt)

Run:
    python exercises/apis_json_foundations.py
"""

from __future__ import annotations

import json
from pathlib import Path

import requests

API_URL = "https://jsonplaceholder.typicode.com/posts/1"
SUMMARY_FILENAME = "post_summary.json"
BODY_PREVIEW_LEN = 80


def fetch_post(url: str) -> requests.Response:
    """GET a resource and raise on HTTP error status."""
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response


def extract_post_fields(data: dict) -> dict:
    """Pull key fields from JSONPlaceholder post shape."""
    body = data.get("body", "")
    preview = body[:BODY_PREVIEW_LEN]
    if len(body) > BODY_PREVIEW_LEN:
        preview += "..."
    return {
        "userId": data["userId"],
        "id": data["id"],
        "title": data["title"],
        "body_preview": preview,
    }


def save_summary(path: Path, summary: dict) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
        f.write("\n")


def load_summary(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def main() -> None:
    response = fetch_post(API_URL)
    print(f"Status: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type', 'unknown')}")

    data = response.json()
    summary = extract_post_fields(data)

    summary_path = Path(__file__).resolve().parent / SUMMARY_FILENAME
    save_summary(summary_path, summary)

    loaded = load_summary(summary_path)
    print("\nSaved summary:")
    print(json.dumps(loaded, indent=2))


if __name__ == "__main__":
    main()
