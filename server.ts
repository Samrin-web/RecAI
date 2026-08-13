import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { CATALOG_ITEMS, EVALUATION_BENCHMARKS, SAMPLE_USERS } from './src/data/recaiData';
import {
  runInteRecAgent,
  runKnowledgePluginComparison,
  runRecExplainer,
  runVectorSearch,
  runGenerativeRanker
} from './server/recaiEngine';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get Catalog Items
  app.get('/api/items', (req, res) => {
    const domain = req.query.domain as string;
    if (domain && domain !== 'all') {
      return res.json(CATALOG_ITEMS.filter(i => i.domain === domain));
    }
    return res.json(CATALOG_ITEMS);
  });

  // Get User Profiles
  app.get('/api/users', (req, res) => {
    res.json(SAMPLE_USERS);
  });

  // InteRecAgent Chat Endpoint
  app.post('/api/agent', async (req, res) => {
    try {
      const { message, domain = 'game', userId = 'gamer1', history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      const result = await runInteRecAgent({ message, domain, userId, history });
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/agent:', err);
      res.status(500).json({ error: err?.message || 'Failed to process agent request' });
    }
  });

  // Knowledge Plugin Endpoint
  app.post('/api/knowledge-plugin', async (req, res) => {
    try {
      const { userQuery = 'Recommend popular games', domain = 'game' } = req.body;
      const result = await runKnowledgePluginComparison({ userQuery, domain });
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/knowledge-plugin:', err);
      res.status(500).json({ error: err?.message || 'Knowledge plugin error' });
    }
  });

  // RecExplainer Endpoint
  app.post('/api/explain', async (req, res) => {
    try {
      const { itemId = 'g-001', surrogateModel = 'MatrixFactorization', userId = 'gamer1' } = req.body;
      const result = await runRecExplainer({ itemId, surrogateModel, userId });
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/explain:', err);
      res.status(500).json({ error: err?.message || 'RecExplainer error' });
    }
  });

  // RecLM-emb Vector Search Endpoint
  app.post('/api/embedding-search', (req, res) => {
    try {
      const { query = '', domain = 'all' } = req.body;
      const results = runVectorSearch(query, domain);
      res.json({ query, results });
    } catch (err: any) {
      console.error('Error in /api/embedding-search:', err);
      res.status(500).json({ error: err?.message || 'Search error' });
    }
  });

  // RecLM-gen Generative Ranker Endpoint
  app.post('/api/rank', (req, res) => {
    try {
      const { items = CATALOG_ITEMS.slice(0, 8), constraints = {} } = req.body;
      const results = runGenerativeRanker(items, constraints);
      res.json({ results });
    } catch (err: any) {
      console.error('Error in /api/rank:', err);
      res.status(500).json({ error: err?.message || 'Ranking error' });
    }
  });

  // RecLM-eval Benchmarks Endpoint
  app.get('/api/evaluate', (req, res) => {
    res.json({ benchmarks: EVALUATION_BENCHMARKS });
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RecAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
