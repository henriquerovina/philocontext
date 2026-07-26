# Graph Report - .  (2026-07-26)

## Corpus Check
- Corpus is ~20,983 words - fits in a single context window. You may not need a graph.

## Summary
- 170 nodes · 179 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Bundler & Linter Config
- Python API Backend
- Frontend ESLint Config
- Graphify Tool Suite
- PythonProject Frontend Deps
- philo-frontend Deps
- Social Media Icons
- Graphify Pipeline Core
- Project Brand Logos
- Engineering Skills Suite
- Frontend App Descriptions
- Frontend App Source
- PDF Paper
- Temp Reading Paper
- PostCSS Config
- Tailwind Config
- Vite Config Duplicate

## God Nodes (most connected - your core abstractions)
1. `Graphify Tool` - 15 edges
2. `PhiloParser` - 7 edges
3. `Social and Feature Icon Sprite Sheet` - 7 edges
4. `Social and Feature Icon Sprite Sheet` - 7 edges
5. `analyze_pdf()` - 6 edges
6. `scripts` - 5 edges
7. `scripts` - 5 edges
8. `Pipeline` - 5 edges
9. `Bluesky Social Icon` - 5 edges
10. `Discord Social Icon` - 5 edges

## Surprising Connections (you probably didn't know these)
- `React + Vite` --semantically_similar_to--> `React + Vite`  [INFERRED] [semantically similar]
  PythonProject/philo-frontend/README.md → philo-frontend/README.md
- `philo-frontend` --semantically_similar_to--> `philo-frontend`  [INFERRED] [semantically similar]
  PythonProject/philo-frontend/index.html → philo-frontend/index.html
- `PhiloContext Logo Purple Angular Brand Mark` --semantically_similar_to--> `PhiloContext Logo Purple Angular Brand Mark`  [INFERRED] [semantically similar]
  PythonProject/philo-frontend/public/favicon.svg → philo-frontend/public/favicon.svg
- `Social and Feature Icon Sprite Sheet` --semantically_similar_to--> `Social and Feature Icon Sprite Sheet`  [INFERRED] [semantically similar]
  PythonProject/philo-frontend/public/icons.svg → philo-frontend/public/icons.svg
- `React Logo` --semantically_similar_to--> `React Logo`  [INFERRED] [semantically similar]
  PythonProject/philo-frontend/src/assets/react.svg → philo-frontend/src/assets/react.svg

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Pipeline Steps** — _claude_skills_graphify_skill_corpus_detection, _claude_skills_graphify_skill_astextraction, _claude_skills_graphify_skill_semantic_extraction, _claude_skills_graphify_skill_community_detection [EXTRACTED 1.00]
- **Engineering Skills Suite** — docs_agents_domain_domain_documentation, docs_agents_issue_tracker_github_issues, docs_agents_triage_labels_triage_labels [INFERRED 0.85]
- **Social Media Presence Icons** — pythonproject_philo_frontend_public_icons_svg_bluesky_icon, pythonproject_philo_frontend_public_icons_svg_discord_icon, pythonproject_philo_frontend_public_icons_svg_github_icon, pythonproject_philo_frontend_public_icons_svg_x_icon, philo_frontend_public_icons_svg_bluesky_icon, philo_frontend_public_icons_svg_discord_icon, philo_frontend_public_icons_svg_github_icon, philo_frontend_public_icons_svg_x_icon [INFERRED 0.95]
- **Frontend Visual Identity Assets** — pythonproject_philo_frontend_public_favicon_svg_philocontext_logo, philo_frontend_public_favicon_svg_philocontext_logo, pythonproject_philo_frontend_src_assets_react_svg_react_logo, philo_frontend_src_assets_react_svg_react_logo, pythonproject_philo_frontend_src_assets_vite_svg_vite_logo, philo_frontend_src_assets_vite_svg_vite_logo, pythonproject_philo_frontend_src_assets_hero_png_hero_image, philo_frontend_src_assets_hero_png_hero_image [INFERRED 0.85]
- **Feature and Navigation Icons** — pythonproject_philo_frontend_public_icons_svg_documentation_icon, pythonproject_philo_frontend_public_icons_svg_social_icon, philo_frontend_public_icons_svg_documentation_icon, philo_frontend_public_icons_svg_social_icon [INFERRED 0.85]

## Communities (24 total, 6 thin omitted)

### Community 0 - "Bundler & Linter Config"
Cohesion: 0.08
Nodes (25): autoprefixer, postcss, devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+17 more)

### Community 1 - "Python API Backend"
Cohesion: 0.13
Nodes (14): get, post, analyze_pdf(), view_pdf(), generate_exam_review(), get_contemporaries(), get_historical_context(), PhiloParser (+6 more)

### Community 2 - "Frontend ESLint Config"
Cohesion: 0.11
Nodes (19): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+11 more)

### Community 3 - "Graphify Tool Suite"
Cohesion: 0.12
Nodes (18): Graphify, Watch Mode, MCP Server, Neo4j Export, Subagent Extraction, Cross-Repo Merge, CLAUDE.md Integration, Git Post-Commit Hook (+10 more)

### Community 4 - "PythonProject Frontend Deps"
Cohesion: 0.12
Nodes (16): dependencies, react, react-dom, @tailwindcss/postcss, react, react-dom, name, private (+8 more)

### Community 5 - "philo-frontend Deps"
Cohesion: 0.13
Nodes (14): dependencies, react, react-dom, react, react-dom, name, private, scripts (+6 more)

### Community 6 - "Social Media Icons"
Cohesion: 0.34
Nodes (14): Bluesky Social Icon, Discord Social Icon, Documentation Navigation Icon, GitHub Social Icon, Social and Feature Icon Sprite Sheet, Social Features Icon, X Twitter Social Icon, Bluesky Social Icon (+6 more)

### Community 7 - "Graphify Pipeline Core"
Cohesion: 0.40
Nodes (6): AST Extraction, Community Detection, Corpus Detection, God Nodes, Pipeline, Semantic Extraction

### Community 8 - "Project Brand Logos"
Cohesion: 0.47
Nodes (6): PhiloContext Logo Purple Angular Brand Mark, React Logo, Vite Logo, PhiloContext Logo Purple Angular Brand Mark, React Logo, Vite Logo

### Community 9 - "Engineering Skills Suite"
Cohesion: 0.40
Nodes (5): Engineering Skills, Domain Documentation, GitHub Issues, Wayfinder, Triage Labels

### Community 10 - "Frontend App Descriptions"
Cohesion: 0.67
Nodes (4): philo-frontend, React + Vite, philo-frontend, React + Vite

## Knowledge Gaps
- **64 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Bundler & Linter Config` to `PythonProject Frontend Deps`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Frontend ESLint Config` to `philo-frontend Deps`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Bundler & Linter Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Python API Backend` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `Frontend ESLint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Graphify Tool Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._