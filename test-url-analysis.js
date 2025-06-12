// URL Analysis Test Script
const API_BASE = 'http://localhost:3000';

async function testUrlAnalysis() {
  console.log('🧪 URL分析機能テスト開始');
  
  // Test URL (using a simple, reliable test URL)
  const testUrl = 'https://example.com';
  
  try {
    console.log(`📡 分析対象URL: ${testUrl}`);
    
    const response = await fetch(`${API_BASE}/api/analyze-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: testUrl,
        provider: 'mock'
      })
    });

    console.log(`📊 レスポンス状態: ${response.status}`);
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ URL分析成功!');
      console.log('📋 分析結果:');
      console.log(`  - 信頼度: ${result.data.metadata.confidence}%`);
      console.log(`  - 処理時間: ${result.data.metadata.processingTime}ms`);
      console.log(`  - データソース: ${result.data.metadata.extractedFrom.join(', ')}`);
      console.log(`  - プロバイダー: ${result.data.metadata.provider}`);
      
      // 商品分析結果
      if (result.data.marketingAnalysis.product) {
        console.log('📦 商品分析:');
        console.log(`  - カテゴリー: ${result.data.marketingAnalysis.product.category}`);
        console.log(`  - 価格: ${result.data.marketingAnalysis.product.pricing}`);
      }
      
      // 改善提案
      if (result.data.metadata.suggestions.length > 0) {
        console.log('💡 改善提案:');
        result.data.metadata.suggestions.forEach((suggestion, index) => {
          console.log(`  ${index + 1}. ${suggestion}`);
        });
      }
      
      console.log('🎉 テスト完了 - URL分析機能は正常に動作しています');
      
    } else {
      console.error('❌ URL分析エラー:', result.error || result);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 テスト実行エラー:', error.message);
    process.exit(1);
  }
}

// APIエンドポイントテスト
async function testApiEndpoint() {
  try {
    console.log('🔍 APIエンドポイント確認...');
    
    const response = await fetch(`${API_BASE}/api/analyze-url`, {
      method: 'GET'
    });
    
    const result = await response.json();
    console.log('📡 APIエンドポイント情報:', result.message);
    
  } catch (error) {
    console.error('❌ APIエンドポイント接続エラー:', error.message);
    throw error;
  }
}

// メイン実行
async function main() {
  try {
    await testApiEndpoint();
    await testUrlAnalysis();
  } catch (error) {
    console.error('🚨 テスト失敗:', error.message);
    process.exit(1);
  }
}

main();