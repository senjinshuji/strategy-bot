import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function analyzeMarketingStrategy(data: any) {
  try {
    const prompt = `
あなたはマーケティング戦略のエキスパートです。以下の商品情報を分析して、包括的な戦略レポートを生成してください。

## 入力データ
${JSON.stringify(data, null, 2)}

## 出力形式
以下の8つの観点で分析結果を提供してください：

### 1. 戦略的インサイト
- バリュープロポジション分析
- 成功要因仮説（3つ）
- リスク分析と対策案

### 2. 推奨チャネル戦略
- 推奨媒体ランキング（理由付き）
- 予算配分提案
- 各チャネルの役割

### 3. メッセージング戦略
- プライマリメッセージ
- セカンダリメッセージ
- ターゲット別カスタマイズ

### 4. クリエイティブディレクション
- 推奨ビジュアル方向性
- コピー案（3パターン）
- 参考クリエイティブ要素

### 5. 競合ポジショニング戦略
- 差別化ポイント
- 価格戦略
- 弱点補強案

### 6. KPI設定提案
- 認知段階のKPI
- 獲得段階のKPI
- 継続段階のKPI

### 7. 実行優先度ロードマップ
- Phase別の実行計画（6ヶ月間）
- 各フェーズの目標とアクション

### 8. 既存ツール活用提案
- 動画広告分析PROの活用法
- ad.comデータの活用法

実践的で具体的な提案をお願いします。数値目標も含めてください。
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return {
      success: true,
      analysis: response.content[0]?.type === 'text' ? response.content[0].text : '',
      usage: {
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
        cost: calculateCost(response.usage?.input_tokens || 0, response.usage?.output_tokens || 0)
      }
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      analysis: ''
    };
  }
}

function calculateCost(inputTokens: number, outputTokens: number): number {
  // Claude 3.5 Haiku pricing: $0.25/1M input tokens, $1.25/1M output tokens
  const inputCost = (inputTokens / 1000000) * 0.25;
  const outputCost = (outputTokens / 1000000) * 1.25;
  return inputCost + outputCost;
}

export { calculateCost };