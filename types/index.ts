// 大カテゴリー1: 商品
export interface Product {
  // 製品情報
  productInfo: {
    productName: string;
    productUrl: string;
    category: string;
    sizeCapacity: string;
    functions: string[];
    effects: string[];
    rtb: string;
    authority: string;
    regularPrice: string;
    specialPrice?: string;
    campaign?: string;
    releaseDate: string;
    salesChannel: string;
    demographics: {
      age: string;
      gender: string;
      other: string;
    };
  };
  // 提供価値候補
  valueProposition: {
    functionalValue: string[];
    emotionalValue: string[];
  };
}

// 大カテゴリー2: 市場（複数）
export interface Market {
  // 市場/ターゲット
  marketTarget: {
    marketDefinition: string;
    marketCategory: string;
    strategicTarget: string;
    coreTarget: string;
    marketSize: string;
    purchasers: string;
    aov: string;
  };
}

// 大カテゴリー3: N1（複数）
export interface N1 {
  // プロフィール
  profile: {
    age: string;
    gender: string;
    location: string;
    occupation: string;
    position: string;
    industryCategory: string;
    income: string;
    education: string;
    familyStructure: string;
    lifestyle: string;
    interests: string[];
    mediaUsage: string[];
    dailyPurchases: string[];
    specialPurchases: string[];
  };
  // N1脳内ジャーニー
  journey: {
    situation: string;
    driver: string;
    instinct: string;
    perception: string;
    emotion: string;
    discomfort: string;
    stress: string;
    desire: string;
    category: string;
    howToGet: string;
    categorySelection: string;
    priceExpectation: string;
    otherRequirements: string;
    demand: string;
  };
}

// 大カテゴリー4: 競合
export interface Competitor {
  categoryCompetitors: {
    name: string;
    brands: string[];
    products: string[];
    differentiation: string;
    usp: string;
    preference: string;
  }[];
}

// 大カテゴリー5: コンセプト（コアターゲットに紐づく）
export interface Concept {
  market: string;
  strategicTarget: string;
  coreTarget: string;
  demand: string;
  benefit: string;
  features: string[];
  concept: string;
  rtb: string;
  brandCharacter: string;
}

// 全体の分析データ構造
export interface MarketingAnalysis {
  product: Product;
  market: Market;
  n1: N1[];
  competitors: Competitor;
  concept: Concept;
}

export interface AnalysisResult {
  strategicInsights: string[];
  recommendedChannels: string[];
  messagingStrategy: string[];
  creativeDirections: string[];
  kpiRecommendations: string[];
}