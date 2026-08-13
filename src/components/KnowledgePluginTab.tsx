import React, { useState } from 'react';
import { DomainType, KnowledgePluginComparison } from '../types';
import { ItemCard } from './ItemCard';
import { Layers, Zap, AlertTriangle, CheckCircle, Code, Play, Sparkles, ShieldCheck } from 'lucide-react';

interface KnowledgePluginTabProps {
  selectedDomain: DomainType;
}

export const KnowledgePluginTab: React.FC<KnowledgePluginTabProps> = ({ selectedDomain }) => {
  const [query, setQuery] = useState<string>(
    selectedDomain === 'game'
      ? 'Recommend challenging open world action RPGs with deep lore'
      : selectedDomain === 'movie'
      ? 'Find sci-fi space movies with mind-bending plots'
      : 'Suggest hydrating peptide serums for sensitive skin'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comparison, setComparison] = useState<KnowledgePluginComparison | null>(null);
  const [showInjectedCode, setShowInjectedCode] = useState<boolean>(false);

  const handleRunComparison = async () => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/knowledge-plugin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: query, domain: selectedDomain })
      });

      if (!res.ok) throw new Error('Failed to run comparison');
      const data: KnowledgePluginComparison = await res.json();
      setComparison(data);
    } catch (err) {
      console.error('Error running knowledge plugin comparison:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Selective Knowledge Plugin</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enhance LLM domain-specific recommendation ability without fine-tuning by dynamically injecting structured item profiles, popularity trends, and domain constraints into prompt contexts.
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Enter recommendation request in ${selectedDomain}...`}
            className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleRunComparison}
            disabled={isLoading || !query.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 shrink-0"
          >
            {isLoading ? (
              <span>Running LLM Comparison...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Test Knowledge Plugin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-side Comparison Grid */}
      {comparison ? (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Standard LLM (Without Plugin) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Standard LLM (Zero-Shot, No Plugin)</h3>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800">
                  Grounding: {(comparison.withoutPlugin.groundingAccuracy * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  LLM Output Text:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {comparison.withoutPlugin.response}
                </p>

                {comparison.withoutPlugin.hallucinatedItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-semibold text-rose-400 block mb-1">
                      ⚠️ Detected Out-of-Domain / Hallucinated Items:
                    </span>
                    <ul className="list-disc list-inside text-xs text-rose-300/80 space-y-0.5">
                      {comparison.withoutPlugin.hallucinatedItems.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Knowledge-Injected LLM (With Plugin) */}
            <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Selective Knowledge Plugin Injected</h3>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  Grounding: {(comparison.withPlugin.groundingAccuracy * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-indigo-900/40 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                  LLM Output (Grounding Verified):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {comparison.withPlugin.response}
                </p>

                {/* Grounded Recommended Items */}
                {comparison.withPlugin.recommendedItems.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Grounded Items In Catalog:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {comparison.withPlugin.recommendedItems.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          explanationBadge="Knowledge Verified"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Prompt Inspector Drawer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Injected Knowledge Prompt Inspector</h3>
              </div>
              <button
                onClick={() => setShowInjectedCode(!showInjectedCode)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {showInjectedCode ? 'Hide Injected Prompt' : 'View Injected Prompt'}
              </button>
            </div>

            {showInjectedCode && (
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                {comparison.withPlugin.injectedKnowledge}
              </pre>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Sparkles className="w-12 h-12 mx-auto text-indigo-400 opacity-40" />
          <h3 className="text-base font-semibold text-slate-200">Test Knowledge Injected Recommendations</h3>
          <p className="text-xs max-w-lg mx-auto">
            Click "Test Knowledge Plugin" above to observe how Selective Knowledge Injection eliminates hallucination and guarantees 100% catalog grounding.
          </p>
        </div>
      )}

    </div>
  );
};
