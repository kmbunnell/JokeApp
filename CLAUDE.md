# JokeApp — Claude Code Guide

## Project Overview

JokeApp is a learning app that tells jokes.

React Native 0.85.3 app (TypeScript) bootstrapped with the React Native CLI. Currently at the initial scaffold stage — the default `NewAppScreen` is the only rendered content.

**Tech stack:**
- React Native 0.85.3 / React 19
- TypeScript 5.8
- React Navigation 7 (native stack)
- react-native-safe-area-context 5
- react-native-screens 4
- Jest + React Test Renderer

---

## Architecture

All new source code lives under `src/`. Never add business logic directly to `App.tsx` or `index.js`.

### Layer rules
- `core/` has **zero** React or React Native imports — it is pure business logic.
- `data/` depends only on `core/` interfaces, not on `presentation/`.
- `presentation/` depends on `core/usecases` and `core/entities` only (not on `data/` directly).
- Dependency injection: pass repository implementations into use-cases via constructor or hook argument; never instantiate concrete classes inside components.

---

## Coding Standards

### General
- **TypeScript strict mode** — no `any`, no non-null assertions without a comment explaining why.
- Follow **SOLID** and **DRY**: extract shared logic into hooks or utilities before copy-pasting.
- Components are **pure and presentational** where possible; side effects live in hooks.
- Prefer **named exports** for components and functions; use default export only at screen level (required by React Navigation).
- No `console.log` left in committed code — use a logger utility if tracing is needed.

### Components
- Props interfaces named `<ComponentName>Props`.
- Styles shared across screens live in `src/presentation/styles/screenStyles.ts`; screen-specific styles are co-located in a `styles.ts` beside the component.
- Images: use `useWindowDimensions()` to compute dimensions (e.g. `width * 0.65`) — never hardcode pixel sizes.
- All user-visible string literals defined in a co-located `strings.ts` (`as const` object) — never inline text in JSX.
- Use `useCallback` and `useMemo` only when there is a measurable perf reason — don't pre-optimise.

### Hooks
- **No render-body initialization.** Never construct objects or run side effects directly in the hook/component render body. Use `useState(() => ...)` (lazy initializer) for one-time object construction; use `useEffect` for side effects. Render-body mutations are fragile under React Strict Mode (double-invoke) and concurrent features.
- **Screen focus effects:** Use `useFocusEffect` (not `useIsFocused() + useEffect`) for side effects that should re-run each time a screen gains focus. `useIsFocused + useEffect` causes an extra render pass; `useFocusEffect` is the React Navigation–recommended pattern.

### Navigation
- All route names defined as a typed `RootStackParamList` (or per-navigator param list) in `src/presentation/navigation/types.ts`.
- Use `useNavigation<NativeStackNavigationProp<RootStackParamList>>()` — never cast `navigation` to `any`.

### Testing
- Unit tests co-located: `__tests__/` folder beside the module being tested.
- Integration / screen tests use React Test Renderer + `@testing-library/react-native` (add it when writing the first screen test).
- Mock at the boundary (data source / API layer), never deep inside the domain.
- **Only test meaningful logic and behaviour** — do not write tests for pure data classes, DTOs, or entity mappers that contain no logic beyond field assignment. Tests should assert non-trivial decisions, not that a constructor copies a value.

### Commits
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`.

---

## Available Skills

| Skill | Purpose |
|---|---|
| `/create-plan <criteria>` | Analyse current code and produce an engineering plan for new work — no code changes |
| `/implement-plan` | Read `plan.md` and implement the planned work following clean architecture |

Both skills operate as a senior React Native engineer. See `.claude/commands/` for their full prompts.

---

## Running the App

```bash
# Install dependencies
npm install

# iOS (requires Xcode + CocoaPods)
cd ios && pod install && cd ..
npm run ios

# Android (requires Android Studio + emulator)
npm run android

# Tests
npm test

# Lint
npm run lint
```

---

## Best Practice Reviews

`/create-plan` runs a best-practice review before producing the plan. Protocol:

Compare the proposed approach against current React Native best practices (RN 0.73+, React 19, community conventions). For any gap where a best practice contradicts or is absent from this file, record it in the plan's **Open Questions / Assumptions** section in this format:

> **Best Practice Note:** `<topic>` — current stance: `<what CLAUDE.md says, or "not addressed">` — recommendation: `<what the community recommends and why>`

Do **not** block or ask for decisions before producing the plan. The user reviews these notes when approving the plan. If they approve any updates, apply them to `CLAUDE.md` and log each accepted change in `DECISIONS.md`. If there are no gaps, omit the section.

---

## Key Files

| Path | Role |
|---|---|
| `App.tsx` | Root component — providers and navigation container only; no business logic |
| `index.js` | Entry point — registers `App` |
| `plan.md` | Generated by `/create-plan`; gitignored |
