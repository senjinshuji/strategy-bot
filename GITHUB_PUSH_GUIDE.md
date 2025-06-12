# 戦略botプロジェクトをGitHubにpushする詳細手順

## 現在の状況
- 作業ディレクトリ: `/Users/watanabetessei/Desktop/調べ物/戦略bot/strategy-bot`
- 現在のリモートリポジトリ: `https://github.com/senjinshuji/diagnosisbot.git` (誤ったリポジトリ)
- 正しいリモートリポジトリ: `https://github.com/senjinshuji/strategy-bot`

## 手順

### 1. リモートリポジトリの変更

まず、現在の誤ったリモートリポジトリを正しいものに変更します。

```bash
# 現在のリモートリポジトリを確認
git remote -v

# 既存のoriginを削除
git remote remove origin

# 正しいリモートリポジトリを追加
git remote add origin https://github.com/senjinshuji/strategy-bot.git

# 変更を確認
git remote -v
```

### 2. 現在の変更状況の確認

```bash
# 変更されたファイルと未追跡のファイルを確認
git status
```

### 3. .gitignoreファイルの確認と更新

プロジェクトに適切な.gitignoreファイルがあることを確認します。

```bash
# .gitignoreの内容を確認
cat .gitignore
```

もし.gitignoreがない場合、以下の内容で作成してください：

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# テストデータ
test-data.json
tsukurioki-enhanced-data.json
tsukurioki-scraped-data.json
```

### 4. ファイルの追加とコミット

#### 4.1 すべての変更を確認
```bash
# 追加される予定のファイルを確認（ドライラン）
git add --dry-run .
```

#### 4.2 必要なファイルを段階的に追加

```bash
# 設定ファイルを追加
git add package.json package-lock.json tsconfig.json

# アプリケーションファイルを追加
git add app/
git add components/
git add lib/*.ts
git add lib/types/

# 必要なドキュメントを追加
git add README.md SETUP.md CLAUDE.md CHATGPT_SETUP.md

# Vercel設定を追加
git add vercel.json .vercelignore

# 環境変数の例を追加
git add .env.example

# テストファイルは必要に応じて追加（オプション）
# git add test-*.js
```

#### 4.3 追加されたファイルを確認
```bash
git status
```

#### 4.4 コミット
```bash
git commit -m "feat: 戦略bot初期実装 - AIプロバイダー統合とURL分析機能を追加"
```

### 5. リモートリポジトリの現在の状態を確認

```bash
# リモートリポジトリから最新の情報を取得
git fetch origin

# リモートブランチを確認
git branch -r
```

### 6. プッシュ

#### 6.1 初回プッシュの場合
```bash
# mainブランチをプッシュ（-uオプションで上流ブランチを設定）
git push -u origin main
```

#### 6.2 既存のリポジトリに変更がある場合

もしリモートリポジトリに既存のコミットがある場合、以下のエラーが出る可能性があります：
```
! [rejected]        main -> main (non-fast-forward)
```

この場合は以下の手順で対処：

```bash
# リモートの変更を取得
git fetch origin

# リモートの変更をローカルにマージ
git merge origin/main --allow-unrelated-histories

# コンフリクトがある場合は解決してコミット
git add .
git commit -m "merge: リモートリポジトリの変更をマージ"

# 再度プッシュ
git push origin main
```

### 7. プッシュ後の確認

```bash
# プッシュが成功したか確認
git log --oneline -5

# リモートとローカルの同期状態を確認
git status
```

### 8. GitHub上での確認

1. ブラウザで https://github.com/senjinshuji/strategy-bot を開く
2. ファイルが正しくアップロードされているか確認
3. READMEが正しく表示されているか確認

## トラブルシューティング

### 認証エラーが発生した場合

GitHubの認証にはPersonal Access Token（PAT）が必要です：

1. GitHubで Settings > Developer settings > Personal access tokens に移動
2. "Generate new token" をクリック
3. 必要な権限（repo）を選択
4. トークンを生成してコピー
5. プッシュ時にパスワードの代わりにこのトークンを使用

```bash
# HTTPSでプッシュする場合
git push origin main
# Username: あなたのGitHubユーザー名
# Password: 生成したPersonal Access Token
```

### 大きなファイルのエラー

100MB以上のファイルがある場合：

```bash
# Git LFSをインストール
brew install git-lfs

# Git LFSを初期化
git lfs install

# 大きなファイルをLFSで追跡
git lfs track "*.大きなファイルの拡張子"

# .gitattributesを追加
git add .gitattributes
```

### node_modulesが誤って追加された場合

```bash
# キャッシュから削除
git rm -r --cached node_modules

# .gitignoreに追加されていることを確認
echo "node_modules/" >> .gitignore

# 変更をコミット
git add .gitignore
git commit -m "fix: node_modulesをgitignoreに追加"
```

## 推奨される追加設定

### GitHub Actions の設定

`.github/workflows/ci.yml` を作成して、自動テストやビルドを設定：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test --if-present
```

### Branch Protection Rules

GitHubのリポジトリ設定で、mainブランチの保護ルールを設定することを推奨します：

1. Settings > Branches
2. Add rule
3. Branch name pattern: `main`
4. 必要な保護ルールを選択（PR必須、レビュー必須など）

これで、戦略botプロジェクトを安全にGitHubにプッシュできます。