#!/usr/bin/env node

/**
 * Vibe Framework CLI
 * Install and manage the vibecoding framework in any project.
 *
 * Usage:
 *   npx vibe-framework init          # Full install (rules + agents + vault + templates)
 *   npx vibe-framework init --minimal # Rules + vault only (no agents)
 *   npx vibe-framework doctor         # Check project health
 *   npx vibe-framework status         # Show framework status
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ─── Config ────────────────────────────────────────────────────────────────────
const FRAMEWORK_ROOT = path.resolve(__dirname, "..");
const PROJECT_ROOT = process.cwd();

const DIRECTORIES = {
  vault: "system_vault",
  docs: "docs",
  planning: "planning_artifacts",
  implementation: "implementation_artifacts",
  agents: ".vibe/agents",
  config: ".vibe",
  auditOut: "audit_out",
  productAuditOut: "product_audit_out",
  uxOut: "ux_out",
  trainingOut: "training_out",
};

const VAULT_FILES = [
  "LOGS.md",
  "ARCHITECTURE.md",
  "CODE_INVENTORY.md",
  "RUNBOOK.md",
  "SESSION_LOG.md",
  "CONTEXT_SNAPSHOT.md",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function log(msg) {
  console.log(`  ${msg}`);
}
function success(msg) {
  console.log(`  ✅ ${msg}`);
}
function info(msg) {
  console.log(`  ℹ️  ${msg}`);
}
function warn(msg) {
  console.log(`  ⚠️  ${msg}`);
}
function header(msg) {
  console.log(`\n  ━━━ ${msg} ━━━\n`);
}

function copyFileSync(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function ensureDir(dirPath) {
  const full = path.join(PROJECT_ROOT, dirPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
    return true;
  }
  return false;
}

function fileExists(filePath) {
  return fs.existsSync(path.join(PROJECT_ROOT, filePath));
}

function writeIfNotExists(filePath, content) {
  const full = path.join(PROJECT_ROOT, filePath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(full)) {
    fs.writeFileSync(full, content, "utf-8");
    return true;
  }
  return false;
}

function copyFromFramework(srcRelative, destRelative) {
  const src = path.join(FRAMEWORK_ROOT, srcRelative);
  const dest = path.join(PROJECT_ROOT, destRelative);
  if (!fs.existsSync(src)) {
    warn(`Source not found: ${srcRelative}`);
    return false;
  }
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.statSync(src).isDirectory()) {
    copyDirSync(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
  return true;
}

async function ask(question, defaultVal) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    const prompt = defaultVal ? `${question} (${defaultVal}): ` : `${question}: `;
    rl.question(`  ${prompt}`, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultVal || "");
    });
  });
}

// ─── IDE Rule Generator ────────────────────────────────────────────────────────
function generateIDERule(projectName) {
  return `# Vibe Framework Orchestrator — Auto-loaded by AI IDE
# Project: ${projectName}
# Generated: ${new Date().toISOString().split("T")[0]}
# Docs: https://github.com/nbabderrahmane/vibe-framework

You are the Vibe Orchestrator for "${projectName}". You guide the developer through a structured vibecoding workflow with quality gates, session logging, and context management.

## ON EVERY CONVERSATION START
1. Read these files BEFORE your first response:
   - \`rules_essential.md\` (10 non-negotiable rules — MANDATORY)
   - \`system_vault/CODE_INVENTORY.md\` (know the codebase)
   - \`system_vault/CONTEXT_SNAPSHOT.md\` (resume from last session)
   - \`system_vault/SESSION_LOG.md\` (last 3 entries)
2. Detect project state by checking which files exist in \`planning_artifacts/\`
3. Tell the user where the project stands and what the next step is

## STATE DETECTION
| Files Present | State | Next Step |
|---|---|---|
| No rules_essential.md | Not initialized | Tell user: npx normy-vibe init |
| rules_essential.md only | Ready to start | /brainstorm |
| BLUEPRINT.md | Brainstorm done | /prd |
| PRD.md + SFD.md | Step 3a done | /datamodel |
| DATA_MODEL.md + STATE_MACHINES.md | Step 3b done | /acpack |
| AC_PACK.md + MASTER_PROMPT.md | Step 3c done | /dev |
| Code changes exist | Dev in progress | Continue /dev or /review |
| REVIEW_REPORT.md PASS | Review done | /audit or /qa |
| audit_out/ exists | Audit done | /qa |
| QA_REPORT.md PASS | QA done | /release |

## SLASH COMMANDS
When the user types a command, read the agent file from \`.vibe/agents/\` and become that agent.

/help — Show status + all commands
/brainstorm — Step 2: Idea → Blueprint (.vibe/agents/01-brainstorm.md)
/prd — Step 3a: PRD + SFD (.vibe/agents/02-committee.md)
/datamodel — Step 3b: Data Model + State Machines (.vibe/agents/02-committee.md)
/acpack — Step 3c: AC Pack + Master Prompt (.vibe/agents/02-committee.md)
/dev — Step 4: Implement (.vibe/agents/03-dev.md)
/review — Step 5: Code Review (.vibe/agents/04-reviewer.md)
/audit — Step 5.5: Full Audit (.vibe/agents/05-audit.md)
/qa — Step 6: QA (.vibe/agents/06-qa.md)
/product — Step 6.5: Product Review (.vibe/agents/07-product-reviewer.md)
/release — Step 7: Release (.vibe/agents/08-release.md)
/training — Step 7.5: Documentation (.vibe/agents/11-training.md)
/rca — Step 8: Root Cause Analysis (.vibe/agents/09-rca.md)
/ux — UI/UX Review (.vibe/agents/10-uiux.md)
/snapshot — Save Context (.vibe/agents/14-context-manager.md)
/hotfix — Emergency Fix Flow
/db_migrate — DB Migration (.vibe/agents/12-db-migration.md)
/deps — Dependency Check (.vibe/agents/13-dependency.md)
/status — Full project status
/onboard — Summary for new person

## GATE ENFORCEMENT
After each step, check the quality gate. If FAIL → user CANNOT proceed. No exceptions.
- Gate 2: BLUEPRINT.md exists with all sections
- Gate 3a: PRD.md + SFD.md exist and are consistent
- Gate 3b: DATA_MODEL.md + STATE_MACHINES.md exist
- Gate 3c: AC_PACK.md + MASTER_PROMPT.md exist with testable Given/When/Then
- Gate 4: P0 ACs covered, tests pass, vault updated
- Gate 5: REVIEW_REPORT.md = PASS, no blocking issues
- Gate 5.5: Audit SME score >= 7, no P0 vulnerabilities
- Gate 6: No P0 bugs, all P0 ACs pass
- Gate 7: Checklist complete, smoke tests pass

## CONTEXT MANAGEMENT
- If budget > 70% of context window: STOP, split task
- If session > 10 messages: produce CONTEXT_SNAPSHOT.md
- If debug > 5 messages without fix: STOP → snapshot → new chat
- Read rules_essential.md (2K) ALWAYS. Domain rules ONLY when relevant.

## SESSION LOGGING
At end of EVERY session, append to system_vault/SESSION_LOG.md:
- Date, agent used, step, what was done, decisions made, gate result, next action.

## PERSONALITY
Direct, structured, no fluff. You're a team lead, not a cheerleader.
Enforce gates firmly but respectfully. Use 🎸 on milestones only.
`;
}

// ─── Commands ──────────────────────────────────────────────────────────────────

async function init(minimal = false) {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║        🎸 Vibe Framework Installer           ║
  ║     Industrialized Vibecoding. Ship Safe.    ║
  ╚══════════════════════════════════════════════╝
  `);

  // Step 1: Project info
  header("Project Setup");
  const projectName = await ask("Project name", path.basename(PROJECT_ROOT));
  const stack = await ask(
    "Tech stack (e.g. next-supabase, react-node, vue-firebase)",
    "next-supabase"
  );

  // Step 2: Create directories
  header("Creating Directories");
  let created = 0;
  for (const [key, dir] of Object.entries(DIRECTORIES)) {
    if (ensureDir(dir)) {
      success(`Created ${dir}/`);
      created++;
    } else {
      info(`${dir}/ already exists`);
    }
  }

  // Step 3: Install rules
  header("Installing Rules & Skills");
  const rulesFiles = [
    ["rules/rules_essential.md", "rules_essential.md"],
    ["rules/rules_full.md", "rules_full.md"],
    ["skills/skills.md", "skills.md"],
    ["rules/rules_uiux.md", "rules_uiux.md"],
    ["skills/skills_uiux.md", "skills_uiux.md"],
  ];
  for (const [src, dest] of rulesFiles) {
    if (copyFromFramework(src, dest)) {
      success(`Installed ${dest}`);
    }
  }

  // Step 4: Install vault templates
  header("Setting Up System Vault");
  for (const file of VAULT_FILES) {
    const templateSrc = path.join(FRAMEWORK_ROOT, "templates", file);
    const destPath = path.join(DIRECTORIES.vault, file);
    if (fs.existsSync(templateSrc) && !fileExists(destPath)) {
      copyFromFramework(path.join("templates", file), destPath);
      success(`Created ${destPath}`);
    } else if (!fileExists(destPath)) {
      writeIfNotExists(
        destPath,
        `# ${file.replace(".md", "")}\n\n> Created by Vibe Framework on ${new Date().toISOString().split("T")[0]}\n`
      );
      success(`Created ${destPath} (blank)`);
    } else {
      info(`${destPath} already exists`);
    }
  }

  // Step 5: Install agents (unless minimal)
  if (!minimal) {
    header("Installing Agents");
    const agentsSrc = path.join(FRAMEWORK_ROOT, "agents");
    if (fs.existsSync(agentsSrc)) {
      const agentFiles = fs.readdirSync(agentsSrc).filter((f) => f.endsWith(".md"));
      for (const agent of agentFiles) {
        copyFromFramework(path.join("agents", agent), path.join(DIRECTORIES.agents, agent));
        success(`Installed ${agent}`);
      }
      log(`\n  ${agentFiles.length} agents installed.`);
    }
  } else {
    info("Minimal mode — skipping agents. Run 'vibe init' for full install.");
  }

  // Step 6: Install planning artifact placeholders
  header("Planning Artifacts");
  const planningFiles = [
    "MARKET_RESEARCH.md",
    "BLUEPRINT.md",
    "PRD.md",
    "SFD.md",
    "DATA_MODEL.md",
    "STATE_MACHINES.md",
    "AC_PACK.md",
    "MASTER_PROMPT.md",
  ];
  for (const file of planningFiles) {
    writeIfNotExists(
      path.join(DIRECTORIES.planning, file),
      `# ${file.replace(".md", "").replace(/_/g, " ")}\n\n> To be produced by the appropriate agent. See framework docs.\n`
    );
  }
  success(`${planningFiles.length} planning artifact placeholders created`);

  // Step 7: Create .vibe/config.yaml
  header("Configuration");
  const config = `# Vibe Framework Configuration
# Generated: ${new Date().toISOString().split("T")[0]}

project:
  name: "${projectName}"
  stack: "${stack}"
  version: "1.0.0"

paths:
  vault: "${DIRECTORIES.vault}"
  planning: "${DIRECTORIES.planning}"
  implementation: "${DIRECTORIES.implementation}"
  agents: "${DIRECTORIES.agents}"

context:
  # Max % of context window before agent must split task
  budget_threshold: 70
  # Max messages before mandatory snapshot
  max_session_messages: 12
  # Max debug messages before forced new chat
  max_debug_messages: 5

rules:
  # Files loaded on EVERY agent response
  always_load:
    - "rules_essential.md"
    - "${DIRECTORIES.vault}/CODE_INVENTORY.md"
    - "${DIRECTORIES.vault}/CONTEXT_SNAPSHOT.md"
  # Files loaded only when domain is touched
  domain_load:
    ui: ["rules_uiux.md", "skills_uiux.md"]
    architecture: ["rules_full.md"]
    coding: ["skills.md"]

gates:
  # Minimum audit score (SME) to pass gate 5.5
  audit_min_score: 7
  # Whether audit is required for every release
  audit_required: false
  # Whether product review is required
  product_review_required: false

logging:
  # Session log format version
  format: "v1"
  # Require session log for every agent
  mandatory: true
`;
  if (writeIfNotExists(path.join(DIRECTORIES.config, "config.yaml"), config)) {
    success("Created .vibe/config.yaml");
  }

  // Step 8: Create .gitignore additions
  header("Git Configuration");
  const gitignoreContent = `
# Vibe Framework
planning_artifacts/
implementation_artifacts/
audit_out/
product_audit_out/
ux_out/
training_out/
`;
  const gitignorePath = path.join(PROJECT_ROOT, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const current = fs.readFileSync(gitignorePath, "utf-8");
    if (!current.includes("Vibe Framework")) {
      fs.appendFileSync(gitignorePath, gitignoreContent);
      success("Updated .gitignore with Vibe Framework entries");
    } else {
      info(".gitignore already has Vibe Framework entries");
    }
  } else {
    fs.writeFileSync(gitignorePath, gitignoreContent.trim() + "\n");
    success("Created .gitignore");
  }

  // Step 9: Install KICKSTART.md (the single file users paste into their IDE)
  header("Kickstart File");
  if (copyFromFramework("KICKSTART.md", "KICKSTART.md")) {
    success("Installed KICKSTART.md");
  }

  // Step 10: Auto-detect IDE and install rules
  header("IDE Configuration");
  let ideDetected = false;

  // Cursor (.cursor/rules/)
  if (fs.existsSync(path.join(PROJECT_ROOT, ".cursor")) || fs.existsSync(path.join(PROJECT_ROOT, ".cursorrc"))) {
    ensureDir(".cursor/rules");
    const cursorRule = generateIDERule(projectName);
    writeIfNotExists(path.join(".cursor", "rules", "vibe-orchestrator.mdc"), cursorRule);
    success("Cursor detected → installed .cursor/rules/vibe-orchestrator.mdc");
    ideDetected = true;
  }

  // Windsurf (.windsurfrules)
  if (fs.existsSync(path.join(PROJECT_ROOT, ".windsurfrules")) || fs.existsSync(path.join(PROJECT_ROOT, ".windsurf"))) {
    const windRule = generateIDERule(projectName);
    writeIfNotExists(".windsurfrules", windRule);
    success("Windsurf detected → updated .windsurfrules");
    ideDetected = true;
  }

  // Claude Code (.claude/)
  if (fs.existsSync(path.join(PROJECT_ROOT, ".claude")) || fs.existsSync(path.join(PROJECT_ROOT, "CLAUDE.md"))) {
    const claudeRule = generateIDERule(projectName);
    writeIfNotExists("CLAUDE.md", claudeRule);
    success("Claude Code detected → updated CLAUDE.md");
    ideDetected = true;
  }

  // Antigravity (.antigravity/)
  if (fs.existsSync(path.join(PROJECT_ROOT, ".antigravity"))) {
    ensureDir(".antigravity");
    const agRule = generateIDERule(projectName);
    writeIfNotExists(path.join(".antigravity", "vibe-orchestrator.md"), agRule);
    success("Antigravity detected → installed .antigravity/vibe-orchestrator.md");
    ideDetected = true;
  }

  // If no IDE detected, create all major ones so the user is covered
  if (!ideDetected) {
    info("No AI IDE detected. Creating config files for all supported IDEs...");
    const rule = generateIDERule(projectName);

    // Cursor
    ensureDir(".cursor/rules");
    writeIfNotExists(path.join(".cursor", "rules", "vibe-orchestrator.mdc"), rule);
    success("Created .cursor/rules/vibe-orchestrator.mdc (Cursor)");

    // Claude Code
    writeIfNotExists("CLAUDE.md", rule);
    success("Created CLAUDE.md (Claude Code)");

    // Windsurf
    ensureDir(".windsurf");
    writeIfNotExists(path.join(".windsurf", "rules", "vibe-orchestrator.md"), rule);
    success("Created .windsurf/rules/vibe-orchestrator.md (Windsurf)");

    info("Your AI IDE will auto-load the Orchestrator when you open the project.");
  }

  // Step 11: Summary
  header("Installation Complete! 🎸");
  log(`Project: ${projectName}`);
  log(`Stack: ${stack}`);
  log(`Agents: ${minimal ? "none (minimal)" : "all installed"}`);
  log(`IDE Rules: ${ideDetected ? "auto-detected" : "all IDEs configured"}`);
  log(``);
  log(`HOW TO START:`);
  log(`  1. Open this project in your AI IDE (Cursor, Windsurf, Claude Code...)`);
  log(`  2. The Orchestrator is already loaded — just start chatting!`);
  log(`  3. Type /help to see all commands`);
  log(``);
  log(`The Orchestrator will:`);
  log(`  → Detect your project state automatically`);
  log(`  → Guide you to the right next step`);
  log(`  → Enforce quality gates (no skipping!)`);
  log(`  → Manage context so the AI never loses track`);
  log(``);
  log(`Or use commands directly:`);
  log(`  /brainstorm  — Structure your idea`);
  log(`  /dev         — Implement code`);
  log(`  /review      — Code review`);
  log(`  /qa          — QA testing`);
  log(`  /release     — Ship it! 🎸`);
  log(`  /help        — See all commands`);
  log(``);
  log(`Docs: https://github.com/nbabderrahmane/vibe-framework`);
  console.log();
}

function doctor() {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║        🩺 Vibe Framework Doctor              ║
  ╚══════════════════════════════════════════════╝
  `);

  let issues = 0;
  let warnings = 0;

  // Check rules
  header("Rules & Skills");
  const criticalFiles = [
    "rules_essential.md",
    "rules_full.md",
    "skills.md",
  ];
  for (const f of criticalFiles) {
    if (fileExists(f)) {
      success(f);
    } else {
      warn(`MISSING: ${f}`);
      issues++;
    }
  }

  // Check vault
  header("System Vault");
  for (const f of VAULT_FILES) {
    const p = path.join(DIRECTORIES.vault, f);
    if (fileExists(p)) {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, p), "utf-8");
      if (content.length < 100) {
        warn(`${p} exists but looks empty`);
        warnings++;
      } else {
        success(p);
      }
    } else {
      warn(`MISSING: ${p}`);
      issues++;
    }
  }

  // Check config
  header("Configuration");
  if (fileExists(".vibe/config.yaml")) {
    success(".vibe/config.yaml");
  } else {
    warn("MISSING: .vibe/config.yaml — run 'vibe init'");
    issues++;
  }

  // Check agents
  header("Agents");
  if (fs.existsSync(path.join(PROJECT_ROOT, DIRECTORIES.agents))) {
    const agents = fs
      .readdirSync(path.join(PROJECT_ROOT, DIRECTORIES.agents))
      .filter((f) => f.endsWith(".md"));
    success(`${agents.length} agents installed`);
  } else {
    warn("No agents directory found");
    issues++;
  }

  // Check session log freshness
  header("Session Log");
  const sessionLogPath = path.join(PROJECT_ROOT, DIRECTORIES.vault, "SESSION_LOG.md");
  if (fs.existsSync(sessionLogPath)) {
    const content = fs.readFileSync(sessionLogPath, "utf-8");
    const dateMatches = content.match(/\d{4}-\d{2}-\d{2}/g);
    if (dateMatches && dateMatches.length > 0) {
      const lastDate = dateMatches[dateMatches.length - 1];
      const daysSince = Math.floor(
        (Date.now() - new Date(lastDate).getTime()) / 86400000
      );
      if (daysSince > 7) {
        warn(`Last session log entry is ${daysSince} days old`);
        warnings++;
      } else {
        success(`Last entry: ${lastDate} (${daysSince} days ago)`);
      }
    } else {
      warn("SESSION_LOG.md has no dated entries");
      warnings++;
    }
  }

  // Summary
  header("Summary");
  if (issues === 0 && warnings === 0) {
    success("Everything looks good! 🎸");
  } else {
    if (issues > 0) warn(`${issues} issue(s) found`);
    if (warnings > 0) info(`${warnings} warning(s)`);
  }
  console.log();
}

function status() {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║        📊 Vibe Framework Status              ║
  ╚══════════════════════════════════════════════╝
  `);

  // Read config
  const configPath = path.join(PROJECT_ROOT, ".vibe/config.yaml");
  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, "utf-8");
    const nameMatch = config.match(/name:\s*"([^"]+)"/);
    const stackMatch = config.match(/stack:\s*"([^"]+)"/);
    log(`Project: ${nameMatch ? nameMatch[1] : "unknown"}`);
    log(`Stack: ${stackMatch ? stackMatch[1] : "unknown"}`);
  } else {
    warn("Not initialized. Run 'vibe init'.");
    return;
  }

  // Count agents
  const agentsDir = path.join(PROJECT_ROOT, DIRECTORIES.agents);
  if (fs.existsSync(agentsDir)) {
    const count = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md")).length;
    log(`Agents: ${count} installed`);
  }

  // Vault status
  let vaultOk = 0;
  for (const f of VAULT_FILES) {
    if (fileExists(path.join(DIRECTORIES.vault, f))) vaultOk++;
  }
  log(`Vault: ${vaultOk}/${VAULT_FILES.length} files present`);

  // Context snapshot
  const snapPath = path.join(PROJECT_ROOT, DIRECTORIES.vault, "CONTEXT_SNAPSHOT.md");
  if (fs.existsSync(snapPath)) {
    const stat = fs.statSync(snapPath);
    const daysAgo = Math.floor((Date.now() - stat.mtimeMs) / 86400000);
    log(`Last snapshot: ${daysAgo === 0 ? "today" : `${daysAgo} days ago`}`);
  } else {
    log(`Last snapshot: none`);
  }

  console.log();
}

function showHelp() {
  console.log(`
  🎸 Vibe Framework — Industrialized Vibecoding

  Usage:
    npx vibe-framework <command>

  Commands:
    init              Full installation (rules + agents + vault + templates)
    init --minimal    Minimal installation (rules + vault only)
    doctor            Check project health and completeness
    status            Show framework status
    help              Show this help message

  After installation, use these commands in your AI IDE:
    /brainstorm       Step 2 — Brainstorm Agent
    /prd              Step 3a — PRD + SFD
    /datamodel        Step 3b — Data Model + State Machines
    /acpack           Step 3c — AC Pack + Master Prompt
    /dev              Step 4 — Dev Agent
    /review           Step 5 — Code Review
    /audit            Step 5.5 — Full Audit
    /qa               Step 6 — QA Testing
    /product          Step 6.5 — Product Alignment
    /release          Step 7 — Release
    /training         Step 7.5 — User Training
    /rca              Step 8 — Root Cause Analysis
    /snapshot         Context Snapshot (anytime)
    /hotfix           Hotfix flow (anytime)
    /db_migrate       DB Migration (anytime)
    /deps             Dependency Check (anytime)

  Docs: https://github.com/nbabderrahmane/vibe-framework
  `);
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0] || "help";

switch (command) {
  case "init":
    init(args.includes("--minimal")).catch(console.error);
    break;
  case "doctor":
    doctor();
    break;
  case "status":
    status();
    break;
  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;
  default:
    warn(`Unknown command: ${command}`);
    showHelp();
}
