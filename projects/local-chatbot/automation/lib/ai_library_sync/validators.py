from __future__ import annotations

from typing import Any

REQUIRED_FIELDS = (
    "id",
    "title",
    "url",
    "lessons",
    "difficulty",
    "reinforcement_priority",
    "copyright_status",
    "source_type",
)


def validate_resources(
    resources: list[dict[str, Any]],
    required_lesson_slugs: list[str],
) -> dict[str, Any]:
    issues: list[dict[str, Any]] = []
    lesson_coverage: dict[str, list[str]] = {slug: [] for slug in required_lesson_slugs}

    for resource in resources:
        rid = resource.get("id", "<unknown>")

        for field in REQUIRED_FIELDS:
            value = resource.get(field)
            if field == "lessons":
                if not value:
                    issues.append(
                        {
                            "resource_id": rid,
                            "field": "lessons",
                            "severity": "error",
                            "message": "missing lesson links",
                        }
                    )
            elif value is None or value == "":
                issues.append(
                    {
                        "resource_id": rid,
                        "field": field,
                        "severity": "error",
                        "message": f"missing {field}",
                    }
                )

        for lesson in resource.get("lessons") or []:
            if lesson in lesson_coverage:
                lesson_coverage[lesson].append(rid)

    for slug in required_lesson_slugs:
        if not lesson_coverage[slug]:
            issues.append(
                {
                    "resource_id": None,
                    "field": "lessons",
                    "severity": "warning",
                    "message": f"no resources mapped to lesson '{slug}'",
                }
            )

    error_count = sum(1 for i in issues if i["severity"] == "error")
    warning_count = sum(1 for i in issues if i["severity"] == "warning")

    return {
        "valid": error_count == 0,
        "error_count": error_count,
        "warning_count": warning_count,
        "issues": issues,
        "lesson_coverage": lesson_coverage,
    }
