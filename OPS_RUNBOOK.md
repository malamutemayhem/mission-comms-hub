# OPS_RUNBOOK.md

## Canonical Workspace
- Primary workspace: `C:\B\openclaw-workspace`
- OpenClaw config: `C:\Users\Bailey Amarok\.openclaw\openclaw.json`

## Fast Recovery (Main)
```powershell
openclaw gateway restart
openclaw status --all
```

## One-command Healthcheck
```powershell
powershell -ExecutionPolicy Bypass -File C:\B\openclaw-workspace\scripts\openclaw-healthcheck.ps1
```

## Fast Recovery (Plex Node)
```powershell
$env:OPENCLAW_ALLOW_INSECURE_PRIVATE_WS="1"
openclaw node restart
openclaw node status
```

## Node Reattach (foreground debug)
```powershell
$env:OPENCLAW_ALLOW_INSECURE_PRIVATE_WS="1"
openclaw node run --host 172.31.61.119 --port 18789 --display-name PlexServer
```

## Syncthing Shared Folder
- Folder ID: `b-share`
- Local path: `C:\B`
- Mesh: Plex / Lenovo / VM / Bailey

## Scheduled Jobs
- `healthcheck:security-audit` (every 2 days)
- `security:deep-weekly` (Mon 09:00, deep audit)
- `reliability:node-watchdog` (every 6h; silent unless issue)
- `ops:config-drift-daily` (09:15 daily drift check)
- `memory:nightly-maintenance` (23:30 Australia/Sydney)
- `memory:tiering-weekly` (Sun 23:45 HOT/WARM/COLD redistribution)

## Reliability Scripts
- `scripts\openclaw-healthcheck.ps1` (one-command status/probe/doctor/restart)
- `scripts\openclaw-relay-validate.ps1` (relay port/token validation)
- Plex local watchdog task: `OpenClaw Node Watchdog` (every 10 min)

## Safety Defaults
- Telegram groups blocked by default (`groupPolicy=allowlist`, empty allowlist)
- Use service commands before foreground debug runs
- Avoid repeated terminal paste loops when node execution is available
