// URL-based Auto Analysis API
import { NextRequest, NextResponse } from 'next/server';
import { autoAnalyzer } from '../../../lib/auto-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { url, provider = 'mock' } = await request.json();

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URLが必要です' },
        { status: 400 }
      );
    }

    // Set AI provider
    autoAnalyzer.setProvider(provider);

    // Start analysis
    const startTime = Date.now();
    
    // Perform auto analysis
    const result = await autoAnalyzer.analyzeFromUrl(url);
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;

    // Return comprehensive result
    return NextResponse.json({
      success: true,
      data: {
        url,
        marketingAnalysis: result.marketingAnalysis,
        metadata: {
          confidence: result.confidence,
          extractedFrom: result.extractedFrom,
          suggestions: result.suggestions,
          provider,
          processingTime,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('URL Analysis Error:', error);
    
    return NextResponse.json(
      { 
        error: 'URL分析中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'URL Auto Analysis API',
    usage: 'POST with { url: "https://example.com", provider?: "mock|ollama|claude" }',
    version: '1.0.0'
  });
}