import React from 'react';
import { DomainType } from '../types';
import { Bot, Sparkles, Database, Search, Sliders, BarChart3, Cpu, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDomain: DomainType;
  setSelectedDomain: (domain: DomainType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDomain,
  setSelectedDomain
}) => {
  const tabs = [
    { id: 'agent', label: 'InteRecAgent', icon: Bot, desc: 'Interactive Agent' },
    { id: 'plugin', label: 'Knowledge Plugin', icon: Layers, desc: 'Selective Knowledge' },
    { id: 'explainer', label: 'RecExplainer', icon: Cpu, desc: 'Model Explainer' },
    { id: 'emb', label: 'RecLM-emb', icon: Search, desc: 'Vector Retrieval' },
    { id: 'gen', label: 'RecLM-gen', icon: Sliders, desc: 'Controllable Ranker' },
    { id: 'eval', label: 'RecLM-eval', icon: BarChart3, desc: 'Benchmark Evaluator' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Microsoft RecAI
                </span>
                <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-2 py-0.5 rounded border border-blue-700/50">
                  LLM4Rec Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Next-Gen LLM Recommender Systems Framework
              </p>
            </div>
          </div>

          {/* Domain Selector */}
          <div className="flex items-center space-x-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <Database className="w-4 h-4 text-slate-400 ml-2 hidden sm:block" />
            <span className="text-xs font-medium text-slate-400 hidden sm:block">Catalog:</span>
            {(['game', 'movie', 'beauty'] as DomainType[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedDomain === d
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {d === 'game' ? '🎮 Video Games' : d === 'movie' ? '🎬 Movies & TV' : '💄 Beauty & Skin'}
              </button>
            ))}
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/60 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
