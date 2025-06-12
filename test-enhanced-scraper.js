// Enhanced Playwright Scraper Test for つくりおき.jp
const { enhancedPlaywrightScraper } = require('./lib/enhanced-playwright-scraper');

async function testEnhancedScraping() {
  console.log('🚀 つくりおき.jp 高精度スクレイピングテスト開始');
  
  const testUrl = 'https://www.tsukurioki.jp/';
  
  try {
    console.log(`📡 分析対象URL: ${testUrl}`);
    console.log('⏳ Enhanced Playwright初期化中...');
    
    const startTime = Date.now();
    const scrapedData = await enhancedPlaywrightScraper.scrapeLP(testUrl);
    const endTime = Date.now();
    
    console.log(`✅ 高精度スクレイピング完了! (${endTime - startTime}ms)`);
    console.log(`🎯 信頼度スコア: ${scrapedData.metadata.confidence}%`);
    
    console.log('\n📊 CSV形式準拠データ抽出結果:');
    
    // 製品情報
    console.log(`\n📦 製品情報:`);
    console.log(`  商品名: ${scrapedData.productInfo.productName}`);
    console.log(`  カテゴリー: ${scrapedData.productInfo.category}`);
    console.log(`  サイズ・容量: ${scrapedData.productInfo.sizeCapacity}`);
    console.log(`  通常価格: ${scrapedData.productInfo.regularPrice}`);
    console.log(`  特別価格: ${scrapedData.productInfo.specialPrice}`);
    console.log(`  販売チャネル: ${scrapedData.productInfo.salesChannel}`);
    
    console.log(`\n⚡ 機能 (${scrapedData.productInfo.functions.length}件):`);
    scrapedData.productInfo.functions.forEach((func, index) => {
      console.log(`    ${index + 1}. ${func}`);
    });
    
    console.log(`\n🎯 効果 (${scrapedData.productInfo.effects.length}件):`);
    scrapedData.productInfo.effects.forEach((effect, index) => {
      console.log(`    ${index + 1}. ${effect}`);
    });
    
    console.log(`\n👥 デモグラフィック:`);
    console.log(`  年齢: ${scrapedData.productInfo.demographics.age}`);
    console.log(`  性別: ${scrapedData.productInfo.demographics.gender}`);
    console.log(`  その他: ${scrapedData.productInfo.demographics.other}`);
    
    // 提供価値
    console.log(`\n💎 提供価値:`);
    console.log(`  機能価値 (${scrapedData.valueProposition.functionalValue.length}件):`);
    scrapedData.valueProposition.functionalValue.forEach((value, index) => {
      console.log(`    ${index + 1}. ${value}`);
    });
    
    console.log(`  情緒価値 (${scrapedData.valueProposition.emotionalValue.length}件):`);
    scrapedData.valueProposition.emotionalValue.forEach((value, index) => {
      console.log(`    ${index + 1}. ${value}`);
    });
    
    // 市場・ターゲット
    console.log(`\n🎯 市場・ターゲット:`);
    console.log(`  市場定義: ${scrapedData.marketTarget.marketDefinition}`);
    console.log(`  市場カテゴリー: ${scrapedData.marketTarget.marketCategory}`);
    console.log(`  戦略ターゲット: ${scrapedData.marketTarget.strategicTarget}`);
    console.log(`  コアターゲット: ${scrapedData.marketTarget.coreTarget}`);
    
    // N1プロフィール
    console.log(`\n👤 N1プロフィール:`);
    console.log(`  年齢: ${scrapedData.n1Profile.age}`);
    console.log(`  性別: ${scrapedData.n1Profile.gender}`);
    console.log(`  居住地: ${scrapedData.n1Profile.location}`);
    console.log(`  職業: ${scrapedData.n1Profile.occupation}`);
    console.log(`  家族構成: ${scrapedData.n1Profile.familyStructure}`);
    console.log(`  ライフスタイル: ${scrapedData.n1Profile.lifestyle}`);
    console.log(`  興味関心: ${scrapedData.n1Profile.interests.join(', ')}`);
    console.log(`  メディア利用: ${scrapedData.n1Profile.mediaUsage.join(', ')}`);
    
    // 競合分析
    console.log(`\n⚔️ 競合分析:`);
    console.log(`  カテゴリー競合: ${scrapedData.competitors.categoryCompetitors.join(', ')}`);
    console.log(`  ブランド競合: ${scrapedData.competitors.brandCompetitors.join(', ')}`);
    console.log(`  プロダクト競合: ${scrapedData.competitors.productCompetitors.join(', ')}`);
    console.log(`  差別化要素: ${scrapedData.competitors.differentiation}`);
    console.log(`  USP: ${scrapedData.competitors.usp}`);
    
    // コンセプト
    console.log(`\n💡 コンセプト:`);
    console.log(`  市場: ${scrapedData.concept.market}`);
    console.log(`  戦略ターゲット: ${scrapedData.concept.strategicTarget}`);
    console.log(`  需要: ${scrapedData.concept.demand}`);
    console.log(`  便益: ${scrapedData.concept.benefit}`);
    console.log(`  コンセプト: ${scrapedData.concept.concept}`);
    console.log(`  RTB: ${scrapedData.concept.rtb}`);
    console.log(`  ブランドキャラクター: ${scrapedData.concept.brandCharacter}`);
    
    // メタデータ
    console.log(`\n🔍 メタデータ:`);
    console.log(`  ページ読み込み時間: ${scrapedData.metadata.pageLoadTime}ms`);
    console.log(`  コンテンツ長: ${scrapedData.metadata.contentLength.toLocaleString()}文字`);
    console.log(`  抽出セクション: ${scrapedData.metadata.extractedSections.join(', ')}`);
    
    console.log('\n🎉 高精度スクレイピングテスト完了!');
    console.log('✨ CSV形式準拠の構造化データ抽出に成功しました');
    
    // データをJSONファイルとして保存
    const fs = require('fs');
    fs.writeFileSync('tsukurioki-enhanced-data.json', JSON.stringify(scrapedData, null, 2));
    console.log('💾 Enhanced データを tsukurioki-enhanced-data.json に保存しました');
    
    // CSV比較用のサマリー表示
    console.log('\n📋 CSV比較サマリー:');
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ 項目                    │ 抽出結果                        │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│ 商品名                  │ ${scrapedData.productInfo.productName.substring(0, 30)}...│`);
    console.log(`│ カテゴリー              │ ${scrapedData.productInfo.category.padEnd(30)} │`);
    console.log(`│ 機能数                  │ ${scrapedData.productInfo.functions.length}件${' '.repeat(27)} │`);
    console.log(`│ 価格                    │ ${scrapedData.productInfo.regularPrice.padEnd(30)} │`);
    console.log(`│ 機能価値数              │ ${scrapedData.valueProposition.functionalValue.length}件${' '.repeat(27)} │`);
    console.log(`│ 情緒価値数              │ ${scrapedData.valueProposition.emotionalValue.length}件${' '.repeat(27)} │`);
    console.log(`│ 信頼度                  │ ${scrapedData.metadata.confidence}%${' '.repeat(27)} │`);
    console.log('└─────────────────────────────────────────────────────────────┘');
    
  } catch (error) {
    console.error('❌ 高精度スクレイピングエラー:', error.message);
  } finally {
    await enhancedPlaywrightScraper.close();
    console.log('🔚 ブラウザを閉じました');
  }
}

// メイン実行
testEnhancedScraping();