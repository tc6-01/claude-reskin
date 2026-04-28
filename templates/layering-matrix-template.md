# Capability Layering Matrix

> This file describes where each capability currently lives and where it should live.
> Must reference CAP-XXX from the capability inventory.

## Layering Model Definition

| Layer | Responsible For | NOT Responsible For |
|-------|----------------|---------------------|
| Frontend | Page display, user interaction, triggering actions, displaying aggregated state | Understanding execution layer semantics, making policy decisions, bearing business definition logic |
| API Control Plane | Account/permission/role, resource CRUD, config definition, state aggregation, scheduling/audit/policy | Local execution, agent execution |
| Execution Layer | Local runtime capabilities, files, port proxy, env materialization, service management | Platform resource definition, permission model, global scheduling |
| Extension Layer | Product extensions, integration connectors | Core runtime |

## Capability Layering Matrix

| Capability ID | Capability Name | Current Def. Owner | Current Exec. Owner | Target Def. Owner | Target Exec. Owner | Migration Priority | Notes |
|--------------|-----------------|-------------------|--------------------|--------------------|--------------------|-------------------|-------|
| CAP-001 | | | | | | | |

## Mixed Capability Identification

The following capabilities are currently defined by multiple layers simultaneously and must be split:

| Capability ID | Capability Name | Mixing Problem Description | Split Plan |
|--------------|-----------------|---------------------------|------------|
| | | | |

## Layering Confirmation

- [ ] Layering model confirmed
- [ ] Target ownership for each capability confirmed
- [ ] Mixed capability split plans confirmed

Confirmed by:
Confirmed on:
