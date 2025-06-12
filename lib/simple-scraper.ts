// Simplified Web Scraper (avoiding complex cheerio types)
export interface SimpleScrapedData {
  title: string;
  description: string;
  pricing: string[];
  features: string[];
  images: string[];
  testimonials: string[];
  socialProof: {
    customerCount?: string;
    ratings?: string;
    reviews?: string[];
    companies?: string[];
  };
  contact: {
    phone?: string;
    email?: string;
    address?: string;
    businessHours?: string;
  };
  metadata: {
    url: string;
    scrapedAt: string;
    pageType: 'product' | 'service' | 'company' | 'unknown';
    language: string;
  };
}

export class SimpleWebScraper {
  private timeout = 30000;
  private userAgent = 'Mozilla/5.0 (compatible; StrategyBot/1.0)';

  async scrapeLP(url: string): Promise<SimpleScrapedData> {
    try {
      // URL validation and normalization
      const normalizedUrl = this.normalizeUrl(url);
      
      // Fetch page content
      const html = await this.fetchPage(normalizedUrl);
      
      // Simple text extraction (without complex cheerio parsing)
      const data: SimpleScrapedData = {
        title: this.extractTitleFromHtml(html),
        description: this.extractDescriptionFromHtml(html),
        pricing: this.extractPricingFromHtml(html),
        features: this.extractFeaturesFromHtml(html),
        images: [],
        testimonials: [],
        socialProof: {
          customerCount: this.extractCustomerCountFromHtml(html),
          ratings: undefined,
          reviews: [],
          companies: []
        },
        contact: {
          phone: this.extractPhoneFromHtml(html),
          email: this.extractEmailFromHtml(html),
          address: undefined,
          businessHours: undefined
        },
        metadata: {
          url: normalizedUrl,
          scrapedAt: new Date().toISOString(),
          pageType: this.detectPageTypeFromHtml(html),
          language: 'ja'
        }
      };

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`LP scraping failed: ${errorMessage}`);
    }
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    return url;
  }

  private async fetchPage(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(this.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.text();
  }

  // Simple HTML text extraction methods
  private extractTitleFromHtml(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) return titleMatch[1].trim();
    
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1Match) return h1Match[1].trim();
    
    return 'タイトル未確認';
  }

  private extractDescriptionFromHtml(html: string): string {
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (metaDescMatch) return metaDescMatch[1].trim();
    
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    if (ogDescMatch) return ogDescMatch[1].trim();
    
    return '説明文未確認';
  }

  private extractPricingFromHtml(html: string): string[] {
    const pricing: string[] = [];
    
    // Price patterns
    const pricePatterns = [
      /[¥$€£]\d{1,3}(,\d{3})*/g,
      /\d{1,3}(,\d{3})*[円¥]/g,
      /月額\s*\d{1,3}(,\d{3})*/g,
      /年額\s*\d{1,3}(,\d{3})*/g,
      /無料/g,
      /free/gi
    ];

    pricePatterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches) {
        pricing.push(...matches);
      }
    });

    return Array.from(new Set(pricing)).slice(0, 5);
  }

  private extractFeaturesFromHtml(html: string): string[] {
    const features: string[] = [];
    
    // Extract text from list items
    const listItemMatches = html.match(/<li[^>]*>([^<]+)<\/li>/gi);
    if (listItemMatches) {
      listItemMatches.forEach(match => {
        const text = match.replace(/<[^>]+>/g, '').trim();
        if (text && text.length > 5 && text.length < 100) {
          features.push(text);
        }
      });
    }

    // Extract from headings
    const headingMatches = html.match(/<h[2-6][^>]*>([^<]+)<\/h[2-6]>/gi);
    if (headingMatches) {
      headingMatches.forEach(match => {
        const text = match.replace(/<[^>]+>/g, '').trim();
        if (text && text.length > 5 && text.length < 100) {
          features.push(text);
        }
      });
    }

    return Array.from(new Set(features)).slice(0, 10);
  }

  private extractCustomerCountFromHtml(html: string): string | undefined {
    const patterns = [
      /(\d{1,3}(,\d{3})*)\s*(名|人|社|件|ユーザー|利用者|customers?|users?)/i,
      /利用者数[：:]\s*(\d{1,3}(,\d{3})*)/i,
      /導入実績[：:]\s*(\d{1,3}(,\d{3})*)/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[0];
    }

    return undefined;
  }

  private extractPhoneFromHtml(html: string): string | undefined {
    const phonePattern = /\d{2,4}-\d{2,4}-\d{4}|\d{10,11}/;
    const match = html.match(phonePattern);
    return match ? match[0] : undefined;
  }

  private extractEmailFromHtml(html: string): string | undefined {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = html.match(emailPattern);
    return match ? match[0] : undefined;
  }

  private detectPageTypeFromHtml(html: string): 'product' | 'service' | 'company' | 'unknown' {
    const content = html.toLowerCase();
    
    if (content.includes('製品') || content.includes('商品') || content.includes('product')) {
      return 'product';
    }
    if (content.includes('サービス') || content.includes('service')) {
      return 'service';  
    }
    if (content.includes('会社') || content.includes('企業') || content.includes('company')) {
      return 'company';
    }
    
    return 'unknown';
  }
}

export const simpleWebScraper = new SimpleWebScraper();