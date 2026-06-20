---
name: project-onboard
description: "Scan and understand an unfamiliar project codebase before doing work. Systematically read key files, map architecture, and produce a concise briefing."
---

# Project Onboard

Systematically scan and understand an unfamiliar project codebase. This skill is triggered when the user says "阅读并熟悉项目", "先看看项目", "read and familiarize", or similar onboarding requests.

## When to Use

- User asks to "阅读并熟悉项目" (read and familiarize with the project)
- User asks to "先看看项目" or "看看代码" before doing work
- Starting work on an unfamiliar codebase for the first time
- User asks "这个项目是做什么的？" or "项目实现得怎么样？"

## Procedure

### Step 1: Project Structure Scan (5-10 reads)

1. **Root directory listing** — `ls` or `Read` on project root
2. **Package manifest** — Read `package.json`, `Cargo.toml`, `go.mod`, `requirements.txt`, or equivalent
3. **Entry point** — Read `src/main.*`, `src/App.*`, `index.*`, or equivalent
4. **README** — Read `README.md` if it exists
5. **Config files** — Skim `tsconfig.json`, `vite.config.*`, `.env.example`, or equivalent

Goal: understand tech stack, build system, and project entry point.

### Step 2: Architecture Mapping (10-20 reads)

6. **Directory structure** — Glob `src/**/*` or equivalent source directory
7. **Data layer** — Read data models, types, schemas (`types.ts`, `models/`, `schema/`)
8. **Core logic** — Read the main business logic files
9. **API/routes** — Read API handlers or route definitions
10. **Components/pages** — Read key UI components or page templates

Goal: map the data flow and component relationships.

### Step 3: Supporting Files (5-10 reads)

11. **Scripts** — Read build/deploy/utility scripts
12. **Tests** — Skim test structure (don't read all tests)
13. **CI/CD** — Read `.github/workflows/`, `Dockerfile`, or equivalent
14. **Documentation** — Read any `docs/`, `CHANGELOG.md`, `AGENTS.md`

Goal: understand deployment, testing, and maintenance workflows.

### Step 4: Produce Briefing

Output a concise briefing in this format:

```
## 项目概览
- 技术栈: [languages, frameworks, build tools]
- 项目目标: [one-line purpose]
- 入口文件: [main entry points]

## 架构要点
- [key architectural patterns]
- [data flow summary]
- [notable design decisions]

## 关键文件
- [list of 5-10 most important files with brief descriptions]

## 注意事项
- [gotchas, constraints, or rules from AGENTS.md/memory]
```

## Guidelines

- **Read broadly first, deeply second.** Scan 20-40 files to map the shape, then dive into 5-10 critical ones.
- **Don't read test files in detail** — just note their structure and coverage.
- **Respect project conventions** — if there's an `AGENTS.md` or `CLAUDE.md`, read it first and follow its rules.
- **Chinese output** — produce the briefing in Chinese unless the user's language preference is otherwise.
- **Stop early if the project is small** — for projects under 10 files, Steps 1-2 may be sufficient.
- **Don't modify anything** — this is a read-only scan. No edits, no commits, no package installs.

## Time Budget

- Small project (<20 files): 5-10 minutes
- Medium project (20-100 files): 10-20 minutes
- Large project (100+ files): 20-30 minutes, focus on architecture over line-by-line reading
