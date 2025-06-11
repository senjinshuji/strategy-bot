#!/bin/bash

# タスク完了通知システム

TASK_NAME="${1:-タスク完了}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# macOS通知
osascript -e "display notification \"$TASK_NAME\" with title \"🤖 戦略ボット\" subtitle \"タスク完了\" sound name \"Hero\""

# CLAUDE.md に記録
echo "- ✅ $TIMESTAMP - $TASK_NAME" >> CLAUDE.md

echo "✅ タスク完了: $TASK_NAME (CLAUDE.mdに記録)"