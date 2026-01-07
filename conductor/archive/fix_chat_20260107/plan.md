# Plan: Fix Multi-turn Chat and Stabilize OpenRouter Integration

## Phase 1: Diagnosis and Environment Setup
- [x] Task: Verify current state and dependencies
    - [x] Sub-task: Check `package.json` for current SDK versions.
    - [x] Sub-task: Run the app and reproduce the failure on the second message.
    - [x] Sub-task: Inspect server logs during the failure.
- [x] Task: Research OpenRouter and Vercel AI SDK v6 compatibility
    - [x] Sub-task: Search for specific requirements for `xiaomi/mimo-v2-flash` on OpenRouter (message format).
    - [x] Sub-task: Verify correct usage of `convertToModelMessages` vs manual mapping for this specific case.

## Phase 2: Implementation Fix
- [x] Task: Refactor API Route for Robustness
    - [x] Sub-task: Implement explicit message mapping in `app/api/chat/route.ts` to ensure `content` is always a string (flattening any arrays if necessary), as some OpenRouter models might not support the "parts" array structure from SDK v6.
    - [x] Sub-task: Add extensive logging to the API route to trace the incoming `messages` array and the outgoing payload to OpenRouter.
    - [x] Sub-task: Verify `streamProtocol` usage (ensure frontend and backend match).
- [x] Task: Test and Refine
    - [x] Sub-task: Test multi-turn conversation manually.
    - [x] Sub-task: If issues persist, try a known "safe" model (like `meta-llama/llama-3.2-1b-instruct:free`) to rule out model-specific issues vs. integration issues.

## Phase 3: Cleanup and Final Verification
- [x] Task: Remove Debug Logging
    - [x] Sub-task: Clean up verbose console logs from the API route.
- [x] Task: Final Polish
    - [x] Sub-task: Ensure the UI correctly displays the conversation history.
    - [x] Sub-task: Verify error handling (e.g., if the API key is missing or the service is down).
