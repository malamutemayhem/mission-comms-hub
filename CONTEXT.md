# Mission Comms Context

## Purpose
Mission Comms is the shared communications layer between:
- Chris
- Bailey (OpenClaw assistant)
- Claude

It exists to reduce copy-paste chaos and preserve context across relays.

## Current state
- Mission Comms app is live in Lovable and backed by Supabase.
- Bailey can successfully post messages directly to Mission Comms via Supabase REST.
- GitHub-hosted handoff is live via `CONTEXT.md` and `MESSAGES.md`.
- GitHub Actions autonomous Claude response path is now live and confirmed working.
- Claude can respond automatically when Bailey commits to `MESSAGES.md` with a `**Requested response:**` marker.
- No human relay is needed for the GitHub Actions path.
- Direct Claude ↔ Bailey MCP bridge is still not working.

## Confirmed working
### Mission Comms
- Shared UI is live.
- Realtime updates are live.
- Supabase REST insert works.
- Repo is connected to GitHub with 2-way Lovable sync.

### Bailey
- Bailey can post directly to:
  - `https://fwxcinadcjqkinkemusu.supabase.co/rest/v1/messages`
- Mission Comms test post from Bailey succeeded.
- Bailey can trigger Claude autonomously by committing an active-thread request to `MESSAGES.md`.

### Claude via GitHub Actions
- Workflow file: `.github/workflows/claude-respond.yml`
- Trigger: push to `MESSAGES.md` on `main` or manual dispatch
- Guardrails confirmed:
  - request marker required
  - idempotency check in Supabase via `client_message_id`
  - proper Python JSON payload construction
  - no commits back to `MESSAGES.md`
  - fail hard on bad Anthropic or Supabase responses
- Live test succeeded:
  - Bailey committed a test request to `MESSAGES.md`
  - GitHub Actions ran successfully in about 21 seconds
  - Claude posted directly to Mission Comms through Supabase
  - No copy-paste or Chris relay was required

### Mission Control
- Mission Control finance app is real, materially built, and repo-first via Lovable + GitHub sync.
- Repo: `https://github.com/malamutemayhem/malamutefinance`
- Completed hygiene fixes there:
  1. removed tracked `.env`, added `.env.example`
  2. standardized on npm, removed Bun lockfiles
  3. cleaned README project links

## Not working yet
### Claude ↔ Bailey direct bridge
Attempted path:
- `freema/openclaw-mcp`
- Cloudflare quick tunnel
- Claude.ai custom MCP connector

Infrastructure status:
- Cloudflare tunnel works
- MCP bridge container runs
- Claude connector can be configured

Blocker:
- OpenClaw 2026.3.x appears incompatible with `freema/openclaw-mcp v1.3.0` in current setup
- No confirmed bridge-compatible external HTTP API path was found
- Sessions initialize then close immediately

Conclusion:
- This path is parked for now
- Keep tunnel + bridge infra only if useful later
- Do not spend more time on this exact bridge unless a 2026.3.x-compatible path is found

## Current relay workflow
### Autonomous path
1. Bailey updates `CONTEXT.md` if durable operating context has changed.
2. Bailey writes a focused active-thread request into `MESSAGES.md`.
3. The request must include `**Requested response:**`.
4. GitHub Actions runs Claude automatically.
5. Claude posts directly into Mission Comms via Supabase.
6. Bailey continues from there.

### Human relay fallback
1. Bailey posts a context-rich message to Mission Comms.
2. Bailey pings Chris on Telegram.
3. Chris opens Claude and says: "read Mission Comms and respond to Bailey"
4. Claude reads the current thread/context.
5. Claude responds back into Mission Comms.
6. Bailey continues from there.

## Standard for Mission Comms messages
Every message intended for Claude should include:
- what this is about
- current status
- what is blocked
- what answer/action is needed
- key links/IDs if relevant

Avoid vague prompts like:
- "thoughts?"
- "can Claude help?"
- "see above"

Use context-rich messages instead.

## Open questions for Claude
1. Does OpenClaw 2026.3.x have native MCP support or a newer compatible bridge path?
2. Is there a documented external HTTP API path for OpenClaw 2026.3.x suitable for bridge/proxy use?
3. If direct MCP remains blocked, what is the cleanest long-term relay architecture between Claude and Bailey?
4. Should Mission Comms get a stronger attention/mention system next, such as `@Bailey`, `@Claude`, and `requires_attention`?

## Recommended next steps
### Bailey / OpenClaw
- Update `MESSAGES.md` after resolved tests so stale prompts do not confuse Claude
- Tighten prompt framing so Claude does not reference old relay assumptions when the active thread is clearly autonomous
- Add Plex as a managed OpenClaw node in a future session

### Claude
- Use this file plus current Mission Comms thread as handoff context
- Respond in a direct, punchy style
- No em dashes
- Prefer recommendations over bloated option lists
- Trust the autonomous GitHub Actions path when the request comes through `MESSAGES.md`

## Chris preferences
- Direct, short, critical info only unless depth is needed
- No em dashes
- "Prompt composition" not "prompt engineering"
- Higgsfield result always described as "top 2%"
- Full config pastes preferred over partial edits
- `🎬` prefix for any action needed from Chris

## Business context
- Chris Byrne
- Malamute Mayhem
- Melbourne-based
- Solo creative director, 22+ years experience
- Rate: $150/hr AUD + GST
- Mission Control finance app is current main build focus

## Notes
This file is meant to let Claude enter a fresh conversation cold and understand the operating state quickly.
The autonomous GitHub Actions loop is now real, tested, and preferred for structured Bailey → Claude handoffs.
