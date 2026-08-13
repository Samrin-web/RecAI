import { CatalogItem, UserProfile, EvaluationBenchmark } from '../types';

export const CATALOG_ITEMS: CatalogItem[] = [
  // --- VIDEO GAMES DOMAIN ---
  {
    id: 'g-001',
    title: 'Elden Ring',
    domain: 'game',
    tags: ['Action', 'RPG', 'Open World', 'Dark Fantasy', 'Challenging'],
    description: 'An epic dark fantasy action RPG developed by FromSoftware. Explore the Lands Between, master combat, and defeat demigods.',
    price: 59.99,
    rating: 4.8,
    visited_num: 154200,
    release_year: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g-002',
    title: 'Cyberpunk 2077: Phantom Liberty',
    domain: 'game',
    tags: ['RPG', 'Cyberpunk', 'Open World', 'Sci-Fi', 'Shooter'],
    description: 'A spy-thriller expansion for Cyberpunk 2077 set in Dogtown. Play as V and embark on a high-stakes mission of espionage.',
    price: 29.99,
    rating: 4.6,
    visited_num: 98100,
    release_year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g-003',
    title: 'Hades II',
    domain: 'game',
    tags: ['Roguelike', 'Indie', 'Action', 'Mythology', 'Hack and Slash'],
    description: 'Battle beyond the Underworld using dark magic to face the Titan of Time in this mythic roguelike dungeon crawler.',
    price: 29.99,
    rating: 4.9,
    visited_num: 67300,
    release_year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g-004',
    title: 'Stardew Valley',
    domain: 'game',
    tags: ['Farming Sim', 'Cozy', 'Relaxing', 'Indie', 'Pixel Art', 'RPG'],
    description: 'Inherit your grandfather\'s old farm plot in Stardew Valley. Learn to live off the land, farm crops, raise animals, and make friends.',
    price: 14.99,
    rating: 4.9,
    visited_num: 210000,
    release_year: 2016,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g-005',
    title: 'Baldur\'s Gate 3',
    domain: 'game',
    tags: ['Turn-Based', 'RPG', 'Choices Matter', 'D&D', 'Co-op', 'Story Rich'],
    description: 'Gather your party and return to the Forgotten Realms in a tale of fellowship, betrayal, sacrifice, and the lure of ultimate power.',
    price: 59.99,
    rating: 4.9,
    visited_num: 189000,
    release_year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g-006',
    title: 'God of War Ragnarök',
    domain: 'game',
    tags: ['Action', 'Adventure', 'Mythology', 'Story Rich', 'Singleplayer'],
    description: 'Kratos and Atreus embark on a mythic journey through each of the Nine Realms for answers before the prophesied battle.',
    price: 69.99,
    rating: 4.7,
    visited_num: 112000,
    release_year: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80'
  },

  // --- MOVIES DOMAIN ---
  {
    id: 'm-001',
    title: 'Dune: Part Two',
    domain: 'movie',
    tags: ['Sci-Fi', 'Epic', 'Adventure', 'Desert', 'Space', 'Drama'],
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    price: 19.99,
    rating: 4.8,
    visited_num: 310000,
    release_year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm-002',
    title: 'Oppenheimer',
    domain: 'movie',
    tags: ['Biography', 'Drama', 'History', 'Physics', 'Period Piece'],
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    price: 14.99,
    rating: 4.7,
    visited_num: 280000,
    release_year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm-003',
    title: 'Spider-Man: Across the Spider-Verse',
    domain: 'movie',
    tags: ['Animation', 'Action', 'Superhero', 'Multiverse', 'Stylized'],
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.',
    price: 14.99,
    rating: 4.9,
    visited_num: 245000,
    release_year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm-004',
    title: 'Interstellar',
    domain: 'movie',
    tags: ['Sci-Fi', 'Space', 'Time Travel', 'Drama', 'Mind-Bending'],
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is asked to pilot a spacecraft through a wormhole.',
    price: 9.99,
    rating: 4.9,
    visited_num: 450000,
    release_year: 2014,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm-005',
    title: 'Spirited Away',
    domain: 'movie',
    tags: ['Anime', 'Fantasy', 'Masterpiece', 'Studio Ghibli', 'Heartwarming'],
    description: 'During her family\'s move to the suburbs, a 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    price: 12.99,
    rating: 4.9,
    visited_num: 380000,
    release_year: 2001,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
  },

  // --- BEAUTY & FASHION DOMAIN ---
  {
    id: 'b-001',
    title: 'Hydrating Peptide Serum',
    domain: 'beauty',
    tags: ['Skincare', 'Hydration', 'Peptides', 'Anti-Aging', 'Sensitive Skin'],
    description: 'Lightweight, ultra-moisturizing facial serum enriched with 5 matrix peptides and hyaluronic acid for glowing skin.',
    price: 38.00,
    rating: 4.7,
    visited_num: 42000,
    release_year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1608248597261-833244670d19?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'b-002',
    title: 'Botanical Retinol Renewal Cream',
    domain: 'beauty',
    tags: ['Skincare', 'Bakuchiol', 'Retinol', 'Night Cream', 'Organic'],
    description: 'Gentle plant-derived retinol alternative designed to smooth fine lines without redness or irritation.',
    price: 52.00,
    rating: 4.6,
    visited_num: 31000,
    release_year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'b-003',
    title: 'Radiant Glow Tinted Moisturizer SPF 50',
    domain: 'beauty',
    tags: ['Makeup', 'Sunscreen', 'Tinted', 'Glowy Finish', 'Clean Beauty'],
    description: 'Multi-benefit mineral SPF 50 sunscreen with sheer coverage and niacinamide to even out skin tone.',
    price: 44.00,
    rating: 4.8,
    visited_num: 58000,
    release_year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'b-004',
    title: 'Rosewater Cleansing Balm',
    domain: 'beauty',
    tags: ['Skincare', 'Cleanser', 'Makeup Remover', 'Rosewater', 'Hydrating'],
    description: 'Nourishing oil balm that melts away stubborn makeup and impurities while leaving skin soft and velvety.',
    price: 28.00,
    rating: 4.5,
    visited_num: 26000,
    release_year: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
  }
];

export const SAMPLE_USERS: Record<string, UserProfile> = {
  gamer1: {
    id: 'gamer1',
    name: 'Alex (Hardcore Gamer)',
    history: ['g-001', 'g-006'],
    prefer: ['RPG', 'Action', 'Challenging', 'Open World'],
    unwanted: ['Microtransactions', 'Sports', 'Casual']
  },
  movieBuff: {
    id: 'movieBuff',
    name: 'Elena (Film Enthusiast)',
    history: ['m-001', 'm-004'],
    prefer: ['Sci-Fi', 'Space', 'Epic', 'Biography'],
    unwanted: ['Horror', 'Low Budget']
  },
  beautyLover: {
    id: 'beautyLover',
    name: 'Sophia (Skincare Enthusiast)',
    history: ['b-001', 'b-003'],
    prefer: ['Skincare', 'Hydration', 'Clean Beauty', 'Sensitive Skin'],
    unwanted: ['Fragrance', 'Harsh Acids']
  }
};

export const EVALUATION_BENCHMARKS: EvaluationBenchmark[] = [
  {
    modelName: 'InteRecAgent (Gemini + Tools)',
    domain: 'game',
    ndcg5: 0.842,
    ndcg10: 0.891,
    hitRate5: 0.885,
    hitRate10: 0.942,
    catalogCoverage: 0.915,
    hallucinationRate: 0.012,
    instructionFollowingScore: 0.965,
    diversityIndex: 0.820
  },
  {
    modelName: 'Knowledge Plugin (Dynamic Selective)',
    domain: 'movie',
    ndcg5: 0.810,
    ndcg10: 0.865,
    hitRate5: 0.850,
    hitRate10: 0.910,
    catalogCoverage: 0.880,
    hallucinationRate: 0.025,
    instructionFollowingScore: 0.940,
    diversityIndex: 0.795
  },
  {
    modelName: 'RecLM-gen (Supervised Fine-Tuned)',
    domain: 'game',
    ndcg5: 0.795,
    ndcg10: 0.848,
    hitRate5: 0.830,
    hitRate10: 0.895,
    catalogCoverage: 0.860,
    hallucinationRate: 0.038,
    instructionFollowingScore: 0.910,
    diversityIndex: 0.760
  },
  {
    modelName: 'Standard LLM Zero-Shot (GPT-4 / Gemini)',
    domain: 'game',
    ndcg5: 0.620,
    ndcg10: 0.680,
    hitRate5: 0.650,
    hitRate10: 0.720,
    catalogCoverage: 0.540,
    hallucinationRate: 0.210,
    instructionFollowingScore: 0.820,
    diversityIndex: 0.610
  },
  {
    modelName: 'Traditional LightGCN Baseline',
    domain: 'game',
    ndcg5: 0.710,
    ndcg10: 0.765,
    hitRate5: 0.740,
    hitRate10: 0.810,
    catalogCoverage: 0.780,
    hallucinationRate: 0.000,
    instructionFollowingScore: 0.150,
    diversityIndex: 0.690
  }
];
