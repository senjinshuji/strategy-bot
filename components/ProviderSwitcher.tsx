'use client';

import { useState } from 'react';

interface ProviderInfo {
  id: string;
  name: string;
  cost: string;
  description: string;
  status: 'available' | 'requires_key' | 'free';
  icon: string;
}

const providers: ProviderInfo[] = [
  {
    id: 'mock',
    name: 'Mock (テスト用)',
    cost: '無料',
    description: 'サンプルデータでの分析テスト',
    status: 'free',
    icon: '🧪'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT 4o',
    cost: '約8円/回',
    description: 'コスト効率重視・高速処理',
    status: 'requires_key',
    icon: '🤖'
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    cost: '約15円/回',
    description: '高品質・日本語自然性重視',
    status: 'requires_key',
    icon: '🧠'
  },
  {
    id: 'ollama',
    name: 'Ollama (ローカル)',
    cost: '無料',
    description: 'ローカル実行・プライバシー重視',
    status: 'requires_key',
    icon: '🏠'
  }
];

export default function ProviderSwitcher() {
  const [currentProvider, setCurrentProvider] = useState(
    process.env.NEXT_PUBLIC_AI_PROVIDER || 'chatgpt'
  );

  const handleProviderChange = (providerId: string) => {
    // 注意: 実際の切り替えには環境変数の変更が必要
    setCurrentProvider(providerId);
    alert(`${providers.find(p => p.id === providerId)?.name} を選択しました。\n実際の切り替えには .env.local ファイルの NEXT_PUBLIC_AI_PROVIDER を変更してください。`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'free':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">無料</span>;
      case 'requires_key':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">APIキー必要</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">利用可能</span>;
    }
  };

  const currentProviderInfo = providers.find(p => p.id === currentProvider);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🔧 AI プロバイダー設定
        </h2>
        
        {/* 現在の設定 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">現在の設定</h3>
          {currentProviderInfo && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentProviderInfo.icon}</span>
              <div>
                <p className="font-medium text-blue-900">{currentProviderInfo.name}</p>
                <p className="text-sm text-blue-700">{currentProviderInfo.description}</p>
                <p className="text-sm text-blue-600">コスト: {currentProviderInfo.cost}</p>
              </div>
              {getStatusBadge(currentProviderInfo.status)}
            </div>
          )}
        </div>

        {/* プロバイダー一覧 */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">利用可能なプロバイダー</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                currentProvider === provider.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleProviderChange(provider.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                    <p className="text-sm text-gray-600">{provider.cost}</p>
                  </div>
                </div>
                {getStatusBadge(provider.status)}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
              
              {/* 詳細情報 */}
              {provider.id === 'chatgpt' && (
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• コストパフォーマンス重視</p>
                  <p>• 高速処理・大量分析に適している</p>
                  <p>• プロトタイプ開発におすすめ</p>
                </div>
              )}
              
              {provider.id === 'claude' && (
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• 高品質な日本語分析</p>
                  <p>• 長文コンテキスト理解</p>
                  <p>• 重要案件・最終レポートに最適</p>
                </div>
              )}
              
              {provider.id === 'mock' && (
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• APIキー不要でテスト可能</p>
                  <p>• 機能確認・デモンストレーション用</p>
                  <p>• 開発・学習目的に最適</p>
                </div>
              )}
              
              {provider.id === 'ollama' && (
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• ローカル実行でプライバシー保護</p>
                  <p>• インターネット不要</p>
                  <p>• セットアップが必要</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* セットアップガイド */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 セットアップガイド</h3>
          
          {currentProvider === 'chatgpt' && (
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>ChatGPT API セットアップ:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li><a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a> でAPIキー取得</li>
                <li><code>.env.local</code> ファイルに <code>OPENAI_API_KEY</code> を設定</li>
                <li>詳細は <code>CHATGPT_SETUP.md</code> を参照</li>
              </ol>
            </div>
          )}
          
          {currentProvider === 'claude' && (
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Claude API セットアップ:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li><a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Anthropic Console</a> でAPIキー取得</li>
                <li><code>.env.local</code> ファイルに <code>ANTHROPIC_API_KEY</code> を設定</li>
                <li>プロジェクトを再起動</li>
              </ol>
            </div>
          )}
          
          {currentProvider === 'mock' && (
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Mock版:</strong> 追加設定不要。すぐにテスト可能です。</p>
            </div>
          )}
          
          {currentProvider === 'ollama' && (
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Ollama セットアップ:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li><code>brew install ollama</code></li>
                <li><code>ollama pull llama3.1:8b</code></li>
                <li>Ollamaサーバーを起動</li>
              </ol>
            </div>
          )}
        </div>

        {/* コスト見積もり */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">💰 月間コスト見積もり</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium text-gray-700">月10回分析</p>
              <p className="text-lg font-bold text-green-600">
                {currentProvider === 'chatgpt' ? '約80円' : 
                 currentProvider === 'claude' ? '約150円' : '無料'}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">月50回分析</p>
              <p className="text-lg font-bold text-blue-600">
                {currentProvider === 'chatgpt' ? '約400円' : 
                 currentProvider === 'claude' ? '約750円' : '無料'}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">月100回分析</p>
              <p className="text-lg font-bold text-purple-600">
                {currentProvider === 'chatgpt' ? '約800円' : 
                 currentProvider === 'claude' ? '約1,500円' : '無料'}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">月500回分析</p>
              <p className="text-lg font-bold text-red-600">
                {currentProvider === 'chatgpt' ? '約4,000円' : 
                 currentProvider === 'claude' ? '約7,500円' : '無料'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}