# implement-plan

You are a **senior React Native engineer** implementing a pre-approved engineering plan using **Test-Driven Development (TDD)**. Your code must follow clean architecture, SOLID, and DRY principles exactly as described in `CLAUDE.md`.

---

## Step 0 — Branch check

Run `git branch --show-current`. If the current branch is `develop`, stop immediately and tell the user:

> "You are on the `develop` branch. Implementation should never happen directly on `develop`. Please create a feature branch (`git checkout -b feature/<name>`) and re-run `/implement-plan`."

Do not proceed until the user is on a feature branch.

---

## Step 1 — Read the plan and codebase

Read these files in full before writing a single line of code:
- `plan.md` (the implementation plan — abort with a clear message if this file does not exist)
- `CLAUDE.md` (architecture rules, coding standards)
- `package.json`
- Every file listed under "Directory & File Changes" in the plan (to understand current state)

If `plan.md` does not exist, stop and tell the user to run `/create-plan <criteria>` first.

---

## Step 2 — Validate the plan is still current

Before implementing, do a quick sanity check:
- Do the files the plan says to modify still exist with the expected content?
- Are all required dependencies already in `package.json`? If not, list which ones need to be added and ask the user to confirm before running `npm install`.

Report any discrepancies and ask the user how to proceed before continuing.

---

## Step 3 — Implement using TDD (Red → Green → Refactor)

Work through the plan's **Implementation Steps** in order. For **each step**, follow the TDD cycle strictly:

### Red — Write the failing test first
1. Write the test(s) that describe the expected behaviour for this step.
2. Run `npm test` and confirm the new tests **fail** for the right reason (not due to a syntax error or missing import — the test must execute and assert against behaviour that doesn't exist yet).
3. Report: `🔴 Step N tests written and failing as expected.`

### Green — Write the minimum code to make tests pass
4. Write only the code needed to make the failing tests pass — no extras.
5. Run `npm test` and confirm **all** tests (new and existing) pass.
   - If tests fail, apply the **Test Failure Protocol** (see below) before continuing.
6. Report: `🟢 Step N tests passing.`

### Refactor — Clean up without breaking tests
7. Refactor the new code for clarity, DRY, and adherence to architecture rules (see standards below). Do not change observable behaviour.
8. Run `npm test` again to confirm tests still pass.
   - If tests fail, apply the **Test Failure Protocol** (see below) before continuing.
9. Commit all changes for this step using a conventional commit message (`feat:`, `fix:`, `refactor:`, or `test:` as appropriate). Stage only files changed in this step — do not use `git add -A`.
10. Report: `✅ Step N complete — <one-line summary of what was done>.`

### Test Failure Protocol
If `npm test` fails, attempt to fix it **only if the cause is isolated to files written in the current step**. If the fix would require touching any file outside the current step's scope, stop immediately and report:
- The exact failure message.
- Your diagnosis of the root cause.
- Which files outside this step's scope would need to change, and why.

Then ask the user how to proceed before touching any more code.

All architecture rules, coding standards, and test placement conventions are defined in `CLAUDE.md` (already read in Step 1) — apply them without re-reading here.

---

## Step 4 — Self-review before finishing

After all steps are complete, run the full suite and verify:

- [ ] `npm test` — all tests pass, no skipped tests without a documented reason.
- [ ] `npx tsc --noEmit` — zero TypeScript errors.
- [ ] `npm run lint` — zero ESLint errors or warnings.
- [ ] No business logic leaked into components.
- [ ] No presentation concerns leaked into `core/`.
- [ ] Every regression risk listed in the plan has a corresponding test or explicit mitigation.

Fix any failures before reporting done.

---

## Step 5 — Report completion

Summarise what was implemented as a concise bullet list (one bullet per plan step), including the test count added. Call out any deviation from the plan and why. Do **not** re-explain the code — just state what changed and what is now tested.
