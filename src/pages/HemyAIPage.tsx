import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  Card,
  Body1,
  Caption1,
} from '@fluentui/react-components';
import {
  SendRegular,
  DismissRegular,
} from '@fluentui/react-icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function HemyAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Hemy AI. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual Azure AI Foundry API call
      // Example:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMessage.content }),
      // });
      // const data = await response.json();

      // For now, simulate a response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `You said: "${userMessage.content}". This is a placeholder response. Connect to Azure AI Foundry to get real AI responses.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m Hemy AI. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAF8F2]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#021838] shadow-md">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <HemyAIIcon className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-[#FAF8F2]" title="Hemy AI - Intelligent Assistant">
              Hemy AI
            </span>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-lg hover:bg-[#FAF8F2]/20 transition duration-200"
            title="Clear chat history"
          >
            <DismissRegular className="w-5 h-5 text-[#FAF8F2]" />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <Card
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-[#021838] text-[#FAF8F2]'
                  : 'bg-white text-[#021838] border border-[#DDD4C0]'
              }`}
            >
              <Body1>{message.content}</Body1>
              <Caption1 className={`mt-2 ${
                message.role === 'user' ? 'text-[#FAF8F2]/70' : 'text-[#666]'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </Caption1>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="px-4 py-3 rounded-lg bg-white text-[#021838] border border-[#DDD4C0]">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#7C4D2F] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#7C4D2F] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-[#7C4D2F] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-[#DDD4C0] bg-[#FAF8F2] p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
            appearance="filled-darker"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            icon={<SendRegular />}
            appearance="primary"
            className="bg-[#7C4D2F] hover:bg-[#633d25] text-white"
          />
        </div>
        <Caption1 className="mt-2 text-center text-[#666]">
          Press Shift+Enter for new line, Enter to send
        </Caption1>
      </div>
    </div>
  );
}

function HemyAIIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4v-4m0 0H8m4 0h4M4 12a8 8 0 1116 0 8 8 0 01-16 0z"
      />
    </svg>
  );
}
