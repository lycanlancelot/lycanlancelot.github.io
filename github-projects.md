---
layout: default
title: GitHub Project Portfolio
---

# GitHub Project Portfolio

This page summarises the GitHub projects I have built or meaningfully contributed to. I group them by the engineering problems they demonstrate: search and retrieval systems, applied ML and AI products, agentic developer tooling, data science workflows, and human-facing AI applications.

My background is a PhD in search and recommendation systems, three years as a Data Scientist building search ranking, recommendation, and content-understanding pipelines at Redbubble (100 M+ user events), and current work on production LLM and agentic systems. These projects span that full arc — from classical retrieval and ML to modern RAG, agents, and evaluation engineering.

## Applied AI Products

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| [Termly](https://github.com/lycanlancelot/Termly) | Creator / lead developer | FastAPI, Pydantic, Claude Sonnet, Azure Document Intelligence, Tesseract OCR, Docker, Azure/Vercel/Supabase | Australian medical contract automation: MPPA PDF generation, Medicare/PBS identifier validation, scanned PDF extraction, OCR correction, structured clause/entity extraction, and compliance-oriented risk analysis. |
| [Video-RAG](https://github.com/Iliana678/Video-RAG) | Builder / collaborator | Python, CLIP, ChromaDB, OpenCV, LangChain, OpenAI/Anthropic/Gemini, uv | Multimodal retrieval system for video and image collections: frame sampling, vision-language embeddings, persistent vector search, timestamped retrieval, and optional LLM answer generation. |
| [RageZone](https://github.com/lycanlancelot/ragezone) | Creator / lead developer | WeChat Mini Program, Node.js, WebSocket, Firebase/JWT, OpenAI/Gemini/Deepgram, Supabase | Realtime communication assistant for emotionally charged conversations, with persona/mode setup, chat UI, WebSocket service design, corpus/evaluation scripts, and product hooks for paid usage. |
| [Elder Companion](https://github.com/lycanlancelot/elder-companion) | Creator / prototype | Expo, React Native, Firebase, ElevenLabs, Claude, audio APIs | Mobile voice companion prototype with elder-facing chat, family dashboard, message storage, daily summary planning, and alert workflow design. |

## Agentic Developer Tooling

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| [Remote Agent Workbench](https://github.com/lycanlancelot/remote-agent) | Creator / lead developer | React, Vite, TypeScript, Express, Socket.IO, Cloudflare Tunnel, Codex CLI, Claude Code | VS Code-like remote workbench for running Claude Code and Codex from a browser, including live terminal output, task persistence, file previews, permission prompts, model controls, and safe allowed-directory execution. |
| [AgentForge](https://github.com/lycanlancelot/agent-forge) | Creator / lead developer | React, Node.js, Express, Socket.IO, SQLite, xterm.js, WSL, git worktrees, PM2 | Local control plane for multiple coding agents, with real-time terminals, task queues, worktree isolation, auto-commit scheduling, session logs, and Cloudflare Tunnel remote access. |
| [Claude Code Source Map](https://github.com/lycanlancelot/claude-code-sourcemap) | Research / analysis | Node.js, source maps, CLI architecture notes | Early technical study of Claude Code internals and agent CLI behavior, used to understand terminal-agent architecture, command flow, and developer workflow design. |

## Operator and Workflow Systems

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| [Toy Gifting System](https://github.com/lycanlancelot/toy-gifting) | Creator / lead developer | Python, SQLite, JavaScript, Three.js, supplier APIs, data-import scripts | Back-office tool for toy sourcing and gift-box assembly, combining supplier catalog ingestion, compliance metadata, operator feedback, bilingual product data, and 3D packing visualization. |
| [BranchFlow / AI Writer](https://github.com/lycanlancelot/writer-helper) | Creator / lead developer | React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Flow | Local nonlinear writing and prompt orchestration workbench for Seedance-style video generation, with branching narrative state, prompt drawers, mind-map view, and Obsidian Canvas export. |
| Dispatch.AI Course Project | Instructor / curriculum builder | LangGraph, Pydantic, Redis, MCP, guardrails, RAGAS | AI engineering course project where students build a booking assistant with durable state, tool routing, retrieval, guardrails, and evaluation rather than a single prompt demo. |

## Research Forks and Labs

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| [AI Hedge Fund Lab](https://github.com/virattt/ai-hedge-fund) | Research fork / study | Python, multi-agent workflows, market data, backtesting | Study of multi-agent financial reasoning patterns across valuation, fundamentals, sentiment, technical analysis, risk, and portfolio decision agents. |
| [TradingAgents](https://github.com/TauricResearch/TradingAgents) | Research fork / study | Python, LLM agents, financial workflow simulation | Comparative study of trading-agent orchestration patterns and debate-style analyst roles for complex decision workflows. |
| Everything Claude Code | Contribution / tooling study | Shell, TypeScript, Python, hooks, commands, skills | Agent-harness performance and workflow system studied and adapted for my own Claude Code / Codex operating practice; I treat this as tooling research, not an original product claim. |

## What These Projects Show

- **Search, ranking, and retrieval foundations:** PhD research on personalised ranking and search (VLDB Journal, DASFAA, ADC) informs how I design retrieval quality, evaluation metrics, and vector search layers throughout these projects.
- **Data science and ML depth:** Three years at Redbubble building search, recommendation, content classification, and moderation systems at 100 M+ event scale — feature pipelines, A/B experimentation, MLOps, and measurable business outcomes.
- **Applied AI beyond prompt demos:** The stronger projects include data schemas, service boundaries, validation logic, UI states, operational logs, deployment steps, and recovery paths.
- **Agentic workflow design:** Remote Agent Workbench and AgentForge show direct experience building the control surfaces needed to make coding agents usable for repeated work.
- **Retrieval depth:** Termly and Video-RAG cover two different RAG shapes — document/contract extraction and visual/video multimodal retrieval.
- **Product judgment:** RageZone, Elder Companion, BranchFlow, and Toy Gifting translate messy human workflows into focused software flows rather than over-general AI chat boxes.
- **Honest scope control:** Original builds, collaborations, prototypes, and research forks are kept clearly separate so the technical signal stays credible.
