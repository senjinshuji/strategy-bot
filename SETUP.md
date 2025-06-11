# 戦略ボット - セットアップガイド

## 1. direnv方式（推奨）

### インストール
```bash
# macOS
brew install direnv

# zshの場合
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc

# bashの場合  
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
```

### 有効化
```bash
# プロジェクトディレクトリで実行
direnv allow
```

## 2. 手動実行方式

プロジェクトディレクトリで以下を実行：
```bash
source .claude/init-project.sh
```

## 利用可能なコマンド

### 開発用
- `dev` - 開発サーバー起動 (npm run dev)
- `build` - プロダクションビルド
- `test-analysis` - 分析APIテスト実行

### AI切り替え
- `claude-switch` - Claude API版に切り替え
- `ollama-switch` - Ollama版に切り替え
- `mock-test` - Mock版テスト実行

### Git操作
- `gs` - git status
- `ga` - git add .  
- `gc "message"` - git commit
- `gp` - git push

### タスク管理
- `cn "タスク名"` - タスク完了通知 + CLAUDE.md記録

## 自動実行内容

✅ 環境変数設定 (AI_PROVIDER, PORT等)  
✅ エイリアス登録 (開発・Git・AI切り替え)  
✅ プロジェクト情報表示  
✅ 通知システム準備

## AI プロバイダー切り替え

### Mock版 (完全無料)
```bash
# 自動設定済み - 追加設定不要
```

### Ollama版 (無料・ローカル)
```bash
# 1. Ollamaインストール
brew install ollama

# 2. モデルダウンロード
ollama pull llama3.1:8b

# 3. 切り替え
ollama-switch
```

### Claude API版 (有料・高品質)
```bash
# 1. APIキー取得: https://console.anthropic.com/
# 2. .env.local にキー設定
echo "ANTHROPIC_API_KEY=your_key" >> .env.local

# 3. 切り替え
claude-switch
```

## 開発フロー例

```bash
# 1. 環境初期化
direnv allow

# 2. 開発サーバー起動
dev

# 3. 分析テスト
test-analysis

# 4. タスク完了通知
cn "新機能実装完了"
```

---

**現在の状態**: Mock版で完全無料動作中 🚀