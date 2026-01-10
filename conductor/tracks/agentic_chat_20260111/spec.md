# Specification: Agentic Reimplementation with Browser Search

## Overview
This track involves a complete "clean slate" reimplementation of the AI chat application. The goal is to create a robust, agentic chat interface using the latest Vercel AI SDK that supports dynamic provider switching and browser search via tool calling.

## Functional Requirements
- **Agentic Core:** Implement a working agent using Vercel AI SDK's `generateText` or `streamText` with tool-calling capabilities.
- **Browser Search Tool:** Integrate the Tavily AI API to allow the agent to perform real-time web searches.
- **Dynamic Provider Switching:**
    - Support multiple providers: OpenRouter, Google Gemini, OpenAI, etc.
    - Implement a UI dropdown/selector for real-time model/provider switching.
- **Robustness & Transparency:**
    - **Reasoning Trace:** Display the agent's intermediate "thought process" and tool-call status in the UI.
    - **Streaming Progress:** Provide real-time streaming for both text responses and tool execution updates.
    - **Rate Limit Management:** Implement resilient handling for API rate limits and connection issues.
- **Clean Slate:** Remove or bypass existing chat implementation logic to ensure a fresh, bug-free foundation.

## Non-Functional Requirements
- **Performance:** Maintain low latency for UI updates during multi-step agent operations.
- **Type Safety:** Ensure full TypeScript coverage for all new AI logic and tool definitions.
- **Observability:** Log tool calls and provider switching for easier debugging.

## Acceptance Criteria
- [ ] Users can switch between at least two different AI providers in the UI.
- [ ] The agent successfully calls the Tavily tool to answer questions requiring real-time info.
- [ ] The UI displays a "thinking" or "reasoning" state while the agent is processing tools.
- [ ] Responses are streamed to the UI in real-time.
- [ ] The application handles API errors without crashing, showing user-friendly messages.

## Out of Scope
- Migrating historical chat data from the current (broken) implementation.
- Complex multi-agent orchestrations (staying focused on a single robust agent).
