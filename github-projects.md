---
layout: default
title: GitHub Project Portfolio
---

# GitHub Project Portfolio

This page summarizes the GitHub projects I have built, led, or used as applied R&D labs. The emphasis is on production-shaped AI systems: agentic workflows, retrieval, multimodal search, operator tools, and AI-assisted software engineering.

## Core AI Products

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| [Termly](https://github.com/lycanlancelot/Termly) | Creator / lead developer | FastAPI, Pydantic, Claude Sonnet, Azure Document Intelligence, OCR, Docker | Australian medical contract lifecycle automation: MPPA PDF generation, Medicare/PBS identifier validation, scanned PDF extraction, OCR correction, clause extraction, and compliance risk analysis. |
| [Remote Agent Workbench](https://github.com/lycanlancelot/remote-agent) | Creator / lead developer | React, Vite, Express, Socket.IO, TypeScript, Cloudflare Tunnel | Remote web workbench for Claude Code and Codex with live task execution, terminal streaming, file previews, agent health, permissions, task persistence, and a VS Code-like shell. |
| [AgentForge](https://github.com/lycanlancelot/agent-forge) | Creator / lead developer | React, Node.js, Express, Socket.IO, SQLite, xterm.js, WSL, Cloudflare Tunnel | Local control plane for multiple coding agents, with real-time terminals, task queues, git worktree parallelization, auto-commit scheduling, session logs, and remote access. |

## Retrieval, Multimodal, and Applied AI

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| [Video-RAG](https://github.com/Iliana678/Video-RAG) | Builder / collaborator | Python, CLIP, ChromaDB, OpenCV, LangChain, OpenAI/Anthropic/Gemini | Multimodal retrieval system that samples video frames, embeds visual evidence, stores it in a vector database, and answers natural-language queries with timestamped context. |
| Long-Document PDF Q&A Pipeline | Research prototype | PyMuPDF, Chroma/Marqo, Claude, Gemini, evaluation harnesses | Explored direct PDF ingestion versus RAG for long, layout-heavy documents, with citation-grounded answers and factual recall evaluation. |
| [AI Hedge Fund Lab](https://github.com/virattt/ai-hedge-fund) | Research fork / lab | Python, multi-agent workflows, market data, backtesting | Studied multi-agent financial reasoning patterns across valuation, fundamentals, sentiment, technical analysis, risk, and portfolio decision agents. |

## Operator and Consumer-Facing Apps

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| [Toy Gifting System](https://github.com/lycanlancelot/toy-gifting) | Creator / lead developer | Python, SQLite, JavaScript, Three.js, supplier APIs | Back-office tool for toy sourcing and gift-box assembly, combining product catalog ingestion, supplier metadata, compliance fields, operator feedback, and 3D packing visualization. |
| [BranchFlow / AI Writer](https://github.com/lycanlancelot/writer-helper) | Creator / lead developer | React, TypeScript, Vite, Tailwind, Framer Motion, React Flow | Nonlinear writing and prompt orchestration workbench for Seedance-style video generation, with branching story state, prompt drawers, mind maps, and Obsidian Canvas export. |
| RageZone / Quarrel-Mate | Creator / lead developer | WeChat Mini Program, Node.js, WebSocket, Firebase/JWT | LLM-powered communication assistant concept for emotionally charged conversations, with chat UI, personas, paid-entry placeholders, and token-based realtime service design. |
| Elder Companion | Creator / prototype | Expo, React Native, Firebase, audio/file APIs | Mobile companion prototype for elder-care workflows, exploring persistent state, media capture, and cross-platform app delivery. |

## Developer Tooling and Learning Infrastructure

| Project | Role | Stack | What it demonstrates |
|---|---|---|---|
| Claude Code Source Map Study | Research repo | Node.js, source maps, agentic coding analysis | Reverse-engineering and study notes around early Claude Code behavior, useful for understanding CLI agent architecture and developer workflow design. |
| AI Engineer Bootcamp / Dispatch.AI | Instructor / curriculum builder | LangGraph, Pydantic, Redis, MCP, guardrails, RAGAS | Training project structure for students building a booking assistant with durable state, tool routing, retrieval, guardrails, and evaluation. |

## Portfolio Themes

- **Agentic systems over demos:** Most projects are control planes, workflow engines, or retrieval systems that need state, permissions, logs, and operational feedback.
- **Human-in-the-loop engineering:** The systems keep the human reviewer close to architecture, acceptance criteria, and risk decisions while agents handle repeatable implementation work.
- **Production-shaped AI:** Even prototypes include deployment, observability, validation, test, or compliance thinking rather than stopping at a notebook.
- **Domain translation:** Projects span healthcare contracts, developer tooling, video understanding, toy sourcing, education, and communication support, showing the ability to map messy domain workflows into software contracts.
