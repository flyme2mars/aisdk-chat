'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Chat() {
  const { messages, status, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    await sendMessage({ text: currentInput });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 md:p-10">
      <Card className="w-full max-w-2xl h-[85vh] flex flex-col shadow-xl border-border/60">
        <CardHeader className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 relative">
          <ScrollArea className="h-full p-4 md:p-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 opacity-50">
                <Bot className="h-12 w-12 mb-4" />
                <p className="text-sm">Start a conversation with your AI assistant.</p>
              </div>
            )}
            
            <div className="flex flex-col gap-6 pb-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role !== 'user' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src="/bot-avatar.png" />
                    </Avatar>
                  )}
                  
                  <div
                    className={`rounded-lg px-4 py-2.5 max-w-[85%] text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted text-foreground rounded-tl-none'
                    }`}
                  >
                    {m.parts.map((part, i) => (
                      part.type === 'text' ? <span key={i}>{part.text}</span> : null
                    ))}
                  </div>

                  {m.role === 'user' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                 <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                     <div className="bg-muted text-foreground rounded-lg rounded-tl-none px-4 py-2.5 shadow-sm">
                       <span className="flex gap-1">
                         <span className="animate-bounce delay-0">.</span>
                         <span className="animate-bounce delay-150">.</span>
                         <span className="animate-bounce delay-300">.</span>
                       </span>
                     </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t bg-card p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
