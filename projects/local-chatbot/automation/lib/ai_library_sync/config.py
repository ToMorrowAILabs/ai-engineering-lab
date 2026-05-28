from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class SyncConfig:
    repo_root: Path
    library_root: Path
    raw: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def load(cls, repo_root: Path | None = None) -> SyncConfig:
        root = repo_root or Path(__file__).resolve().parents[3]
        config_path = root / "automation" / "config" / "ai_library_sync.json"
        with config_path.open(encoding="utf-8") as f:
            raw = json.load(f)
        library_root = Path(raw["library_root"])
        return cls(repo_root=root, library_root=library_root, raw=raw)

    def repo_path(self, key: str) -> Path:
        rel = self.raw["paths"][key]
        return self.repo_root / rel

    def library_path(self, key: str) -> Path:
        rel = self.raw["paths"][key]
        return self.library_root / rel

    def assert_allowed_paths(self, *paths: Path) -> None:
        allowed = [
            self.library_root.resolve(),
            self.repo_root.resolve(),
        ]
        for path in paths:
            resolved = path.resolve()
            if not any(resolved == root or root in resolved.parents for root in allowed):
                raise ValueError(f"Path outside allowed roots: {path}")
