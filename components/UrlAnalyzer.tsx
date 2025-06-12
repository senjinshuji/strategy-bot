'use client';

import { useState } from 'react';
import { AutoAnalysisResult } from '../lib/auto-analyzer';

interface UrlAnalysisResult {
  url: string;
  marketingAnalysis: any;
  metadata: {
    confidence: number;
    extractedFrom: string[];
    suggestions: string[];
    provider: string;
    processingTime: number;
    timestamp: string;
  };
}

export default function UrlAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [error, setError] = useState('');

  const analyzeUrl = async () => {
    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          provider: process.env.NEXT_PUBLIC_AI_PROVIDER || 'chatgpt'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API呼び出しに失敗しました');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return '高精度';
    if (confidence >= 60) return '中精度';
    return '低精度';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🚀 URL自動分析
        </h2>
        
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            製品・サービスのURL
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={analyzeUrl}
              disabled={loading || !url.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  分析中...
                </>
              ) : (
                '分析開始'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
              <div>
                <p className="text-blue-800 font-medium">分析実行中...</p>
                <p className="text-blue-600 text-sm">LP情報の取得と戦略分析を行っています</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Analysis Metadata */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">分析結果サマリー</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">信頼度</p>
                  <p className={`text-lg font-semibold ${getConfidenceColor(result.metadata.confidence)}`}>
                    {result.metadata.confidence}% ({getConfidenceLabel(result.metadata.confidence)})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">処理時間</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {(result.metadata.processingTime / 1000).toFixed(1)}秒
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">データソース数</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {result.metadata.extractedFrom.length}個
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">抽出データソース:</p>
                <div className="flex flex-wrap gap-2">
                  {result.metadata.extractedFrom.map((source, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Marketing Analysis Results */}
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">マーケティング戦略分析</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product */}
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-semibold text-blue-800 mb-2">📦 商品分析</h4>
                  <p><strong>カテゴリー:</strong> {result.marketingAnalysis.product?.category || '未分類'}</p>
                  <p><strong>価格:</strong> {result.marketingAnalysis.product?.pricing || '要確認'}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">主要機能:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {result.marketingAnalysis.product?.features?.slice(0, 3).map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      )) || <li>機能情報を取得中</li>}
                    </ul>
                  </div>
                </div>

                {/* Market */}
                <div className="bg-green-50 p-4 rounded-md">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 市場分析</h4>
                  <p><strong>ターゲット:</strong> {result.marketingAnalysis.market?.target || '分析中'}</p>
                  <p><strong>市場規模:</strong> {result.marketingAnalysis.market?.size || '推定中'}</p>
                  <p><strong>成長性:</strong> {result.marketingAnalysis.market?.growth || '評価中'}</p>
                </div>

                {/* Competitors */}
                <div className="bg-yellow-50 p-4 rounded-md">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚔️ 競合分析</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">直接競合:</p>
                      <p className="text-sm text-gray-600">
                        {result.marketingAnalysis.competitors?.direct?.join(', ') || '分析中'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">競合優位性:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {result.marketingAnalysis.competitors?.advantages?.slice(0, 2).map((advantage: string, index: number) => (
                          <li key={index}>{advantage}</li>
                        )) || <li>分析中</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Concept */}
                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-semibold text-purple-800 mb-2">💡 コンセプト</h4>
                  <p><strong>ブランド:</strong> {result.marketingAnalysis.concept?.brand || '策定中'}</p>
                  <p><strong>ポジション:</strong> {result.marketingAnalysis.concept?.positioning || '分析中'}</p>
                  <p><strong>メッセージ:</strong> {result.marketingAnalysis.concept?.message || '検討中'}</p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {result.metadata.suggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 改善提案</h3>
                <ul className="space-y-2">
                  {result.metadata.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-yellow-800">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analysis Link */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">詳細分析</h3>
              <p className="text-gray-600 mb-3">
                この結果をもとに詳細な戦略分析を実行することができます。
              </p>
              <button
                onClick={() => {
                  // TODO: Navigate to detailed analysis with pre-filled data
                  alert('詳細分析機能は開発中です');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                詳細戦略分析へ進む →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}