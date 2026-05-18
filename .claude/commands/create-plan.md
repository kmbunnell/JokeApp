# create-plan

You are a senior React Native engineer orchestrating the creation of an engineering plan. The workflow has two phases: an interactive phase (here in the main conversation) and a planning phase (delegated to a subagent).

## Work Requested

$ARGUMENTS

---

## Phase 1 — Clarifying questions (main conversation)

Ask only the ambiguities that would materially change the plan design — skip anything inferable from the codebase or that has an obvious default. Ask as a single numbered list (aim for 3–5 questions).

Typical high-value questions (use only those that apply):
- Data source: hardcoded, local JSON, or real API? If API: base URL and auth?
- New screens introduced? If yes: where do they fit in the nav tree?
- State scope: local component state sufficient, or shared state needed?
- Error/loading UX: what should the UI show?
- Platform or device constraints?

Wait for the user's answers before proceeding to Phase 2.

---

## Phase 2 — Spawn the planning agent

Once you have the user's answers, use the Agent tool to spawn a `general-purpose` subagent. Give it this brief — substituting `<FEATURE REQUEST>` and `<ANSWERS>` with the actual content:

> You are a senior React Native engineer. Your job is to produce a thorough engineering plan — do not write or change any code.
>
> **Feature requested:** `<FEATURE REQUEST>`
>
> **Clarifications from the user:** `<ANSWERS>`
>
> **Your tasks:**
>
> 1. Read these files in full:
>    - `CLAUDE.md` (architecture rules, coding standards, best-practice review protocol)
>    - `package.json`
>    - `App.tsx`, `index.js`
>    - Everything under `src/` (if it exists)
>    - `tsconfig.json`, `.eslintrc.js`
>    - Any existing `__tests__/` files
>
> 2. Apply the best-practice review protocol from `CLAUDE.md`. Record any gaps as notes in the plan's Open Questions section — do not block on them.
>
> 3. Produce a plan in this exact format:
>
> ```
> # Plan: <short title>
>
> ## Summary
> One paragraph describing what this work achieves and why.
>
> ## Architecture Decisions
> - How the work fits into the clean-architecture layers (core / data / presentation / infrastructure)
> - Any new patterns or abstractions being introduced and why
> - For each new object construction: where it runs (module scope, lazy initializer, effect), who owns it, and what happens if it throws
>
> ## Directory & File Changes
> List every file to be created or modified:
> - CREATE src/...
> - MODIFY src/...
> - DELETE src/... (only if clearly safe)
>
> ## Implementation Steps
> Numbered, ordered list of concrete steps. Each step must be small enough to be a single commit and touch no more than 3 files. Split any larger step.
>
> ## Regression Risks
> - Risk: <description> → Mitigation: <how to test/guard>
>
> ## Test Plan
> What tests need to be written or updated, and what they should assert.
>
> ## Open Questions / Assumptions
> Remaining assumptions, deferred decisions, and any best-practice notes from CLAUDE.md review.
> ```
>
> Return the completed plan and nothing else.

---

## Phase 3 — Present and approve (main conversation)

Present the agent's plan to the user. Ask: **"Does this plan look good, or would you like changes before I write it to `plan.md`?"**

Wait for explicit approval before proceeding.

---

## Phase 4 — Write plan.md

Write the approved plan verbatim to `plan.md` in the project root. Confirm to the user that the file has been written and that they can now run `/implement-plan` to execute it.
