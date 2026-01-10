'use client';

import { type Message } from 'ai';
import { Loader2, Search, CheckCircle2, Globe } from 'lucide-react';

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Tool Invocations (Reasoning Trace) */}
      {message.toolInvocations?.map((toolInvocation) => {
        const { toolCallId, toolName, state } = toolInvocation;

        if (toolName === 'webSearch') {
          return (
            <div
              key={toolCallId}
              className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md border border-border/40 animate-in fade-in slide-in-from-bottom-1"
            >
              {state === 'call' ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <div className="flex gap-1 items-center">
                    <Search className="h-3 w-3 opacity-70" />
                    <span>
                      Searching for:{' '}
                      <span className="font-semibold text-foreground italic">
                        "{(toolInvocation.args as any).query}"
                      </span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <div className="flex gap-1 items-center">
                    <Globe className="h-3 w-3 text-primary opacity-70" />
                    <span>
                      Search completed for:{' '}
                      <span className="font-semibold text-foreground">
                        "{(toolInvocation.args as any).query}"
                      </span>
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        }

        return null;
      })}

      {/* Main Text Content */}
      {message.content && (
        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {message.content}
        </div>
      )}
    </div>
  );
}
