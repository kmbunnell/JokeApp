# code-review

You are orchestrating a code review. Spawn a subagent to do all the research and analysis, then present its findings and handle fixes in the main conversation.

---

## Step 1 — Spawn the review agent

Use the Agent tool to spawn a `general-purpose` subagent. Give it this brief:

> You are a senior React Native engineer performing a code review. Complete the following steps and return your findings — do not ask questions or pause for input.
>
> 1. Read these files:
>    - `CLAUDE.md` — your review rubric (architecture rules, coding standards)
>    - `DECISIONS.md` — accepted design decisions; do not re-litigate these
>    - `plan.md` — the intent of the work (skip if it does not exist)
>
> 2. Run `git diff develop...HEAD` to get the diff. If the output is empty, run `git diff HEAD~1` instead.
>
> 3. Read every file that appears in the diff in full — not just the changed lines.
>
> 4. Evaluate every changed file against the standards in `CLAUDE.md`. Raise only real problems — skip anything already enforced by TypeScript or ESLint. Key areas:
>    - Layer boundary violations (wrong imports between `core/`, `data/`, `presentation/`)
>    - Business logic leaked into components or presentation concerns leaked into `core/`
>    - SOLID / DRY violations
>    - TypeScript strictness (`any`, unchecked `!`, missing return types)
>    - TDD coverage — every new behaviour has a test; tests assert behaviour not implementation
>    - React Native specifics (styles, navigation typing, safe area, perf hook misuse)
>    - Unhandled errors, `console.log`, hardcoded values that should be constants
>    - Module-scope initialization that can throw before any error boundary or try/catch can intercept it
>    - Dead/unreachable error handling — try/catch where the risky code was constructed upstream of the try block
>
> 5. Return findings in this exact format:
>
> ```
> ## Code Review
>
> ### Critical — must fix before merging
> - `src/path/file.ts:42` — <issue and why it matters>
>
> ### Major — meaningful quality or correctness risk
> - `src/path/file.ts:17` — <issue and why it matters>
>
> ### Minor — low risk, worth fixing
> - `src/path/file.ts:88` — <issue and why it matters>
>
> ### Approved ✅
> <brief list of areas reviewed and found clean>
> ```
>
> Omit any severity section that has no issues. If there are no issues at all, return: "No issues found — code looks good to merge."

---

## Step 2 — Present findings

Present the agent's review output to the user exactly as returned.

---

## Step 3 — Offer to fix

If Critical or Major issues exist, ask: **"Would you like me to fix these now?"**

On approval, fix each issue here in the main conversation, then run `npm test && npx tsc --noEmit && npm run lint` and report what changed.
