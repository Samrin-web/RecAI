import React, { useState } from 'react';
import { DomainType } from './types';
import { Header } from './components/Header';
import { InteRecAgentTab } from './components/InteRecAgentTab';
import { KnowledgePluginTab } from './components/KnowledgePluginTab';
import { RecExplainerTab } from './components/RecExplainerTab';
import { RecLMEmbTab } from './components/RecLMEmbTab';
import { RecLMGenTab } from './components/RecLMGenTab';
import { RecLMEvalTab } from './components/RecLMEvalTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('agent');
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('game');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {activeTab === 'agent' && <InteRecAgentTab selectedDomain={selectedDomain} />}
        {activeTab === 'plugin' && <KnowledgePluginTab selectedDomain={selectedDomain} />}
        {activeTab === 'explainer' && <RecExplainerTab selectedDomain={selectedDomain} />}
        {activeTab === 'emb' && <RecLMEmbTab selectedDomain={selectedDomain} />}
        {activeTab === 'gen' && <RecLMGenTab selectedDomain={selectedDomain} />}
        {activeTab === 'eval' && <RecLMEvalTab />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Microsoft RecAI (LLM4Rec) — Next-Generation Recommender Systems Suite</span>
          <span className="text-slate-600">Powered by Gemini AI Studio & Express Server</span>
        </div>
      </footer>
    </div>
  );
}
