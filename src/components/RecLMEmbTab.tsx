import React, { useState, useEffect } from 'react';
import { DomainType, VectorSearchResult } from '../types';
import { ItemCard } from './ItemCard';
import { Search, Sparkles, SlidersHorizontal, Activity } from 'lucide-react';

interface RecLMEmbTabProps {
  selectedDomain: DomainType;
}

export const RecLMEmbTab: React.FC<RecLMEmbTabProps> = ({ selectedDomain }) => {
  const [searchQuery, setSearchQuery] = useState<string>('dark fantasy open world');
  const [results, setResults] = useState<VectorSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVectorSearch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/embedding-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, domain: selectedDomain })
      });

      if (!res.ok) throw new Error('Vector search failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Vector search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleVectorSearch();
  }, [selectedDomain]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RecLM-emb: Embedding Retrieval Engine</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimized dense text-embedding retrieval model for item retrieval, RAG, search queries, item description embeddings, and user instructions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVectorSearch()}
              placeholder="Type natural language query (e.g. 'cozy relaxing game with farming')..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={handleVectorSearch}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search Vectors</span>
          </button>
        </div>
      </div>

      {/* Vector Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-200 flex items-center">
            <Activity className="w-4 h-4 text-emerald-400 mr-1.5" />
            Top Nearest Neighbor Embeddings ({results.length} items)
          </span>
          <span>Domain filter: <strong className="text-emerald-400">{selectedDomain.toUpperCase()}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.map((res) => (
            <ItemCard
              key={res.item.id}
              item={res.item}
              score={res.similarityScore}
              explanationBadge={`${res.matchType} Match`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
