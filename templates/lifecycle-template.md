# Lifecycle Diagram

> For each capability (referencing CAP-XXX from the capability inventory), describe its complete lifecycle.
> Consequence of skipping lifecycle mapping: changing A's creation logic silently breaks B's activation condition.

## Lifecycle Field Descriptions

| Phase | Meaning |
|-------|---------|
| Creation timing | When is this capability created (user-triggered/system-triggered/dependency-triggered) |
| Activation timing | When does this capability become active |
| Mutation timing | Under what conditions does this capability mutate |
| Destruction timing | Under what conditions is this capability destroyed |
| Trigger | Who triggers each phase (Frontend/API/Execution Layer/User) |
| Side effects | Which other capabilities are affected by each phase (reference capability IDs) |

## Capability Lifecycle

### CAP-XXX: [Capability Name]

| Phase | Trigger Condition | Triggered By | Side Effects (affected capability IDs) |
|-------|-----------------|-------------|---------------------------------------|
| Creation | | | |
| Activation | | | |
| Mutation | | | |
| Destruction | | | |

---

> Repeat the table above for every capability in the capability inventory.
