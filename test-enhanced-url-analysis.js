// Enhanced URL Analysis Test with つくりおき.jp
const API_BASE = 'http://localhost:3000';

async function testEnhancedUrlAnalysis() {
  console.log('🚀 Enhanced URL分析機能テスト開始');
  
  const testUrl = 'https://www.tsukurioki.jp/';
  
  try {
    console.log(`📡 分析対象URL: ${testUrl}`);
    console.log('🧠 高精度Playwright + AI分析実行中...');
    
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE}/api/analyze-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: testUrl,
        provider: 'mock' // 後でClaudeに変更
      })
    });

    const endTime = Date.now();
    console.log(`📊 APIレスポンス時間: ${endTime - startTime}ms`);
    console.log(`📊 レスポンス状態: ${response.status}`);
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Enhanced URL分析成功!');
      
      // メタデータ表示
      console.log('\n📋 分析メタデータ:');
      console.log(`  - 信頼度: ${result.data.metadata.confidence}%`);
      console.log(`  - 処理時間: ${result.data.metadata.processingTime}ms`);
      console.log(`  - プロバイダー: ${result.data.metadata.provider}`);
      console.log(`  - データソース: ${result.data.metadata.extractedFrom.join(', ')}`);
      
      // 製品分析結果の詳細表示
      const analysis = result.data.marketingAnalysis;
      
      console.log('\n📦 製品分析結果:');
      if (analysis.product?.productInfo) {
        const product = analysis.product.productInfo;
        console.log(`  - 商品名: ${product.productName}`);
        console.log(`  - カテゴリー: ${product.category}`);
        console.log(`  - サイズ・容量: ${product.sizeCapacity}`);
        console.log(`  - 通常価格: ${product.regularPrice}`);
        console.log(`  - 特別価格: ${product.specialPrice}`);
        console.log(`  - 販売チャネル: ${product.salesChannel}`);
        console.log(`  - RTB: ${product.rtb}`);
        
        console.log(`\n  ⚡ 機能 (${product.functions.length}件):`);
        product.functions.forEach((func, index) => {
          console.log(`    ${index + 1}. ${func}`);
        });
        
        console.log(`\n  🎯 効果 (${product.effects.length}件):`);
        product.effects.forEach((effect, index) => {
          console.log(`    ${index + 1}. ${effect}`);
        });
        
        console.log(`\n  👥 デモグラフィック:`);
        console.log(`    - 年齢: ${product.demographics.age}`);
        console.log(`    - 性別: ${product.demographics.gender}`);
        console.log(`    - その他: ${product.demographics.other}`);
      }
      
      // 提供価値分析
      console.log('\n💎 提供価値分析:');
      if (analysis.product?.valueProposition) {
        const value = analysis.product.valueProposition;
        console.log(`  機能価値 (${value.functionalValue.length}件):`);
        value.functionalValue.forEach((val, index) => {
          console.log(`    ${index + 1}. ${val}`);
        });
        
        console.log(`  情緒価値 (${value.emotionalValue.length}件):`);
        value.emotionalValue.forEach((val, index) => {
          console.log(`    ${index + 1}. ${val}`);
        });
      }
      
      // 市場・ターゲット分析
      console.log('\n🎯 市場・ターゲット分析:');
      if (analysis.market?.marketTarget) {
        const market = analysis.market.marketTarget;
        console.log(`  - 市場定義: ${market.marketDefinition}`);
        console.log(`  - 市場カテゴリー: ${market.marketCategory}`);
        console.log(`  - 戦略ターゲット: ${market.strategicTarget}`);
        console.log(`  - コアターゲット: ${market.coreTarget}`);
        console.log(`  - 市場規模: ${market.marketSize}`);
        console.log(`  - 購入者数: ${market.purchasers}`);
        console.log(`  - AOV: ${market.aov}`);
      }
      
      // N1分析
      console.log('\n👤 N1分析:');
      if (analysis.n1 && analysis.n1.length > 0) {
        const n1 = analysis.n1[0];
        console.log(`  プロフィール:`);
        console.log(`    - 年齢: ${n1.profile.age}`);
        console.log(`    - 性別: ${n1.profile.gender}`);
        console.log(`    - 居住地: ${n1.profile.location}`);
        console.log(`    - 職業: ${n1.profile.occupation}`);
        console.log(`    - 家族構成: ${n1.profile.familyStructure}`);
        console.log(`    - ライフスタイル: ${n1.profile.lifestyle}`);
        console.log(`    - 興味関心: ${n1.profile.interests.join(', ')}`);
        
        console.log(`  脳内ジャーニー:`);
        console.log(`    - 状況: ${n1.journey.situation}`);
        console.log(`    - 欲求: ${n1.journey.desire}`);
        console.log(`    - ストレス: ${n1.journey.stress}`);
        console.log(`    - 需要: ${n1.journey.demand}`);
      }
      
      // 競合分析
      console.log('\n⚔️ 競合分析:');
      if (analysis.competitors?.categoryCompetitors?.length > 0) {
        const comp = analysis.competitors.categoryCompetitors[0];
        console.log(`  - カテゴリー: ${comp.name}`);
        console.log(`  - ブランド競合: ${comp.brands.join(', ')}`);
        console.log(`  - プロダクト競合: ${comp.products.join(', ')}`);
        console.log(`  - 差別化要素: ${comp.differentiation}`);
        console.log(`  - USP: ${comp.usp}`);
        console.log(`  - プレファレンス: ${comp.preference}`);
      }
      
      // コンセプト分析
      console.log('\n💡 コンセプト分析:');
      if (analysis.concept) {
        const concept = analysis.concept;
        console.log(`  - 市場: ${concept.market}`);
        console.log(`  - 戦略ターゲット: ${concept.strategicTarget}`);
        console.log(`  - コアターゲット: ${concept.coreTarget}`);
        console.log(`  - 需要: ${concept.demand}`);
        console.log(`  - 便益: ${concept.benefit}`);
        console.log(`  - コンセプト: ${concept.concept}`);
        console.log(`  - RTB: ${concept.rtb}`);
        console.log(`  - ブランドキャラクター: ${concept.brandCharacter}`);
        
        console.log(`  特徴 (${concept.features.length}件):`);
        concept.features.forEach((feature, index) => {
          console.log(`    ${index + 1}. ${feature}`);
        });
      }
      
      // 改善提案
      if (result.data.metadata.suggestions.length > 0) {
        console.log('\n💡 改善提案:');
        result.data.metadata.suggestions.forEach((suggestion, index) => {
          console.log(`  ${index + 1}. ${suggestion}`);
        });
      }
      
      console.log('\n🎉 Enhanced URL分析テスト完了!');
      console.log('✨ CSV形式準拠の高精度データ抽出・分析に成功しました');
      
      // パフォーマンス評価
      console.log('\n📊 パフォーマンス評価:');
      console.log(`  - 全体処理時間: ${endTime - startTime}ms`);
      console.log(`  - 信頼度スコア: ${result.data.metadata.confidence}%`);
      console.log(`  - データソース数: ${result.data.metadata.extractedFrom.length}件`);
      console.log(`  - 改善提案数: ${result.data.metadata.suggestions.length}件`);
      
      // 品質評価
      const qualityScore = calculateQualityScore(analysis);
      console.log(`  - データ品質スコア: ${qualityScore}%`);
      
      if (qualityScore >= 80) {
        console.log('🌟 高品質：CSV元データと同等レベルの分析精度を達成！');
      } else if (qualityScore >= 60) {
        console.log('👍 良品質：実用的なレベルの分析精度を達成');
      } else {
        console.log('⚠️  改善余地：さらなる精度向上が必要');
      }
      
    } else {
      console.error('❌ Enhanced URL分析エラー:', result.error || result);
    }
    
  } catch (error) {
    console.error('💥 テスト実行エラー:', error.message);
  }
}

function calculateQualityScore(analysis) {
  let score = 0;
  
  // Product info completeness (30%)
  if (analysis.product?.productInfo?.productName) score += 5;
  if (analysis.product?.productInfo?.category) score += 5;
  if (analysis.product?.productInfo?.regularPrice) score += 5;
  if (analysis.product?.productInfo?.functions?.length > 0) score += 5;
  if (analysis.product?.productInfo?.effects?.length > 0) score += 5;
  if (analysis.product?.productInfo?.demographics?.age) score += 5;
  
  // Value proposition completeness (20%)
  if (analysis.product?.valueProposition?.functionalValue?.length > 0) score += 10;
  if (analysis.product?.valueProposition?.emotionalValue?.length > 0) score += 10;
  
  // Market analysis completeness (20%)
  if (analysis.market?.marketTarget?.marketDefinition) score += 5;
  if (analysis.market?.marketTarget?.strategicTarget) score += 5;
  if (analysis.market?.marketTarget?.coreTarget) score += 5;
  if (analysis.market?.marketTarget?.marketSize) score += 5;
  
  // N1 analysis completeness (15%)
  if (analysis.n1?.[0]?.profile?.familyStructure) score += 5;
  if (analysis.n1?.[0]?.profile?.lifestyle) score += 5;
  if (analysis.n1?.[0]?.journey?.demand) score += 5;
  
  // Competitors analysis completeness (10%)
  if (analysis.competitors?.categoryCompetitors?.[0]?.brands?.length > 0) score += 5;
  if (analysis.competitors?.categoryCompetitors?.[0]?.differentiation) score += 5;
  
  // Concept completeness (5%)
  if (analysis.concept?.concept) score += 3;
  if (analysis.concept?.rtb) score += 2;
  
  return Math.min(score, 100);
}

// メイン実行
testEnhancedUrlAnalysis();