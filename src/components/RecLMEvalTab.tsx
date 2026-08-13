import React, { useState, useEffect } from 'react';
import { EvaluationBenchmark } from '../types';
import { BarChart3, Trophy, ShieldCheck, Zap, AlertTriangle, Layers } from 'lucide-react';

export const RecLMEvalTab: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<EvaluationBenchmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/evaluate')
      .then(res => res.json())
      .then(data => {
        setBenchmarks(data.benchmarks || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load benchmarks:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RecLM-eval: Evaluation & Benchmark Suite</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive evaluation service assessing LLM-based recommender performance across retrieval precision (NDCG@K), hit rates (HR@K), catalog coverage, hallucination rates, and instruction following.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
            Top Performer (NDCG@10)
          </span>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-white">InteRecAgent</h4>
            <span className="text-xl font-black text-blue-400">0.891</span>
          </div>
          <p className="text-xs text-slate-400">Combines Gemini reasoning with SQL & Similarity tools</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            Lowest Hallucination Rate
          </span>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-white">InteRecAgent & Knowledge Plugin</h4>
            <span className="text-xl font-black text-emerald-400">1.2%</span>
          </div>
          <p className="text-xs text-slate-400">vs 21.0% in Zero-Shot Standard LLMs</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
            Catalog Coverage Ratio
          </span>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-white">RecAI Framework Average</h4>
            <span className="text-xl font-black text-purple-400">91.5%</span>
          </div>
          <p className="text-xs text-slate-400">vs 54.0% in standard GPT/Gemini zero-shot</p>
        </div>

      </div>

      {/* Detailed Benchmark Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center">
          <Trophy className="w-4 h-4 text-amber-400 mr-2" />
          LLM4Rec Framework Benchmark Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Model Architecture</th>
                <th className="p-3">NDCG@5</th>
                <th className="p-3">NDCG@10</th>
                <th className="p-3">Hit Rate @ 5</th>
                <th className="p-3">Coverage</th>
                <th className="p-3">Hallucination</th>
                <th className="p-3">Instruction Following</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {benchmarks.map((bm, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-semibold text-white flex items-center space-x-2">
                    {idx === 0 && <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/30">TOP</span>}
                    <span>{bm.modelName}</span>
                  </td>
                  <td className="p-3 font-mono text-blue-300">{bm.ndcg5.toFixed(3)}</td>
                  <td className="p-3 font-mono text-blue-400 font-bold">{bm.ndcg10.toFixed(3)}</td>
                  <td className="p-3 font-mono text-emerald-300">{(bm.hitRate5 * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono text-purple-300">{(bm.catalogCoverage * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono text-rose-400">{(bm.hallucinationRate * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono text-indigo-300">{(bm.instructionFollowingScore * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
