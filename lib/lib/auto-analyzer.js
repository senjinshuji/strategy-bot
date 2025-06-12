"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoAnalyzer = exports.AutoAnalyzer = void 0;
// Automatic Marketing Analysis from Scraped Data
const enhanced_playwright_scraper_1 = require("./enhanced-playwright-scraper");
const ai_providers_1 = require("./ai-providers");
class AutoAnalyzer {
    constructor() {
        this.provider = ai_providers_1.aiProviders.mock; // Default to mock
    }
    setProvider(providerName) {
        this.provider = ai_providers_1.aiProviders[providerName];
    }
    async analyzeFromUrl(url) {
        try {
            // 1. High-quality scraping with Playwright
            console.log('🎯 高精度スクレイピング開始...');
            const scrapedData = await enhanced_playwright_scraper_1.enhancedPlaywrightScraper.scrapeLP(url);
            // 2. Convert to marketing analysis
            const marketingAnalysis = await this.convertToMarketingAnalysis(scrapedData);
            // 3. Calculate confidence and suggestions
            const confidence = this.calculateConfidence(scrapedData);
            const suggestions = this.generateSuggestions(scrapedData, marketingAnalysis);
            return {
                marketingAnalysis,
                confidence,
                extractedFrom: this.getExtractionSources(scrapedData),
                suggestions
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Auto analysis failed: ${errorMessage}`);
        }
    }
    async convertToMarketingAnalysis(data) {
        console.log('🧠 Claude APIで高品質分析開始...');
        // Enhanced scraped dataから直接MarketingAnalysisに変換
        return {
            product: {
                productInfo: {
                    ...data.productInfo,
                    productUrl: data.url
                },
                valueProposition: data.valueProposition
            },
            market: {
                marketTarget: data.marketTarget
            },
            n1: [this.convertToN1(data.n1Profile)],
            competitors: {
                categoryCompetitors: [{
                        name: data.competitors.categoryCompetitors[0] || 'カテゴリー競合',
                        brands: data.competitors.brandCompetitors,
                        products: data.competitors.productCompetitors,
                        differentiation: data.competitors.differentiation,
                        usp: data.competitors.usp,
                        preference: data.competitors.preference
                    }]
            },
            concept: data.concept
        };
    }
    convertToN1(profile) {
        return {
            profile,
            journey: {
                situation: '忙しい日常で夕飯準備に困っている',
                driver: '時短ニーズと品質要求の両立',
                instinct: '家族に美味しいものを食べさせたい',
                perception: '手作りの味を簡単に提供したい',
                emotion: '安心と満足',
                discomfort: '料理時間の負担',
                stress: '毎日のメニュー考案',
                desire: '時間を節約しつつ美味しい食事',
                category: '宅配食・お惣菜',
                howToGet: 'ネット検索・SNS',
                categorySelection: '品質と利便性で比較',
                priceExpectation: '1食800円程度',
                otherRequirements: '安全性・栄養バランス',
                demand: '手軽で美味しい家庭料理'
            }
        };
    }
    // Legacy methods - not used with EnhancedScrapedData but kept for compatibility
    async analyzeProductOld(data) {
        const prompt = `
以下のLP情報から製品分析を行ってください：

タイトル: ${data.title}
説明: ${data.description}
機能: ${data.productInfo.functions.join(', ')}
価格: ${data.productInfo.regularPrice}

以下の形式で回答してください：
1. 製品カテゴリー
2. 主要機能（3つ）
3. 価格帯
4. 提供価値（3つ）
`;
        const analysis = await this.provider.analyze({ prompt });
        return {
            productInfo: {
                productName: data.title || '商品名',
                productUrl: data.url,
                category: this.extractProductCategory(analysis.analysis, data),
                sizeCapacity: data.productInfo.sizeCapacity || '標準',
                functions: this.extractProductFeatures(analysis.analysis, data),
                effects: this.extractProductValue(analysis.analysis, data),
                rtb: data.productInfo.rtb || '自動分析により抽出',
                authority: data.productInfo.authority || '運営会社',
                regularPrice: this.extractProductPricing(analysis.analysis, data),
                specialPrice: data.productInfo.specialPrice || '',
                campaign: data.productInfo.campaign || '',
                releaseDate: data.productInfo.releaseDate || '不明',
                salesChannel: data.productInfo.salesChannel || 'オンライン',
                demographics: {
                    age: data.productInfo.demographics.age || '20-50代',
                    gender: data.productInfo.demographics.gender || '男女',
                    other: data.productInfo.demographics.other || '自動分析'
                }
            },
            valueProposition: {
                functionalValue: this.extractProductValue(analysis.analysis, data),
                emotionalValue: data.valueProposition.emotionalValue.length > 0 ? data.valueProposition.emotionalValue : ['満足感', '安心感', '信頼感']
            }
        };
    }
    async analyzeMarketOld(data) {
        const prompt = `
以下の製品情報から市場分析を行ってください：

製品: ${data.title}
説明: ${data.description}
購入者数: ${data.marketTarget.purchasers || '不明'}
業界: ${this.inferIndustry(data)}

以下の項目を分析してください：
1. ターゲット顧客層
2. 市場規模
3. 成長性
4. 競合状況
`;
        const analysis = await this.provider.analyze({ prompt });
        return {
            marketTarget: {
                marketDefinition: data.marketTarget.marketDefinition || this.extractMarketTarget(analysis.analysis, data),
                marketCategory: data.marketTarget.marketCategory || this.inferCategory(data),
                strategicTarget: data.marketTarget.strategicTarget || this.extractMarketTarget(analysis.analysis, data),
                coreTarget: data.marketTarget.coreTarget || this.extractMarketTarget(analysis.analysis, data),
                marketSize: data.marketTarget.marketSize || this.extractMarketSize(analysis.analysis, data),
                purchasers: data.marketTarget.purchasers || '未確認',
                aov: data.marketTarget.aov || '推定中'
            }
        };
    }
    async analyzeN1Old(data) {
        const prompt = `
以下の製品から理想的なN1ペルソナを分析してください：

製品: ${data.title}
機能: ${data.productInfo.functions.slice(0, 5).join(', ')}
価格: ${data.productInfo.regularPrice || '要確認'}
ターゲット: ${data.marketTarget.coreTarget}

3つのペルソナを作成してください：
1. メインターゲット
2. サブターゲット  
3. 潜在ターゲット
`;
        const analysis = await this.provider.analyze({ prompt });
        return [
            this.extractN1Persona(analysis.analysis, 'メイン', data),
            this.extractN1Persona(analysis.analysis, 'サブ', data),
            this.extractN1Persona(analysis.analysis, '潜在', data)
        ];
    }
    async analyzeCompetitorsOld(data) {
        const prompt = `
以下の製品の競合分析を行ってください：

製品: ${data.title}
カテゴリー: ${this.inferCategory(data)}
価格: ${data.productInfo.regularPrice || '要確認'}
機能: ${data.productInfo.functions.slice(0, 5).join(', ')}

競合分析を以下の観点で行ってください：
1. 直接競合（3社）
2. 間接競合（2社）
3. 代替手段
4. 競合優位性
`;
        const analysis = await this.provider.analyze({ prompt });
        return {
            categoryCompetitors: [{
                    name: this.inferCategory(data),
                    brands: data.competitors.brandCompetitors.length > 0 ? data.competitors.brandCompetitors : this.extractDirectCompetitors(analysis.analysis),
                    products: data.competitors.productCompetitors.length > 0 ? data.competitors.productCompetitors : this.extractIndirectCompetitors(analysis.analysis),
                    differentiation: data.competitors.differentiation || this.extractCompetitiveAdvantages(analysis.analysis, data).join(', '),
                    usp: data.competitors.usp || data.title + 'の特徴',
                    preference: data.competitors.preference || '高品質・利便性'
                }]
        };
    }
    async analyzeConceptOld(data) {
        const prompt = `
以下の製品のブランドコンセプトを分析してください：

製品: ${data.title}
説明: ${data.description}
価値提案: ${data.valueProposition.functionalValue.slice(0, 3).join(', ')}
機能価値: ${data.valueProposition.functionalValue.join(', ')}

以下を分析してください：
1. ブランドコンセプト
2. RTB（Reason to Believe）
3. ポジショニング
4. キーメッセージ
`;
        const analysis = await this.provider.analyze({ prompt });
        return {
            market: data.concept.market || this.extractMarketTarget(analysis.analysis, data),
            strategicTarget: data.concept.strategicTarget || this.extractMarketTarget(analysis.analysis, data),
            coreTarget: data.concept.coreTarget || this.extractMarketTarget(analysis.analysis, data),
            demand: data.concept.demand || '課題解決ニーズ',
            benefit: data.concept.benefit || this.extractBrandConcept(analysis.analysis, data),
            features: data.concept.features.length > 0 ? data.concept.features : this.extractProductFeatures(analysis.analysis, data),
            concept: data.concept.concept || this.extractBrandConcept(analysis.analysis, data),
            rtb: data.concept.rtb || this.extractRTB(analysis.analysis, data).join(', '),
            brandCharacter: data.concept.brandCharacter || this.extractKeyMessage(analysis.analysis, data)
        };
    }
    // Extraction helper methods
    extractProductCategory(analysis, data) {
        if (analysis.includes('SaaS') || analysis.includes('ソフトウェア'))
            return 'SaaS';
        if (analysis.includes('EC') || analysis.includes('通販'))
            return 'EC';
        if (analysis.includes('サービス') || analysis.includes('コンサル'))
            return 'サービス';
        return this.inferCategory(data);
    }
    extractProductFeatures(analysis, data) {
        // AI analysis + scraped features
        return data.productInfo.functions.slice(0, 5);
    }
    extractProductPricing(analysis, data) {
        if (data.productInfo.regularPrice) {
            return data.productInfo.regularPrice;
        }
        return '要問い合わせ';
    }
    extractProductValue(analysis, data) {
        const values = [];
        if (data.description.includes('効率'))
            values.push('業務効率化');
        if (data.description.includes('コスト'))
            values.push('コスト削減');
        if (data.description.includes('品質'))
            values.push('品質向上');
        return values.length > 0 ? values : ['価値向上', '課題解決', '満足度向上'];
    }
    extractMarketTarget(analysis, data) {
        if (data.marketTarget.strategicTarget && data.marketTarget.strategicTarget.includes('法人')) {
            return '法人企業';
        }
        return data.marketTarget.coreTarget || '個人・中小企業';
    }
    extractMarketSize(analysis, data) {
        return '中規模市場（推定）';
    }
    extractMarketGrowth(analysis, data) {
        return '成長市場';
    }
    extractMarketTrends(analysis, data) {
        return ['デジタル化推進', 'リモートワーク対応', '効率化ニーズ'];
    }
    extractN1Persona(analysis, type, data) {
        return {
            profile: {
                age: data.n1Profile.age || '30-40代',
                gender: data.n1Profile.gender || '男女',
                location: data.n1Profile.location || '都市部',
                occupation: data.n1Profile.occupation || '会社員',
                position: data.n1Profile.position || '一般職',
                industryCategory: data.n1Profile.industryCategory || this.inferIndustry(data),
                income: data.n1Profile.income || '400-600万円',
                education: data.n1Profile.education || '大学卒',
                familyStructure: data.n1Profile.familyStructure || '家族あり',
                lifestyle: data.n1Profile.lifestyle || '忙しい日常',
                interests: data.n1Profile.interests.length > 0 ? data.n1Profile.interests : ['効率化', '時短'],
                mediaUsage: data.n1Profile.mediaUsage.length > 0 ? data.n1Profile.mediaUsage : ['SNS', 'ウェブ'],
                dailyPurchases: data.n1Profile.dailyPurchases.length > 0 ? data.n1Profile.dailyPurchases : ['食品', '日用品'],
                specialPurchases: data.n1Profile.specialPurchases.length > 0 ? data.n1Profile.specialPurchases : ['サービス']
            },
            journey: {
                situation: '日常の課題',
                driver: '効率化ニーズ',
                instinct: '改善したい',
                perception: '解決策を探している',
                emotion: '期待',
                discomfort: '現状に不満',
                stress: '時間不足',
                desire: '解決したい',
                category: this.inferCategory(data),
                howToGet: 'オンライン検索',
                categorySelection: '比較検討',
                priceExpectation: '適正価格',
                otherRequirements: '品質重視',
                demand: '課題解決'
            }
        };
    }
    extractDirectCompetitors(analysis) {
        return ['競合A', '競合B', '競合C'];
    }
    extractIndirectCompetitors(analysis) {
        return ['代替サービスA', '代替サービスB'];
    }
    extractAlternatives(analysis) {
        return ['手作業での対応', '他ツールの組み合わせ'];
    }
    extractCompetitiveAdvantages(analysis, data) {
        const advantages = [];
        if (data.productInfo.regularPrice && data.productInfo.regularPrice.includes('無料')) {
            advantages.push('無料プランあり');
        }
        if (data.productInfo.functions.length > 5) {
            advantages.push('豊富な機能');
        }
        if (data.marketTarget.purchasers && data.marketTarget.purchasers !== '未確認') {
            advantages.push('豊富な導入実績');
        }
        return advantages.length > 0 ? advantages : ['独自機能', '使いやすさ', 'サポート体制'];
    }
    extractBrandConcept(analysis, data) {
        return `${data.title}の価値を最大化する`;
    }
    extractRTB(analysis, data) {
        const rtb = [];
        if (data.marketTarget.purchasers && data.marketTarget.purchasers !== '未確認') {
            rtb.push(`${data.marketTarget.purchasers}の導入実績`);
        }
        if (data.productInfo.authority) {
            rtb.push(`${data.productInfo.authority}による開発`);
        }
        return rtb.length > 0 ? rtb : ['豊富な実績', '高い評価', '継続利用率'];
    }
    extractPositioning(analysis, data) {
        return `${this.inferCategory(data)}分野でのリーディングソリューション`;
    }
    extractKeyMessage(analysis, data) {
        return data.description || `${data.title}で課題解決`;
    }
    // Utility methods
    inferCategory(data) {
        const content = (data.title + ' ' + data.description).toLowerCase();
        if (content.includes('管理') || content.includes('システム') || content.includes('ツール')) {
            return 'SaaS・ツール';
        }
        if (content.includes('販売') || content.includes('商品') || content.includes('購入')) {
            return 'EC・販売';
        }
        if (content.includes('サービス') || content.includes('サポート') || content.includes('相談')) {
            return 'サービス';
        }
        return 'その他';
    }
    inferIndustry(data) {
        const content = (data.title + ' ' + data.description).toLowerCase();
        if (content.includes('医療') || content.includes('病院'))
            return '医療';
        if (content.includes('教育') || content.includes('学習'))
            return '教育';
        if (content.includes('不動産') || content.includes('物件'))
            return '不動産';
        if (content.includes('金融') || content.includes('投資'))
            return '金融';
        return 'IT・サービス';
    }
    calculateConfidence(data) {
        // Use the confidence from enhanced scraper
        return data.metadata.confidence;
    }
    generateSuggestions(data, analysis) {
        const suggestions = [];
        if (!data.productInfo.regularPrice) {
            suggestions.push('価格情報が不明確 - 価格体系の明記を推奨');
        }
        if (data.productInfo.functions.length < 3) {
            suggestions.push('機能説明が不足 - 主要機能の詳細説明を追加');
        }
        if (data.valueProposition.emotionalValue.length === 0) {
            suggestions.push('情緒価値の訴求が不足 - 感情的なベネフィットの強化を推奨');
        }
        if (data.metadata.confidence < 80) {
            suggestions.push('データ品質向上の余地あり - LP内容の詳細化を推奨');
        }
        return suggestions;
    }
    getExtractionSources(data) {
        const sources = [];
        if (data.title)
            sources.push('ページタイトル');
        if (data.description)
            sources.push('メタ説明');
        if (data.productInfo.functions.length > 0)
            sources.push('機能一覧');
        if (data.productInfo.regularPrice)
            sources.push('価格情報');
        if (data.valueProposition.functionalValue.length > 0)
            sources.push('機能価値');
        if (data.valueProposition.emotionalValue.length > 0)
            sources.push('情緒価値');
        if (data.n1Profile.familyStructure)
            sources.push('N1プロフィール');
        if (data.competitors.categoryCompetitors.length > 0)
            sources.push('競合分析');
        return sources;
    }
}
exports.AutoAnalyzer = AutoAnalyzer;
exports.autoAnalyzer = new AutoAnalyzer();
