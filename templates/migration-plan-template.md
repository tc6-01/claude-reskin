# Migration Roadmap

> Migration order is **dependency order**, not chronological order.
> Rule: Without unified principles → changes become chaotic as you go.
> Without tightening boundaries first → mixed capabilities can't be split.
> Without splitting mixed capabilities first → extensions can't be extracted.

## Phase Definitions

### Phase 1: Unify Judgment Standards

- Goal: Every capability has a clear definition owner and execution owner
- Capabilities involved:
- Completion criteria:
- Verification method:

### Phase 2: Tighten Core Boundaries

- Goal: Frontend no longer understands execution layer semantics, API is the only entry point, execution layer only exposes contracts
- Capabilities involved:
- Completion criteria:
- Verification method:

### Phase 3: Split Mixed Capabilities

- Goal: All mixed capabilities split into control plane + executor
- Capabilities involved:
- Completion criteria:
- Verification method:

### Phase 4: Extract Extensions

- Goal: Product extensions extracted from core execution layer
- Capabilities involved:
- Completion criteria:
- Verification method:

### Phase 5: Trim Optional Add-ons

- Goal: Optional local enhancement capabilities explicitly tagged, excluded from core health checks
- Capabilities involved:
- Completion criteria:
- Verification method:

## Dependency Graph

```
[Phase 1] → [Phase 2] → [Phase 3] → [Phase 4] → [Phase 5]
```

## Migration Plan Confirmation

- [ ] Migration order confirmed
- [ ] Completion criteria for each phase are clear and verifiable
- [ ] No missing dependencies

Confirmed by:
Confirmed on:
