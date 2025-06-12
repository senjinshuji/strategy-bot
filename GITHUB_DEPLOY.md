# GitHub経由でVercelにデプロイする手順

## 1. ターミナルでプロジェクトディレクトリに移動
```bash
cd /Users/watanabetessei/Desktop/調べ物/戦略bot/strategy-bot
```

## 2. Gitの状態を確認
```bash
git status
```

## 3. 必要なファイルをステージング
```bash
# 全ファイルを追加（.gitignoreで除外されるものは自動的に除外）
git add .

# または個別に追加
git add app/ components/ lib/ types/
git add package.json tsconfig.json next.config.js
git add tailwind.config.js postcss.config.js
git add README.md SETUP.md CHATGPT_SETUP.md
git add vercel.json
```

## 4. コミット
```bash
git commit -m "feat: ChatGPT版戦略bot - URL自動分析機能実装

- AI Provider統合（Mock/Ollama/Claude/ChatGPT）
- Playwright高精度スクレイピング（85%信頼度）
- URL入力による自動マーケティング分析
- ChatGPT APIでコスト効率重視（約8円/分析）
- 5タブUIから1ステップURL分析に簡略化"
```

## 5. GitHubにプッシュ
```bash
# 強制プッシュが必要な場合（既存のリポジトリと履歴が異なるため）
git push -f origin main

# または通常のプッシュ
git push origin main
```

## 6. Vercelでインポート

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard

2. **新規プロジェクト作成**
   - "Add New..." → "Project"
   - "Import Git Repository"

3. **GitHubリポジトリを選択**
   - `senjinshuji/strategy-bot` を選択

4. **プロジェクト設定**
   - Framework Preset: `Next.js`
   - Root Directory: `.` (デフォルト)
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **環境変数を設定**
   - `OPENAI_API_KEY`: あなたのOpenAI APIキー
   - `NEXT_PUBLIC_AI_PROVIDER`: `chatgpt`

6. **デプロイ実行**
   - "Deploy" ボタンをクリック

## トラブルシューティング

### プッシュエラーの場合
```bash
# リモートの最新状態を取得
git fetch origin

# 強制的にローカルの内容で上書き
git push -f origin main
```

### 認証エラーの場合
```bash
# Personal Access Tokenを使用
git remote set-url origin https://<your-token>@github.com/senjinshuji/strategy-bot.git
```

### ビルドエラーの場合
- Vercelのビルドログを確認
- 環境変数が正しく設定されているか確認
- package.jsonの依存関係が正しいか確認

## デプロイ後の確認

1. **Vercelダッシュボード**でデプロイ状態を確認
2. **発行されたURL**にアクセス
3. **URL分析機能**をテスト（https://www.tsukurioki.jp など）

## 継続的デプロイ

GitHubにプッシュすると自動的にVercelでビルド・デプロイされます：
```bash
git add .
git commit -m "fix: 機能改善"
git push origin main
```

---

**注意**: 環境変数（特にAPIキー）は絶対にGitHubにコミットしないでください。