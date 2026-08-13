import React, { useState } from 'react';
import { DomainType, ChatMessage, CatalogItem, ToolCallLog } from '../types';
import { ItemCard } from './ItemCard';
import { SAMPLE_USERS } from '../data/recaiData';
import {
  Send,
  Bot,
  User,
  Database,
  Filter,
  ArrowRightLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  RefreshCw,
  Terminal,
  Brain
} from 'lucide-react';

interface InteRecAgentTabProps {
  selectedDomain: DomainType;
}

export const InteRecAgentTab: React.FC<InteRecAgentTabProps> = ({ selectedDomain }) => {
  const [userId, setUserId] = useState<string>('gamer1');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: `Hello! I am **InteRecAgent**, Microsoft RecAI's conversational recommender system. I connect Gemini LLMs with domain recommendation tools (SQL Query, Item Similarity Retrieval, Preference Ranking, and Self-Reflection) to find your ideal ${selectedDomain === 'game' ? 'video games' : selectedDomain === 'movie' ? 'movies' : 'beauty products'}.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [activeToolLogs, setActiveToolLogs] = useState<ToolCallLog[]>([]);
  const [showToolLogs, setShowToolLogs] = useState<boolean>(true);

  const activeUser = SAMPLE_USERS[userId] || SAMPLE_USERS['gamer1'];

  const presetQueries = {
    game: [
      'I want challenging dark fantasy action RPGs with open world exploration',
      'Recommend cozy relaxing farming games without microtransactions',
      'Find high-rated turn-based RPGs with rich story'
    ],
    movie: [
      'Suggest epic sci-fi space movies directed by visionary filmmakers',
      'Recommend top-rated animation films suitable for fantasy fans',
      'Find historical drama movies with high awards acclaim'
    ],
    beauty: [
      'Recommend hydrating peptide serums for sensitive skin',
      'Suggest clean beauty SPF sunscreen tinted moisturizers',
      'Find gentle anti-aging night creams without harsh acids'
    ]
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          domain: selectedDomain,
          userId,
          history: messages.map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach agent server endpoint');
      }

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: data.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: data.items,
        toolLogs: data.toolLogs,
        thoughtProcess: data.thoughtProcess,
        reflectionNotes: data.reflectionNotes
      };

      setMessages(prev => [...prev, agentMsg]);
      if (data.toolLogs) {
        setActiveToolLogs(data.toolLogs);
      }
    } catch (err: any) {
      console.error('Error invoking agent API:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 2}`,
        sender: 'system',
        text: `⚠️ Agent connection error: ${err?.message || 'Could not reach server'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">InteRecAgent: Recommender AI Agent</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Combines Gemini LLM reasoning as the central brain with domain-specific tools (SQL Query Engine, Vector Similarity Search, Preference Ranking, and Self-Reflection) for interactive conversational recommendations.
          </p>
        </div>

        {/* User Profile Selector */}
        <div className="flex items-center space-x-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
          <User className="w-4 h-4 text-slate-400" />
          <div className="text-xs">
            <span className="text-slate-400 block font-medium">Active User Profile:</span>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs font-semibold rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              {Object.entries(SAMPLE_USERS).map(([id, user]) => (
                <option key={id} value={id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Chat vs Live Tool Execution Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chat Interface (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[640px] shadow-xl overflow-hidden">
          
          {/* Chat Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Live InteRecAgent Session ({selectedDomain.toUpperCase()})
              </span>
            </div>
            
            <button
              onClick={() => setMessages([messages[0]])}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
              title="Reset Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : msg.sender === 'system'
                      ? 'bg-amber-950/80 border border-amber-600/40 text-amber-200 text-xs'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none space-y-3'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-slate-700/40 pb-1">
                    <span className="font-bold uppercase tracking-wider flex items-center space-x-1">
                      {msg.sender === 'user' ? (
                        <>
                          <User className="w-3 h-3 mr-1 inline text-blue-200" /> You
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 mr-1 inline text-blue-400" /> InteRecAgent
                        </>
                      )}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Recommended Items inside Message */}
                  {msg.items && msg.items.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/60 space-y-2">
                      <p className="text-xs font-semibold text-blue-300 flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        Top Ranked Recommendations:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.items.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            explanationBadge="Tool Recommended"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-bl-none flex items-center space-x-3 text-xs text-slate-300 shadow">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span>InteRecAgent executing tools (Query → Retrieval → Ranking → Reflection)...</span>
                </div>
              </div>
            )}
          </div>

          {/* Preset Chips */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap">
              Try Preset:
            </span>
            {presetQueries[selectedDomain].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-slate-700 whitespace-nowrap transition-all"
              >
                "{q.slice(0, 30)}..."
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask InteRecAgent for recommendations in ${selectedDomain}...`}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Live Recommendation Tools Pipeline Log (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[640px]">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">InteRecAgent Tools Execution Log</h3>
            </div>
            <button
              onClick={() => setShowToolLogs(!showToolLogs)}
              className="text-slate-400 hover:text-white text-xs"
            >
              {showToolLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showToolLogs && (
            <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1">
              {activeToolLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Brain className="w-10 h-10 opacity-30 text-indigo-400" />
                  <p className="text-xs">
                    Send a query to observe how LLM reasoning orchestrates SQL Querying, Similarity Retrieval, and Preference Ranking tools.
                  </p>
                </div>
              ) : (
                activeToolLogs.map((log) => {
                  const toolIcon =
                    log.tool === 'query' ? Database :
                    log.tool === 'retrieval' ? Filter :
                    log.tool === 'ranking' ? ArrowRightLeft : CheckCircle2;
                  
                  const Icon = toolIcon;

                  return (
                    <div
                      key={log.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-bold flex items-center text-indigo-300">
                          <Icon className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                          {log.actionName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {log.durationMs}ms
                        </span>
                      </div>

                      <div className="bg-slate-900/90 rounded p-2 text-[11px] font-mono text-slate-300 space-y-1">
                        <div className="text-slate-400">INPUT:</div>
                        <div className="text-amber-300/90 truncate">
                          {typeof log.input === 'string' ? log.input : JSON.stringify(log.input)}
                        </div>
                        <div className="text-slate-400 pt-1">OUTPUT:</div>
                        <div className="text-emerald-300/90">
                          {typeof log.output === 'string' ? log.output : JSON.stringify(log.output)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* User Preferences Sidebar Summary */}
          <div className="mt-auto pt-3 border-t border-slate-800 bg-slate-950/80 rounded-xl p-3 text-xs space-y-1.5">
            <span className="font-semibold text-slate-300 block">
              Active Profile Rules ({activeUser.name}):
            </span>
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                Prefer: {activeUser.prefer.join(', ')}
              </span>
              <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                Unwanted: {activeUser.unwanted.join(', ')}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
