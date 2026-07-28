# Graph Report - philocontext  (2026-07-27)

## Corpus Check
- 54 files · ~22,055 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 266 nodes · 303 edges · 32 communities (27 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d16a646d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Bundler & Linter Config
- Python API Backend
- ImageParser
- Graphify Tool Suite
- PythonProject Frontend Deps
- philo-frontend Deps
- PhiloParser
- Graphify Pipeline Core
- Engineering Skills Suite
- PostCSS Config
- Vite Config Duplicate
- devDependencies
- devDependencies
- compilerOptions
- App.tsx
- client/package.json
- Philocontext Backend
- Philocontext Client
- opencode.json
- Philocontext
- React + Vite
- graphify.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `Graphify Tool` - 15 edges
3. `BaseAgent` - 13 edges
4. `PhilosophyAnalyzer` - 13 edges
5. `ArgumentAgent` - 7 edges
6. `ExamAgent` - 7 edges
7. `HistoryAgent` - 7 edges
8. `MetadataAgent` - 7 edges
9. `ImageParser` - 7 edges
10. `PhiloParser` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Graphify Rules` --references--> `Graphify Tool`  [EXTRACTED]
  CLAUDE.md → .claude/skills/graphify/SKILL.md
- `PhilosophyAnalyzer` --uses--> `ImageParser`  [INFERRED]
  server/orchestrator.py → server/extractors/image_extractor.py
- `PhilosophyAnalyzer` --uses--> `PhiloParser`  [INFERRED]
  server/orchestrator.py → server/extractors/pdf_extractor.py
- `PhilosophyAnalyzer` --uses--> `ResearchPacket`  [INFERRED]
  server/orchestrator.py → server/models.py
- `Engineering Skills` --references--> `Triage Labels`  [EXTRACTED]
  CLAUDE.md → docs/agents/triage-labels.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Pipeline Steps** — _claude_skills_graphify_skill_corpus_detection, _claude_skills_graphify_skill_astextraction, _claude_skills_graphify_skill_semantic_extraction, _claude_skills_graphify_skill_community_detection [EXTRACTED 1.00]
- **Engineering Skills Suite** — docs_agents_domain_domain_documentation, docs_agents_issue_tracker_github_issues, docs_agents_triage_labels_triage_labels [INFERRED 0.85]

## Communities (32 total, 5 thin omitted)

### Community 0 - "Bundler & Linter Config"
Cohesion: 0.25
Nodes (12): BaseModel, AnalysisRequest, AnalysisResult, ArgumentAnalysis, ArgumentReconstruction, ArgumentThesis, Conclusion, Fallacy (+4 more)

### Community 1 - "Python API Backend"
Cohesion: 0.67
Nodes (3): post, analyze_pdf(), UploadFile

### Community 3 - "Graphify Tool Suite"
Cohesion: 0.12
Nodes (18): Graphify, Watch Mode, MCP Server, Neo4j Export, Subagent Extraction, Cross-Repo Merge, CLAUDE.md Integration, Git Post-Commit Hook (+10 more)

### Community 4 - "PythonProject Frontend Deps"
Cohesion: 0.12
Nodes (16): dependencies, react, react-dom, @tailwindcss/postcss, react, react-dom, name, private (+8 more)

### Community 5 - "philo-frontend Deps"
Cohesion: 0.13
Nodes (11): ABC, get, ArgumentAgent, BaseAgent, ExamAgent, HistoryAgent, MetadataAgent, health() (+3 more)

### Community 7 - "Graphify Pipeline Core"
Cohesion: 0.40
Nodes (6): AST Extraction, Community Detection, Corpus Detection, God Nodes, Pipeline, Semantic Extraction

### Community 9 - "Engineering Skills Suite"
Cohesion: 0.33
Nodes (5): Engineering Skills, Domain Documentation, GitHub Issues, Wayfinder, Triage Labels

### Community 24 - "devDependencies"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+19 more)

### Community 25 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+17 more)

### Community 26 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution (+13 more)

### Community 27 - "App.tsx"
Cohesion: 0.09
Nodes (15): ArgumentTabProps, SectionId, ResultsProps, Tab, TabsProps, UploadProps, AnalysisResult, ArgumentAnalysis (+7 more)

### Community 28 - "client/package.json"
Cohesion: 0.12
Nodes (16): dependencies, framer-motion, react, react-dom, react, react-dom, name, private (+8 more)

### Community 34 - "Philocontext Backend"
Cohesion: 0.33
Nodes (5): Deploy (Railway), Philocontext Backend, Run, Setup, Structure

### Community 35 - "Philocontext Client"
Cohesion: 0.40
Nodes (4): Build, Philocontext Client, Run, Setup

### Community 39 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 40 - "Philocontext"
Cohesion: 0.50
Nodes (3): Architecture, Philocontext, Quick Start

### Community 41 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **106 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `private`, `version` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `client/package.json`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `PythonProject Frontend Deps`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `PhilosophyAnalyzer` connect `philo-frontend Deps` to `Bundler & Linter Config`, `ImageParser`, `PhiloParser`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `BaseAgent` (e.g. with `ArgumentAgent` and `ExamAgent`) actually correct?**
  _`BaseAgent` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `PhilosophyAnalyzer` (e.g. with `ArgumentAgent` and `ExamAgent`) actually correct?**
  _`PhilosophyAnalyzer` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Graphify Tool Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._