#!/bin/bash

# 戦略ボット - プロジェクト自動初期化スクリプト

# エイリアス設定
alias dev='npm run dev'
alias build='npm run build'
alias test-analysis='node test-api.js'
alias switch-ai='echo "AI Provider切り替え: .env.local の NEXT_PUBLIC_AI_PROVIDER を編集"'

# Git エイリアス
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'

# 戦略ボット専用コマンド
alias analyze='echo "戦略分析テスト実行中..." && npm run dev &'
alias mock-test='echo "モック版テスト実行" && node test-api.js'
alias claude-switch='echo "Claude版に切り替え中..." && sed -i "" "s/NEXT_PUBLIC_AI_PROVIDER=.*/NEXT_PUBLIC_AI_PROVIDER=claude/" .env.local'
alias ollama-switch='echo "Ollama版に切り替え中..." && sed -i "" "s/NEXT_PUBLIC_AI_PROVIDER=.*/NEXT_PUBLIC_AI_PROVIDER=ollama/" .env.local'

# タスク完了通知
alias cn='bash .claude/task-complete.sh'

# プロジェクト情報表示
echo "🤖 戦略ボット - マーケティング分析AI"
echo "📅 開始日: 2025-06-11"  
echo "💰 コスト: 無料版で稼働中"
echo ""
echo "🔧 利用可能コマンド:"
echo "  dev          - 開発サーバー起動"
echo "  test-analysis - 分析APIテスト" 
echo "  mock-test    - モック版テスト"
echo "  claude-switch - Claude版に切り替え"
echo "  ollama-switch - Ollama版に切り替え"
echo "  cn 'タスク'   - タスク完了通知"
echo ""