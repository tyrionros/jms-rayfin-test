import { useEffect, useRef, useState } from 'react';
import { Button, Input, Card, Caption1 } from '@fluentui/react-components';
import { SendRegular, DismissRegular } from '@fluentui/react-icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

interface ChartData {
  type: 'line' | 'bar' | 'pie';
  data: Record<string, any>[];
  dataKey?: string;
  xAxisKey?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  table?: TableData;
  chart?: ChartData;
}

export function HemyAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '# Welcome to Hemy AI\n\nI can help you with:\n- **Data Analysis** — Query and visualize your metrics\n- **Insights** — Get AI-powered recommendations\n- **Reports** — Generate tables and charts\n\nTry asking me about your data!',
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
      const endpoint = import.meta.env.VITE_AI_FOUNDRY_ENDPOINT;
      const apiKey = import.meta.env.VITE_AI_FOUNDRY_API_KEY;

      if (!endpoint || !apiKey) {
        throw new Error('AI Foundry not configured');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage.content }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || data.content || '';
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        table: data.table,
        chart: data.chart,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **Error**: ${error instanceof Error ? error.message : 'Failed to reach AI Foundry'}\n\n**Setup required:**\n1. Edit \`/rayfin/.env\`\n2. Set \`VITE_AI_FOUNDRY_ENDPOINT\`\n3. Set \`VITE_AI_FOUNDRY_API_KEY\`\n4. Run \`npm run build\``,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '# Welcome to Hemy AI\n\nI can help you with:\n- **Data Analysis** — Query and visualize your metrics\n- **Insights** — Get AI-powered recommendations\n- **Reports** — Generate tables and charts\n\nTry asking me about your data!',
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
            <div className={`max-w-2xl ${message.role === 'user' ? 'max-w-xs' : ''}`}>
              <Card
                className={`px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#021838] text-[#FAF8F2]'
                    : 'bg-white text-[#021838] border border-[#DDD4C0]'
                }`}
              >
                <div className="prose prose-sm max-w-none text-sm">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown>
                </div>

                {/* Table Rendering */}
                {message.table && (
                  <div className="mt-4 overflow-x-auto border border-[#DDD4C0] rounded">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-[#021838] text-[#FAF8F2]">
                        <tr>
                          {message.table.headers.map((header, idx) => (
                            <th key={idx} className="px-4 py-2 text-left font-semibold border-b">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {message.table.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-[#FAF8F2]' : 'bg-white'}>
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="px-4 py-2 border-b border-[#DDD4C0]">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Chart Rendering */}
                {message.chart && (
                  <div className="mt-4 w-full h-80 flex justify-center">
                    {message.chart.type === 'bar' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={message.chart.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={message.chart.xAxisKey} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey={message.chart.dataKey} fill="#7C4D2F" />
                          <Bar dataKey="target" fill="#DDD4C0" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {message.chart.type === 'line' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={message.chart.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={message.chart.xAxisKey} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey={message.chart.dataKey} stroke="#7C4D2F" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                    {message.chart.type === 'pie' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={message.chart.data}
                            dataKey={message.chart.dataKey}
                            nameKey={message.chart.xAxisKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {message.chart.data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={['#021838', '#7C4D2F', '#DDD4C0', '#C4956A'][index % 4]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}

                <Caption1 className={`mt-2 ${
                  message.role === 'user' ? 'text-[#FAF8F2]/70' : 'text-[#666]'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </Caption1>
              </Card>
            </div>
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
