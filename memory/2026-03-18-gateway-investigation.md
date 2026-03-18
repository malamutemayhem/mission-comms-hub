# Gateway Service Investigation (2026-03-18 22:54 UTC+11)

## Task: Investigate AlwaysUp vs Scheduled Task Conflict

### Findings

#### 1. AlwaysUp Status
- **Status:** NOT RUNNING
- **Registry:** No AlwaysUp configuration found in HKCU\Software
- **Directory:** No C:\AppData\AlwaysUp config directory
- **Process:** Not listed in tasklist
- **Conclusion:** AlwaysUp is either uninstalled or disabled

#### 2. Scheduled Tasks (Both Present & Active)

**OpenClaw Gateway**
```
Path: C:\Windows\System32\tasks\OpenClaw Gateway
Created: 2026-03-18 15:52:26
Command: cmd.exe /c "C:\Users\Malamutemayhem\.openclaw\gateway.cmd"
Principal: S4U (user context, highest available)
Trigger: Boot
RestartOnFailure: 1 minute interval, 10 retries
MultipleInstancesPolicy: IgnoreNew
Status: Enabled, running
```

**OpenClaw Node**
```
Path: C:\Windows\System32\tasks\OpenClaw Node
Created: 2026-03-18 16:36:34
Command: cmd.exe /c "C:\Users\Malamutemayhem\.openclaw\node.cmd"
Principal: S4U (user context, highest available)
Trigger: Boot
RestartOnFailure: 1 minute interval, 10 retries
MultipleInstancesPolicy: IgnoreNew
Status: Enabled, running
```

### Analysis

**No Conflict Detected**
- Only Scheduled Tasks are managing services
- AlwaysUp is not active
- Both tasks are properly configured with RestartOnFailure
- MultipleInstancesPolicy: IgnoreNew prevents duplicate runs

**Why Gateway May Have Dropped Earlier**
1. Temporary process crash
2. Auto-restarted by Scheduled Task (within 1 minute)
3. No monitoring app running (AlwaysUp already gone)

### Recommendation

✅ **Current configuration is correct and reliable.**
- Scheduled Tasks are the right choice for system services on Windows
- 1-minute restart interval is appropriate
- 10 retry limit prevents infinite restart loops on fatal errors

**No action required.** If AlwaysUp was previously running, it's now disabled/removed (good).

### Test
```bash
# Verify tasks are registered
schtasks /query /tn OpenClaw* /v

# Manually trigger gateway restart
schtasks /run /tn "OpenClaw Gateway"

# Check gateway is running
openclaw gateway status
```

## C:\G\ Folder Structure (Verified 2026-03-18)

**Top-level directory:** 140+ folders

**High-priority (admin-heavy):**
- Tax (2,360+ archived files)
- Medical
- Legal
- Banking
- Insurance
- Houses

**Business:**
- MalamuteMayhem
- Business

**Personal & Misc:**
- Documents, Desktop, Pictures, Audio Books
- Employment, Education, CV, Contacts, Travel
- And 100+ others

**Search Protocol:** Use dynamic searches on request, never recursive-scan entire C:\G\

