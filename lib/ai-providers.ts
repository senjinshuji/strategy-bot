// AI分析プロバイダーの抽象化
export interface AnalysisResult {
  success: boolean;
  analysis: string;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    cost: number;
  };
}

export interface AIProvider {
  name: string;
  cost: string;
  analyze(data: any): Promise<AnalysisResult>;
}

// モックデータ版（完全無料）
export class MockProvider implements AIProvider {
  name = 'Mock (テスト用)';
  cost = '無料';

  async analyze(data: any): Promise<AnalysisResult> {
    // 2秒待ってリアルっぽく
    await new Promise(resolve => setTimeout(resolve, 2000));

    const productName = data.product?.productInfo?.productName || '商品名未設定';
    
    const mockAnalysis = `
# 📊 戦略分析レポート: ${productName}

## 1. 戦略的インサイト

### バリュープロポジション分析
- **主要価値**: 時短と利便性の組み合わせ
- **差別化要素**: 家庭的な味と手軽さの両立
- **市場ポジション**: プレミアム時短食材カテゴリー

### 成功要因仮説
1. **ターゲットの明確化**: 共働き世帯の夕食問題解決
2. **品質と利便性**: プロの味 × レンジ調理
3. **継続利用促進**: 飽きない週替わりメニュー

### リスク分析と対策案
- **リスク**: 競合の価格競争
- **対策**: 品質差別化とブランディング強化

## 2. 推奨チャネル戦略

### 推奨媒体ランキング
1. **Instagram** (優先度: 高)
   - 理由: ターゲット女性の利用率が高い
   - 予算配分: 40%

2. **Google検索広告** (優先度: 高)  
   - 理由: 「時短料理」「宅配食」のニーズキャッチ
   - 予算配分: 35%

3. **Facebook広告** (優先度: 中)
   - 理由: ターゲティング精度の高さ
   - 予算配分: 25%

## 3. メッセージング戦略

### プライマリメッセージ
**「5分で完成！我が家のごちそう」**

### セカンダリメッセージ
- 機能価値: 「レンジでチンするだけ」
- 情緒価値: 「家族みんなの笑顔」
- RTB: 「プロの手作り、栄養士監修」

## 4. クリエイティブディレクション

### 推奨ビジュアル方向性
- **家族団らんシーン**: 情緒価値訴求
- **5分タイマー演出**: 機能価値訴求  
- **Before/After**: 調理の手軽さ

### コピー案
1. 「毎日戦争状態のママへ。5分で家族みんな笑顔の食卓」
2. 「レンジでチン。それだけで、プロの手作りが我が家に」
3. 「共働き夫婦が選んだ、夕飯づくりからの解放」

## 5. 競合ポジショニング戦略

### 差別化ポイント
- **味の続けやすさ**: 冷凍感のない出来立ての味
- **家庭的な安心感**: プロの手作り感
- **利便性**: 最短5分で完成

### 価格戦略
- **ポジション**: プレミアム価格帯
- **根拠**: 品質差別化による価値訴求

## 6. KPI設定提案

### 認知段階
- Instagram リーチ数: 月100万
- ブランド認知率: 3ヶ月で5%

### 獲得段階
- CPA: 3,000円以下
- CVR: 3%以上

### 継続段階  
- 継続率: 3ヶ月80%以上
- NPS: 50以上

## 7. 実行優先度ロードマップ

### Phase 1 (1-2ヶ月): 認知拡大
- Instagram広告開始
- インフルエンサー施策

### Phase 2 (2-4ヶ月): 獲得強化
- Google検索広告
- LP最適化

### Phase 3 (4-6ヶ月): リテンション
- 既存顧客向け施策
- 口コミ促進

## 8. 既存ツール活用提案

### 動画広告分析PRO
- 競合クリエイティブの定期分析
- トレンド把握と改善点発見

### ad.com  
- LP改善ポイントの継続監視
- A/Bテスト結果との照合

---
*このレポートは戦略ボット(モック版)により生成されました*
`;

    return {
      success: true,
      analysis: mockAnalysis,
      usage: {
        inputTokens: 2000,
        outputTokens: 3000,  
        cost: 0 // モック版は無料
      }
    };
  }
}

// Ollama版（完全無料）
export class OllamaProvider implements AIProvider {
  name = 'Ollama (ローカル)';
  cost = '無料';

  async analyze(data: any): Promise<AnalysisResult> {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1:8b',
          prompt: this.buildPrompt(data),
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Ollama サーバーに接続できません');
      }

      const result = await response.json();
      
      return {
        success: true,
        analysis: result.response,
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          cost: 0
        }
      };
    } catch (error) {
      return {
        success: false,
        analysis: '',
        error: error instanceof Error ? error.message : 'Ollama接続エラー'
      };
    }
  }

  private buildPrompt(data: any): string {
    return `あなたはマーケティング戦略のエキスパートです。以下の商品情報を分析して、包括的な戦略レポートを生成してください。

商品情報: ${JSON.stringify(data, null, 2)}

以下の8つの観点で分析結果を提供してください：
1. 戦略的インサイト
2. 推奨チャネル戦略  
3. メッセージング戦略
4. クリエイティブディレクション
5. 競合ポジショニング戦略
6. KPI設定提案
7. 実行優先度ロードマップ
8. 既存ツール活用提案

実践的で具体的な提案をお願いします。`;
  }
}

// Claude版（有料）
export class ClaudeProvider implements AIProvider {
  name = 'Claude 3.5 Sonnet';
  cost = '約15円/回';

  async analyze(data: any): Promise<AnalysisResult> {
    try {
      const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
      if (!ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not found');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: this.buildAnalysisPrompt(data)
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const result = await response.json();
      const analysisText = result.content[0].text;

      return {
        success: true,
        analysis: analysisText,
        usage: {
          inputTokens: result.usage?.input_tokens || 0,
          outputTokens: result.usage?.output_tokens || 0,
          cost: this.calculateCost(result.usage?.input_tokens || 0, result.usage?.output_tokens || 0)
        }
      };
    } catch (error) {
      return {
        success: false,
        analysis: '',
        error: error instanceof Error ? error.message : 'Claude API error'
      };
    }
  }

  private buildAnalysisPrompt(data: any): string {
    return `あなたは優秀なマーケティング戦略アナリストです。以下のLP情報から包括的な戦略分析を行ってください。

LP情報:
${JSON.stringify(data, null, 2)}

以下の8つの観点で詳細に分析してください：

1. 戦略的インサイト
2. 推奨チャネル戦略
3. メッセージング戦略
4. クリエイティブディレクション
5. 競合ポジショニング戦略
6. KPI設定提案
7. 実行優先度ロードマップ
8. 既存ツール活用提案

実践的で具体的な提案を日本語で回答してください。`;
  }

  private calculateCost(inputTokens: number, outputTokens: number): number {
    // Claude 3.5 Sonnet pricing: $3/1M input, $15/1M output
    return (inputTokens * 3 + outputTokens * 15) / 1000000 * 150; // USD to JPY conversion
  }
}

// ChatGPT版（有料）
export class ChatGPTProvider implements AIProvider {
  name = 'ChatGPT 4o';
  cost = '約8円/回';

  async analyze(data: any): Promise<AnalysisResult> {
    try {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not found');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{
            role: 'system',
            content: 'あなたは優秀なマーケティング戦略アナリストです。LPの情報から包括的な戦略分析を行い、実践的で具体的な提案を日本語で回答してください。'
          }, {
            role: 'user',
            content: this.buildAnalysisPrompt(data)
          }],
          max_tokens: 4000,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const analysisText = result.choices[0].message.content;

      return {
        success: true,
        analysis: analysisText,
        usage: {
          inputTokens: result.usage?.prompt_tokens || 0,
          outputTokens: result.usage?.completion_tokens || 0,
          cost: this.calculateCost(result.usage?.prompt_tokens || 0, result.usage?.completion_tokens || 0)
        }
      };
    } catch (error) {
      return {
        success: false,
        analysis: '',
        error: error instanceof Error ? error.message : 'OpenAI API error'
      };
    }
  }

  private buildAnalysisPrompt(data: any): string {
    return `以下のLP情報から包括的なマーケティング戦略分析を行ってください。

LP情報:
${JSON.stringify(data, null, 2)}

以下の8つの観点で詳細に分析してください：

1. 戦略的インサイト
   - バリュープロポジション分析
   - 成功要因仮説
   - リスク分析と対策案

2. 推奨チャネル戦略
   - 推奨媒体ランキング（優先度・予算配分含む）
   - 各媒体の選定理由

3. メッセージング戦略
   - プライマリメッセージ
   - セカンダリメッセージ（機能価値・情緒価値・RTB）

4. クリエイティブディレクション
   - 推奨ビジュアル方向性
   - コピー案（3パターン）

5. 競合ポジショニング戦略
   - 差別化ポイント
   - 価格戦略

6. KPI設定提案
   - 認知段階・獲得段階・継続段階のKPI

7. 実行優先度ロードマップ
   - Phase 1-3の具体的施策

8. 既存ツール活用提案
   - 動画広告分析PRO活用法
   - ad.com活用法

実践的で具体的な提案をお願いします。`;
  }

  private calculateCost(inputTokens: number, outputTokens: number): number {
    // GPT-4o pricing: $2.50/1M input, $10/1M output
    return (inputTokens * 2.5 + outputTokens * 10) / 1000000 * 150; // USD to JPY conversion
  }
}

// プロバイダー取得
export function getAIProvider(): AIProvider {
  const provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'mock';
  
  switch (provider) {
    case 'ollama':
      return new OllamaProvider();
    case 'claude':
      return new ClaudeProvider();
    case 'chatgpt':
      return new ChatGPTProvider();
    default:
      return new MockProvider();
  }
}

// プロバイダーオブジェクト（後方互換性のため）
export const aiProviders = {
  mock: new MockProvider(),
  ollama: new OllamaProvider(),
  claude: new ClaudeProvider(),
  chatgpt: new ChatGPTProvider()
};