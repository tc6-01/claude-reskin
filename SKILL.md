---
name: reskin
version: 3.0.0
description: "System reskinning/refactoring methodology — thoroughly understand the system first, then integrate user intent, execute autonomously once confirmed. For brand reskinning, tech stack migration, system layering refactors."
metadata:
  requires:
    directories:
      - ".reskin/"
    templates:
      - "capability-inventory-template.md"
      - "lifecycle-template.md"
      - "layering-matrix-template.md"
      - "migration-plan-template.md"
      - "execution-log-template.md"
---

# Reskin Skill v3

## Core Philosophy

> **There is only one reason reskins fail: insufficient understanding of the system.**
>
> The solution is not more checkpoints — it's maxing out the understanding phase.
> The upfront confirmation can be long, but once confirmed, execution is a straight line
> with no turning back until acceptance criteria are met.

---

## ⚠️ RE-ENTRY DETECTION — Execute First on Every Invocation

**The first thing this skill does is NOT start Phase 1. It checks whether an incomplete reskin session already exists.**

```
ON INVOKE:
    1. CHECK if .reskin/plan.md exists
    2. IF not exists:
         → Enter Phase 1 (fresh reskin)
    3. IF exists:
         → READ .reskin/plan.md
         → COUNT STEPs marked [ ] and [-]
         → IF all STEPs are [x]:
             → Output: "Reskin already complete. Delete .reskin/ directory to restart."
             → STOP
         → IF any [ ] or [-] or [!] exist:
             → Output: "Detected incomplete reskin session. Auto-resuming."
             → Output: "Completed: X/Y steps, progress: Z%"
             → Jump directly to Phase 4 RESUMPTION LOOP
             → Do NOT re-run Phase 1/2/3
    4. IF .reskin/ directory exists but plan.md does not:
         → Enter Phase 1 (partial analysis artifacts exist but incomplete)
```

**Why this check must come first**: The LLM may stop mid-Phase 4 due to context window exhaustion,
token limits, session timeout, etc. If `/reskin` is re-invoked without checking state first,
it would incorrectly restart from scratch, causing duplicate work — or worse, leaving
half-modified code from Phase 4 with no one to finish it.

---

## Execution Model

```
Phase 1: DEEP ANALYSIS        Phase 2: GOAL INTEGRATION       Phase 3: GATE              Phase 4: AUTONOMOUS LOOP
(interactive, can be long)     (interactive)                    (single confirmation)       (zero-interaction + self-scheduling)

 Traverse codebase             User states goal                 One-time approval of        WHILE acceptance criteria unmet:
 Inventory all capabilities    Agent enriches goal               all artifacts               Read plan.md, find next [-]
 Map complete lifecycles        based on analysis                                          Execute that STEP
 Trace dependency chains       Identify conflicts/risks                                    Auto-verify
 Determine layering            Generate migration plan                                     IF pass → mark [x] → CONTINUE
                                Generate acceptance criteria                               IF fail → diagnose & fix, max 3x
     ↓                            ↓                            ↓                           After each STEP:
  analysis/ artifacts          constitution.md              After approval:                ScheduleWakeup(60s) self-schedule
                               plan.md                      No more questions              → prevents session interruption
                                                            plan.md locked                 from stranding the reskin
                                                                                           END
                                                                                           Criteria met → SUCCESS
```

---

## Trigger Conditions

- Brand name / Logo / Theme color / Copy text batch replacement
- Tech stack migration (e.g. Node→Go, React→Vue)
- System layering refactor (e.g. frontend/API/execution layer boundary redraw)
- Multi-product line splitting from shared codebase into independent brands

---

## Directory Structure

```
.reskin/
├── analysis/                 # Phase 1 artifacts
│   ├── capabilities.md       # Capability inventory
│   ├── lifecycle/            # One lifecycle file per capability
│   │   └── CAP-XXX.md
│   ├── dependencies.md       # Capability dependency graph
│   └── layering.md           # Current layer ownership assessment
├── constitution.md           # Phase 2 artifact — core principles + enriched goal
├── plan.md                   # Phase 2 artifact — migration plan + acceptance criteria
└── logs/                     # Phase 4 artifact — execution logs
    └── STEP-XXX.md
```

**Skill template directory**: `~/.claude/skills/reskin/templates/`

---

## Phase 1: DEEP ANALYSIS — Understand the System Completely

### Principle

> This phase has no time limit. Take as long as needed, but you must understand the system
> to the point where "the lifecycle and side effects of every capability are crystal clear."

### 1.1 Codebase Traversal

Starting from entry points, systematically traverse the entire codebase. For each key file/module, answer:
- Which business capability does it belong to?
- What is it defining? What is it executing?
- What does it depend on? What depends on it?
- What is the blast radius of changing it?

**Method**: Use `Agent` (Explore) for parallel exploration, `grep`/`rg` to trace reference chains,
`Read` to dive into key files. Do not skip any directory that "seems unimportant."

### 1.2 Capability Inventory

Based on codebase traversal, output `.reskin/analysis/capabilities.md` (use `capability-inventory-template.md`).

Assign each capability a unique ID `CAP-XXX`, annotate:
- Current definition owner (who defines the rules/structure/semantics)
- Current execution owner (who actually performs the operations)
- Dependents (which CAPs depend on it)
- Replacement risk (High/Medium/Low)

### 1.3 Lifecycle Mapping

For each capability, output `.reskin/analysis/lifecycle/CAP-XXX.md` (use `lifecycle-template.md`).

**Must include**:
- Creation timing, activation timing, mutation timing, destruction timing
- Trigger for each phase (Frontend/API/Execution layer/User)
- Side effects of each phase (which CAP-XXX are affected)

### 1.4 Dependency Graph

Output `.reskin/analysis/dependencies.md`, describing inter-capability dependencies.

**Must include**:
- Dependency topology (text form is fine)
- Circular dependency annotations
- Critical paths (which capability chains are affected by changing one capability)

### 1.5 Layer Ownership Assessment

Output `.reskin/analysis/layering.md` (use `layering-matrix-template.md`),
determining which layer each capability currently belongs to (Frontend/API Control Plane/Execution Layer/Extension Layer).

### Phase 1 Confirmation

After all artifacts are written to `.reskin/analysis/`, **confirm with the user that the analysis is accurate and complete**.

This is the single most important interaction in the entire reskin process:
```
"Here is the complete system analysis. Please confirm:
1. Is the capability inventory complete? Any missing capabilities?
2. Are the lifecycle descriptions for each capability accurate?
3. Are the dependency relationships correct?
4. Is the layer ownership assessment accurate?

If anything is inaccurate, please point it out and I will re-analyze."
```

**Phase 1 can iterate repeatedly** until the user confirms the analysis is fully accurate.

---

## Phase 2: GOAL INTEGRATION — Incorporate User Intent

### Principle

> The user's reskin goal is typically brief (e.g. "change brand name from Kortix to Habitat"),
> but based on the deep understanding from Phase 1, the agent must **expand** this brief goal
> into a complete, executable plan.

### 2.1 User States the Goal

Let the user describe what they want in natural language.

### 2.2 Agent Enriches the Goal

Based on Phase 1 analysis, the agent expands the user's brief goal:

- Which CAP-XXX does this goal involve? (map to capability inventory)
- What does each involved CAP need to change into?
- Which CAPs appear unrelated but are actually implicated by the dependency chain?
- Are there conflicts? (user's desired goal vs. current system layering)
- Are there blind spots? (places the user may not have thought of but analysis reveals must change)

### 2.3 Generate Constitution

Output `.reskin/constitution.md` (use `constitution-template.md`).

Contains:
- Project identifier + reskin goal (enriched)
- 5 core principle confirmations
- **NEW: Analysis-derived constraint clauses** (e.g. "frontend layer must not understand sandbox semantics" — specific rules extracted from analysis)

### 2.4 Generate Migration Plan + Acceptance Criteria

Output `.reskin/plan.md` (use `migration-plan-template.md`).

Must include:
- Migration steps ordered by **dependency** (not chronological)
- **Acceptance criteria per step** (must be automatable for verification)
- **Overall acceptance criteria** (how to determine "reskin succeeded" after all steps)
- Corresponding CAP-XXX for each step

### Phase 2 Confirmation

```
"Based on system analysis and your goal, here is the complete migration plan.

【Enriched Goal】
[List the user's original goal + agent-enriched content]

【Capabilities Involved】
[List all involved CAP-XXX and what changes for each]

【Migration Steps】
[List steps in dependency order]

【Acceptance Criteria】
[List of verifiable criteria]

【Risk Points】
[Potential conflicts/risks discovered during analysis]

Please confirm all of the above. Once confirmed, I will enter autonomous execution
and will not ask any questions until completion or an unrecoverable error."
```

---

## Phase 3: GATE — Single Confirmation

### This is the Only Gate

Use the `approvals` tool, `action:'request'` to submit `constitution.md` + `plan.md` for approval.

- Poll `action:'status'` until `approved`
- On `action:'delete'` success → enter Phase 4
- If `needs-revision`: return to Phase 2, update, re-submit

> **Once this gate is passed, Phase 4 will not ask any questions, unless an error cannot be auto-repaired.**

---

## Phase 4: AUTONOMOUS LOOP — Execute to Completion

### plan.md Status Marker Protocol

Each STEP in plan.md uses the following markers:

| Marker | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[-]` | In progress (started but verification not complete) |
| `[x]` | Completed and verified |
| `[!]` | Failed (paused after 3 attempts, waiting for human) |

**Key rules**:
- When starting a STEP, **change `[ ]` to `[-]` first** (persist "in progress" state)
- After verification passes, **change `[-]` to `[x]`**
- If session is interrupted, STEPs marked `[-]` will be re-executed on re-entry (safe retry)
- STEPs marked `[x]` are **never re-executed** (completed changes are idempotent)

### Core Rules

```
WHILE any STEP marked [ ] or [-] exists in plan.md:
    1. Find the first [ ] or [-] STEP
    2. IF [-] → this is re-entry after interruption, re-execute this STEP from scratch
    3. Mark as [-] (if not already)
    4. Execute the STEP's changes
    5. Auto-verify the STEP's acceptance criteria
    6. IF verification passes:
         → Write execution log to .reskin/logs/STEP-XXX.md
         → Mark the STEP as [x] in plan.md
         → Call ScheduleWakeup(60s, reason="continue reskin STEP-XXX+1")
         → CONTINUE
    7. IF verification fails:
         → Auto-diagnose root cause
         → Auto-fix
         → Re-verify
         → IF same STEP fails 3 consecutive times:
             → Mark as [!]
             → Output detailed diagnostic report
             → STOP (wait for user intervention, then resume on re-entry)
    8. END

All STEPs marked [x]:
    → Execute overall acceptance verification
    → Output completion report
    → STOP
```

### Self-Scheduling Mechanism (prevents session interruption from stranding the reskin)

**After each STEP completes, MUST call ScheduleWakeup to schedule the next continuation.**

```typescript
// Pseudocode: execute after each STEP completes
ScheduleWakeup({
  delaySeconds: 60,           // Wake up in 60 seconds
  reason: "Continue reskin STEP-XXX+1 — autonomous loop",
  prompt: "resume reskin execution from .reskin/plan.md"
})
```

**Why self-scheduling is necessary**:
- The LLM may stop at any moment (context full, token limit, connection drop)
- If plan.md still has `[ ]` or `[-]` STEPs when stopped, the next `/reskin` invocation will auto-resume
- But if the user doesn't manually call `/reskin`, the reskin is stranded
- `ScheduleWakeup` schedules the next execution in the background, ensuring that even if the current session ends, the next session will auto-start and continue
- 60s delay keeps the cache warm without being too frequent

**Fallback: user uses the /loop command**

If ScheduleWakeup is unavailable, tell the user:
```
"Autonomous execution phase requires continuous running. Recommended: run in another terminal:
  /loop 30s /reskin

This checks progress every 30 seconds and auto-resumes. CTRL+C to stop."
```

### Stop Conditions

| Condition | Behavior |
|-----------|----------|
| All STEPs `[x]` + overall acceptance passes | Output completion report, stop self-scheduling, END |
| Same STEP fails 3 consecutive fix attempts → `[!]` | Stop self-scheduling, output diagnostic report, wait for user |
| User actively interrupts | Save current progress (plan.md `[-]` state already persisted), safe stop |

**Explicitly forbidden stop reasons**:
- "Looks about right"
- "This change is too big"
- "Should we adjust the plan"
- "Phase is done"
- **"Context is almost full"** — not a stop reason; use ScheduleWakeup to save progress and continue in new session
- **"Almost out of tokens"** — same as above; finish current STEP, mark [x], ScheduleWakeup the next STEP

### Resumption Flow (RESUMPTION LOOP)

When session is interrupted and `/reskin` is re-invoked or ScheduleWakeup triggers:

```
1. READ .reskin/plan.md
2. FIND first non-[x] STEP:
   - [ ] → normal start
   - [-] → interruption recovery, check for incomplete change residue
        → Check .reskin/logs/ for partial logs of this STEP
        → Re-execute this STEP (safe: changes must be idempotent)
   - [!] → skip, wait for manual user handling
3. Continue from that STEP
4. Output progress: "Resuming: STEP X/Y (Z%)"
```

### Execution Constraints

```
SINGLE_CAPABILITY: Each STEP involves only one CAP-XXX
DEFINITION_FIRST: Change definition owner first, then execution logic (even within same CAP, these must not be merged)
NO_FEATURE_CHANGE: Functional behavior must be identical before and after changes
MUST_LOG: Every STEP must write .reskin/logs/STEP-XXX.md
MUST_VERIFY: Every STEP must verify all CAPs within its side effect window
MUST_SCHEDULE: Must call ScheduleWakeup(60s) after each STEP completes
AUTO_RETRY: Auto-diagnose and fix on error; never roll back completed STEPs
IDEMPOTENT: All changes must be designed as idempotent (STEPs in [-] state may be re-executed)
```

### Error Handling Protocol

1. **First failure**: Read error → Diagnose root cause → Fix → Re-verify
2. **Second failure**: Expand diagnosis scope (check all CAPs in side effect window) → Fix → Re-verify
3. **Third failure**: Mark `[!]` → Output detailed diagnostic report → Stop self-scheduling → Wait for user

Diagnostic report must include:
- Failed STEP number and involved CAP-XXX
- Error symptoms
- Fix approaches already attempted and why they failed
- Suggested solution (if agent has a hypothesis)
- Current progress (completed/incomplete STEPs)
- Recovery method (tell user: run `/reskin` after fixing to auto-resume)

### Post-Acceptance Output

```
Reskin Completion Report:
- Total STEPs
- Success / Failed / Skipped count
- Files involved
- Capability change summary
- Acceptance criteria achievement status
```

---

## Anti-Patterns (will cause execution pause or rejection)

| Anti-Pattern | Detection | Handling |
|-------------|-----------|----------|
| Phase 1 analysis incomplete before Phase 2 | Check analysis/ artifact completeness | Reject entry to Phase 2 |
| Phase 2 plan missing acceptance criteria | Check plan.md structure | Reject entry to Phase 3 |
| Attempting to modify plan during Phase 4 | Any non-marker operation on plan.md | Reject, continue per original plan |
| Asking "should we continue" during Phase 4 | — | Forbidden, keep executing |
| Skipping verification during Phase 4 | Check logs/ missing verification section | Mark STEP incomplete, re-execute |
| Single STEP touches multiple CAPs | Pre-execution check | Reject, split into multiple STEPs |
