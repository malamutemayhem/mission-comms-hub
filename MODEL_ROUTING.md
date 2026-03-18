# MODEL_ROUTING.md — Bailey Amarok Routing Policy

_Last updated: 2026-03-09_

## Philosophy
Route by task complexity and output stakes. Use cheap/free models for bulk and code. Escalate to Sonnet only when quality, accuracy, or brand reputation is on the line.

---

## Tier 0 — Orchestrator
**Model:** `google/gemini-2.5-flash` ($0.30 in / $2.50 out per 1M)
**Role:** Front brain. Receives every message first. Classifies and routes. Handles simple tasks directly.

Handle directly at Tier 0:
- Short conversational replies
- Memory recall and lookup
- Task classification decisions
- Quick confirmations and scheduling
- Any response under ~500 tokens that doesn't need specialised code or precision

---

## Tier 1 — Code Executor
**Model:** `qwen/qwen3-coder:free` ($0 / $0)
**Role:** All technical implementation work at zero cost.

Route to Tier 1:
- PowerShell scripts
- Python automation
- Bash/shell commands
- Docker configurations
- Code refactoring and debugging
- Any terminal execution or scripting task

⚠️ **Escalation rule:** If Tier 1 returns a linter error, test failure, or logic bug — escalate immediately to Tier 3. Do NOT retry at Tier 1 or a similar model. Retrying failed code at the same tier wastes tokens on repeated failure modes.

---

## Tier 2 — Bulk & Large Context
**Model:** `google/gemini-2.5-flash-lite` ($0.10 in / $0.40 out per 1M, 1M context window)
**Role:** High-volume, repetitive, or context-heavy processing at minimal cost.

Route to Tier 2:
- Large pasted text blocks (documents, transcripts, data dumps)
- Information extraction from bulk uploads
- Summarising long documents
- Parsing email threads
- Invoice extraction
- Mundane agentic loops with many iterations but low reasoning requirement
- Any O(n) task repeating similar operations across many items

⚠️ **Escalation rule:** If a large context task requires genuine intelligence, nuanced analysis, or careful reasoning — escalate to Tier 3.

---

## Tier 3 — Precision Escalation (Primary Model)
**Model:** `anthropic/claude-sonnet-4-6` ($3 in / $15 out per 1M)
**Role:** Only for client-facing output, failed code escalation, and strategic reasoning.

Route to Tier 3 only when:
- Crafting client communications (Rinnai, DAF Trucks, any commercial contacts)
- Writing creative/marketing content
- Preparing strategic output for business decisions
- Code that failed at Tier 1 and needs intelligent debugging
- Anything shipping under the Malamute Mayhem name
- Sensitive Malamute Mayhem commercial context or strategy
- High-stakes decisions where accuracy is critical

**Gut-check rule:** Would I be comfortable if this output went directly to a client or was published under the Malamute Mayhem name? If no → Tier 3.

---

## Opus Manual Override
**Model:** `anthropic/claude-opus-4-6` ($5 in / $25 out per 1M)
**Role:** Never auto-routed. Use only when Chris explicitly requests maximum quality or when you're genuinely stuck on strategic design, architectural issues, or multi-file refactoring that exceeds Sonnet's capability. Surface as an option when you're stuck.

---

## Sensitive Context Rule (Override for Gmail)
For Gmail-related tasks only:
- Business-sensitive content (leads, contracts, projects) **can** route to Tier 2 (`gemini-2.5-flash-lite`)
- This override applies strictly to email scanning and inbox triage
- All other sensitive context (payments, legal, strategy, etc.) still routes to Tier 3 minimum

**Exception Clause:**
This Gmail-specific rule is explicitly for cost savings on large-volume inbox management. It violates the standard sovereignty rule (no Tier 2 for sensitive context) but aligns with your explicit instruction to prioritize financial efficiency in email triage while keeping Tier 3 for client-facing output, code that fails, and strategic decision-making.

---

## Fallback Handling
Fallbacks are managed at OpenRouter infrastructure level — do not include in routing logic:
- Tier 1 (Qwen) 429 rate limit → OpenRouter auto-routes to Llama 4 70B
- Tier 2 (Flash Lite) unavailable → OpenRouter auto-routes to DeepSeek V3.2

These happen silently. No action required.

---

## Cost Target
80-90% of daily traffic should cost nothing or near-nothing. Sonnet is precision-only. Opus is never auto-routed.

---

## Cost Reference (per 1M tokens)

| Tier | Model | In | Out | Notes |
|------|-------|----|-----|-------|
| 0 | gemini-2.5-flash | $0.30 | $2.50 | Orchestrator |
| 1 | qwen3-coder:free | $0 | $0 | Code only |
| 2 | gemini-2.5-flash-lite | $0.10 | $0.40 | Bulk/large context |
| 3 | claude-sonnet-4-6 | $3.00 | $15.00 | Precision/client-facing |
| M | claude-opus-4-6 | $5.00 | $25.00 | Manual override only |