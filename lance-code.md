# Lance Code — Project Inventory

> Auto-generated summary of Liangjun (Lance) Song's software projects across WSL and GitHub.  
> Last updated: 2026-05-27

---

## Personal Projects (github.com/lycanlancelot)

### Termly
**Path:** `~/src/Termly`  
**GitHub:** https://github.com/lycanlancelot/Termly  
**Stack:** Python · FastAPI · Pydantic · Claude Sonnet · Azure Document Intelligence · Tesseract OCR · Docker  
**Status:** Active (2026)

Document AI system for Australian medical contract automation. Ingests scanned PDFs, runs OCR correction, extracts structured clauses and Medicare/PBS identifiers, validates compliance fields, and produces risk assessments. Backed by FastAPI REST services with healthcare-domain validation logic and provider-switchable LLM layer.

Key features:
- PDF extraction pipeline (Azure Doc Intelligence + Tesseract fallback)
- Structured clause/entity extraction via Claude Sonnet
- MPPA/Medicare identifier validation and risk scoring
- Docker-containerised, environment-parity local ↔ deployed

---

### Remote Agent Workbench
**Path:** `~/src/vibe/remote-agent`  
**GitHub:** https://github.com/lycanlancelot/remote-agent  
**Stack:** React · Vite · TypeScript · Express · Socket.IO · Node.js · PTY  
**Status:** Active (2025–2026)

VS Code-like remote workbench for orchestrating Claude Code and Codex from a browser. Built around real task execution rather than a mock dashboard — live terminal streaming, file previews, task persistence, model controls, and permission prompts over Socket.IO.

Key features:
- PTY-backed terminal streaming (xterm.js)
- Task queue with persistence and status tracking
- Allowed-directory safety boundary for agent work
- Remote access patterns (Cloudflare Tunnel compatible)
- Model selector and conversation continuity

---

### AgentForge
**Path:** `~/src/vibe/agent-forge`  
**GitHub:** https://github.com/lycanlancelot/agent-forge  
**Stack:** React · Express · TypeScript · SQLite · xterm.js · PM2 · Git Worktrees  
**Status:** Active (2025–2026)

Local control plane for running Claude Code, Codex, and Kimi Code in parallel across isolated git worktrees. Designed for long-running multi-agent coding tasks that need to be observable, parallelisable, and recoverable.

Key features:
- Multi-agent grid with live xterm.js terminals
- Git worktree isolation per task
- PM2 process management with auto-restart
- Auto-commit scheduling and session logs
- SQLite-backed task state
- Cloudflare Tunnel for remote access

---

### Video-RAG
**Path:** `~/src/Video-RAG`  
**GitHub:** https://github.com/Iliana678/Video-RAG *(collaboration)*  
**Stack:** Python · CLIP · ChromaDB · FastAPI · OpenCV · OpenAI API  
**Status:** 2025

Multimodal retrieval pipeline that samples video frames, generates CLIP embeddings, stores them in ChromaDB, and answers natural-language queries with timestamped visual evidence. Supports image-only search paths and multiple LLM provider backends.

Key features:
- Configurable frame sampling rate
- CLIP embedding + ChromaDB vector store
- Natural-language query with timestamped results
- Multiple LLM provider support (OpenAI, local)
- FastAPI serving layer

---

### Toy Gifting System
**Path:** `~/src/toy-gifting`  
**GitHub:** https://github.com/lycanlancelot/toy-gifting  
**Stack:** JavaScript · Node.js · SQLite · Three.js · HTML/CSS  
**Status:** 2025

Back-office sourcing and assembly tool for toy gift boxes targeting Australian children. Ingests SQLite toy catalogs, models supplier/compliance metadata and bilingual product data, drives an operator review loop, and renders a Three.js 3D bin-packing visualisation of the assembled box.

Key features:
- SQLite catalog ingestion with filtering
- Supplier compliance and certification metadata
- Three.js 3D packing visualisation
- Operator feedback and approval workflow
- Bilingual (English/Chinese) product data

---

### BranchFlow (AI-Writer)
**Path:** `~/src/AI-writer`  
**GitHub:** https://github.com/lycanlancelot/writer-helper  
**Stack:** React 18 · TypeScript · Vite · React Flow · Obsidian Canvas  
**Status:** 2025

Local nonlinear writing and prompt-orchestration workbench (枝影 · BranchFlow) for Seedance-style branching narrative work. Manages branching story state, drives prompt drawers per branch, renders a React Flow mind-map of the story tree, and exports to Obsidian Canvas format.

Key features:
- Branching story editor with per-branch context
- Prompt drawer with LLM call per branch node
- React Flow mind-map visualisation
- Obsidian Canvas export
- Local-only, no auth required

---

### Elder Companion
**Path:** `~/src/elder-companion`  
**GitHub:** https://github.com/lycanlancelot/elder-companion  
**Stack:** Expo · React Native · Node.js · Firebase · Claude API · ElevenLabs (planned)  
**Status:** 2025

Voice companion app prototype for elderly users, with a paired family dashboard. Elder-facing screen handles voice conversation, daily summaries, and alert workflows. Family-facing dashboard shows activity, summaries, and configures reminders.

Key features:
- Voice-first UI (Expo/React Native)
- Claude-backed conversation engine
- Firebase persistence for sessions and summaries
- Daily summary generation for family dashboard
- ElevenLabs TTS integration plan

---

### RageZone
**Path:** `~/src/vibe/` *(local)*  
**GitHub:** https://github.com/lycanlancelot/ragezone  
**Stack:** WeChat Mini Program · Node.js · WebSocket · LLM API  
**Status:** 2025

WeChat Mini Program and Node/WebSocket backend for an LLM-assisted argument coaching product. Users set a persona, engage in a real-time chat flow guided by the LLM coach, and receive de-escalation or reframing suggestions. Includes JWT/Firebase auth plan, evaluation scripts, and monetisation entry points.

Key features:
- WeChat Mini Program frontend
- Real-time WebSocket communication
- LLM persona-driven coaching
- JWT + Firebase auth design
- Evaluation and A/B test scaffolding

---

### Claude Code Source Map
**Path:** `~/src/claude-code-sourcemap`  
**GitHub:** https://github.com/lycanlancelot/claude-code-sourcemap  
**Stack:** Node.js · JavaScript · Source Maps  
**Status:** 2025

Technical research repository for understanding early Claude Code CLI internals. Extracts and resolves source maps from the minified bundle to reconstruct the agent architecture, command flow, and terminal-agent interaction patterns. Reference: original at https://github.com/dnakov/anon-kode.

Key features:
- Source map extraction and symbol resolution
- Reconstructed agent architecture graph
- Command-flow documentation
- Architecture notes and annotations

---

### lycanlancelot.github.io (this site)
**Path:** `~/src/lycanlancelot.github.io-live`  
**GitHub:** https://github.com/lycanlancelot/lycanlancelot.github.io  
**Stack:** Jekyll · Ruby · SCSS · HTML · JavaScript  
**Status:** Active

Personal portfolio and CV site built on jekyll-theme-hacker with a fully custom dark design system. Features a project dashboard, interactive CV (print-ready A4 HTML), and GitHub project summary page.

---

## Open Source Contributions

### SGLang Framework
**GitHub:** https://github.com/sgl-project/sglang  
**Role:** Contributor (Feb 2025 – Present)  
**Stack:** Python · CUDA · Triton · NCCL · C++

Contributing runtime and serving optimisations for the SGLang LLM inference framework (LMSYS / UC Berkeley). Work spans backend runtime, distributed serving, and frontend prompt-language features for DeepSeek R1, Llama 3, and Qwen. Using Claude Code as an AI-assisted open-source workflow.

---

### Everything Claude Code
**GitHub:** https://github.com/affaan-m/everything-claude-code  
**Role:** User and contributor  
**Stack:** TypeScript · Python · Shell · Go · Java · Perl

50K+ star collection of Claude Code utilities, patterns, and skills. Anthropic Hackathon winner. Used as the skill/agent harness for daily development work.

---

### Video-RAG (collaboration)
**GitHub:** https://github.com/Iliana678/Video-RAG  
**Role:** Builder and collaborator  
See personal project entry above.

---

## Research & Study Forks

### AI Hedge Fund Lab
**Path:** `~/src/ai-hedge-fund`  
**GitHub:** https://github.com/virattt/ai-hedge-fund  
**Stack:** Python · LangGraph · Claude/GPT-4  

Multi-agent trading system proof-of-concept with 17 analyst agents (Buffett, Ackman, Lynch, etc.) and risk management. Used to study multi-agent orchestration patterns.

---

### TradingAgents
**Path:** `~/src/TradingAgents`  
**GitHub:** https://github.com/TauricResearch/TradingAgents  
**Stack:** Python · Multi-agent framework  

Academic multi-agent trading system (arXiv 2412.20138) by TauricResearch. Studied for agent communication and evaluation patterns.

---

### Stanford CS336 Spring 2025
**Path:** `~/src/spring2025-lectures`  
**GitHub:** https://github.com/stanford-cs336/spring2025-lectures  
**Stack:** Python  

"Language Modeling from Scratch" lecture materials. Executable and PDF lectures covering pretraining, fine-tuning, RLHF, and inference.

---

## Active Work

### WiseTech Global — AI Engineer (Apr 2025 – Present)
Production AI systems: CWBot and TriageAgent. LangGraph orchestration, FastAPI services, Azure OpenAI, RAG workflows, guardrails, CI/CD with Docker/GitHub Actions, PostgreSQL-backed state.

---

*To update this document: edit `lance-code.md` at the root of the GitHub Pages repo.*
