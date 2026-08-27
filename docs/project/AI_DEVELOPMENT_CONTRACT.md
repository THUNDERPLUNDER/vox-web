# Viddel AI Development Contract v0.1

**Status:** Canonical execution standard  
**Scope:** Non-trivial product, UI, interaction, frontend and system changes performed with AI-assisted development.  
**Canonical source:** This file.

## Purpose

Ensure that AI-assisted development produces the right product behavior, not only valid code.

## Core principle

**Understand before designing. Design before coding. Verify behavior before declaring done.**

The implementation agent is not the product decision-maker.

---

## 1. Understand the user's situation

Before proposing implementation, establish:

- Who is the user in this situation?
- What are they trying to accomplish?
- What is the relevant context before, during and after the interaction?
- What existing product intent or user insight constrains the solution?

### MUST

- State the user goal in plain language.
- Read relevant existing product/context documentation.

### MUST NOT

- Infer the desired interaction solely from the technical task.
- Treat implementation convenience as product intent.

---

## 2. Describe the desired interaction and edge cases

Describe what should actually happen from the user's perspective.

Include relevant:

- entry state
- primary interaction
- feedback/state changes
- completion state
- errors
- missing or uncertain data
- interruption/retry
- important accessibility or device considerations

### MUST

- Make consequential interaction choices visible before implementation.

### SHOULD

- Preserve the user's context and minimize unnecessary interruption and friction.

### MUST NOT

- Introduce modals, navigation changes, new interaction patterns or other consequential UX decisions simply because they are technically convenient.

---

## 3. Map the existing architecture

Before changing code, inspect how the relevant system works today.

Identify where relevant:

- existing components and patterns
- data flow
- state management
- routes/API boundaries
- design-system patterns
- dependencies
- guards and constraints
- production/runtime behavior

### MUST

- Read the relevant existing code and project documentation.
- Reuse established patterns where appropriate.
- Distinguish verified facts from assumptions.

### MUST NOT

- Assume architecture, stack, data flow or production behavior from memory.
- Introduce a new dependency, pattern or architectural direction without making the decision explicit.

---

## 4. Propose the smallest good solution

Before implementation, state:

- what should change
- what should remain unchanged
- why this is the smallest solution that satisfies the user/product need
- relevant risks or trade-offs
- what is deliberately deferred

### MUST

- Stay within agreed scope.
- Surface product or architectural decisions that require human ownership.

### SHOULD

- Prefer small, reversible and reviewable changes.

### MUST NOT

- Expand scope automatically.
- Combine unrelated cleanup or refactoring with the requested change unless necessary.

---

## 5. Implement

Implement the agreed solution.

### MUST

- Follow existing repository and design-system conventions.
- Keep the change reviewable.
- Preserve unrelated working behavior.
- Run relevant automated checks.

### MUST NOT

- Quietly reinterpret the agreed interaction during implementation.
- Make irreversible product or architectural decisions without surfacing them.

If implementation reveals that the agreed solution is wrong or incomplete, return to the relevant earlier step rather than improvising a new product decision.

---

## 6. Verify actual behavior

Passing build/tests is necessary where relevant, but is not sufficient for user-facing work.

### MUST

- Verify the actual affected user flow in a browser when the change has a browser-visible or interactive effect and browser access is available.
- Check the main path and relevant edge cases.
- State what was actually verified and where.

### MUST NOT

- Claim that a feature works in Preview or Production without checking the exact deployed surface.
- Equate successful compilation with successful product behavior.

---

## Decision rule

At every stage ask:

> **Is this an implementation decision, or am I making a product/architecture decision on behalf of the owner?**

If it is consequential and not already decided:

> **Surface it before proceeding.**

---

## Development Brief

For non-trivial issue-driven work, use this compact format when it helps make the contract explicit without creating unnecessary process overhead:

### USER
What is the user trying to do, and in what situation?

### BEHAVIOR
What should actually happen from the user's perspective? What are the important edge cases?

### CURRENT SYSTEM
How does the relevant product/system work today? What is verified, and what is assumed?

### PROPOSED CHANGE
What is the smallest good solution? What remains unchanged? What is deliberately deferred?

### VERIFY
How will we know that the actual behavior works where it runs?

The Development Brief is an operational format, not a second source of truth. It instantiates this contract for a specific task.

---

## Definition of done

A non-trivial AI-assisted development task is done when:

1. User situation is understood.
2. Intended behavior and important edge cases are explicit.
3. Existing architecture has been inspected.
4. The smallest good solution has been agreed.
5. The solution is implemented within scope.
6. Actual behavior has been verified where it runs.

**Code complete ≠ product complete.**

---

## Relationship to other repo rules

This contract defines the product-to-implementation sequence for AI-assisted development.

It complements, and does not replace:

- `AGENTS.md` — agent entrypoint and minimum workflow
- `docs/project/OPERATING_RULES.md` — repository operating rules and source-of-truth map
- `/designsystem/` — canonical design patterns
- `/backstage/` — canonical system reference for AI/API/guards/env/production
- `src/data/mvp-current-state.ts` — current operational MVP status
- GitHub issues/PRs — task bus and implementation history

If another operational instruction conflicts with this contract, surface the conflict instead of silently choosing one.
