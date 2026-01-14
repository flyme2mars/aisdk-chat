'use client';

import { type Message } from 'ai';

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main Text Content */}
      {message.content && (
        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {message.content}
        </div>
      )}
    </div>
  );
}