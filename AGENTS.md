# Vibe Coders Starter Kit - Agent Guidelines

See @.cursor/rules/convex_rules.mdc for Convex guidelines.

## Build & Test Commands

```bash
# Type checking
npx tsc --noEmit

# Convex type checking
npx convex dev --once --typecheck=enable 2>&1 | tail -20

# Development server
npm run dev

# Linting
npm run lint

# Build
npm run build

# Testing (after Vitest setup)
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
```

## Security Architecture

Security is implemented through specialized skills at `.agents/skills/security/`:

### Implementation Skills (how to build securely)

- **security-overview**: High-level defense-in-depth architecture and skill directory
- **csrf-protection**: CSRF protection implementation
- **rate-limiting**: Rate limiting implementation
- **input-validation**: Input validation and XSS prevention
- **ai-chat-protection**: AI chatbot protection and prompt injection prevention
- **security-headers**: Security headers configuration
- **error-handling**: Secure error handling
- **auth-security**: Clerk authentication and authorization
- **payment-security**: Clerk Billing and Stripe payment security
- **dependency-security**: Dependency and supply chain security
- **security-testing**: Testing security features

### Awareness Skills (understanding AI code vulnerabilities)

- **security-awareness/awareness-overview**: Vibe coding security risks overview
- **security-awareness/injection-vulnerabilities**: SQL injection, command injection, XSS in AI code
- **security-awareness/auth-vulnerabilities**: Insecure passwords, broken sessions, access control
- **security-awareness/information-leakage**: Hardcoded secrets, verbose logging
- **security-awareness/supply-chain-risks**: Vulnerable dependencies, typosquatting
- **security-awareness/business-logic-flaws**: Race conditions, integer overflow
- **security-awareness/resource-exhaustion**: Unbounded operations, DoS, cost explosion

## Project Management (GSD)

Project planning and execution uses the **Get Shit Done (GSD)** system.

### Quick Start: The `/work` Command

**Use `/work` as your single entry point.** It handles everything:

```
┌─────────────────────────────────────────────────────────────┐
│                        /work                                │
├─────────────────────────────────────────────────────────────┤
│  1. LEARN    - Auto-check lessons + Librarian research      │
│  2. REVIEW   - Oracle reviews plan before execution         │
│  3. DO       - Route to GSD (Oracle debugs, Librarian helps)│
│  4. CAPTURE  - Oracle synthesizes retrospective insights    │
└─────────────────────────────────────────────────────────────┘
```

That's it. Just say `/work` and the system handles the rest.

**Intelligent Tool Usage:**
- **Oracle** (GPT-5): Reviews plans, debugs failures, synthesizes learnings
- **Librarian**: Researches OSS patterns, finds implementation examples

### All Commands (for manual control)

| Command | Purpose |
|---------|---------|
| `/work` | **Unified workflow with TDD (recommended)** |
| `/gsd` | Check status and route to next action |
| `/new-project` | Initialize new project with deep questioning |
| `/roadmap` | Create phases from requirements |
| `/plan` | Create PLAN.md for next phase |
| `/execute` | Run current plan with TDD + atomic commits |
| `/progress` | Show status and next steps |

**Note:** All feature work uses TDD (Red-Green-Refactor) by default. See `.agents/skills/tdd/SKILL.md` for test patterns.

### Key Principles

1. **Plans ARE Prompts**: Plans are directly executable, not transformed
2. **Aggressive Atomicity**: 2-3 tasks per plan maximum
3. **Context Window Awareness**: Quality degrades at 50%+ usage
4. **Atomic Commits**: One commit per task (MANDATORY - see below)
5. **State Is Sacred**: STATE.md tracks all decisions and progress

### Atomic Commits (Non-Negotiable)

**Every task MUST end with a git commit before moving to the next task.**

```
Task → Execute → Verify → git add -A → git commit → Next Task
```

- Commit message comes from the task's `<done>` section
- Use conventional commit format: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- Never batch multiple tasks into one commit
- Never skip commits between tasks

### Configuration

Stored in `.planning/config.json`:
- **Mode**: `interactive` (asks questions) or `yolo` (minimal interruption)
- **Depth**: `quick`, `standard`, or `comprehensive`

### Supporting Skills

Detailed templates and references at `.agents/skills/gsd/`:
- `work/` - Unified workflow (lessons + GSD + retrospective)
- `templates/` - PROJECT.md, ROADMAP.md, PLAN.md, STATE.md, SUMMARY.md
- `references/` - principles.md, questioning.md, plan-format.md, git-integration.md

## Dynamic Lessons Library

Lessons are automatically searched by `/work` and captured when phases complete.

- **Location**: `.agents/skills/lessons/*/SKILL.md`
- **Auto-searched**: When you run `/work`, relevant lessons are found and applied
- **Auto-prompted**: When a phase completes, you're prompted to capture learnings

### Manual Commands (if needed)

| Command | Purpose |
|---------|---------|
| `/advise` | Manually search lessons |
| `/retrospective` | Manually capture learnings |

> Note: Lessons folder may be empty initially and grows over time. Each lesson makes future work faster.
