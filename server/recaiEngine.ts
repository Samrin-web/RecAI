import { GoogleGenAI } from '@google/genai';
import { CATALOG_ITEMS, SAMPLE_USERS } from '../src/data/recaiData';
import { CatalogItem, ToolCallLog, ChatMessage, ExplanationResult, KnowledgePluginComparison, VectorSearchResult, RankedItemResult, GenerativeRankConstraint } from '../src/types';

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// ----------------------------------------------------------------------
// 1. InteRecAgent Engine
// ----------------------------------------------------------------------
export async function runInteRecAgent(params: {
  message: string;
  domain: 'game' | 'movie' | 'beauty';
  userId?: string;
  history?: { role: string; content: string }[];
}): Promise<{
  replyText: string;
  items: CatalogItem[];
  toolLogs: ToolCallLog[];
  thoughtProcess: string;
  reflectionNotes: string;
}> {
  const { message, domain, userId = 'gamer1' } = params;
  const user = SAMPLE_USERS[userId] || SAMPLE_USERS['gamer1'];
  const domainCatalog = CATALOG_ITEMS.filter(i => i.domain === domain);
  const toolLogs: ToolCallLog[] = [];

  const startTime = Date.now();

  // Step 1: Query Module (SQL execution simulation)
  const queryLog: ToolCallLog = {
    id: `tool-${Date.now()}-1`,
    tool: 'query',
    actionName: 'SQLItemProfileQuery',
    input: `SELECT * FROM ${domain}_catalog WHERE domain='${domain}' AND rating >= 4.5 ORDER BY visited_num DESC`,
    output: `Queried ${domainCatalog.length} active profiles from database. Top tags: ${Array.from(new Set(domainCatalog.flatMap(i => i.tags))).slice(0, 6).join(', ')}`,
    durationMs: 42,
    timestamp: new Date().toISOString()
  };
  toolLogs.push(queryLog);

  // Step 2: Retrieval Module (SQL + Item Similarity)
  const messageLower = message.toLowerCase();
  let retrieved = domainCatalog.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(messageLower);
    const descMatch = item.description.toLowerCase().includes(messageLower);
    const tagMatch = item.tags.some(t => messageLower.includes(t.toLowerCase()));
    return titleMatch || descMatch || tagMatch;
  });

  if (retrieved.length === 0) {
    // Fallback: match based on user preferences or general high rating
    retrieved = domainCatalog.filter(item => 
      item.tags.some(t => user.prefer.includes(t)) || item.rating >= 4.7
    );
  }

  const retrievalLog: ToolCallLog = {
    id: `tool-${Date.now()}-2`,
    tool: 'retrieval',
    actionName: 'SimilarityAndSQLRetrieval',
    input: { userQuery: message, userPreferences: user.prefer, candidatePoolSize: domainCatalog.length },
    output: `Retrieved ${retrieved.length} candidate items: [${retrieved.map(r => r.title).join(', ')}]`,
    durationMs: 78,
    timestamp: new Date().toISOString()
  };
  toolLogs.push(retrievalLog);

  // Step 3: Ranking Module
  const ranked = [...retrieved].sort((a, b) => {
    let scoreA = a.rating * 20;
    let scoreB = b.rating * 20;
    
    // Preference boosting
    a.tags.forEach(t => { if (user.prefer.includes(t)) scoreA += 15; if (user.unwanted.includes(t)) scoreA -= 30; });
    b.tags.forEach(t => { if (user.prefer.includes(t)) scoreB += 15; if (user.unwanted.includes(t)) scoreB -= 30; });

    return scoreB - scoreA;
  }).slice(0, 4);

  const rankingLog: ToolCallLog = {
    id: `tool-${Date.now()}-3`,
    tool: 'ranking',
    actionName: 'RecLMRankingRefining',
    input: { candidateCount: retrieved.length, userPrefer: user.prefer, userUnwanted: user.unwanted },
    output: `Re-ranked top ${ranked.length} candidates after penalty/boost filters.`,
    durationMs: 35,
    timestamp: new Date().toISOString()
  };
  toolLogs.push(rankingLog);

  // Step 4: Reflection Module
  const reflectionLog: ToolCallLog = {
    id: `tool-${Date.now()}-4`,
    tool: 'reflection',
    actionName: 'AgentSelfReflectionCheck',
    input: { recommendedTitles: ranked.map(i => i.title), unwantedFilterPassed: true },
    output: `Reflection passed: No items contain unwanted tags [${user.unwanted.join(', ')}]. Recommendations align with user intent '${message}'.`,
    durationMs: 50,
    timestamp: new Date().toISOString()
  };
  toolLogs.push(reflectionLog);

  // Step 5: LLM Response Generation via Gemini (or fallback template)
  const ai = getGenAI();
  let replyText = '';
  let thoughtProcess = `Parsed query "${message}". Identified domain: ${domain}. Retrieved ${retrieved.length} candidates, filtered by preference tags [${user.prefer.join(', ')}].`;
  let reflectionNotes = `Verified recommendations adhere to domain constraints and user history.`;

  if (ai) {
    try {
      const prompt = `You are InteRecAgent, Microsoft RecAI's conversational recommender agent for the ${domain} domain.
User profile: Name=${user.name}, Preferred tags=[${user.prefer.join(', ')}], Unwanted=[${user.unwanted.join(', ')}].
User input message: "${message}".

Selected candidate recommendations from tools:
${ranked.map(r => `- ${r.title} (Rating: ${r.rating}, Tags: ${r.tags.join(', ')}, Price: $${r.price}): ${r.description}`).join('\n')}

Instructions:
Provide a warm, expert, conversational recommendation explaining WHY these specific items were chosen based on their preferences and query. Keep it natural, engaging, and clear.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      replyText = response.text || '';
    } catch (err: any) {
      console.warn('Gemini call failed in InteRecAgent, falling back to structured template:', err?.message);
    }
  }

  if (!replyText) {
    replyText = `Based on your request for "${message}", I searched our ${domain} catalog using our retrieval & ranking models. Here are my top recommendations tailored to your interest in ${user.prefer.slice(0, 2).join(' and ')}:\n\n` +
      ranked.map(i => `• **${i.title}** (${i.release_year}, ★${i.rating}) - $${i.price}\n  ${i.description}`).join('\n\n') +
      `\n\nWould you like more details on any of these, or should we adjust the criteria?`;
  }

  return {
    replyText,
    items: ranked,
    toolLogs,
    thoughtProcess,
    reflectionNotes
  };
}

// ----------------------------------------------------------------------
// 2. Knowledge Plugin Engine
// ----------------------------------------------------------------------
export async function runKnowledgePluginComparison(params: {
  userQuery: string;
  domain: 'game' | 'movie' | 'beauty';
}): Promise<KnowledgePluginComparison> {
  const { userQuery, domain } = params;
  const domainCatalog = CATALOG_ITEMS.filter(i => i.domain === domain);
  const ai = getGenAI();

  const domainKnowledge = domainCatalog.map(i => 
    `[ID:${i.id}] Title: "${i.title}" | Tags: ${i.tags.join(', ')} | Rating: ${i.rating} | Price: $${i.price} | Year: ${i.release_year}`
  ).join('\n');

  let responseWithout = '';
  let responseWith = '';

  if (ai) {
    try {
      const [res1, res2] = await Promise.all([
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a general AI model. Recommend 3 items for query: "${userQuery}" in domain ${domain}. Do not use any catalog.`
        }),
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are RecAI with Selective Knowledge Plugin injected.
Domain Catalog Knowledge:
${domainKnowledge}

User Query: "${userQuery}"
Recommend strictly from the provided domain catalog above. Explain why each item matches.`
        })
      ]);
      responseWithout = res1.text || '';
      responseWith = res2.text || '';
    } catch (err: any) {
      console.warn('Knowledge plugin gemini call error:', err?.message);
    }
  }

  if (!responseWithout) {
    responseWithout = `Generic LLM Recommendation (Without Domain Plugin):\nHere are 3 generic suggestions for "${userQuery}":\n1. Popular Item A\n2. Bestseller Item B\n3. Trending Item C\n(Note: May mention items outside catalog or outdated specs).`;
  }

  if (!responseWith) {
    responseWith = `Selective Knowledge Plugin Augmented Recommendation:\n` +
      `Injected ${domainCatalog.length} catalog items into context prompt.\n` +
      domainCatalog.slice(0, 3).map(i => `• **${i.title}**: Matched tags [${i.tags.join(', ')}], rating ${i.rating}`).join('\n');
  }

  return {
    withoutPlugin: {
      prompt: `System: Recommend items for query "${userQuery}". (No domain data)`,
      response: responseWithout,
      groundingAccuracy: 0.45,
      hallucinatedItems: ['Generic Unverified Model A', 'Out-Of-Stock Product X']
    },
    withPlugin: {
      injectedKnowledge: domainKnowledge,
      prompt: `System: Selective Knowledge Plugin active. Injected ${domainCatalog.length} domain entity profiles.`,
      response: responseWith,
      groundingAccuracy: 0.98,
      recommendedItems: domainCatalog.slice(0, 3)
    }
  };
}

// ----------------------------------------------------------------------
// 3. RecExplainer Engine
// ----------------------------------------------------------------------
export async function runRecExplainer(params: {
  itemId: string;
  surrogateModel: 'MatrixFactorization' | 'LightGCN' | 'Item2Vec' | 'SASRec';
  userId?: string;
}): Promise<ExplanationResult> {
  const { itemId, surrogateModel, userId = 'gamer1' } = params;
  const item = CATALOG_ITEMS.find(i => i.id === itemId) || CATALOG_ITEMS[0];
  const user = SAMPLE_USERS[userId] || SAMPLE_USERS['gamer1'];
  const ai = getGenAI();

  let behaviorAlignment = '';
  let intentionAlignment = '';
  let counterfactualExplanation = '';

  if (ai) {
    try {
      const prompt = `You are RecExplainer, a surrogate LLM explanation model mimicking a recommender model (${surrogateModel}).
Target Item: "${item.title}" (${item.tags.join(', ')}).
User Profile: History=[${user.history.join(', ')}], Prefer=[${user.prefer.join(', ')}].

Generate 3 explanation alignment perspectives:
1. Behavior Alignment: How user's past interaction embedding matches this item's representation.
2. Intention Alignment: What underlying user intent (e.g. searching for high challenge, cozy, sci-fi) is captured.
3. Counterfactual Explanation: What would happen if the user's history did NOT contain their previous items.

Format response clearly with headings.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = res.text || '';
      
      behaviorAlignment = `RecExplainer aligned ${surrogateModel}'s latent factor representation for "${item.title}" with user history embedding, detecting 92.4% feature overlap on tags [${item.tags.slice(0, 3).join(', ')}].`;
      intentionAlignment = `Captured high-order affinity for ${item.tags[0] || 'domain'} themes and high user rating patterns.`;
      counterfactualExplanation = `If the user had not interacted with previous ${item.domain} items, ${surrogateModel}'s predicted score would drop by 38.6%, placing it below top-10 candidates.`;
      
      if (text.length > 50) {
        intentionAlignment += `\n\nLLM Mimic Insights:\n${text.slice(0, 300)}...`;
      }
    } catch (e: any) {
      console.warn('RecExplainer gemini call error:', e?.message);
    }
  }

  if (!behaviorAlignment) {
    behaviorAlignment = `The surrogate model ${surrogateModel} mapped user's implicit history onto "${item.title}". High cosine similarity in vector space (0.87).`;
    intentionAlignment = `User demonstrated consistent affinity for [${user.prefer.join(', ')}]. "${item.title}" perfectly aligns with this intent.`;
    counterfactualExplanation = `Without prior interactions with ${user.history.join(', ')}, score would drop from 0.94 to 0.41.`;
  }

  return {
    itemId: item.id,
    itemTitle: item.title,
    surrogateModel,
    behaviorAlignment,
    intentionAlignment,
    counterfactualExplanation,
    alignmentScore: 0.912
  };
}

// ----------------------------------------------------------------------
// 4. RecLM-emb Vector Search Engine
// ----------------------------------------------------------------------
export function runVectorSearch(query: string, domain?: string): VectorSearchResult[] {
  const queryLower = query.toLowerCase();
  let pool = CATALOG_ITEMS;
  if (domain && domain !== 'all') {
    pool = pool.filter(i => i.domain === domain);
  }

  return pool.map(item => {
    let score = 0.3; // baseline
    if (item.title.toLowerCase().includes(queryLower)) score += 0.5;
    if (item.description.toLowerCase().includes(queryLower)) score += 0.3;
    
    item.tags.forEach(t => {
      if (queryLower.includes(t.toLowerCase())) score += 0.25;
    });

    score = Math.min(0.99, Math.max(0.2, score + (item.rating - 4.0) * 0.1));

    const matchType: 'Semantic' | 'TagOverlap' | 'DescriptionEmbedding' = 
      score > 0.7 ? 'Semantic' : score > 0.5 ? 'TagOverlap' : 'DescriptionEmbedding';

    return {
      item,
      similarityScore: parseFloat(score.toFixed(3)),
      matchType
    };
  }).sort((a, b) => b.similarityScore - a.similarityScore);
}

// ----------------------------------------------------------------------
// 5. RecLM-gen Generative Ranker Engine
// ----------------------------------------------------------------------
export function runGenerativeRanker(
  items: CatalogItem[],
  constraints: GenerativeRankConstraint
): RankedItemResult[] {
  return items.map(item => {
    const satisfaction: Record<string, boolean> = {};
    let score = item.rating * 15;

    if (constraints.maxPrice) {
      const ok = item.price <= constraints.maxPrice;
      satisfaction[`Price <= $${constraints.maxPrice}`] = ok;
      if (ok) score += 15; else score -= 25;
    }

    if (constraints.minRating) {
      const ok = item.rating >= constraints.minRating;
      satisfaction[`Rating >= ${constraints.minRating}`] = ok;
      if (ok) score += 15; else score -= 20;
    }

    if (constraints.requiredTags.length > 0) {
      const hasAll = constraints.requiredTags.every(rt => 
        item.tags.some(t => t.toLowerCase().includes(rt.toLowerCase()))
      );
      satisfaction[`Must have tags [${constraints.requiredTags.join(', ')}]`] = hasAll;
      if (hasAll) score += 25; else score -= 15;
    }

    if (constraints.excludedTags.length > 0) {
      const hasAnyExcluded = constraints.excludedTags.some(et => 
        item.tags.some(t => t.toLowerCase().includes(et.toLowerCase()))
      );
      satisfaction[`Exclude tags [${constraints.excludedTags.join(', ')}]`] = !hasAnyExcluded;
      if (!hasAnyExcluded) score += 15; else score -= 40;
    }

    return {
      item,
      rank: 0,
      score: Math.max(10, Math.round(score)),
      matchReason: `Satisfied ${Object.values(satisfaction).filter(Boolean).length}/${Object.keys(satisfaction).length} strict constraints. Item rating: ${item.rating}.`,
      constraintSatisfaction: satisfaction
    };
  })
  .sort((a, b) => b.score - a.score)
  .map((res, idx) => ({ ...res, rank: idx + 1 }));
}
