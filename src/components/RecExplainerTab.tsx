import React, { useState, useEffect } from 'react';
import { DomainType, ExplanationResult, CatalogItem } from '../types';
import { CATALOG_ITEMS, SAMPLE_USERS } from '../data/recaiData';
import { Cpu, GitBranch, Target, ShieldAlert, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface RecExplainerTabProps {
  selectedDomain: DomainType;
}

export const RecExplainerTab: React.FC<RecExplainerTabProps> = ({ selectedDomain }) => {
  const domainCatalog = CATALOG_ITEMS.filter(i => i.domain === selectedDomain);
  const [selectedItemId, setSelectedItemId] = useState<string>(domainCatalog[0]?.id || 'g-001');
  const [surrogateModel, setSurrogateModel] = useState<'MatrixFactorization' | 'LightGCN' | 'Item2Vec' | 'SASRec'>('LightGCN');
  const [userId, setUserId] = useState<string>('gamer1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);

  const activeUser = SAMPLE_USERS[userId] || SAMPLE_USERS['gamer1'];
  const activeItem = CATALOG_ITEMS.find(i => i.id === selectedItemId) || domainCatalog[0];

  const handleGenerateExplanation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItemId,
          surrogateModel,
          userId
        })
      });

      if (!res.ok) throw new Error('Explanation request failed');
      const data: ExplanationResult = await res.json();
      setExplanation(data);
    } catch (err) {
      console.error('Error generating explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (domainCatalog.length > 0) {
      setSelectedItemId(domainCatalog[0].id);
    }
  }, [selectedDomain]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RecExplainer: Model Explainer</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aligns LLMs as surrogate models to mimic, comprehend, and generate multi-perspective natural language explanations for black-box recommendation models (Matrix Factorization, LightGCN, Item2Vec, SASRec).
            </p>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          
          {/* Target Item Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Select Target Item:
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-xs font-medium rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-purple-500"
            >
              {domainCatalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} (${item.price})
                </option>
              ))}
            </select>
          </div>

          {/* Surrogate Model Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Surrogate Recommender Model:
            </label>
            <select
              value={surrogateModel}
              onChange={(e) => setSurrogateModel(e.target.value as any)}
              className="w-full bg-slate-900 text-slate-200 text-xs font-medium rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="LightGCN">LightGCN (Graph Neural Network)</option>
              <option value="MatrixFactorization">Matrix Factorization (Latent Factors)</option>
              <option value="SASRec">SASRec (Sequential Attention)</option>
              <option value="Item2Vec">Item2Vec (Item Embeddings)</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateExplanation}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Aligning Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Model Prediction</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Target Item & User Context Card */}
      {activeItem && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {activeItem.imageUrl && (
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                Target Recommendation Item
              </span>
              <h3 className="text-base font-bold text-white">{activeItem.title}</h3>
              <p className="text-xs text-slate-400">{activeItem.description}</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300 min-w-[240px]">
            <span className="font-semibold text-purple-300 block">User History Context:</span>
            <p className="text-slate-400 text-[11px]">
              User prefers: <span className="text-slate-200 font-medium">{activeUser.prefer.join(', ')}</span>
            </p>
          </div>
        </div>
      )}

      {/* Explanation Perspective Grid */}
      {explanation ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Behavior Alignment */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-blue-400">
              <GitBranch className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Behavior Alignment</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {explanation.behaviorAlignment}
            </p>
          </div>

          {/* Intention Alignment */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-purple-400">
              <Target className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Intention Alignment</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {explanation.intentionAlignment}
            </p>
          </div>

          {/* Counterfactual Explanation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Counterfactual Explanation</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {explanation.counterfactualExplanation}
            </p>
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Cpu className="w-12 h-12 mx-auto text-purple-400 opacity-40" />
          <h3 className="text-base font-semibold text-slate-200">Generate Multi-Perspective Explanation</h3>
          <p className="text-xs max-w-lg mx-auto">
            Select a recommender surrogate model and click "Explain Model Prediction" to generate behavior, intention, and counterfactual explanations.
          </p>
        </div>
      )}

    </div>
  );
};
