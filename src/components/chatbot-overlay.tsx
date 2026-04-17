"use client"

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, ShieldCheck, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export function ChatbotOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Greetings. I am Cyber-Sphere Intelligence. How can I assist your security needs today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });

      const data = await response.json();

      if (!response.ok || !data.answer) {
        throw new Error(data.error || 'Invalid chatbot response');
      }

      setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
    } catch (error) {
      console.error('Chatbot request failed:', error);
      setMessages(prev => [...prev, { role: 'bot', content: 'System interference detected. Please try again or ask a different security question.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60]">
        {!isOpen && (
          <Button 
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl futuristic-glow group"
          >
            <MessageSquare className="h-8 w-8 transition-transform group-hover:scale-110" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[70] w-full max-w-[400px] h-[600px] bg-card border border-primary/30 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-primary/10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-sm tracking-wide uppercase">Cyber-Sphere Bot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] text-muted-foreground uppercase">System Active</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-accent/10 hover:text-accent">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-secondary border border-white/5 rounded-tl-none'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {m.role === 'bot' ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      <span className="text-[10px] opacity-60 uppercase font-bold">{m.role === 'bot' ? 'Core Intelligence' : 'User'}</span>
                    </div>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary border border-white/5 p-3 rounded-xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-primary/10">
            <div className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query security database..."
                className="bg-secondary/50 border-primary/20 focus-visible:ring-primary"
              />
              <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}