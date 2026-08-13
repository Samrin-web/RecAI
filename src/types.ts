export type DomainType = 'game' | 'movie' | 'beauty';

export interface CatalogItem {
  id: string;
  title: string;
  domain: DomainType;
  tags: string[];
  description: string;
  price: number;
  rating: number;
  visited_num: number;
  release_year: number;
  imageUrl?: string;
  features?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  name: string;
  history: string[]; // item IDs or titles
  prefer: string[];  // preferred tags/genres
  unwanted: string[]; // unwanted tags/genres
  age?: number;
}

export type ToolType = 'query' | 'retrieval' | 'ranking' | 'reflection';

export interface ToolCallLog {
  id: string;
  tool: ToolType;
  actionName: string;
  input: string | Record<string, any>;
  output: string | Record<string, any>;
  durationMs: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  items?: CatalogItem[];
  toolLogs?: ToolCallLog[];
  thoughtProcess?: string;
  reflectionNotes?: string;
}

export interface ExplanationResult {
  itemId: string;
  itemTitle: string;
  surrogateModel: 'MatrixFactorization' | 'LightGCN' | 'Item2Vec' | 'SASRec';
  behaviorAlignment: string;
  intentionAlignment: string;
  counterfactualExplanation: string;
  alignmentScore: number;
}

export interface KnowledgePluginComparison {
  withoutPlugin: {
    prompt: string;
    response: string;
    groundingAccuracy: number;
    hallucinatedItems: string[];
  };
  withPlugin: {
    injectedKnowledge: string;
    prompt: string;
    response: string;
    groundingAccuracy: number;
    recommendedItems: CatalogItem[];
  };
}

export interface VectorSearchResult {
  item: CatalogItem;
  similarityScore: number;
  matchType: 'Semantic' | 'TagOverlap' | 'DescriptionEmbedding';
}

export interface GenerativeRankConstraint {
  maxPrice?: number;
  minRating?: number;
  requiredTags: string[];
  excludedTags: string[];
  tonePreference?: string;
}

export interface RankedItemResult {
  item: CatalogItem;
  rank: number;
  score: number;
  matchReason: string;
  constraintSatisfaction: Record<string, boolean>;
}

export interface EvaluationBenchmark {
  modelName: string;
  domain: DomainType;
  ndcg5: number;
  ndcg10: number;
  hitRate5: number;
  hitRate10: number;
  catalogCoverage: number;
  hallucinationRate: number;
  instructionFollowingScore: number;
  diversityIndex: number;
}
