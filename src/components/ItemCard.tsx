import React from 'react';
import { CatalogItem } from '../types';
import { Star, Eye, Calendar, Tag, ShoppingCart } from 'lucide-react';

interface ItemCardProps {
  item: CatalogItem;
  score?: number;
  explanationBadge?: string;
  onSelect?: (item: CatalogItem) => void;
  actionText?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  score,
  explanationBadge,
  onSelect,
  actionText
}) => {
  return (
    <div className="bg-slate-800/90 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg hover:border-blue-500/50 transition-all group flex flex-col justify-between">
      <div>
        {/* Image / Banner */}
        <div className="relative h-36 overflow-hidden bg-slate-900">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
              <Tag className="w-8 h-8 opacity-40" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            <span className="bg-slate-900/80 backdrop-blur-md text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-500/30">
              {item.domain.toUpperCase()}
            </span>
            {explanationBadge && (
              <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                {explanationBadge}
              </span>
            )}
          </div>

          {score !== undefined && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white font-bold text-xs px-2 py-0.5 rounded shadow">
              {(score * 100).toFixed(0)}% Match
            </div>
          )}

          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
            <h3 className="font-bold text-sm text-white drop-shadow truncate pr-2">
              {item.title}
            </h3>
            <span className="font-bold text-amber-300 text-xs flex items-center shrink-0">
              <Star className="w-3 h-3 fill-amber-300 mr-0.5" />
              {item.rating}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="bg-slate-700/50 text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-600/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-200">${item.price.toFixed(2)}</span>
          <span className="flex items-center text-[10px]">
            <Calendar className="w-3 h-3 mr-1 text-slate-500" />
            {item.release_year}
          </span>
          <span className="flex items-center text-[10px] hidden sm:flex">
            <Eye className="w-3 h-3 mr-1 text-slate-500" />
            {(item.visited_num / 1000).toFixed(0)}k views
          </span>
        </div>

        {onSelect && (
          <button
            onClick={() => onSelect(item)}
            className="bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-medium px-2.5 py-1 rounded transition-colors flex items-center space-x-1"
          >
            <span>{actionText || 'Inspect'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
