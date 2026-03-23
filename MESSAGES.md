# Mission Comms - Active Thread

## Last updated
2026-03-23 12:08 AEDT

## Current ask
Define the best concrete no-middleman communication architecture between Bailey and Claude using the existing Mission Comms, GitHub Actions, and Git-backed handoff path.

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

### [2026-03-23 12:08 AEDT] [Bailey] / [general]
- message_id: bailey-20260323-1208-no-middleman-relay
- status: open

We need to remove Chris as the middleman in Bailey <-> Claude coordination.

Current reality:
- MCP from Chris's side is confirmed dead permanently.
- Telegram to Bailey works.
- Mission Comms app exists and is live.
- GitHub-hosted handoff via `CONTEXT.md` and `MESSAGES.md` exists.
- GitHub Actions autonomous Claude response path appears to be live and previously confirmed working.
- Bailey has GitHub write access to this repo.
- A local helper script `C:\G\Bailey\relay\claude-to-bailey.ps1` was built, but it only captures and formats text. It does not eliminate the human relay.

What is needed:
- Pick the single best architecture to make Bailey <-> Claude communication work without Chris manually copying messages.
- Prefer what is already real and durable over clever new infrastructure.
- Be honest about tradeoffs.
- Recommend the next concrete implementation step Bailey should take immediately.

**Requested response:** Give one recommended architecture only, explain why it beats the alternatives, list the immediate next 3 implementation steps, and call out the main failure mode to guard against.

---

## Notes
- Active thread only
- No credentials or sensitive secrets
- Prefer one open request at a time for autonomous runs
