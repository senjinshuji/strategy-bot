'use client';

import { useState } from 'react';
import { MarketingAnalysis } from '../types';
import UrlAnalyzer from '../components/UrlAnalyzer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('url');
  const [formData, setFormData] = useState<Partial<MarketingAnalysis>>({
    product: {
      productInfo: {
        productName: '',
        productUrl: '',
        category: '',
        sizeCapacity: '',
        functions: [],
        effects: [],
        rtb: '',
        authority: '',
        regularPrice: '',
        specialPrice: '',
        campaign: '',
        releaseDate: '',
        salesChannel: '',
        demographics: {
          age: '',
          gender: '',
          other: ''
        }
      },
      valueProposition: {
        functionalValue: [],
        emotionalValue: []
      }
    },
    market: {
      marketTarget: {
        marketDefinition: '',
        marketCategory: '',
        strategicTarget: '',
        coreTarget: '',
        marketSize: '',
        purchasers: '',
        aov: ''
      }
    },
    n1: [{
      profile: {
        age: '',
        gender: '',
        location: '',
        occupation: '',
        position: '',
        industryCategory: '',
        income: '',
        education: '',
        familyStructure: '',
        lifestyle: '',
        interests: [],
        mediaUsage: [],
        dailyPurchases: [],
        specialPurchases: []
      },
      journey: {
        situation: '',
        driver: '',
        instinct: '',
        perception: '',
        emotion: '',
        discomfort: '',
        stress: '',
        desire: '',
        category: '',
        howToGet: '',
        categorySelection: '',
        priceExpectation: '',
        otherRequirements: '',
        demand: ''
      }
    }],
    concept: {
      market: '',
      strategicTarget: '',
      coreTarget: '',
      demand: '',
      benefit: '',
      features: [],
      concept: '',
      rtb: '',
      brandCharacter: ''
    }
  });

  const tabs = [
    { id: 'url', label: 'URL分析', icon: '🚀' },
    { id: 'product', label: '商品', icon: '📦' },
    { id: 'market', label: '市場', icon: '📊' },
    { id: 'n1', label: 'N1', icon: '👤' },
    { id: 'competitor', label: '競合', icon: '⚔️' },
    { id: 'concept', label: 'コンセプト', icon: '💡' }
  ];

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [analysisError, setAnalysisError] = useState<string>('');
  const [usageStats, setUsageStats] = useState<any>(null);
  const [providerInfo, setProviderInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product?.productInfo.productName) {
      alert('商品名を入力してください。');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setAnalysisResult(result.analysis);
        setUsageStats(result.usage);
        setProviderInfo(result.provider);
      } else {
        setAnalysisError(result.error || '分析に失敗しました。');
      }
    } catch (error) {
      setAnalysisError('ネットワークエラーが発生しました。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProductInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product!,
        productInfo: {
          ...prev.product!.productInfo,
          [field]: value
        }
      }
    }));
  };

  const handleDemographicsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product!,
        productInfo: {
          ...prev.product!.productInfo,
          demographics: {
            ...prev.product!.productInfo.demographics,
            [field]: value
          }
        }
      }
    }));
  };

  const handleValuePropositionChange = (type: 'functionalValue' | 'emotionalValue', value: string) => {
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product!,
        valueProposition: {
          ...prev.product!.valueProposition,
          [type]: value.split('\n').filter(v => v.trim())
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          戦略ボット - マーケティング分析
        </h1>

        {/* タブナビゲーション */}
        <div className="flex justify-center mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm transition-colors duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* URL分析タブ */}
        {activeTab === 'url' && (
          <UrlAnalyzer />
        )}

        {/* 手動入力フォーム */}
        {activeTab !== 'url' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 商品タブ */}
          {activeTab === 'product' && (
            <div className="space-y-6">
              {/* 製品情報セクション */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                  製品情報
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      商品名
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: つくりおき.jp"
                      value={formData.product?.productInfo.productName || ''}
                      onChange={(e) => handleProductInputChange('productName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      商品URL
                    </label>
                    <input
                      type="url"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.example.com"
                      value={formData.product?.productInfo.productUrl || ''}
                      onChange={(e) => handleProductInputChange('productUrl', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      カテゴリー
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 宅配食（冷凍）、家庭料理"
                      value={formData.product?.productInfo.category || ''}
                      onChange={(e) => handleProductInputChange('category', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      サイズ・容量
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 週3食プラン（4人前×3食）"
                      value={formData.product?.productInfo.sizeCapacity || ''}
                      onChange={(e) => handleProductInputChange('sizeCapacity', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      通常価格
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 1人前798円〜"
                      value={formData.product?.productInfo.regularPrice || ''}
                      onChange={(e) => handleProductInputChange('regularPrice', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      特別オファー価格
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 初回限定50%OFF"
                      value={formData.product?.productInfo.specialPrice || ''}
                      onChange={(e) => handleProductInputChange('specialPrice', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    機能（改行区切りで入力）
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    placeholder="プロの手作り&#10;週替わりメニュー&#10;栄養士監修のメニュー"
                    value={formData.product?.productInfo.functions?.join('\n') || ''}
                    onChange={(e) => handleProductInputChange('functions', e.target.value.split('\n').filter(v => v.trim()))}
                  />
                </div>

                {/* デモグラフィック */}
                <h3 className="text-lg font-medium mt-6 mb-3 text-gray-700">デモグラフィック</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      年齢
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 20-40代"
                      value={formData.product?.productInfo.demographics.age || ''}
                      onChange={(e) => handleDemographicsChange('age', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      性別
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 男性10.3% 女性89.1%"
                      value={formData.product?.productInfo.demographics.gender || ''}
                      onChange={(e) => handleDemographicsChange('gender', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      その他
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 共働き、3or4人家族が7割"
                      value={formData.product?.productInfo.demographics.other || ''}
                      onChange={(e) => handleDemographicsChange('other', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 提供価値候補セクション */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                  提供価値候補
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      機能価値（改行区切りで入力）
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      placeholder="5分で食卓が完成&#10;毎日の夕食作りが丸っとなくなる&#10;メニューを考えないでいい"
                      value={formData.product?.valueProposition.functionalValue?.join('\n') || ''}
                      onChange={(e) => handleValuePropositionChange('functionalValue', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      情緒価値（どんな人が/どんな状況で/どう感じる）
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      placeholder="家族みんなが/夕飯で/家庭的な味でおいしいと感じる&#10;夫婦が/食事終わりに/時間にゆとりができて家族時間が増える"
                      value={formData.product?.valueProposition.emotionalValue?.join('\n') || ''}
                      onChange={(e) => handleValuePropositionChange('emotionalValue', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 市場タブ */}
          {activeTab === 'market' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                市場/ターゲット
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    市場（機能・情緒価値が刺さるボリュームが最大化する市場定義）
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 料理のアウトソーシング市場"
                    value={formData.market?.marketTarget.marketDefinition || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      market: {
                        marketTarget: {
                          ...prev.market!.marketTarget,
                          marketDefinition: e.target.value
                        }
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    市場カテゴリー
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 宅配食/中食/家事代行/フードデリバリー/冷凍ミールキット"
                    value={formData.market?.marketTarget.marketCategory || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      market: {
                        marketTarget: {
                          ...prev.market!.marketTarget,
                          marketCategory: e.target.value
                        }
                      }
                    }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      戦略ターゲット
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 共働き夫婦"
                      value={formData.market?.marketTarget.strategicTarget || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        market: {
                          marketTarget: {
                            ...prev.market!.marketTarget,
                            strategicTarget: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      コアターゲット
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 健康or仕事都合で夕飯作りが難しい共働き夫婦"
                      value={formData.market?.marketTarget.coreTarget || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        market: {
                          marketTarget: {
                            ...prev.market!.marketTarget,
                            coreTarget: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      市場規模
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 約11兆5,000億円"
                      value={formData.market?.marketTarget.marketSize || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        market: {
                          marketTarget: {
                            ...prev.market!.marketTarget,
                            marketSize: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      購入者数（年間）
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 約8,500万人"
                      value={formData.market?.marketTarget.purchasers || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        market: {
                          marketTarget: {
                            ...prev.market!.marketTarget,
                            purchasers: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      AOV（購入単価/1回）
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 約1,335円"
                      value={formData.market?.marketTarget.aov || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        market: {
                          marketTarget: {
                            ...prev.market!.marketTarget,
                            aov: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* N1タブ */}
          {activeTab === 'n1' && (
            <div className="space-y-6">
              {/* プロフィールセクション */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                  N1プロフィール
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">年齢</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 35歳"
                      value={formData.n1?.[0]?.profile.age || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          profile: {
                            ...prev.n1![0].profile,
                            age: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">性別</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 女性"
                      value={formData.n1?.[0]?.profile.gender || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          profile: {
                            ...prev.n1![0].profile,
                            gender: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">居住地</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 東京都 世田谷区"
                      value={formData.n1?.[0]?.profile.location || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          profile: {
                            ...prev.n1![0].profile,
                            location: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">職業</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 事務職"
                      value={formData.n1?.[0]?.profile.occupation || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          profile: {
                            ...prev.n1![0].profile,
                            occupation: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">役職</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 一般職（主任クラス）"
                      value={formData.n1?.[0]?.profile.position || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          profile: {
                            ...prev.n1![0].profile,
                            position: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">業種カテゴリー</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 金融"
                      value={formData.n1?.[0]?.profile.industryCategory || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          profile: {
                            ...prev.n1![0].profile,
                            industryCategory: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">家族構成</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                    placeholder="例: 夫（36歳・メーカー勤務・営業職）子供2人（5歳・3歳の未就学児）の4人家族"
                    value={formData.n1?.[0]?.profile.familyStructure || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      n1: [{
                        ...prev.n1![0],
                        profile: {
                          ...prev.n1![0].profile,
                          familyStructure: e.target.value
                        }
                      }]
                    }))}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">生活リズム</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    placeholder="例: 平日：朝6:00起床 → 子供の支度 → 保育園送り → 出社9:00 → 退社17:00 → 保育園迎え18:00 → 帰宅18:30"
                    value={formData.n1?.[0]?.profile.lifestyle || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      n1: [{
                        ...prev.n1![0],
                        profile: {
                          ...prev.n1![0].profile,
                          lifestyle: e.target.value
                        }
                      }]
                    }))}
                  />
                </div>
              </div>

              {/* N1脳内ジャーニーセクション */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                  N1脳内ジャーニー
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">状況（シーン）</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                      placeholder="例: 子供2人を保育園に通わせながら共働き。毎晩の「夕飯→お風呂→寝かしつけ」までが戦争状態。"
                      value={formData.n1?.[0]?.journey.situation || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          journey: {
                            ...prev.n1![0].journey,
                            situation: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">体感（ドライバー）</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                      placeholder="例: 外感（五感）：子どもの声や生活の雑音が多い&#10;内感（体感覚）：脳の疲労感、空腹"
                      value={formData.n1?.[0]?.journey.driver || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          journey: {
                            ...prev.n1![0].journey,
                            driver: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">感情（エモーション）</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 不快"
                        value={formData.n1?.[0]?.journey.emotion || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          n1: [{
                            ...prev.n1![0],
                            journey: {
                              ...prev.n1![0].journey,
                              emotion: e.target.value
                            }
                          }]
                        }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">ストレス</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: キツすぎ、もう無理"
                        value={formData.n1?.[0]?.journey.stress || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          n1: [{
                            ...prev.n1![0],
                            journey: {
                              ...prev.n1![0].journey,
                              stress: e.target.value
                            }
                          }]
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">欲求</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 夕飯準備なくしたい、子供にハッピーでいてほしい"
                      value={formData.n1?.[0]?.journey.desire || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          journey: {
                            ...prev.n1![0].journey,
                            desire: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">需要</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                      placeholder="例: 子供がしっかり毎日食べてくれて、値段が高すぎず晩ごはんが家に届くサービス"
                      value={formData.n1?.[0]?.journey.demand || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        n1: [{
                          ...prev.n1![0],
                          journey: {
                            ...prev.n1![0].journey,
                            demand: e.target.value
                          }
                        }]
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 競合タブ */}
          {activeTab === 'competitor' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                競合分析
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-700">カテゴリー競合</h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">競合カテゴリー</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 作り置き宅配"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">ブランド競合</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: シェフボックス/やおやの食卓"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">プロダクト競合</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 定期便：主菜＋副菜/おばんざい定期便"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">差別化要素</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 味の続けやすさ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">USP（便益）</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 家庭的な美味しさ、5分で夕飯出来上がり"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">プレファレンス（VALUE FIT）ボリューム</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 市場規模 約1兆3,377億円、ターゲット 約928.9万人"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  ※ 追加の競合カテゴリーがある場合は、分析実行後に追加できます
                </div>
              </div>
            </div>
          )}

          {/* コンセプトタブ */}
          {activeTab === 'concept' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                コンセプト（コアターゲットに紐づく）
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">市場</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 料理のアウトソーシング市場"
                      value={formData.concept?.market || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        concept: {
                          ...prev.concept!,
                          market: e.target.value
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">戦略ターゲット</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: 共働き夫婦"
                      value={formData.concept?.strategicTarget || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        concept: {
                          ...prev.concept!,
                          strategicTarget: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">コアターゲット</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 健康or仕事都合で夕飯作りが難しい共働き夫婦"
                    value={formData.concept?.coreTarget || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      concept: {
                        ...prev.concept!,
                        coreTarget: e.target.value
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">需要</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                    placeholder="例: 子供がしっかり毎日食べてくれて、値段が高すぎず晩ごはんが家に届くサービス"
                    value={formData.concept?.demand || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      concept: {
                        ...prev.concept!,
                        demand: e.target.value
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">便益</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 家庭的な美味しさ、5分で夕飯出来上がり"
                    value={formData.concept?.benefit || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      concept: {
                        ...prev.concept!,
                        benefit: e.target.value
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">特徴（便益提供特徴）</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                    placeholder="・出来立ての味が冷蔵で届く&#10;・管理栄養士監修プロの手作りごはん&#10;・チンするだけの超ラク夕飯準備体験"
                    value={formData.concept?.features?.join('\n') || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      concept: {
                        ...prev.concept!,
                        features: e.target.value.split('\n').filter(v => v.trim())
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">コンセプト</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 5分で完成！我が家のごちそう"
                    value={formData.concept?.concept || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      concept: {
                        ...prev.concept!,
                        concept: e.target.value
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">RTB</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                    placeholder="レンジでチンするだけでこの出来上がり（写真映像見せ）&#10;メニューを考えない、買い物に行かない、調理をしない、洗い物が出ない4STEP"
                    value={formData.concept?.rtb || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      concept: {
                        ...prev.concept!,
                        rtb: e.target.value
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">ブランドキャラクター</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 料理特化の第二のおふくろ"
                    value={formData.concept?.brandCharacter || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      concept: {
                        ...prev.concept!,
                        brandCharacter: e.target.value
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className={`w-full py-3 px-6 rounded-md transition duration-200 font-medium text-lg ${
              isAnalyzing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isAnalyzing ? '分析中...' : '戦略分析を実行'}
          </button>

          {/* 分析結果表示 */}
          {analysisError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-lg font-semibold text-red-800 mb-2">エラー</h3>
              <p className="text-red-700">{analysisError}</p>
            </div>
          )}

          {analysisResult && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">📊 戦略分析レポート</h3>
                <div className="text-sm text-gray-500">
                  {providerInfo && (
                    <div className="text-right">
                      <div>AI: {providerInfo.name}</div>
                      <div>コスト: {providerInfo.cost}</div>
                      {usageStats && usageStats.cost > 0 && (
                        <div>${usageStats.cost.toFixed(4)} | {usageStats.inputTokens + usageStats.outputTokens} tokens</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {analysisResult}
                </pre>
              </div>
            </div>
          )}
          </form>
        )}
      </div>
    </div>
  );
}