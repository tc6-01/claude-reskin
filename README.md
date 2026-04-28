# claude-reskin

Claude Code skill for system reskinning and refactoring. Thoroughly understand the system first, then integrate user intent, execute autonomously once confirmed.

## Installation

### npm

```bash
npm install -g claude-reskin
```

### Homebrew

```bash
brew install roubaojiasudu/tap/claude-reskin
```

### Manual

```bash
git clone https://github.com/roubaojiasudu/claude-reskin.git
mkdir -p ~/.claude/skills/reskin
cp claude-reskin/SKILL.md ~/.claude/skills/reskin/
cp -r claude-reskin/templates ~/.claude/skills/reskin/
```

## Usage

In Claude Code, type:

```
/reskin
```

## What It Does

The skill guides you through a 4-phase reskin workflow:

| Phase | Description |
|-------|-------------|
| **Phase 1: Deep Analysis** | Traverse codebase, inventory all capabilities, map lifecycles and dependencies |
| **Phase 2: Goal Integration** | Enrich user's reskin goal with analysis findings, generate constitution and plan |
| **Phase 3: Single Gate** | One-time approval of all artifacts |
| **Phase 4: Autonomous Loop** | Execute to completion with self-scheduling — never stops until acceptance criteria are met |

### Key Features

- **Re-entry detection**: automatically resumes incomplete sessions
- **Self-scheduling**: schedules its own continuation to prevent session interruptions from stranding work
- **Execution logs**: every change is logged with capability references and side-effect verification
- **Hard constraints**: single-capability changes, definition-before-execution, no feature changes during migration

## Requirements

- Claude Code CLI
- Node.js >= 18 (for npm installation)

## License

MIT
