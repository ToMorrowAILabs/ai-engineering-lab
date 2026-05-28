# Commuter Review Queue

JSON review metadata per resource for **manual** commute reinforcement.

Each file includes:

- `review_questions` — rapid recall prompts
- `exercise_suggestion` — applied practice tie-in
- `commute_friendly` — whether video/audio resources suit commute
- `weakness_tags` — remediation lookup keys

## Usage

1. Run `python automation/scripts/ingest_math_resources.py --generate-queues`
2. Before commuting, open `{resource_id}.json` for your target lesson
3. For video resources, open the URL manually (no YouTube automation)
4. Answer review questions without notes
5. Optional: use matching file in `notebooklm_pack_queue/` for audio prep

## Weakness Lookup

See `resource_metadata_index.json` → `by_weakness` for all resources tagged to a weakness.
