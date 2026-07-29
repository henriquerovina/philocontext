# Graph Report - philocontext  (2026-07-28)

## Corpus Check
- 73 files · ~39,687 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 450 nodes · 561 edges · 60 communities (35 shown, 25 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4778306a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api.ts
- orchestrator.py
- devDependencies
- devDependencies
- What You Must Do When Invoked
- compilerOptions
- Graphify
- Domain Documentation Conventions
- client/package.json
- philo-frontend/package.json
- Philocontext Backend
- dev.sh
- UW-LAX Logo Mark
- Philocontext Favicon
- plugin
- Bluesky Icon
- UW-La Crosse Brand Color Palette
- graphify.js
- Philocontext Favicon
- UWLAX Gold Accent Color
- Documentation Icon
- Documentation Icon
- Philocontext HTML Entry
- Bluesky Icon
- Discord Icon
- GitHub Icon
- X (Twitter) Icon
- philo-frontend HTML Entry
- Vite Template (philo-frontend)
- groq
- Pillow
- pydantic
- pypdf
- pytesseract
- python-dotenv
- python-multipart
- uvicorn
- graphify reference: extra exports and benchmark
- BaseAgent
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- CLAUDE.md
- extraction-spec.md
- StudyManager.tsx
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `PhilosophyAnalyzer` - 20 edges
2. `Graphify` - 16 edges
3. `compilerOptions` - 15 edges
4. `BaseAgent` - 15 edges
5. `What You Must Do When Invoked` - 12 edges
6. `/graphify` - 10 edges
7. `StudyManager()` - 8 edges
8. `IdentifyAgent` - 8 edges
9. `graphify reference: extra exports and benchmark` - 8 edges
10. `getSavedStudies()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Philocontext` --references--> `Agent Skills System`  [INFERRED]
  README.md → CLAUDE.md
- `Philocontext` --conceptually_related_to--> `Graphify CLI Integration`  [INFERRED]
  README.md → CLAUDE.md
- `Philocontext` --conceptually_related_to--> `Improve Historical Context & Study Guide Plan`  [INFERRED]
  README.md → .opencode/plans/improve-history-study-guide.md
- `Philocontext` --references--> `Graphify Usage Rules`  [INFERRED]
  README.md → AGENTS.md
- `Graphify CLI Integration` --conceptually_related_to--> `Graphify Usage Rules`  [INFERRED]
  CLAUDE.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Pipeline Steps** — _claude_skills_graphify_skill_ast_extraction, _claude_skills_graphify_skill_semantic_extraction, _claude_skills_graphify_skill_community_detection, _claude_skills_graphify_skill_knowledge_graph, _claude_skills_graphify_skill_audit_trail, _claude_skills_graphify_skill_pipeline, _claude_skills_graphify_skill_no_api_key, _claude_skills_graphify_skill_honesty_rules, _claude_skills_graphify_references_update_incremental, _claude_skills_graphify_references_query_traversal, _claude_skills_graphify_references_hooks_commit_hook, _claude_skills_graphify_references_exports_mcp_server, _claude_skills_graphify_references_add_watch_watch_mode, _claude_skills_graphify_references_github_clone [EXTRACTED 1.00]
- **Improve History Study Guide Workstream** — _opencode_plans_improve_history_study_guide_plan, _opencode_plans_improve_history_study_guide_historical_context, _opencode_plans_improve_history_study_guide_study_guide, _opencode_plans_improve_history_study_guide_history_agent, _opencode_plans_improve_history_study_guide_exam_agent [EXTRACTED 1.00]
- **Philocontext Analysis Pipeline** — server_readme_philoparser, server_readme_metadata_agent, server_readme_history_agent, server_readme_exam_agent, server_readme_philosophy_analyzer [EXTRACTED 1.00]
- **Triage Workflow State Machine** — docs_agents_triage_labels_needs_triage, docs_agents_triage_labels_needs_info, docs_agents_triage_labels_ready_for_agent, docs_agents_triage_labels_ready_for_human, docs_agents_triage_labels_wontfix [EXTRACTED 1.00]
- **Social Platform Link Icons** — client_public_icons_bluesky_icon, client_public_icons_discord_icon, client_public_icons_github_icon, client_public_icons_x_icon [EXTRACTED 1.00]
- **Philocontext UI Icon Sprite** — client_public_icons_bluesky_icon, client_public_icons_discord_icon, client_public_icons_github_icon, client_public_icons_x_icon, client_public_icons_documentation_icon, client_public_icons_social_icon [EXTRACTED 1.00]
- **Social Media Brand Icons** — server_philo_frontend_public_icons_bluesky_icon, server_philo_frontend_public_icons_discord_icon, server_philo_frontend_public_icons_github_icon, server_philo_frontend_public_icons_x_icon [EXTRACTED 1.00]
- **UWLAX Brand Color Element** — uwlax_pallete_p_decorative_p, uwlax_pallete_p_gold_accent, uwlax_pallete_p_brand_palette [INFERRED 0.95]

## Communities (60 total, 25 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.07
Nodes (26): ArgumentTabProps, SectionId, CandidatePickerProps, HistoryTabProps, AuthorPhoto, getInitials(), MetadataTab(), Results() (+18 more)

### Community 1 - "orchestrator.py"
Cohesion: 0.09
Nodes (32): BaseModel, get, post, analyze_identified(), analyze_pdf(), health(), identify_paper(), ImageParser (+24 more)

### Community 2 - "devDependencies"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+19 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+17 more)

### Community 4 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 5 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution (+13 more)

### Community 6 - "Graphify"
Cohesion: 0.07
Nodes (32): Watch Mode, MCP Server, Confidence Rubric, Hyperedges, Node ID Format Rules, GitHub Clone Flow, Post-Commit Hook, Query Vocabulary Expansion (+24 more)

### Community 7 - "Domain Documentation Conventions"
Cohesion: 0.11
Nodes (20): Architecture Decision Record (ADR), ADR Conflict Flagging, CONTEXT-MAP.md, CONTEXT.md, Domain Documentation Conventions, Domain Modeling (/domain-modeling), Glossary Vocabulary, Frontier Query (+12 more)

### Community 8 - "client/package.json"
Cohesion: 0.12
Nodes (16): dependencies, framer-motion, react, react-dom, react, react-dom, name, private (+8 more)

### Community 9 - "philo-frontend/package.json"
Cohesion: 0.12
Nodes (16): dependencies, react, react-dom, @tailwindcss/postcss, react, react-dom, name, private (+8 more)

### Community 10 - "Philocontext Backend"
Cohesion: 0.17
Nodes (15): API Proxy, Philocontext Client, Vite, BaseAgent, Backend Config (config.py), ExamAgent, FastAPI API (api.py), HistoryAgent (+7 more)

### Community 12 - "UW-LAX Logo Mark"
Cohesion: 0.47
Nodes (6): UW-LAX Brand Identifier Text, UW-LAX Eagle Crest Emblem, UW-LAX Primary Maroon (#73253D), UW-LAX Secondary Gray (#A6AAAD), Traditional Collegiate Seal Design Style, UW-LAX Logo Mark

### Community 13 - "Philocontext Favicon"
Cohesion: 0.40
Nodes (5): Brand Purple Color (#863bff), Display P3 Wide Gamut Color, Glow and Lighting Effect, Philocontext Favicon, Stylized Geometric Logo Mark

### Community 14 - "plugin"
Cohesion: 0.40
Nodes (4): plugin, $schema, @dietrichgebert/ponytail, .opencode/plugins/graphify.js

### Community 15 - "Bluesky Icon"
Cohesion: 1.00
Nodes (4): Bluesky Icon, Discord Icon, GitHub Icon, X (Twitter) Icon

### Community 16 - "UW-La Crosse Brand Color Palette"
Cohesion: 0.50
Nodes (4): UW-La Crosse Brand Color Palette Variant, Gray Secondary Color, Maroon Primary Color (#83151d), UW-La Crosse Brand Color Palette

### Community 18 - "Philocontext Favicon"
Cohesion: 0.67
Nodes (3): Philocontext Favicon, Philocontext Brand Mark, Brand Purple (#863bff)

### Community 19 - "UWLAX Gold Accent Color"
Cohesion: 0.67
Nodes (3): UW-La Crosse Brand Palette, Gold Decorative Letter P, UWLAX Gold Accent Color

### Community 47 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 48 - "BaseAgent"
Cohesion: 0.12
Nodes (7): ABC, ArgumentAgent, BaseAgent, ExamAgent, HistoryAgent, IdentifyAgent, MetadataAgent

### Community 49 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 50 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 51 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 52 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 58 - "StudyManager.tsx"
Cohesion: 0.21
Nodes (18): StudyGuideTabProps, OpenGuide, StudyManager(), StudyManagerProps, conceptsForStudies(), createCompilation(), deleteCompilation(), deleteStudy() (+10 more)

## Knowledge Gaps
- **177 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `@dietrichgebert/ponytail`, `name`, `private` (+172 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `client/package.json`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `philo-frontend/package.json`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `PhilosophyAnalyzer` connect `orchestrator.py` to `BaseAgent`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `PhilosophyAnalyzer` (e.g. with `ArgumentAgent` and `ExamAgent`) actually correct?**
  _`PhilosophyAnalyzer` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `BaseAgent` (e.g. with `ArgumentAgent` and `ExamAgent`) actually correct?**
  _`BaseAgent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `@dietrichgebert/ponytail` to the rest of the system?**
  _177 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06533776301218161 - nodes in this community are weakly interconnected._