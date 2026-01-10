'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProviderSelector } from '@/components/ProviderSelector';
import { MessageContent } from '@/components/MessageContent';
import { type ModelSelection } from '@/lib/ai/registry';

export default function Chat() {
  const [selection, setSelection] = useState<ModelSelection>({
    provider: 'google',
    modelId: 'gemini-2.5-flash-lite',
  });

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      selection,
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 md:p-10">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl border-border/60 overflow-hidden bg-card/80 backdrop-blur-md">
        <CardHeader className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              Agentic Search Chat
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              v2.0 Agent
            </div>
          </div>
        </CardHeader>
        
        <ProviderSelector 
          selection={selection} 
          onSelect={setSelection} 
          disabled={isLoading || messages.length > 0} 
        />
        
        <CardContent className="flex-1 overflow-hidden p-0 relative bg-dot-pattern">
          <ScrollArea className="h-full p-4 md:p-8">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground p-8 space-y-4">
                <div className="bg-primary/10 p-6 rounded-full">
                  <Bot className="h-16 w-16 text-primary opacity-80" />
                </div>
                <div className="max-w-[400px] space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">How can I help you today?</h3>
                  <p className="text-sm">
                    Ask me anything! I can browse the web in real-time to provide up-to-date answers and deep insights.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-[500px] mt-8">
                  {['What is the price of Bitcoin today?', 'Latest news on AI agents', 'How to use Vercel AI SDK', 'Weather in Tokyo'].map((hint) => (
                    <button 
                      key={hint}
                      onClick={() => {
                        const event = { target: { value: hint } } as any;
                        handleInputChange(event);
                      }}
                      className="text-xs text-left p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      "{hint}"
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-8 pb-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-4 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role !== 'user' && (
                    <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                      <AvatarImage src="/bot-avatar.png" />
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col gap-2 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-5 py-3 shadow-sm ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted/80 text-foreground rounded-tl-none border border-border/40'
                      }`}
                    >
                      <MessageContent message={m} />
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1 uppercase tracking-widest font-bold opacity-50">
                      {m.role === 'user' ? 'User' : selection.modelId}
                    </span>
                  </div>

                  {m.role === 'user' && (
                    <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">ME</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                 <div className="flex gap-4 justify-start">
                    <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                    </Avatar>
                     <div className="bg-muted/80 text-foreground rounded-2xl rounded-tl-none px-5 py-3 shadow-sm border border-border/40">
                       <div className="flex items-center gap-3">
                         <Loader2 className="h-4 w-4 animate-spin text-primary" />
                         <span className="text-sm font-medium animate-pulse italic">Thinking...</span>
                       </div>
                     </div>
                 </div>
              )}
              {error && (
                <div className="flex justify-center w-full p-4">
                  <div className="bg-destructive/10 text-destructive text-xs px-4 py-2 rounded-full border border-destructive/20 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error.message || 'Failed to fetch response'}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t bg-card/80 p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex w-full gap-3 items-center max-w-3xl mx-auto">
            <div className="relative flex-1 group">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Message your agent..."
                className="flex-1 h-12 px-6 rounded-full border-2 border-muted hover:border-primary/30 focus-visible:ring-primary transition-all pr-12"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                ENTER TO SEND
              </div>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input?.trim()}
              className="h-12 w-12 rounded-full shadow-lg hover:shadow-primary/20 transition-all shrink-0"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}