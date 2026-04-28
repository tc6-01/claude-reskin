# claude-reskin

> **Reskins don't fail because of the tech stack. They fail because you don't understand the system well enough.**

A Claude Code skill that encodes a battle-tested methodology for system reskinning, rebranding, and refactoring. Born from a real project where a large-scale rebrand went sideways — not because the new stack was wrong, but because nobody had mapped out which capability was defined where, who owned what lifecycle, and what the blast radius of each change would be.

The methodology was then formalized in a system capability inventory and layering plan. This skill turns that methodology into a structured, enforceable workflow — not a wall of advice text, but a **file-system state machine with hard gates, re-entry detection, and autonomous self-scheduling**.

## The Problem It Solves

Most reskin attempts follow this trajectory:

```
1. Jump into the codebase and start making changes
2. Change A silently breaks B because B's lifecycle was tied to A's definition
3. Fix B, which breaks C and D
4. "While we're here" optimizations obscure what's a migration bug vs a new bug
5. Team gets lost mid-way, reskin stalls, codebase is left in a half-migrated state
```

The root cause is always the same: **insufficient understanding of the system before the first line is changed**.

## The Solution: 4 Phases, One Gate, Autonomous Execution

```
Phase 1: DEEP ANALYSIS           Phase 2: GOAL INTEGRATION
(interactive, can be long)        (interactive)

Inventory every capability        Enrich user's goal with
Map complete lifecycles            analysis findings
Trace dependency chains           Identify conflicts & blind spots
Determine layer ownership          Generate constitution + plan

        ↓                                ↓
    analysis/ artifacts              constitution.md + plan.md

                    ↓
        Phase 3: SINGLE GATE
        (one-time approval via approvals tool)

                    ↓
        Phase 4: AUTONOMOUS LOOP
        (zero-interaction + self-scheduling)

        WHILE acceptance criteria not met:
            Execute next STEP
            Auto-verify
            If fail → diagnose, fix, retry (max 3x)
            ScheduleWakeup(60s) — keeps itself alive
        END
```

### Phase 1: Deep Analysis

**No time limit.** The agent traverses the entire codebase, builds a capability inventory (`CAP-XXX`), maps every capability's lifecycle (creation → activation → mutation → destruction), traces dependency chains, and determines current layer ownership. This phase iterates until the user confirms the analysis is 100% accurate.

### Phase 2: Goal Integration

The user states a brief goal ("change brand from Kortix to Habitat"). Based on Phase 1's deep understanding, the agent **expands** this into a complete plan — which capabilities are affected, what dependency chains are implicated, what conflicts exist, what blind spots the user didn't think of. A constitution file + migration plan with verifiable acceptance criteria is generated.

### Phase 3: Single Gate

One approval for all artifacts. **After this, no more questions.** The plan is locked.

### Phase 4: Autonomous Loop

Executes step by step. Each step is verified. Failures are auto-diagnosed and auto-fixed (3 attempts). After each step, the agent schedules its own continuation via `ScheduleWakeup` — if the session is interrupted, the next session auto-resumes from where it left off.

**The loop does not stop** until every acceptance criterion is met. "Looks about right" is not a stop condition. "Context is almost full" is not a stop condition (schedule wakeup, continue in new session).

## Hard Constraints (Not Suggestions)

| Constraint | Enforcement |
|-----------|------------|
| No code changes before capability inventory is complete | File-system check: `.reskin/analysis/` must exist |
| One capability per change step | Pre-execution check, rejects multi-CAP steps |
| Definition before execution | Step ordering enforced by plan.md structure |
| No feature changes during migration | Diff auditing — any logic change not matching ownership migration is rejected |
| Every step must be verified | Execution log must contain side-effect verification table |
| Every step must be logged | `.reskin/logs/STEP-XXX.md` must exist before next step proceeds |

## Why This Works

1. **Front-loaded understanding**: All the thinking happens before any code changes. When you actually start changing code, you know exactly what depends on what.

2. **Definition vs. Execution separation**: The single most important distinction in any reskin. "Who defines this capability?" and "Who executes it?" are different questions. Most reskins fail because they conflate the two.

3. **Dependency-ordered, not time-ordered**: Migration steps follow the dependency graph, not a calendar. You can't split mixed capabilities before tightening core boundaries. You can't extract extensions before splitting mixed capabilities.

4. **Self-scheduling prevents stranding**: LLM sessions end for many reasons (context window, token limit, timeout). The skill schedules its own continuation, and re-entry detection ensures it picks up where it left off.

5. **Idempotent by design**: Every step can be safely re-executed. If a session dies mid-step, the next session re-runs that step from scratch with no side effects.

## Installation

### npm

```bash
npm install -g claude-reskin
```

### Homebrew

```bash
brew tap tc6-01/tap
brew install claude-reskin
```

### Manual

```bash
git clone https://github.com/tc6-01/claude-reskin.git
mkdir -p ~/.claude/skills/reskin
cp claude-reskin/SKILL.md ~/.claude/skills/reskin/
cp -r claude-reskin/templates ~/.claude/skills/reskin/
```

## Usage

In Claude Code, type:

```
/reskin
```

The skill auto-detects whether this is a new reskin or a resumption of an interrupted session.

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- Node.js >= 18 (for npm installation only)

## When to Use

| Scenario | Use reskin? |
|----------|------------|
| Brand name / logo / theme / copy replacement | Yes |
| Tech stack migration (Node→Go, React→Vue, etc.) | Yes |
| System layering refactor | Yes |
| Multi-product line split from shared codebase | Yes |
| Renaming a single variable | No — pure rename, no ownership change |
| Bug fix | No — unless the bug is caused by ownership confusion |
| New feature | No — not a reskin |

## License

MIT
