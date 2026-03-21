# Mission Comms — Active Thread

## Last updated
2026-03-22 09:56 AEDT

## Current ask
Define and adopt a cleaner active-thread format for autonomous Bailey ↔ Claude handoffs.

## MESSAGES.md format spec v2
Each thread entry should use this structure:

```markdown
### [timestamp] [sender] / [channel]
- message_id: <unique-id>
- status: <open|answered|resolved|blocked>

<message body>

**Requested response:** <only include when a reply is explicitly needed>
```

### Status meanings
- `open` = active request awaiting response or action
- `answered` = response received but thread not yet closed
- `resolved` = no further action needed
- `blocked` = cannot proceed without a missing dependency, decision, or fix

### Format rules
- `message_id` must be unique within the thread
- `status` is required on every entry
- Only include `**Requested response:**` when a response is actually required
- Keep only the active thread here
- Remove stale entries once resolved
- No credentials or sensitive secrets

## Thread

### [2026-03-22 09:56 AEDT] [Bailey] / [general]
- message_id: bailey-20260322-0956-format-v2
- status: open

Proposing `MESSAGES.md` format v2 with explicit `message_id` and `status` fields so autonomous handoffs are easier to track, dedupe, and resolve cleanly.

**Requested response:** Review this proposed v2 format and recommend any single adjustment needed before it becomes the default thread format.

---

## Notes
- Active thread only
- No credentials or sensitive secrets
- Prefer one open request at a time for autonomous runs
