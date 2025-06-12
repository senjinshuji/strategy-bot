// Playwright Scraper Test for つくりおき.jp
const { playwrightScraper } = require('./lib/playwright-scraper');

async function testTsukuriokirjp() {
  console.log('🚀 つくりおき.jp スクレイピングテスト開始');
  
  const testUrl = 'https://www.tsukurioki.jp/';
  
  try {
    console.log(`📡 分析対象URL: ${testUrl}`);
    console.log('⏳ Playwright初期化中...');
    
    const startTime = Date.now();
    const scrapedData = await playwrightScraper.scrapeLP(testUrl);
    const endTime = Date.now();
    
    console.log(`✅ スクレイピング完了! (${endTime - startTime}ms)`);
    console.log('\n📊 抽出データサマリー:');
    
    // 基本情報
    console.log(`\n🏷️  基本情報:`);
    console.log(`  - タイトル: ${scrapedData.title}`);
    console.log(`  - 商品名: ${scrapedData.productName}`);
    console.log(`  - カテゴリー: ${scrapedData.category}`);
    console.log(`  - 説明: ${scrapedData.description.substring(0, 100)}...`);
    
    // 価格情報
    console.log(`\n💰 価格情報:`);
    console.log(`  - メイン価格: ${scrapedData.pricing.mainPrice}`);
    console.log(`  - プラン数: ${scrapedData.pricing.plans.length}`);
    if (scrapedData.pricing.plans.length > 0) {
      scrapedData.pricing.plans.slice(0, 3).forEach((plan, index) => {
        console.log(`    ${index + 1}. ${plan.name} - ${plan.price} (${plan.period})`);
      });
    }
    console.log(`  - 特別オファー: ${scrapedData.pricing.specialOffers.length}件`);
    
    // 機能・特徴
    console.log(`\n⚡ 機能・特徴:`);
    console.log(`  - 機能数: ${scrapedData.features.length}`);
    scrapedData.features.slice(0, 5).forEach((feature, index) => {
      console.log(`    ${index + 1}. ${feature.substring(0, 80)}...`);
    });
    
    // ターゲット・デモグラ
    console.log(`\n🎯 ターゲット情報:`);
    console.log(`  - ターゲット層: ${scrapedData.targetAudience.join(', ')}`);
    console.log(`  - 年齢: ${scrapedData.demographics.age}`);
    console.log(`  - 性別: ${scrapedData.demographics.gender}`);
    console.log(`  - ライフスタイル: ${scrapedData.demographics.lifestyle}`);
    console.log(`  - 興味関心: ${scrapedData.demographics.interests.join(', ')}`);
    
    // お客様の声
    console.log(`\n💬 お客様の声:`);
    console.log(`  - 証言数: ${scrapedData.testimonials.length}`);
    scrapedData.testimonials.slice(0, 2).forEach((testimonial, index) => {
      console.log(`    ${index + 1}. "${testimonial.text.substring(0, 100)}..." - ${testimonial.author}`);
    });
    
    // 社会的証明
    console.log(`\n👥 社会的証明:`);
    console.log(`  - 利用者数: ${scrapedData.socialProof.customerCount}`);
    console.log(`  - 企業ロゴ: ${scrapedData.socialProof.companyLogos.length}件`);
    console.log(`  - 評価: ${scrapedData.socialProof.ratings.length}件`);
    
    // コンテンツ分析
    console.log(`\n📝 コンテンツ分析:`);
    console.log(`  - キーメッセージ: ${scrapedData.keyMessages.length}件`);
    scrapedData.keyMessages.forEach((message, index) => {
      console.log(`    ${index + 1}. ${message}`);
    });
    
    console.log(`\n  - 価値提案: ${scrapedData.valuePropositions.length}件`);
    scrapedData.valuePropositions.slice(0, 3).forEach((value, index) => {
      console.log(`    ${index + 1}. ${value.substring(0, 80)}...`);
    });
    
    console.log(`\n  - CTA: ${scrapedData.callToActions.length}件`);
    scrapedData.callToActions.forEach((cta, index) => {
      console.log(`    ${index + 1}. "${cta}"`);
    });
    
    // 連絡先情報
    console.log(`\n📞 連絡先情報:`);
    console.log(`  - 電話: ${scrapedData.contact.phone}`);
    console.log(`  - メール: ${scrapedData.contact.email}`);
    console.log(`  - 住所: ${scrapedData.contact.address}`);
    console.log(`  - 営業時間: ${scrapedData.contact.businessHours}`);
    console.log(`  - SNS: ${scrapedData.contact.socialMedia.length}件`);
    
    // メディア
    console.log(`\n🎥 メディア:`);
    console.log(`  - 画像: ${scrapedData.images.length}件`);
    console.log(`  - 動画: ${scrapedData.videos.length}件`);
    console.log(`  - ダウンロード: ${scrapedData.downloadableContent.length}件`);
    
    // メタデータ
    console.log(`\n🔍 メタデータ:`);
    console.log(`  - ページタイプ: ${scrapedData.metadata.pageType}`);
    console.log(`  - 言語: ${scrapedData.metadata.language}`);
    console.log(`  - コンテンツ長: ${scrapedData.metadata.contentLength.toLocaleString()}文字`);
    console.log(`  - ページ読み込み時間: ${scrapedData.metadata.pageLoadTime}ms`);
    console.log(`  - モバイル最適化: ${scrapedData.metadata.mobileOptimized ? 'あり' : 'なし'}`);
    console.log(`  - 動画コンテンツ: ${scrapedData.metadata.hasVideo ? 'あり' : 'なし'}`);
    console.log(`  - お客様の声: ${scrapedData.metadata.hasTestimonials ? 'あり' : 'なし'}`);
    console.log(`  - 価格情報: ${scrapedData.metadata.hasPricing ? 'あり' : 'なし'}`);
    
    console.log('\n🎉 スクレイピングテスト完了!');
    console.log('✨ 詳細なデータ抽出に成功しました');
    
    // データをJSONファイルとして保存
    const fs = require('fs');
    fs.writeFileSync('tsukurioki-scraped-data.json', JSON.stringify(scrapedData, null, 2));
    console.log('💾 データを tsukurioki-scraped-data.json に保存しました');
    
  } catch (error) {
    console.error('❌ スクレイピングエラー:', error.message);
  } finally {
    await playwrightScraper.close();
    console.log('🔚 ブラウザを閉じました');
  }
}

// メイン実行
testTsukuriokirjp();