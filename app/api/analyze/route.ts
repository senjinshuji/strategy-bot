import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '../../../lib/ai-providers';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 入力データの検証
    if (!data.product || !data.product.productInfo.productName) {
      return NextResponse.json(
        { 
          success: false, 
          error: '商品名は必須です。' 
        },
        { status: 400 }
      );
    }

    console.log('Analysis request received:', {
      productName: data.product?.productInfo?.productName,
      hasMarket: !!data.market,
      hasN1: !!data.n1?.[0],
      hasConcept: !!data.concept
    });

    // AI分析実行（プロバイダーは環境変数で切り替え）
    const aiProvider = getAIProvider();
    console.log(`Using AI Provider: ${aiProvider.name} (${aiProvider.cost})`);
    
    const result = await aiProvider.analyze(data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || '分析中にエラーが発生しました。' 
        },
        { status: 500 }
      );
    }

    console.log('Analysis completed:', {
      provider: aiProvider.name,
      inputTokens: result.usage?.inputTokens || 0,
      outputTokens: result.usage?.outputTokens || 0,
      cost: result.usage?.cost || 0
    });

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      usage: result.usage,
      provider: {
        name: aiProvider.name,
        cost: aiProvider.cost
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'サーバーエラーが発生しました。' 
      },
      { status: 500 }
    );
  }
}