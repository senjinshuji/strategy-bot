// Claude vs ChatGPT API Performance Comparison Test
const { enhancedPlaywrightScraper } = require('./lib/enhanced-playwright-scraper');
const { aiProviders } = require('./lib/ai-providers');

// Test configuration
const TEST_CONFIG = {
  testUrl: 'https://www.tsukurioki.jp/',
  providers: ['mock', 'claude', 'chatgpt'],
  iterations: 1, // Number of tests per provider
  metrics: ['cost', 'speed', 'quality', 'accuracy']
};

async function runComparisonTest() {
  console.log('🚀 Claude vs ChatGPT パフォーマンス比較テスト開始');
  console.log(`📊 テスト対象: ${TEST_CONFIG.testUrl}`);
  console.log(`🤖 プロバイダー: ${TEST_CONFIG.providers.join(', ')}`);
  console.log('=' * 60);

  const results = {};
  
  // 共通のスクレイピングデータを取得（1回のみ）
  console.log('\n🎯 共通データの高精度スクレイピング実行中...');
  const scrapedData = await enhancedPlaywrightScraper.scrapeLP(TEST_CONFIG.testUrl);
  console.log(`✅ スクレイピング完了 (信頼度: ${scrapedData.metadata.confidence}%)`);

  // 各プロバイダーでテスト実行
  for (const providerName of TEST_CONFIG.providers) {
    console.log(`\n${'='.repeat(20)} ${providerName.toUpperCase()} テスト ${'='.repeat(20)}`);
    
    const providerResults = [];
    
    for (let i = 0; i < TEST_CONFIG.iterations; i++) {
      console.log(`\n🔄 ${providerName} - 実行 ${i + 1}/${TEST_CONFIG.iterations}`);
      
      try {
        const startTime = Date.now();
        
        // AI分析実行
        const provider = aiProviders[providerName];
        const analysisResult = await provider.analyze(scrapedData);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (analysisResult.success) {
          const result = {
            provider: providerName,
            iteration: i + 1,
            success: true,
            duration,
            analysis: analysisResult.analysis,
            usage: analysisResult.usage || {},
            quality: evaluateQuality(analysisResult.analysis),
            accuracy: evaluateAccuracy(analysisResult.analysis, scrapedData),
            timestamp: new Date().toISOString()
          };
          
          providerResults.push(result);
          
          console.log(`  ✅ 成功 (${duration}ms)`);
          console.log(`  💰 コスト: ${analysisResult.usage?.cost?.toFixed(2) || 0}円`);
          console.log(`  📊 品質スコア: ${result.quality}/100`);
          console.log(`  🎯 精度スコア: ${result.accuracy}/100`);
          console.log(`  📝 分析文字数: ${analysisResult.analysis.length}文字`);
          
        } else {
          console.log(`  ❌ 失敗: ${analysisResult.error}`);
          providerResults.push({
            provider: providerName,
            iteration: i + 1,
            success: false,
            error: analysisResult.error,
            timestamp: new Date().toISOString()
          });
        }
        
      } catch (error) {
        console.log(`  💥 エラー: ${error.message}`);
        providerResults.push({
          provider: providerName,
          iteration: i + 1,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    results[providerName] = providerResults;
  }

  // 比較レポート生成
  console.log('\n' + '='.repeat(60));
  console.log('📊 Claude vs ChatGPT 比較レポート');
  console.log('='.repeat(60));
  
  generateComparisonReport(results);
  
  // 詳細結果をファイルに保存
  const fs = require('fs');
  fs.writeFileSync('ai-comparison-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 詳細結果を ai-comparison-results.json に保存しました');
  
  // 推奨事項
  console.log('\n🎯 推奨事項:');
  generateRecommendations(results);
  
  await enhancedPlaywrightScraper.close();
  console.log('\n🔚 比較テスト完了');
}

function evaluateQuality(analysisText) {
  let score = 0;
  
  // 基本構造の評価 (40点)
  const sections = ['戦略的インサイト', '推奨チャネル', 'メッセージング', 'クリエイティブ', 'ポジショニング', 'KPI', 'ロードマップ', 'ツール活用'];
  sections.forEach(section => {
    if (analysisText.includes(section) || analysisText.toLowerCase().includes(section.toLowerCase())) {
      score += 5;
    }
  });
  
  // 具体性の評価 (30点)
  if (analysisText.includes('%') || analysisText.includes('円')) score += 10; // 数値的根拠
  if (analysisText.includes('Instagram') || analysisText.includes('Google') || analysisText.includes('Facebook')) score += 10; // 具体的媒体名
  if (analysisText.includes('Phase') || analysisText.includes('ステップ')) score += 10; // 段階的提案
  
  // 実践性の評価 (20点)
  if (analysisText.includes('予算') || analysisText.includes('コスト')) score += 10; // 予算考慮
  if (analysisText.includes('ターゲット') && analysisText.includes('共働き')) score += 10; // ターゲット理解
  
  // 日本語品質の評価 (10点)
  if (analysisText.length > 1000) score += 5; // 十分な分量
  if (!analysisText.includes('undefined') && !analysisText.includes('null')) score += 5; // エラーなし
  
  return Math.min(score, 100);
}

function evaluateAccuracy(analysisText, scrapedData) {
  let score = 0;
  
  // 商品名・サービス名の正確性 (20点)
  if (analysisText.includes('つくりおき') || analysisText.includes('作り置き')) score += 20;
  
  // カテゴリー理解の正確性 (20点)
  if (analysisText.includes('宅配食') || analysisText.includes('お惣菜') || analysisText.includes('冷蔵')) score += 20;
  
  // ターゲット理解の正確性 (20点)
  if (analysisText.includes('共働き') || analysisText.includes('忙しい') || analysisText.includes('家族')) score += 20;
  
  // 価値提案理解の正確性 (20点)
  if (analysisText.includes('5分') || analysisText.includes('時短') || analysisText.includes('レンジ')) score += 20;
  
  // 競合理解の正確性 (20点)
  if (analysisText.includes('シェフボックス') || analysisText.includes('ヨシケイ') || analysisText.includes('宅配食')) score += 20;
  
  return Math.min(score, 100);
}

function generateComparisonReport(results) {
  const providers = Object.keys(results);
  
  console.log('\n📊 パフォーマンス比較:');
  console.log('┌─────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐');
  console.log('│ プロバイダー │ 成功率   │ 平均時間 │ 平均コスト│ 品質スコア│ 精度スコア│');
  console.log('├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤');
  
  providers.forEach(provider => {
    const providerResults = results[provider].filter(r => r.success);
    
    if (providerResults.length > 0) {
      const successRate = (providerResults.length / results[provider].length * 100).toFixed(0);
      const avgTime = (providerResults.reduce((sum, r) => sum + r.duration, 0) / providerResults.length).toFixed(0);
      const avgCost = (providerResults.reduce((sum, r) => sum + (r.usage?.cost || 0), 0) / providerResults.length).toFixed(1);
      const avgQuality = (providerResults.reduce((sum, r) => sum + r.quality, 0) / providerResults.length).toFixed(0);
      const avgAccuracy = (providerResults.reduce((sum, r) => sum + r.accuracy, 0) / providerResults.length).toFixed(0);
      
      console.log(`│ ${provider.padEnd(11)} │ ${successRate.padEnd(8)}%│ ${avgTime.padEnd(8)}ms│ ${avgCost.padEnd(9)}円│ ${avgQuality.padEnd(9)}/100│ ${avgAccuracy.padEnd(9)}/100│`);
    } else {
      console.log(`│ ${provider.padEnd(11)} │ ${('0').padEnd(8)}%│ ${'N/A'.padEnd(8)} │ ${'N/A'.padEnd(9)} │ ${'N/A'.padEnd(9)} │ ${'N/A'.padEnd(9)} │`);
    }
  });
  
  console.log('└─────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘');
  
  // 詳細分析
  console.log('\n📈 詳細分析:');
  
  providers.forEach(provider => {
    const providerResults = results[provider].filter(r => r.success);
    
    if (providerResults.length > 0) {
      console.log(`\n🤖 ${provider.toUpperCase()}:`);
      
      const avgCost = providerResults.reduce((sum, r) => sum + (r.usage?.cost || 0), 0) / providerResults.length;
      const avgTokens = providerResults.reduce((sum, r) => sum + (r.usage?.inputTokens || 0) + (r.usage?.outputTokens || 0), 0) / providerResults.length;
      const avgLength = providerResults.reduce((sum, r) => sum + r.analysis.length, 0) / providerResults.length;
      
      console.log(`  💰 コスト効率: ${avgCost.toFixed(2)}円/回`);
      console.log(`  📊 トークン使用: ${avgTokens.toFixed(0)}トークン/回`);
      console.log(`  📝 出力文字数: ${avgLength.toFixed(0)}文字/回`);
      console.log(`  ⚡ 文字/秒: ${(avgLength / (providerResults[0].duration / 1000)).toFixed(0)}`);
    }
  });
}

function generateRecommendations(results) {
  const claudeResults = results.claude?.filter(r => r.success) || [];
  const chatgptResults = results.chatgpt?.filter(r => r.success) || [];
  
  if (claudeResults.length === 0 && chatgptResults.length === 0) {
    console.log('  ⚠️  両プロバイダーでエラーが発生しました。APIキーを確認してください。');
    return;
  }
  
  if (claudeResults.length === 0) {
    console.log('  🏆 ChatGPT推奨: Claudeでエラーが発生したため');
    return;
  }
  
  if (chatgptResults.length === 0) {
    console.log('  🏆 Claude推奨: ChatGPTでエラーが発生したため');
    return;
  }
  
  // 品質比較
  const claudeQuality = claudeResults.reduce((sum, r) => sum + r.quality, 0) / claudeResults.length;
  const chatgptQuality = chatgptResults.reduce((sum, r) => sum + r.quality, 0) / chatgptResults.length;
  
  // コスト比較
  const claudeCost = claudeResults.reduce((sum, r) => sum + (r.usage?.cost || 0), 0) / claudeResults.length;
  const chatgptCost = chatgptResults.reduce((sum, r) => sum + (r.usage?.cost || 0), 0) / chatgptResults.length;
  
  // 速度比較
  const claudeSpeed = claudeResults.reduce((sum, r) => sum + r.duration, 0) / claudeResults.length;
  const chatgptSpeed = chatgptResults.reduce((sum, r) => sum + r.duration, 0) / chatgptResults.length;
  
  console.log('\n🏆 総合評価:');
  
  if (claudeQuality > chatgptQuality && Math.abs(claudeCost - chatgptCost) < 5) {
    console.log('  ✨ Claude推奨: 高品質で同等コスト');
  } else if (chatgptCost < claudeCost * 0.8 && Math.abs(claudeQuality - chatgptQuality) < 10) {
    console.log('  💰 ChatGPT推奨: コストパフォーマンス重視');
  } else if (claudeQuality > chatgptQuality + 10) {
    console.log('  🎯 Claude推奨: 品質重視');
  } else if (chatgptSpeed < claudeSpeed * 0.8) {
    console.log('  ⚡ ChatGPT推奨: 速度重視');
  } else {
    console.log('  🤝 どちらも優秀: 用途に応じて選択');
  }
  
  console.log('\n📋 用途別推奨:');
  console.log('  💼 ビジネス重要案件: 品質重視でClaude');
  console.log('  🚀 大量処理・プロトタイプ: コスト重視でChatGPT');
  console.log('  ⚖️  バランス重視: 両方試して比較');
}

// メイン実行
runComparisonTest().catch(console.error);