# Implementation Plan: Agentic Reimplementation with Browser Search

This plan follows a TDD-centric approach to reimplement the chat application as a robust agentic interface.

## Phase 1: Foundation & Provider Configuration [checkpoint: 63073e3]
- [x] Task: Set up environment variables and API clients for Tavily, OpenRouter, and Gemini. 861d311
- [x] Task: Implement a unified `ProviderRegistry` to manage dynamic switching between AI models. 861d311
- [x] Task: Write unit tests for provider initialization and configuration validation. 861d311
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation' (Protocol in workflow.md) 63073e3

## Phase 2: Tool Integration & Agent Logic [checkpoint: f330c2e]
- [x] Task: Implement the Tavily Search tool using Vercel AI SDK `tool()` definition. 30eb645
- [x] Task: Create the core agent logic using `streamText` with support for recursive tool calling. ebfb5a8
- [x] Task: Write tests for tool execution (mocking Tavily API) and agent response structure. 01332b8
- [x] Task: Conductor - User Manual Verification 'Phase 2: Agent Logic' (Protocol in workflow.md) f330c2e

## Phase 3: UI/UX Reimplementation (Clean Slate)
- [x] Task: Scaffold the new chat layout, bypassing the current implementation. 13a1623
- [x] Task: Build the `ProviderSelector` component for real-time model switching. 13a1623
- [x] Task: Implement the `MessageContent` component to handle streaming text and "Reasoning Trace" (tool-call status). 13a1623
- [x] Task: Write integration tests for the chat flow, ensuring messages are appended and streamed correctly. 13a1623
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI/UX' (Protocol in workflow.md)

## Phase 4: Robustness & Error Handling
- [ ] Task: Implement global error boundaries and user-friendly error notifications for API failures.
- [ ] Task: Add rate-limiting logic and backoff retries for provider calls.
- [ ] Task: Final polish: Ensure smooth auto-scrolling and mobile responsiveness.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Robustness' (Protocol in workflow.md)
