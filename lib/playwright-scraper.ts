// Advanced Playwright-based Web Scraper
import { chromium, Browser, Page } from 'playwright';

export interface PlaywrightScrapedData {
  // Basic Info
  title: string;
  description: string;
  url: string;
  
  // Product Details
  productName: string;
  category: string;
  pricing: {
    plans: PricingPlan[];
    mainPrice: string;
    specialOffers: string[];
  };
  
  // Features & Benefits
  features: string[];
  benefits: string[];
  specifications: string[];
  
  // Target & Demographics
  targetAudience: string[];
  demographics: {
    age: string;
    gender: string;
    lifestyle: string;
    interests: string[];
  };
  
  // Social Proof
  testimonials: Testimonial[];
  socialProof: {
    customerCount: string;
    companyLogos: string[];
    ratings: Rating[];
    reviews: Review[];
  };
  
  // Contact & Business Info
  contact: {
    phone: string;
    email: string;
    address: string;
    businessHours: string;
    socialMedia: SocialMedia[];
  };
  
  // Content Analysis
  keyMessages: string[];
  valuePropositions: string[];
  callToActions: string[];
  
  // Technical Info
  images: string[];
  videos: string[];
  downloadableContent: string[];
  
  // Metadata
  metadata: {
    scrapedAt: string;
    pageLoadTime: number;
    contentLength: number;
    language: string;
    pageType: 'product' | 'service' | 'company' | 'landing' | 'ecommerce';
    mobileOptimized: boolean;
    hasVideo: boolean;
    hasTestimonials: boolean;
    hasPricing: boolean;
  };
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isRecommended: boolean;
}

interface Testimonial {
  text: string;
  author: string;
  company?: string;
  rating?: number;
  image?: string;
}

interface Rating {
  platform: string;
  score: number;
  maxScore: number;
  reviewCount: number;
}

interface Review {
  text: string;
  author: string;
  rating: number;
  date?: string;
  platform?: string;
}

interface SocialMedia {
  platform: string;
  url: string;
  followers?: string;
}

export class PlaywrightScraper {
  private browser: Browser | null = null;
  private timeout = 30000;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeLP(url: string): Promise<PlaywrightScrapedData> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      console.log(`🔍 Scraping URL: ${url}`);
      const startTime = Date.now();
      
      // Navigate with advanced options
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.timeout
      });

      // Wait for dynamic content
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000); // Allow for JS rendering

      const loadTime = Date.now() - startTime;
      console.log(`⏱️ Page loaded in ${loadTime}ms`);

      // Extract comprehensive data
      const data = await this.extractAllData(page, url, loadTime);
      
      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Playwright scraping failed: ${errorMessage}`);
    } finally {
      await page.close();
    }
  }

  private async extractAllData(page: Page, url: string, loadTime: number): Promise<PlaywrightScrapedData> {
    console.log('📊 Extracting comprehensive data...');

    // Parallel data extraction for performance
    const [
      basicInfo,
      productInfo,
      features,
      testimonials,
      socialProof,
      contact,
      content,
      media,
      metadata
    ] = await Promise.all([
      this.extractBasicInfo(page),
      this.extractProductInfo(page),
      this.extractFeatures(page),
      this.extractTestimonials(page),
      this.extractSocialProof(page),
      this.extractContact(page),
      this.extractContent(page),
      this.extractMedia(page),
      this.extractMetadata(page, loadTime)
    ]);

    return {
      // Basic Info
      title: basicInfo.title,
      description: basicInfo.description,
      url,
      
      // Product Details
      productName: productInfo.productName,
      category: productInfo.category,
      pricing: productInfo.pricing,
      
      // Features & Benefits
      features: features.features,
      benefits: features.benefits,
      specifications: features.specifications,
      
      // Target & Demographics
      targetAudience: productInfo.targetAudience,
      demographics: productInfo.demographics,
      
      // Social Proof
      testimonials,
      socialProof,
      
      // Contact & Business Info
      contact,
      
      // Content Analysis
      keyMessages: content.keyMessages,
      valuePropositions: content.valuePropositions,
      callToActions: content.callToActions,
      
      // Technical Info
      images: media.images,
      videos: media.videos,
      downloadableContent: media.downloadableContent,
      
      // Metadata
      metadata
    };
  }

  private async extractBasicInfo(page: Page) {
    return await page.evaluate(() => {
      const getMetaContent = (name: string) => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"], meta[property="og:${name}"]`);
        return meta?.getAttribute('content') || '';
      };

      return {
        title: document.title || 
               document.querySelector('h1')?.textContent?.trim() || 
               getMetaContent('title') || '',
        description: getMetaContent('description') || 
                    getMetaContent('og:description') || 
                    document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      };
    });
  }

  private async extractProductInfo(page: Page) {
    return await page.evaluate(() => {
      // Product name extraction
      const productName = document.title ||
                         document.querySelector('h1')?.textContent?.trim() ||
                         document.querySelector('.product-title, .hero-title, .main-title')?.textContent?.trim() ||
                         '';

      // Category detection
      const categoryKeywords = ['食品', '宅配', 'サービス', '冷凍', 'ミール', 'デリバリー'];
      const bodyText = document.body.textContent?.toLowerCase() || '';
      const category = categoryKeywords.find(keyword => bodyText.includes(keyword.toLowerCase())) || '未分類';

      // Pricing extraction
      const priceElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent || '';
        return /[¥$€£]\d{1,3}(,\d{3})*|月額|年額|無料|プラン/i.test(text);
      });

      const plans: PricingPlan[] = [];
      let mainPrice = '';
      const specialOffers: string[] = [];

      priceElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text.length < 200) { // Avoid long paragraphs
          if (text.includes('プラン') || text.includes('コース')) {
            plans.push({
              name: text,
              price: text.match(/[¥$€£]?\d{1,3}(,\d{3})*/)?.[0] || '',
              period: text.includes('月') ? '月額' : text.includes('年') ? '年額' : '',
              features: [],
              isRecommended: text.includes('おすすめ') || text.includes('人気')
            });
          } else if (text.match(/[¥$€£]\d{1,3}(,\d{3})*/)) {
            if (!mainPrice) mainPrice = text;
          }
          
          if (text.includes('割引') || text.includes('OFF') || text.includes('特別') || text.includes('初回')) {
            specialOffers.push(text);
          }
        }
      });

      // Target audience detection
      const targetKeywords = ['共働き', '忙しい', 'ママ', 'パパ', '家族', '主婦', '会社員', 'OL'];
      const targetAudience = targetKeywords.filter(keyword => bodyText.includes(keyword));

      // Demographics detection
      const demographics = {
        age: bodyText.match(/(\d+)代|(\d+)歳/)?.[0] || '',
        gender: bodyText.includes('女性') ? '女性' : bodyText.includes('男性') ? '男性' : '男女',
        lifestyle: targetAudience.includes('共働き') ? '共働き' : 
                  targetAudience.includes('忙しい') ? '忙しいライフスタイル' : '',
        interests: ['料理', '時短', '健康', '家族'].filter(interest => bodyText.includes(interest))
      };

      return {
        productName,
        category,
        pricing: {
          plans,
          mainPrice,
          specialOffers
        },
        targetAudience,
        demographics
      };
    });
  }

  private async extractFeatures(page: Page) {
    return await page.evaluate(() => {
      const features: string[] = [];
      const benefits: string[] = [];
      const specifications: string[] = [];

      // Extract from lists
      const listItems = Array.from(document.querySelectorAll('li, .feature, .benefit, .point'));
      listItems.forEach(item => {
        const text = item.textContent?.trim() || '';
        if (text && text.length > 5 && text.length < 200) {
          if (text.includes('特徴') || text.includes('機能')) {
            features.push(text);
          } else if (text.includes('メリット') || text.includes('効果') || text.includes('価値')) {
            benefits.push(text);
          } else {
            features.push(text);
          }
        }
      });

      // Extract from headings
      const headings = Array.from(document.querySelectorAll('h2, h3, h4'));
      headings.forEach(heading => {
        const text = heading.textContent?.trim() || '';
        if (text && text.length > 5 && text.length < 100) {
          features.push(text);
        }
      });

      return {
        features: [...new Set(features)].slice(0, 10),
        benefits: [...new Set(benefits)].slice(0, 10),
        specifications: [...new Set(specifications)].slice(0, 10)
      };
    });
  }

  private async extractTestimonials(page: Page): Promise<Testimonial[]> {
    return await page.evaluate(() => {
      const testimonials: Testimonial[] = [];
      
      // Common testimonial selectors
      const testimonialSelectors = [
        '.testimonial', '.review', '.customer-voice', '.voice',
        '.comment', '.feedback', '.user-review', '.customer-review'
      ];

      testimonialSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent?.trim() || '';
          if (text && text.length > 20 && text.length < 500) {
            const author = el.querySelector('.author, .name, .customer-name')?.textContent?.trim() || '匿名';
            const company = el.querySelector('.company')?.textContent?.trim() || '';
            const ratingEl = el.querySelector('.rating, .stars');
            const rating = ratingEl ? parseFloat(ratingEl.textContent?.match(/\d+(\.\d+)?/)?.[0] || '0') : undefined;
            
            testimonials.push({
              text,
              author,
              company,
              rating
            });
          }
        });
      });

      return testimonials.slice(0, 5);
    });
  }

  private async extractSocialProof(page: Page) {
    return await page.evaluate(() => {
      const socialProof = {
        customerCount: '',
        companyLogos: [] as string[],
        ratings: [] as Rating[],
        reviews: [] as Review[]
      };

      // Customer count
      const bodyText = document.body.textContent || '';
      const countMatch = bodyText.match(/(\d{1,3}(,\d{3})*)\s*(名|人|社|件|ユーザー|利用者|customers?|users?)/i);
      if (countMatch) {
        socialProof.customerCount = countMatch[0];
      }

      // Company logos
      const logoImages = Array.from(document.querySelectorAll('img')).filter(img => {
        const alt = img.alt.toLowerCase();
        const src = img.src.toLowerCase();
        return alt.includes('logo') || alt.includes('client') || alt.includes('company') ||
               src.includes('logo') || src.includes('client');
      });
      socialProof.companyLogos = logoImages.map(img => img.src).slice(0, 10);

      // Ratings
      const ratingElements = document.querySelectorAll('.rating, .stars, .score');
      ratingElements.forEach(el => {
        const text = el.textContent || '';
        const scoreMatch = text.match(/(\d+(\.\d+)?)\s*\/?\s*(\d+)?/);
        if (scoreMatch) {
          socialProof.ratings.push({
            platform: '評価',
            score: parseFloat(scoreMatch[1]),
            maxScore: scoreMatch[3] ? parseFloat(scoreMatch[3]) : 5,
            reviewCount: 0
          });
        }
      });

      return socialProof;
    });
  }

  private async extractContact(page: Page) {
    return await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      
      return {
        phone: bodyText.match(/\d{2,4}-\d{2,4}-\d{4}|\d{10,11}/)?.[0] || '',
        email: bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || '',
        address: document.querySelector('.address, .location')?.textContent?.trim() || '',
        businessHours: bodyText.match(/営業時間|(\d{1,2}:\d{2})\s*[-〜～]\s*(\d{1,2}:\d{2})/)?.[0] || '',
        socialMedia: Array.from(document.querySelectorAll('a[href*="twitter"], a[href*="facebook"], a[href*="instagram"], a[href*="youtube"]'))
          .map(link => ({
            platform: link.getAttribute('href')?.includes('twitter') ? 'Twitter' :
                     link.getAttribute('href')?.includes('facebook') ? 'Facebook' :
                     link.getAttribute('href')?.includes('instagram') ? 'Instagram' :
                     link.getAttribute('href')?.includes('youtube') ? 'YouTube' : 'Other',
            url: link.getAttribute('href') || ''
          }))
      };
    });
  }

  private async extractContent(page: Page) {
    return await page.evaluate(() => {
      const keyMessages: string[] = [];
      const valuePropositions: string[] = [];
      const callToActions: string[] = [];

      // Extract key messages from prominent headings
      const prominentHeadings = document.querySelectorAll('h1, h2, .hero-text, .main-message, .key-message');
      prominentHeadings.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text && text.length > 5 && text.length < 200) {
          keyMessages.push(text);
        }
      });

      // Extract value propositions
      const valueElements = document.querySelectorAll('.value, .benefit, .advantage, .point, .merit');
      valueElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text && text.length > 10 && text.length < 300) {
          valuePropositions.push(text);
        }
      });

      // Extract CTAs
      const ctaElements = document.querySelectorAll('button, .btn, .cta, a[class*="button"]');
      ctaElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text && text.length > 2 && text.length < 50) {
          callToActions.push(text);
        }
      });

      return {
        keyMessages: [...new Set(keyMessages)].slice(0, 5),
        valuePropositions: [...new Set(valuePropositions)].slice(0, 10),
        callToActions: [...new Set(callToActions)].slice(0, 5)
      };
    });
  }

  private async extractMedia(page: Page) {
    return await page.evaluate(() => {
      // Images
      const images = Array.from(document.querySelectorAll('img')).map(img => img.src).slice(0, 10);
      
      // Videos
      const videos = Array.from(document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]'))
        .map(el => el.getAttribute('src') || (el as HTMLVideoElement).src)
        .filter(src => src)
        .slice(0, 5);

      // Downloadable content
      const downloadableContent = Array.from(document.querySelectorAll('a[href$=".pdf"], a[href*="download"]'))
        .map(link => link.getAttribute('href') || '')
        .filter(href => href)
        .slice(0, 5);

      return {
        images,
        videos,
        downloadableContent
      };
    });
  }

  private async extractMetadata(page: Page, loadTime: number) {
    return await page.evaluate((loadTime) => {
      const bodyText = document.body.textContent || '';
      
      return {
        scrapedAt: new Date().toISOString(),
        pageLoadTime: loadTime,
        contentLength: bodyText.length,
        language: document.documentElement.lang || 'ja',
        pageType: bodyText.includes('商品') || bodyText.includes('製品') ? 'product' as const :
                 bodyText.includes('サービス') ? 'service' as const :
                 bodyText.includes('会社') || bodyText.includes('企業') ? 'company' as const :
                 bodyText.includes('お申し込み') || bodyText.includes('今すぐ') ? 'landing' as const :
                 bodyText.includes('購入') || bodyText.includes('カート') ? 'ecommerce' as const :
                 'product' as const,
        mobileOptimized: !!document.querySelector('meta[name="viewport"]'),
        hasVideo: !!document.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]'),
        hasTestimonials: !!document.querySelector('.testimonial, .review, .voice'),
        hasPricing: /[¥$€£]\d{1,3}(,\d{3})*|月額|年額|プラン/i.test(bodyText)
      };
    }, loadTime);
  }
}

export const playwrightScraper = new PlaywrightScraper();