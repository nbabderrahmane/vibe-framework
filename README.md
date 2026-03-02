# 🎸 Vibe Framework

**Industrialized vibecoding. Ship solo, ship safe.**

Vibe Framework turns chaotic AI-assisted coding into a structured, traceable, production-ready workflow. Built for solo vibecoders who ship real products with AI IDEs (Cursor, Windsurf, Antigravity, Claude Code).

```bash
npx normy-vibe init
```

---

## Why Vibe Framework?

Vibecoding is powerful. But without structure, you get:
- **Context amnesia** — the AI forgets what it built 3 messages ago
- **Silent quality decay** — no one catches the bugs until production
- **Untraceable decisions** — no one knows why the code is the way it is
- **Hallucinated code** — the AI invents APIs, paths, and behaviors

Vibe Framework fixes this with **gates**, **agents**, **session logging**, and **context management**.

---

## What You Get

### 🎯 Orchestrator (Your AI Team Lead)
One agent to rule them all. The Orchestrator auto-detects your project state, guides you to the right next step, and enforces quality gates. You never have to think about "what do I do next" — it tells you.

### 🚦 Quality Gates
Every step has a PASS/FAIL gate. If FAIL → you go back. No skipping.

### 🤖 15 Specialized Agents
Each agent is a focused prompt with clear inputs, outputs, and session logging.

### 📋 Session Traceability
Every agent writes what it did, what it decided, and what it assumed. A new dev reads `SESSION_LOG.md` and understands everything.

### 🧠 Context Management Protocol
Rules tiering, context budgets, session boundaries, and snapshots. Your AI never loses the plot.

### 🔒 Security-First Rules
10 non-negotiable rules (`rules_essential.md`) loaded on every single AI response. No exceptions.

### 🔌 IDE Auto-Configuration
The installer auto-detects your AI IDE and installs the Orchestrator rules. Open your project → the AI already knows the framework.

---

## Quick Start

### 1. Install

```bash
npx normy-vibe init
```

The installer will:
- Create all directories (vault, planning, implementation)
- Install 15 agent prompts
- Install rules and skills files
- Set up your system vault with templates
- **Auto-configure your AI IDE** (Cursor, Windsurf, Claude Code, Antigravity)

### 2. Open your AI IDE

Open your project in Cursor, Windsurf, Claude Code, or any AI IDE. The Orchestrator is already loaded via the IDE config files.

### 3. Start building

Just chat with your AI. The Orchestrator will:
- Detect that the project is freshly initialized
- Guide you to start with `/brainstorm`
- Walk you through every step with quality gates

Or type `/help` to see all available commands.

### Other CLI commands

```bash
# Minimal install (rules + vault only, no agents)
npx normy-vibe init --minimal

# Check project health
npx normy-vibe doctor

# Show framework status
npx normy-vibe status
```

---

## The Flow

### Standard (New Feature)

```
1.  Research (Perplexity/web)
2.  Brainstorm Agent → BLUEPRINT.md
3a. Committee → PRD.md + SFD.md                    [GATE]
3b. Committee → DATA_MODEL.md + STATE_MACHINES.md   [GATE]
3c. Committee → AC_PACK.md + MASTER_PROMPT.md        [GATE]
4.  Dev Agent → Code + Tests                         [GATE]
5.  Reviewer + Librarian → REVIEW_REPORT.md          [GATE]
5.5 Audit Agent → audit_out/ (13 dimensions)         [GATE]
6.  QA Agent → QA_REPORT.md                          [GATE]
6.5 Product Reviewer → product_audit_out/            [GATE]
7.  Release Agent → RELEASE_NOTES.md                 [GATE]
7.5 Training Agent → training_out/
8.  RCA / Learning → LEARNING_LOG.md                 [GATE]
```

### Hotfix (Critical Bug in Prod)

```
H1. Bug Report → Triage (P0/P1/P2)
H2. Dev Agent (fix only, minimal scope)
H3. Review (fast-track, diff only)
H4. QA (fix + regression)
H5. Release (deploy + smoke test)
H6. RCA obligatoire (within 24h)
```

---

## Commands

Type these in your AI IDE chat. The Orchestrator handles routing.

| Command | Step | What It Does |
|---------|------|-------------|
| `/help` | — | Show project status + all commands |
| `/brainstorm` | 2 | Structure your idea into a viable Blueprint |
| `/prd` | 3a | Produce PRD + System Functional Design |
| `/datamodel` | 3b | Data Model + State Machines |
| `/acpack` | 3c | Acceptance Criteria + Master Prompt |
| `/dev` | 4 | Implement code per AC Pack |
| `/review` | 5 | Code review + doc audit |
| `/audit` | 5.5 | Full-stack audit (13 dimensions, dual scoring) |
| `/qa` | 6 | QA testing with declared execution mode |
| `/product` | 6.5 | Product alignment check |
| `/release` | 7 | Release preparation + execution |
| `/training` | 7.5 | User documentation |
| `/rca` | 8 | Root cause analysis + framework learning |
| `/snapshot` | Any | Context snapshot for session continuity |
| `/hotfix` | Any | Fast-track bug fix flow |
| `/db_migrate` | Any | Safe database migration |
| `/deps` | Any | Dependency audit |
| `/status` | Any | Full project status |
| `/onboard` | Any | Generate summary for new person |

---

## Context Management (The Killer Feature)

The #1 problem in vibecoding is **context window overflow**. Vibe Framework solves this with:

### Rules Tiering
| File | Tokens | When Loaded |
|------|--------|------------|
| `rules_essential.md` | ~2K | **EVERY response** |
| `CODE_INVENTORY.md` | ~2-5K | **Every session start** |
| `CONTEXT_SNAPSHOT.md` | ~1K | **Every session start** |
| `rules_full.md` | ~15K | Only for architectural questions |
| `skills.md` | ~20K | Only relevant sections |
| `rules_uiux.md` | ~5K | Only when UI touched |

### Session Boundaries
- One session = one scope (1 feature, 1 bug, 1 refactor)
- Max 10-12 messages before mandatory snapshot
- Debug > 5 messages without resolution → STOP → snapshot → new chat

### Context Budget
Every agent estimates token usage before starting. If > 70% of context window → STOP, propose splitting. Quality degrades silently past this threshold.

---

## Agents

| # | Agent | Step | Trigger |
|---|-------|------|---------|
| 00 | **Orchestrator** | All | Auto-loaded by IDE |
| 01 | Brainstorm | 2 | `/brainstorm` |
| 02 | Vibecoding Committee | 3a/3b/3c | `/prd`, `/datamodel`, `/acpack` |
| 03 | Dev Agent | 4 | `/dev` |
| 04 | Reviewer + Librarian | 5 | `/review` |
| 05 | Audit Agent | 5.5 | `/audit` |
| 06 | QA Agent | 6 | `/qa` |
| 07 | Product Reviewer | 6.5 | `/product` |
| 08 | Release + Ops | 7 | `/release` |
| 09 | RCA / Learning | 8 | `/rca` |
| 10 | UI/UX Agent | Any | `/ux` |
| 11 | User Training | 7.5 | `/training` |
| 12 | DB Migration | Any | `/db_migrate` |
| 13 | Dependency Agent | Any | `/deps` |
| 14 | Context Manager | Any | `/snapshot` |

Every agent:
- Reads `rules_essential.md` before every response
- Writes to `SESSION_LOG.md` at end of session
- Respects context budget protocol
- Has a clear PASS/FAIL gate

---

## IDE Support

The installer auto-detects and configures:

| IDE | Config File |
|-----|------------|
| **Cursor** | `.cursor/rules/vibe-orchestrator.mdc` |
| **Claude Code** | `CLAUDE.md` |
| **Windsurf** | `.windsurf/rules/vibe-orchestrator.md` |
| **Antigravity** | `.antigravity/vibe-orchestrator.md` |

If no IDE is detected, all configs are created so you're covered regardless of which IDE you use.

You can also manually paste `KICKSTART.md` into any AI chat to activate the Orchestrator.

---

## Project Structure

```
your-project/
├── rules_essential.md          # 10 P0 rules (< 2K tokens) — always loaded
├── rules_full.md               # Complete rulebook by domain
├── skills.md                   # Coding patterns & conventions
├── rules_uiux.md               # UI/UX rules
├── skills_uiux.md              # UI/UX patterns & design system
├── KICKSTART.md                # Manual Orchestrator activation
├── .vibe/
│   ├── config.yaml             # Framework configuration
│   └── agents/                 # 15 agent prompts
│       ├── 00-orchestrator.md  # ← The entry point
│       ├── 01-brainstorm.md
│       └── ...
├── .cursor/rules/              # Auto-generated Cursor config
├── system_vault/
│   ├── LOGS.md                 # Structured changelog
│   ├── ARCHITECTURE.md         # Architecture decisions
│   ├── CODE_INVENTORY.md       # Codebase map + patterns
│   ├── RUNBOOK.md              # How to run/deploy/rollback
│   ├── SESSION_LOG.md          # Agent session logs (traceability)
│   └── CONTEXT_SNAPSHOT.md     # Context for session resume
├── planning_artifacts/         # Planning docs (PRD, AC Pack...)
├── implementation_artifacts/   # Implementation docs
├── audit_out/                  # Audit agent outputs
├── ux_out/                     # UI/UX agent outputs
└── training_out/               # Training agent outputs
```

---

## Definition of Done (Global)

A feature is DONE when:
- [ ] AC Pack P0 covered + tested
- [ ] Review PASS
- [ ] QA PASS (execution mode declared)
- [ ] Audit score SME ≥ 7 (if triggered)
- [ ] System vault up to date
- [ ] SESSION_LOG up to date
- [ ] CONTEXT_SNAPSHOT up to date
- [ ] Vibecoder confirms: **"DONE"**

---

## Contributing

1. Fork the repo
2. Create a branch (`feature/my-improvement`)
3. Make your changes
4. Submit a PR

We welcome:
- New agent prompts
- Stack-specific rules (Vue, Django, Rails, etc.)
- IDE integration scripts
- Bug reports and suggestions

---

## License

MIT — Use it, fork it, improve it. Just don't ship garbage to production. 🎸

---

## Credits

Built by vibecoders, for vibecoders. Inspired by [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) and hard lessons learned shipping AI-built products to real users.
