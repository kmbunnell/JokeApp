# Architecture Decision Records

Design decisions made as the codebase evolves. Each entry captures context, the decision, and the reasoning — so future contributors (and Claude) don't re-litigate settled choices or lose sight of tradeoffs.

---

## ADR Format

```
### ADR-NNN: <title>
**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded by ADR-NNN | Deferred

**Context:** What problem or constraint prompted this decision?

**Decision:** What was decided?

**Reasoning:** Why this option over the alternatives?

**Consequences:** What does this make easier or harder going forward?
```

---

## Decisions

### ADR-001: Clean architecture layer separation
**Date:** 2026-05-15
**Status:** Accepted

**Context:** First architectural decision for a greenfield React Native app. Needed a structure that scales, keeps business logic testable, and doesn't couple UI to data fetching.

**Decision:** Adopt a four-layer clean architecture: `core` (entities + use-cases + repository interfaces), `data` (concrete repositories + data sources + DTOs), `presentation` (screens + components + hooks + navigation), `infrastructure` (API clients + storage).

**Reasoning:** Clean architecture keeps `core` free of React Native imports, making business logic unit-testable without a device or simulator. The dependency rule (outer layers depend on inner, never the reverse) prevents the tight coupling that makes React Native codebases hard to refactor.

**Consequences:** Slightly more boilerplate for simple features (interface + implementation), but components stay thin and all business logic is independently testable.

---

### ADR-002: Context API + custom hooks for dependency injection
**Date:** 2026-05-15
**Status:** Accepted

**Context:** Clean architecture requires injecting repository implementations into use-cases and hooks without instantiating concrete classes inside components.

**Decision:** Use React Context to provide repository instances at the app root. Custom hooks consume the context — components depend only on the hook, never on the concrete repository.

**Reasoning:** No third-party DI container needed at this scale. Swapping implementations (e.g. real API → mock in tests) is a Provider swap, not a mocking-framework concern. Aligns with idiomatic React patterns.

**Consequences:** Testing components requires wrapping in a Provider with a mock implementation. Worth the tradeoff for the decoupling gained.

---

### ADR-003: Test-Driven Development (TDD) as standard practice
**Date:** 2026-05-15
**Status:** Accepted

**Context:** First React Native project; establishing quality and confidence habits from the start.

**Decision:** All implementation follows Red → Green → Refactor. Tests are written before the code they exercise.

**Reasoning:** TDD surfaces design problems early (hard-to-test code is a design smell), produces a regression suite automatically, and enforces the clean architecture boundary (if a test requires RN imports in `core/`, the design is wrong).

**Consequences:** Slightly slower initial velocity; faster, safer iteration thereafter.
