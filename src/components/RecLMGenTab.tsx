import React, { useState, useEffect } from 'react';
import { DomainType, RankedItemResult, GenerativeRankConstraint } from '../types';
import { CATALOG_ITEMS } from '../data/recaiData';
import { ItemCard } from './ItemCard';
import { Sliders, CheckCircle, XCircle, Sparkles, Filter, ShieldCheck } from 'lucide-react';

interface RecLMGenTabProps {
  selectedDomain: DomainType;
}

export const RecLMGenTab: React.FC<RecLMGenTabProps> = ({ selectedDomain }) => {
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [minRating, setMinRating] = useState<number>(4.5);
  const [requiredTag, setRequiredTag] = useState<string>('');
  const [excludedTag, setExcludedTag] = useState<string>('');
  const [rankedResults, setRankedResults] = useState<RankedItemResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const domainCatalog = CATALOG_ITEMS.filter(i => i.domain === selectedDomain);

  const handleRankItems = async () => {
    setIsLoading(true);
    try {
      const constraints: GenerativeRankConstraint = {
        maxPrice,
        minRating,
        requiredTags: requiredTag ? [requiredTag] : [],
        excludedTags: excludedTag ? [excludedTag] : []
      };

      const res = await fetch('/api/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: domainCatalog, constraints })
      });

      if (!res.ok) throw new Error('Ranking failed');
      const data = await res.json();
      setRankedResults(data.results || []);
    } catch (err) {
      console.error('Error ranking items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRankItems();
  }, [selectedDomain, maxPrice, minRating, requiredTag, excludedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RecLM-gen: Controllable Generative Ranker</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fine-tuned generative ranker ensuring strict instruction following, user constraint satisfaction, and domain grounding across candidate catalogs.
            </p>
          </div>
        </div>

        {/* Constraint Controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          
          {/* Price Slider */}
          <div>
            <label className="text-xs font-semibold text-slate-400 justify-between flex mb-1">
              <span>Max Price Limit:</span>
              <span className="text-blue-400 font-bold">${maxPrice}</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800"
            />
          </div>

          {/* Min Rating Slider */}
          <div>
            <label className="text-xs font-semibold text-slate-400 justify-between flex mb-1">
              <span>Min Rating Threshold:</span>
              <span className="text-amber-400 font-bold">★ {minRating}</span>
            </label>
            <input
              type="range"
              min="4.0"
              max="5.0"
              step="0.1"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800"
            />
          </div>

          {/* Required Tag */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Must Include Tag:
            </label>
            <input
              type="text"
              value={requiredTag}
              onChange={(e) => setRequiredTag(e.target.value)}
              placeholder="e.g. RPG, Sci-Fi, Skincare"
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Excluded Tag */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Exclude Tag:
            </label>
            <input
              type="text"
              value={excludedTag}
              onChange={(e) => setExcludedTag(e.target.value)}
              placeholder="e.g. Casual, Horror"
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-rose-500"
            />
          </div>

        </div>
      </div>

      {/* Ranked Items List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center">
          <ShieldCheck className="w-4 h-4 text-blue-400 mr-2" />
          Controllable Re-Ranked Candidate List ({rankedResults.length} Items)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankedResults.map((res) => (
            <div
              key={res.item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex gap-4 items-start"
            >
              <div className="flex flex-col items-center justify-center bg-blue-600/20 text-blue-400 font-black text-lg w-10 h-10 rounded-xl border border-blue-500/30 shrink-0">
                #{res.rank}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{res.item.title}</h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Score: {res.score}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1">{res.item.description}</p>

                {/* Constraint Checklist */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
                  {Object.entries(res.constraintSatisfaction).map(([rule, isOk], idx) => (
                    <span
                      key={idx}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded ${
                        isOk
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {isOk ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-rose-400" />}
                      <span>{rule}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
