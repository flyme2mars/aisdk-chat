# Specification: Fix Multi-turn Chat and Stabilize OpenRouter Integration

## Context
The current application, a Next.js AI chat app using Vercel AI SDK, fails to handle multi-turn conversations. The first user message receives a response, but subsequent messages fail. The user specifically wants to use the `xiaomi/mimo-v2-flash:free` model via OpenRouter. The failure likely stems from incorrect message formatting or handling of the conversation history when interacting with the specific OpenRouter provider/model combination.

## Goals
1.  **Fix Multi-turn Chat:** Ensure that the user can continue a conversation beyond the first message.
2.  **Stabilize OpenRouter Integration:** Verify that the integration with OpenRouter (specifically for the Xiaomi model) is robust and handles API requirements correctly.
3.  **Update Dependencies:** Ensure the Vercel AI SDK and related packages are up-to-date and configured according to the latest best practices.

## Technical Requirements
-   **Model:** `xiaomi/mimo-v2-flash:free`
-   **Provider:** OpenRouter (via `@ai-sdk/openai` or compatible provider)
-   **Message Format:** Ensure messages sent to the API are in the correct format (likely simple content strings for this specific model, rather than complex content parts).
-   **Streaming:** Maintain or fix streaming functionality using the correct Vercel AI SDK v6 protocol (`toDataStreamResponse` / `toUIMessageStreamResponse`).

## Verification Plan
-   **Manual Testing:**
    -   Start the app.
    -   Send a message (e.g., "Hello").
    -   Verify response.
    -   Send a second message (e.g., "Tell me a joke").
    -   Verify response.
-   **Logging:** Add server-side logging to inspect the payload sent to OpenRouter during the second turn to identify the exact cause of the failure (e.g., 400 Bad Request due to format).
