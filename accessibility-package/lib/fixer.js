/**
 * Accessibility Fixer
 * Automated fixes for common accessibility issues
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

/**
 * Enhanced Alt Text Generator
 * Tạo alt text thông minh và đa dạng dựa trên AI và ngữ cảnh
 */
class EnhancedAltGenerator {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      creativity: config.creativity || 'balanced', // conservative, balanced, creative
      includeEmotions: config.includeEmotions || false,
      includeBrandContext: config.includeBrandContext || true,
      maxLength: config.maxLength || 125,
      ...config
    };
    
    // Từ điển đa ngôn ngữ
    this.vocabulary = this.initializeVocabulary();
  }

  initializeVocabulary() {
    return {
      ja: {
        types: {
          person: ['人物', '人', '男性', '女性', '子供', '大人'],
          object: ['物', '商品', 'アイテム', '製品'],
          nature: ['自然', '風景', '景色', '環境'],
          building: ['建物', '建築', '構造物', '施設'],
          food: ['食べ物', '料理', '食品', 'グルメ'],
          technology: ['技術', 'テクノロジー', '機器', 'デバイス'],
          art: ['芸術', 'アート', '作品', 'デザイン'],
          vehicle: ['乗り物', '車両', '交通手段']
        },
        emotions: {
          positive: ['明るい', '楽しい', '美しい', '素晴らしい', '魅力的な'],
          neutral: ['シンプルな', '清潔な', '整然とした', 'プロフェッショナルな'],
          dynamic: ['活気のある', 'エネルギッシュな', 'ダイナミックな', '力強い']
        },
        actions: {
          showing: ['示している', '表示している', '見せている'],
          working: ['作業している', '働いている', '取り組んでいる'],
          enjoying: ['楽しんでいる', '満喫している', '味わっている'],
          creating: ['作成している', '制作している', '開発している']
        },
        contexts: {
          business: ['ビジネス', '企業', '会社', '職場'],
          education: ['教育', '学習', '研修', 'トレーニング'],
          lifestyle: ['ライフスタイル', '日常', '生活', '暮らし'],
          technology: ['IT', 'デジタル', 'オンライン', 'ウェブ']
        }
      },
      en: {
        types: {
          person: ['person', 'people', 'individual', 'team', 'group'],
          object: ['object', 'item', 'product', 'tool', 'equipment'],
          nature: ['nature', 'landscape', 'scenery', 'environment'],
          building: ['building', 'architecture', 'structure', 'facility'],
          food: ['food', 'cuisine', 'dish', 'meal', 'delicacy'],
          technology: ['technology', 'device', 'gadget', 'equipment'],
          art: ['art', 'artwork', 'design', 'creation'],
          vehicle: ['vehicle', 'transportation', 'automobile']
        },
        emotions: {
          positive: ['bright', 'cheerful', 'beautiful', 'wonderful', 'attractive'],
          neutral: ['simple', 'clean', 'organized', 'professional'],
          dynamic: ['vibrant', 'energetic', 'dynamic', 'powerful']
        },
        actions: {
          showing: ['showing', 'displaying', 'presenting'],
          working: ['working', 'operating', 'engaging'],
          enjoying: ['enjoying', 'experiencing', 'savoring'],
          creating: ['creating', 'developing', 'building']
        },
        contexts: {
          business: ['business', 'corporate', 'company', 'workplace'],
          education: ['education', 'learning', 'training', 'academic'],
          lifestyle: ['lifestyle', 'daily life', 'personal', 'casual'],
          technology: ['technology', 'digital', 'online', 'web']
        }
      },
      vi: {
        types: {
          person: ['người', 'con người', 'cá nhân', 'nhóm', 'đội ngũ'],
          object: ['vật', 'đồ vật', 'sản phẩm', 'công cụ', 'thiết bị'],
          nature: ['thiên nhiên', 'phong cảnh', 'cảnh quan', 'môi trường'],
          building: ['tòa nhà', 'kiến trúc', 'công trình', 'cơ sở'],
          food: ['thức ăn', 'món ăn', 'ẩm thực', 'đặc sản'],
          technology: ['công nghệ', 'thiết bị', 'máy móc', 'kỹ thuật'],
          art: ['nghệ thuật', 'tác phẩm', 'thiết kế', 'sáng tạo'],
          vehicle: ['phương tiện', 'xe cộ', 'giao thông']
        },
        emotions: {
          positive: ['tươi sáng', 'vui vẻ', 'đẹp đẽ', 'tuyệt vời', 'hấp dẫn'],
          neutral: ['đơn giản', 'sạch sẽ', 'ngăn nắp', 'chuyên nghiệp'],
          dynamic: ['sôi động', 'năng động', 'mạnh mẽ', 'đầy năng lượng']
        },
        actions: {
          showing: ['đang hiển thị', 'đang trình bày', 'đang thể hiện'],
          working: ['đang làm việc', 'đang hoạt động', 'đang thực hiện'],
          enjoying: ['đang thưởng thức', 'đang tận hưởng', 'đang trải nghiệm'],
          creating: ['đang tạo ra', 'đang phát triển', 'đang xây dựng']
        },
        contexts: {
          business: ['kinh doanh', 'doanh nghiệp', 'công ty', 'nơi làm việc'],
          education: ['giáo dục', 'học tập', 'đào tạo', 'học thuật'],
          lifestyle: ['lối sống', 'cuộc sống', 'cá nhân', 'thường ngày'],
          technology: ['công nghệ', 'số hóa', 'trực tuyến', 'web']
        }
      }
    };
  }

  generateDiverseAltText(imgTag, htmlContent, analysis) {
    const strategies = [
      () => this.generateContextualAlt(analysis),
      () => this.generateSemanticAlt(analysis),
      () => this.generateEmotionalAlt(analysis),
      () => this.generateActionBasedAlt(analysis),
      () => this.generateBrandAwareAlt(analysis),
      () => this.generateTechnicalAlt(analysis)
    ];

    const selectedStrategies = this.selectStrategies(strategies, analysis);
    
    for (const strategy of selectedStrategies) {
      const result = strategy();
      if (result && this.validateAltText(result)) {
        return this.refineAltText(result, analysis);
      }
    }

    return this.generateFallbackAlt(analysis);
  }

  generateContextualAlt(analysis) {
    const { context, structural, imageType } = analysis;
    
    if (structural.figcaption) {
      return this.enhanceWithVocabulary(structural.figcaption, imageType);
    }
    
    if (structural.parentLink) {
      const linkText = this.extractLinkText(structural.parentLink);
      if (linkText) {
        return this.createLinkAlt(linkText, imageType);
      }
    }
    
    const contextElements = this.extractContextElements(context);
    if (contextElements.nearbyHeading) {
      return this.createHeadingBasedAlt(contextElements.nearbyHeading, imageType);
    }
    
    if (contextElements.surroundingText) {
      return this.createTextBasedAlt(contextElements.surroundingText, imageType);
    }
    
    return null;
  }

  generateSemanticAlt(analysis) {
    const { src, imageType, context } = analysis;
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const semanticInfo = this.analyzeSemanticContent(src, context);
    
    if (!semanticInfo.mainSubject) return null;
    
    let altParts = [];
    
    const subjectWord = this.selectVocabularyWord(vocab.types[semanticInfo.category] || [], 'random');
    if (subjectWord) {
      altParts.push(subjectWord);
    }
    
    if (semanticInfo.description) {
      altParts.push(semanticInfo.description);
    }
    
    if (semanticInfo.context && this.config.includeBrandContext) {
      const contextWord = this.selectVocabularyWord(vocab.contexts[semanticInfo.context] || [], 'first');
      if (contextWord) {
        altParts.push(`${contextWord}の`);
      }
    }
    
    return this.combineAltParts(altParts);
  }

  generateEmotionalAlt(analysis) {
    if (!this.config.includeEmotions) return null;
    
    const { imageType, context } = analysis;
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const emotionalTone = this.analyzeEmotionalTone(context);
    
    if (!emotionalTone) return null;
    
    const emotionWords = vocab.emotions[emotionalTone] || [];
    const emotionWord = this.selectVocabularyWord(emotionWords, 'random');
    
    if (!emotionWord) return null;
    
    const baseAlt = this.generateBasicAlt(analysis);
    
    return lang === 'ja' ? 
      `${emotionWord}${baseAlt}` : 
      `${emotionWord} ${baseAlt}`;
  }

  generateActionBasedAlt(analysis) {
    const { context, imageType } = analysis;
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const detectedAction = this.detectAction(context);
    
    if (!detectedAction) return null;
    
    const actionWords = vocab.actions[detectedAction] || [];
    const actionWord = this.selectVocabularyWord(actionWords, 'random');
    
    if (!actionWord) return null;
    
    const subject = this.detectSubject(context, imageType);
    
    return lang === 'ja' ?
      `${subject}${actionWord}様子` :
      `${subject} ${actionWord}`;
  }

  generateBrandAwareAlt(analysis) {
    if (!this.config.includeBrandContext) return null;
    
    const { context, src } = analysis;
    
    const brandInfo = this.extractBrandInfo(context, src);
    
    if (!brandInfo.name) return null;
    
    const baseAlt = this.generateBasicAlt(analysis);
    
    return `${brandInfo.name}の${baseAlt}`;
  }

  generateTechnicalAlt(analysis) {
    const { imageType, src, context } = analysis;
    
    if (imageType !== 'data-visualization' && imageType !== 'complex') {
      return null;
    }
    
    const technicalInfo = this.extractTechnicalInfo(context, src);
    
    if (!technicalInfo.type) return null;
    
    let altParts = [technicalInfo.type];
    
    if (technicalInfo.data) {
      altParts.push(technicalInfo.data);
    }
    
    if (technicalInfo.trend) {
      altParts.push(technicalInfo.trend);
    }
    
    return this.combineAltParts(altParts);
  }

  selectStrategies(strategies, analysis) {
    const { creativity } = this.config;
    const { imageType } = analysis;
    
    switch (creativity) {
      case 'conservative':
        return strategies.slice(0, 2);
      case 'creative':
        return strategies;
      default:
        if (imageType === 'decorative') {
          return strategies.slice(0, 1);
        } else if (imageType === 'data-visualization') {
          return [strategies[0], strategies[5]];
        } else {
          return strategies.slice(0, 4);
        }
    }
  }

  validateAltText(altText) {
    if (!altText || typeof altText !== 'string') return false;
    
    const trimmed = altText.trim();
    
    if (trimmed.length < 2 || trimmed.length > this.config.maxLength) {
      return false;
    }
    
    const forbiddenWords = ['image', 'picture', 'photo', '画像', '写真'];
    const hasForbidenWord = forbiddenWords.some(word => 
      trimmed.toLowerCase().includes(word.toLowerCase())
    );
    
    if (hasForbidenWord) return false;
    
    const placeholders = ['[', ']', 'placeholder', 'dummy'];
    const hasPlaceholder = placeholders.some(placeholder => 
      trimmed.toLowerCase().includes(placeholder)
    );
    
    return !hasPlaceholder;
  }

  refineAltText(altText, analysis) {
    let refined = altText.trim();
    
    refined = refined.replace(/[<>]/g, '');
    refined = refined.replace(/\s+/g, ' ');
    
    if (refined.length > this.config.maxLength) {
      refined = refined.substring(0, this.config.maxLength - 3) + '...';
    }
    
    if (this.config.language === 'en') {
      refined = refined.charAt(0).toUpperCase() + refined.slice(1);
    }
    
    return refined;
  }

  // Helper methods
  extractContextElements(context) {
    return {
      nearbyHeading: this.findNearbyHeading(context),
      surroundingText: this.extractSurroundingText(context),
      listContext: this.findListContext(context),
      tableContext: this.findTableContext(context)
    };
  }

  analyzeSemanticContent(src, context) {
    const srcLower = (src || '').toLowerCase();
    const contextLower = context.toLowerCase();
    
    let category = 'object';
    
    if (this.containsKeywords(srcLower + ' ' + contextLower, ['person', 'people', 'man', 'woman', '人', '人物'])) {
      category = 'person';
    } else if (this.containsKeywords(srcLower + ' ' + contextLower, ['nature', 'landscape', '自然', '風景'])) {
      category = 'nature';
    } else if (this.containsKeywords(srcLower + ' ' + contextLower, ['building', 'architecture', '建物', '建築'])) {
      category = 'building';
    } else if (this.containsKeywords(srcLower + ' ' + contextLower, ['food', 'restaurant', '食べ物', '料理'])) {
      category = 'food';
    } else if (this.containsKeywords(srcLower + ' ' + contextLower, ['tech', 'computer', 'device', '技術', 'コンピューター'])) {
      category = 'technology';
    }
    
    return {
      category,
      mainSubject: this.extractMainSubject(context),
      description: this.extractDescription(context),
      context: this.detectContextType(context)
    };
  }

  analyzeEmotionalTone(context) {
    const contextLower = context.toLowerCase();
    
    if (this.containsKeywords(contextLower, ['success', 'happy', 'great', 'excellent', '成功', '素晴らしい', '優秀'])) {
      return 'positive';
    }
    
    if (this.containsKeywords(contextLower, ['action', 'energy', 'dynamic', 'power', 'アクション', 'エネルギー', 'ダイナミック'])) {
      return 'dynamic';
    }
    
    return 'neutral';
  }

  detectAction(context) {
    const contextLower = context.toLowerCase();
    
    if (this.containsKeywords(contextLower, ['show', 'display', 'present', '表示', '示す'])) {
      return 'showing';
    } else if (this.containsKeywords(contextLower, ['work', 'operate', 'use', '作業', '操作', '使用'])) {
      return 'working';
    } else if (this.containsKeywords(contextLower, ['enjoy', 'experience', 'taste', '楽しむ', '体験', '味わう'])) {
      return 'enjoying';
    } else if (this.containsKeywords(contextLower, ['create', 'build', 'develop', '作成', '構築', '開発'])) {
      return 'creating';
    }
    
    return null;
  }

  detectSubject(context, imageType) {
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const typeVocab = vocab.types[imageType] || vocab.types.object;
    return this.selectVocabularyWord(typeVocab, 'first') || (lang === 'ja' ? '画像' : 'image');
  }

  extractBrandInfo(context, src) {
    const brandPatterns = [
      /company[^>]*>([^<]+)/i,
      /brand[^>]*>([^<]+)/i,
      /<title[^>]*>([^<]+)/i,
      /alt\s*=\s*["']([^"']*logo[^"']*)["']/i
    ];
    
    for (const pattern of brandPatterns) {
      const match = context.match(pattern);
      if (match) {
        return { name: match[1].trim().replace(/\s*logo\s*/i, '') };
      }
    }
    
    return { name: null };
  }

  extractTechnicalInfo(context, src) {
    const contextLower = context.toLowerCase();
    const srcLower = (src || '').toLowerCase();
    
    let type = null;
    let data = null;
    let trend = null;
    
    if (this.containsKeywords(srcLower + ' ' + contextLower, ['chart', 'graph', 'グラフ', 'チャート'])) {
      if (this.containsKeywords(contextLower, ['bar', 'column', '棒'])) {
        type = this.config.language === 'ja' ? '棒グラフ' : 'Bar chart';
      } else if (this.containsKeywords(contextLower, ['pie', '円'])) {
        type = this.config.language === 'ja' ? '円グラフ' : 'Pie chart';
      } else if (this.containsKeywords(contextLower, ['line', '線'])) {
        type = this.config.language === 'ja' ? '線グラフ' : 'Line chart';
      } else {
        type = this.config.language === 'ja' ? 'グラフ' : 'Chart';
      }
    }
    
    const numberPattern = /(\d+(?:\.\d+)?)\s*%?/g;
    const numbers = contextLower.match(numberPattern);
    if (numbers && numbers.length > 0) {
      data = numbers.slice(0, 3).join(', ');
    }
    
    if (this.containsKeywords(contextLower, ['increase', 'rise', 'up', '増加', '上昇', '向上'])) {
      trend = this.config.language === 'ja' ? '増加傾向' : 'increasing trend';
    } else if (this.containsKeywords(contextLower, ['decrease', 'fall', 'down', '減少', '下降', '低下'])) {
      trend = this.config.language === 'ja' ? '減少傾向' : 'decreasing trend';
    }
    
    return { type, data, trend };
  }

  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  selectVocabularyWord(words, strategy = 'random') {
    if (!words || words.length === 0) return null;
    
    switch (strategy) {
      case 'first':
        return words[0];
      case 'random':
        return words[Math.floor(Math.random() * words.length)];
      case 'shortest':
        return words.reduce((shortest, word) => 
          word.length < shortest.length ? word : shortest
        );
      default:
        return words[0];
    }
  }

  combineAltParts(parts) {
    const lang = this.config.language;
    const validParts = parts.filter(part => part && part.trim());
    
    if (validParts.length === 0) return null;
    
    if (lang === 'ja') {
      return validParts.join('');
    } else {
      return validParts.join(' ');
    }
  }

  generateBasicAlt(analysis) {
    const { imageType, src } = analysis;
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const typeWords = vocab.types[imageType] || vocab.types.object;
    return this.selectVocabularyWord(typeWords, 'first') || (lang === 'ja' ? '画像' : 'image');
  }

  generateFallbackAlt(analysis) {
    const { src } = analysis;
    const lang = this.config.language;
    
    if (src) {
      const filename = src.split('/').pop().split('.')[0];
      const cleaned = filename.replace(/[-_]/g, ' ').trim();
      
      if (cleaned && cleaned.length > 0) {
        return lang === 'ja' ? 
          cleaned.replace(/\b\w/g, l => l.toUpperCase()) :
          cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }
    }
    
    return lang === 'ja' ? '画像' : 'Image';
  }

  enhanceWithVocabulary(text, imageType) {
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const typeWords = vocab.types[imageType];
    if (typeWords && typeWords.length > 0) {
      const typeWord = this.selectVocabularyWord(typeWords, 'random');
      
      return lang === 'ja' ?
        `${typeWord}：${text}` :
        `${typeWord}: ${text}`;
    }
    
    return text;
  }

  createLinkAlt(linkText, imageType) {
    const lang = this.config.language;
    
    return lang === 'ja' ?
      `${linkText}へのリンク` :
      `Link to ${linkText}`;
  }

  createHeadingBasedAlt(heading, imageType) {
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const typeWords = vocab.types[imageType] || [];
    const typeWord = this.selectVocabularyWord(typeWords, 'first');
    
    if (typeWord) {
      return lang === 'ja' ?
        `${heading}の${typeWord}` :
        `${typeWord} of ${heading}`;
    }
    
    return heading;
  }

  createTextBasedAlt(text, imageType) {
    const words = text.split(/\s+/).filter(word => word.length > 2);
    const keyWords = words.slice(0, 3).join(' ');
    
    const lang = this.config.language;
    const vocab = this.vocabulary[lang];
    
    const typeWords = vocab.types[imageType] || [];
    const typeWord = this.selectVocabularyWord(typeWords, 'first');
    
    if (typeWord && keyWords) {
      return lang === 'ja' ?
        `${keyWords}の${typeWord}` :
        `${typeWord} showing ${keyWords}`;
    }
    
    return keyWords || (lang === 'ja' ? '画像' : 'Image');
  }

  extractMainSubject(context) {
    const sentences = context.split(/[.!?。！？]/);
    const firstSentence = sentences[0];
    
    if (firstSentence) {
      const words = firstSentence.split(/\s+/);
      return words.slice(0, 3).join(' ');
    }
    
    return null;
  }

  extractDescription(context) {
    const descriptiveWords = context.match(/\b(beautiful|amazing|professional|modern|elegant|美しい|素晴らしい|プロフェッショナル|モダン|エレガント)\b/gi);
    
    return descriptiveWords ? descriptiveWords[0] : null;
  }

  detectContextType(context) {
    const contextLower = context.toLowerCase();
    
    if (this.containsKeywords(contextLower, ['business', 'company', 'corporate', 'ビジネス', '企業', '会社'])) {
      return 'business';
    } else if (this.containsKeywords(contextLower, ['education', 'learning', 'school', '教育', '学習', '学校'])) {
      return 'education';
    } else if (this.containsKeywords(contextLower, ['technology', 'tech', 'digital', '技術', 'テクノロジー', 'デジタル'])) {
      return 'technology';
    } else if (this.containsKeywords(contextLower, ['lifestyle', 'personal', 'daily', 'ライフスタイル', '個人', '日常'])) {
      return 'lifestyle';
    }
    
    return null;
  }

  findNearbyHeading(context) {
    const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
    const match = headingRegex.exec(context);
    return match ? match[1].trim() : null;
  }

  extractSurroundingText(context) {
    const textOnly = context.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textOnly.split(' ');
    
    const meaningfulWords = words.filter(word => 
      word.length > 2 && !/^\d+$/.test(word) && !/^[^\w]+$/.test(word)
    ).slice(0, 8);
    
    return meaningfulWords.join(' ');
  }

  findListContext(context) {
    const listItemRegex = /<li[^>]*>([^<]+)<\/li>/gi;
    const match = listItemRegex.exec(context);
    return match ? match[1].trim() : null;
  }

  findTableContext(context) {
    const tableCellRegex = /<t[hd][^>]*>([^<]+)<\/t[hd]>/gi;
    const match = tableCellRegex.exec(context);
    return match ? match[1].trim() : null;
  }

  extractLinkText(linkTag) {
    const textMatch = linkTag.match(/>([^<]+)</);
    return textMatch ? textMatch[1].trim() : null;
  }
}

/**
 * Enhanced Alt Attribute Checker
 * Cải tiến tính năng kiểm tra alt attribute đa dạng và toàn diện hơn
 */
class EnhancedAltChecker {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      strictMode: config.strictMode || false,
      checkDecorative: config.checkDecorative || true,
      checkInformative: config.checkInformative || true,
      checkComplex: config.checkComplex || true,
      maxAltLength: config.maxAltLength || 125,
      minAltLength: config.minAltLength || 3,
      ...config
    };
  }

  analyzeAltAttributes(content) {
    const issues = [];
    const imgRegex = /<img[^>]*>/gi;
    const imgTags = content.match(imgRegex) || [];
    
    imgTags.forEach((imgTag, index) => {
      const analysis = this.analyzeImageContext(imgTag, content, index);
      const altIssues = this.checkAltQuality(imgTag, analysis);
      
      if (altIssues.length > 0) {
        issues.push({
          imageIndex: index + 1,
          imgTag: imgTag,
          src: analysis.src,
          context: analysis.context,
          issues: altIssues,
          recommendations: this.generateRecommendations(imgTag, analysis)
        });
      }
    });
    
    return issues;
  }

  analyzeImageContext(imgTag, htmlContent, imgIndex) {
    const src = this.extractAttribute(imgTag, 'src');
    const alt = this.extractAttribute(imgTag, 'alt');
    const title = this.extractAttribute(imgTag, 'title');
    const ariaLabel = this.extractAttribute(imgTag, 'aria-label');
    const role = this.extractAttribute(imgTag, 'role');
    
    const position = this.findImagePosition(imgTag, htmlContent, imgIndex);
    const surroundingContext = this.extractSurroundingContext(htmlContent, position, 1000);
    
    const imageType = this.classifyImageType(imgTag, surroundingContext, src);
    
    const structuralContext = this.analyzeStructuralContext(surroundingContext, imgTag);
    
    return {
      src,
      alt,
      title,
      ariaLabel,
      role,
      imageType,
      context: surroundingContext,
      structural: structuralContext,
      position
    };
  }

  checkAltQuality(imgTag, analysis) {
    const issues = [];
    const { alt, imageType, src } = analysis;
    
    if (!this.hasAttribute(imgTag, 'alt')) {
      issues.push({
        type: 'MISSING_ALT',
        severity: 'ERROR',
        message: 'Thiếu thuộc tính alt',
        description: 'Tất cả hình ảnh phải có thuộc tính alt'
      });
      return issues;
    }

    if (alt === '') {
      if (imageType === 'decorative') {
        return issues;
      } else {
        issues.push({
          type: 'EMPTY_ALT',
          severity: 'ERROR',
          message: 'Alt text rỗng cho hình ảnh có nội dung',
          description: 'Hình ảnh có nội dung cần alt text mô tả'
        });
      }
    }

    if (alt && alt.length > this.config.maxAltLength) {
      issues.push({
        type: 'ALT_TOO_LONG',
        severity: 'WARNING',
        message: `Alt text quá dài (${alt.length} ký tự)`,
        description: `Nên giới hạn dưới ${this.config.maxAltLength} ký tự`
      });
    }

    if (alt && alt.length < this.config.minAltLength && imageType !== 'decorative') {
      issues.push({
        type: 'ALT_TOO_SHORT',
        severity: 'WARNING',
        message: `Alt text quá ngắn (${alt.length} ký tự)`,
        description: 'Alt text nên mô tả đầy đủ nội dung hình ảnh'
      });
    }

    const contentIssues = this.checkAltContent(alt, src, imageType);
    issues.push(...contentIssues);

    const consistencyIssues = this.checkAttributeConsistency(analysis);
    issues.push(...consistencyIssues);

    const typeSpecificIssues = this.checkTypeSpecificRequirements(analysis);
    issues.push(...typeSpecificIssues);

    return issues;
  }

  classifyImageType(imgTag, context, src) {
    const srcLower = (src || '').toLowerCase();
    const contextLower = context.toLowerCase();
    
    if (this.isDecorativeImage(imgTag, context, src)) {
      return 'decorative';
    }
    
    if (this.isDataVisualization(srcLower, contextLower)) {
      return 'data-visualization';
    }
    
    if (this.isComplexImage(srcLower, contextLower)) {
      return 'complex';
    }
    
    if (this.isLogo(srcLower, contextLower)) {
      return 'logo';
    }
    
    if (this.isFunctionalIcon(imgTag, context, srcLower)) {
      return 'functional-icon';
    }
    
    if (this.isContentImage(contextLower)) {
      return 'content';
    }
    
    return 'informative';
  }

  checkAltContent(alt, src, imageType) {
    const issues = [];
    
    if (!alt) return issues;
    
    const altLower = alt.toLowerCase();
    const srcLower = (src || '').toLowerCase();
    
    const forbiddenWords = [
      'image', 'picture', 'photo', 'graphic', 'img',
      '画像', '写真', 'イメージ', '図', '図表'
    ];
    
    const foundForbidden = forbiddenWords.find(word => altLower.includes(word));
    if (foundForbidden) {
      issues.push({
        type: 'REDUNDANT_WORDS',
        severity: 'WARNING',
        message: `Alt text chứa từ thừa: "${foundForbidden}"`,
        description: 'Không cần nói "hình ảnh" trong alt text'
      });
    }
    
    if (src) {
      const filename = src.split('/').pop().split('.')[0];
      if (altLower.includes(filename.toLowerCase())) {
        issues.push({
          type: 'FILENAME_IN_ALT',
          severity: 'WARNING',
          message: 'Alt text chứa tên file',
          description: 'Nên mô tả nội dung thay vì tên file'
        });
      }
    }
    
    const genericTexts = [
      'click here', 'read more', 'learn more', 'see more',
      'ここをクリック', '詳細', 'もっと見る'
    ];
    
    const foundGeneric = genericTexts.find(text => altLower.includes(text));
    if (foundGeneric) {
      issues.push({
        type: 'GENERIC_ALT',
        severity: 'ERROR',
        message: `Alt text quá chung chung: "${foundGeneric}"`,
        description: 'Nên mô tả cụ thể nội dung hình ảnh'
      });
    }
    
    if (imageType === 'data-visualization' && !this.hasDataDescription(alt)) {
      issues.push({
        type: 'MISSING_DATA_DESCRIPTION',
        severity: 'ERROR',
        message: 'Biểu đồ thiếu mô tả dữ liệu',
        description: 'Biểu đồ cần mô tả xu hướng và dữ liệu chính'
      });
    }
    
    return issues;
  }

  generateRecommendations(imgTag, analysis) {
    const recommendations = [];
    const { imageType, context, src, alt } = analysis;
    
    switch (imageType) {
      case 'decorative':
        recommendations.push({
          type: 'DECORATIVE',
          suggestion: 'alt=""',
          reason: 'Hình trang trí nên có alt rỗng'
        });
        break;
        
      case 'logo':
        const brandName = this.extractBrandName(context, src);
        recommendations.push({
          type: 'LOGO',
          suggestion: brandName ? `alt="${brandName} logo"` : 'alt="Company logo"',
          reason: 'Logo nên bao gồm tên thương hiệu'
        });
        break;
        
      case 'functional-icon':
        const action = this.extractIconAction(context, imgTag);
        recommendations.push({
          type: 'FUNCTIONAL',
          suggestion: action ? `alt="${action}"` : 'alt="[Mô tả chức năng]"',
          reason: 'Icon chức năng nên mô tả hành động'
        });
        break;
        
      case 'data-visualization':
        recommendations.push({
          type: 'DATA_VIZ',
          suggestion: 'alt="[Loại biểu đồ]: [Xu hướng chính] [Dữ liệu quan trọng]"',
          reason: 'Biểu đồ cần mô tả loại, xu hướng và dữ liệu chính'
        });
        break;
        
      case 'complex':
        recommendations.push({
          type: 'COMPLEX',
          suggestion: 'alt="[Mô tả ngắn]" + longdesc hoặc mô tả chi tiết bên dưới',
          reason: 'Hình phức tạp cần mô tả ngắn trong alt và mô tả dài riêng'
        });
        break;
        
      default:
        const contextualAlt = this.generateContextualAlt(analysis);
        recommendations.push({
          type: 'CONTEXTUAL',
          suggestion: `alt="${contextualAlt}"`,
          reason: 'Mô tả dựa trên ngữ cảnh xung quanh'
        });
    }
    
    return recommendations;
  }

  generateContextualAlt(analysis) {
    const { context, src, structural } = analysis;
    
    const nearbyHeading = this.findNearbyHeading(context);
    if (nearbyHeading) {
      return nearbyHeading;
    }
    
    if (structural.parentLink) {
      const linkText = this.extractLinkText(structural.parentLink);
      if (linkText) {
        return linkText;
      }
    }
    
    if (structural.figcaption) {
      return structural.figcaption;
    }
    
    const surroundingText = this.extractSurroundingText(context);
    if (surroundingText) {
      return surroundingText;
    }
    
    return this.generateFallbackAlt(src);
  }

  // Helper methods
  isDecorativeImage(imgTag, context, src) {
    const decorativeIndicators = [
      'decoration', 'border', 'spacer', 'divider',
      'background', 'texture', 'pattern'
    ];
    
    const srcLower = (src || '').toLowerCase();
    return decorativeIndicators.some(indicator => srcLower.includes(indicator));
  }

  isDataVisualization(src, context) {
    const dataIndicators = [
      'chart', 'graph', 'plot', 'diagram', 'infographic',
      'グラフ', '図表', 'チャート'
    ];
    
    return dataIndicators.some(indicator => 
      src.includes(indicator) || context.includes(indicator)
    );
  }

  isComplexImage(src, context) {
    const complexIndicators = [
      'flowchart', 'timeline', 'map', 'blueprint', 'schematic',
      'フローチャート', '地図', '設計図'
    ];
    
    return complexIndicators.some(indicator => 
      src.includes(indicator) || context.includes(indicator)
    );
  }

  isLogo(src, context) {
    const logoIndicators = ['logo', 'brand', 'ロゴ', 'ブランド'];
    return logoIndicators.some(indicator => 
      src.includes(indicator) || context.includes(indicator)
    );
  }

  isFunctionalIcon(imgTag, context, src) {
    const iconIndicators = ['icon', 'btn', 'button', 'アイコン', 'ボタン'];
    const hasClickHandler = /onclick|href/i.test(context);
    
    return (iconIndicators.some(indicator => src.includes(indicator)) || hasClickHandler);
  }

  isContentImage(context) {
    const contentIndicators = [
      'article', 'content', 'story', 'news',
      '記事', 'コンテンツ', 'ニュース'
    ];
    
    return contentIndicators.some(indicator => context.includes(indicator));
  }

  extractAttribute(imgTag, attributeName) {
    const regex = new RegExp(`${attributeName}\\s*=\\s*["']([^"']*)["']`, 'i');
    const match = imgTag.match(regex);
    return match ? match[1] : null;
  }

  hasAttribute(imgTag, attributeName) {
    const regex = new RegExp(`${attributeName}\\s*=`, 'i');
    return regex.test(imgTag);
  }

  findImagePosition(imgTag, htmlContent, imgIndex) {
    const imgRegex = /<img[^>]*>/gi;
    let match;
    let currentIndex = 0;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      if (currentIndex === imgIndex) {
        return match.index;
      }
      currentIndex++;
    }
    
    return -1;
  }

  extractSurroundingContext(htmlContent, position, range) {
    if (position === -1) return '';
    
    const start = Math.max(0, position - range);
    const end = Math.min(htmlContent.length, position + range);
    
    return htmlContent.substring(start, end);
  }

  analyzeStructuralContext(context, imgTag) {
    return {
      parentLink: this.findParentElement(context, imgTag, 'a'),
      parentFigure: this.findParentElement(context, imgTag, 'figure'),
      figcaption: this.findSiblingElement(context, imgTag, 'figcaption'),
      parentButton: this.findParentElement(context, imgTag, 'button')
    };
  }

  findParentElement(context, imgTag, tagName) {
    const imgIndex = context.indexOf(imgTag);
    if (imgIndex === -1) return null;
    
    const beforeImg = context.substring(0, imgIndex);
    const openTagRegex = new RegExp(`<${tagName}[^>]*>`, 'gi');
    const closeTagRegex = new RegExp(`</${tagName}>`, 'gi');
    
    let openTags = 0;
    let lastOpenMatch = null;
    
    let match;
    while ((match = openTagRegex.exec(beforeImg)) !== null) {
      lastOpenMatch = match;
      openTags++;
    }
    
    while ((match = closeTagRegex.exec(beforeImg)) !== null) {
      openTags--;
    }
    
    return openTags > 0 ? lastOpenMatch[0] : null;
  }

  findSiblingElement(context, imgTag, tagName) {
    const imgIndex = context.indexOf(imgTag);
    if (imgIndex === -1) return null;
    
    const afterImg = context.substring(imgIndex + imgTag.length);
    const siblingRegex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, 'i');
    const match = afterImg.match(siblingRegex);
    
    return match ? match[1].trim() : null;
  }

  checkAttributeConsistency(analysis) {
    const issues = [];
    const { alt, title, ariaLabel } = analysis;
    
    if (alt && ariaLabel && alt !== ariaLabel) {
      issues.push({
        type: 'INCONSISTENT_LABELS',
        severity: 'WARNING',
        message: 'Alt text và aria-label không nhất quán',
        description: 'Alt và aria-label nên có nội dung giống nhau'
      });
    }
    
    if (title && alt && title === alt) {
      issues.push({
        type: 'REDUNDANT_TITLE',
        severity: 'INFO',
        message: 'Title attribute trùng với alt text',
        description: 'Title có thể bỏ đi để tránh lặp lại'
      });
    }
    
    return issues;
  }

  checkTypeSpecificRequirements(analysis) {
    const issues = [];
    const { imageType, alt, structural } = analysis;
    
    switch (imageType) {
      case 'functional-icon':
        if (structural.parentLink && !alt) {
          issues.push({
            type: 'FUNCTIONAL_MISSING_ALT',
            severity: 'ERROR',
            message: 'Icon chức năng trong link thiếu alt text',
            description: 'Icon có chức năng phải có alt mô tả hành động'
          });
        }
        break;
        
      case 'logo':
        if (alt && !alt.toLowerCase().includes('logo')) {
          issues.push({
            type: 'LOGO_MISSING_CONTEXT',
            severity: 'WARNING',
            message: 'Logo thiếu từ khóa "logo" trong alt text',
            description: 'Logo nên bao gồm từ "logo" để rõ ràng'
          });
        }
        break;
    }
    
    return issues;
  }

  hasDataDescription(alt) {
    const dataKeywords = [
      'increase', 'decrease', 'trend', 'percent', '%',
      '増加', '減少', 'トレンド', 'パーセント'
    ];
    
    return dataKeywords.some(keyword => 
      alt.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  findNearbyHeading(context) {
    const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
    const match = headingRegex.exec(context);
    return match ? match[1].trim() : null;
  }

  extractLinkText(linkTag) {
    const textMatch = linkTag.match(/>([^<]+)</);
    return textMatch ? textMatch[1].trim() : null;
  }

  extractSurroundingText(context) {
    const textOnly = context.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textOnly.split(' ');
    
    const meaningfulWords = words.filter(word => 
      word.length > 2 && !/^\d+$/.test(word)
    ).slice(0, 5);
    
    return meaningfulWords.join(' ');
  }

  generateFallbackAlt(src) {
    if (!src) return '画像';
    
    const filename = src.split('/').pop().split('.')[0];
    
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim() || '画像';
  }

  extractBrandName(context, src) {
    const brandPatterns = [
      /company[^>]*>([^<]+)/i,
      /brand[^>]*>([^<]+)/i,
      /logo[^>]*>([^<]+)/i
    ];
    
    for (const pattern of brandPatterns) {
      const match = context.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }

  extractIconAction(context, imgTag) {
    const actionPatterns = [
      /title\s*=\s*["']([^"']+)["']/i,
      /aria-label\s*=\s*["']([^"']+)["']/i,
      /onclick[^>]*>([^<]+)/i
    ];
    
    for (const pattern of actionPatterns) {
      const match = imgTag.match(pattern) || context.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }
}

class AccessibilityFixer {
  constructor(config = {}) {
    this.config = {
      backupFiles: config.backupFiles === true,
      language: config.language || 'ja',
      dryRun: config.dryRun || false,
      enhancedAltMode: config.enhancedAltMode || false,
      altCreativity: config.altCreativity || 'balanced', // conservative, balanced, creative
      includeEmotions: config.includeEmotions || false,
      strictAltChecking: config.strictAltChecking || false,
      // New options for advanced features
      autoFixHeadings: config.autoFixHeadings || false, // Enable automatic heading fixes
      fixDescriptionLists: config.fixDescriptionLists || true, // Enable DL structure fixes
      ...config
    };
    
    // Initialize enhanced alt tools
    this.enhancedAltChecker = new EnhancedAltChecker({
      language: this.config.language,
      strictMode: this.config.strictAltChecking,
      checkDecorative: true,
      checkInformative: true,
      checkComplex: true
    });
    
    this.enhancedAltGenerator = new EnhancedAltGenerator({
      language: this.config.language,
      creativity: this.config.altCreativity,
      includeEmotions: this.config.includeEmotions,
      includeBrandContext: true
    });
  }

  async fixHtmlLang(directory = '.') {
    console.log(chalk.blue('📝 Fixing HTML lang attributes...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fixed = this.fixLangAttribute(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed lang attribute in: ${file}`));
          results.push({ file, status: 'fixed' });
        } else {
          results.push({ file, status: 'no-change' });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    return results;
  }

  async fixEmptyAltAttributes(directory = '.') {
    console.log(chalk.blue('🖼️ Fixing empty alt attributes...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    let enhancedIssues = []; // Declare here to avoid scope issues
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        
        // Use enhanced alt checker if enabled
        if (this.config.enhancedAltMode) {
          enhancedIssues = this.enhancedAltChecker.analyzeAltAttributes(content);
          
          if (enhancedIssues.length > 0) {
            console.log(chalk.cyan(`\n📁 ${file}:`));
            enhancedIssues.forEach(issue => {
              console.log(chalk.yellow(`  🔍 Image ${issue.imageIndex} (${issue.src}):`));
              issue.issues.forEach(subIssue => {
                const icon = subIssue.severity === 'ERROR' ? '❌' : 
                           subIssue.severity === 'WARNING' ? '⚠️' : 'ℹ️';
                console.log(chalk.yellow(`    ${icon} ${subIssue.message}`));
                console.log(chalk.gray(`       ${subIssue.description}`));
              });
              
              // Show recommendations
              if (issue.recommendations.length > 0) {
                console.log(chalk.blue(`    💡 Recommendations:`));
                issue.recommendations.forEach(rec => {
                  console.log(chalk.blue(`       ${rec.suggestion}`));
                  console.log(chalk.gray(`       ${rec.reason}`));
                });
              }
              totalIssuesFound += issue.issues.length;
            });
          }
        } else {
          // Use original analysis
          const issues = this.analyzeAltAttributes(content);
          
          if (issues.length > 0) {
            console.log(chalk.cyan(`\n📁 ${file}:`));
            issues.forEach(issue => {
              console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
              totalIssuesFound++;
            });
          }
          enhancedIssues = issues; // For consistency in results calculation
        }
        
        const fixed = this.fixAltAttributes(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed alt attributes in: ${file}`));
          results.push({ file, status: 'fixed', issues: this.config.enhancedAltMode ? 
            enhancedIssues.reduce((sum, ei) => sum + (ei.issues ? ei.issues.length : 1), 0) : enhancedIssues.length });
        } else {
          results.push({ file, status: 'no-change', issues: this.config.enhancedAltMode ? 
            enhancedIssues.reduce((sum, ei) => sum + (ei.issues ? ei.issues.length : 1), 0) : enhancedIssues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} alt attribute issues across ${results.length} files`));
    if (this.config.enhancedAltMode) {
      console.log(chalk.gray(`   🔍 Enhanced analysis mode: Comprehensive quality checking enabled`));
    }
    return results;
  }

  analyzeAltAttributes(content) {
    const issues = [];
    const imgRegex = /<img[^>]*>/gi;
    const imgTags = content.match(imgRegex) || [];
    
    imgTags.forEach((imgTag, index) => {
      const hasAlt = /alt\s*=/i.test(imgTag);
      const hasEmptyAlt = /alt\s*=\s*[""''][""'']/i.test(imgTag);
      const src = imgTag.match(/src\s*=\s*["']([^"']+)["']/i);
      const srcValue = src ? src[1] : 'unknown';
      
      if (!hasAlt) {
        issues.push({
          type: '❌ Missing alt',
          description: `Image ${index + 1} (${srcValue}) has no alt attribute`,
          imgTag: imgTag.substring(0, 100) + '...'
        });
      } else if (hasEmptyAlt) {
        issues.push({
          type: '⚠️  Empty alt',
          description: `Image ${index + 1} (${srcValue}) has empty alt attribute`,
          imgTag: imgTag.substring(0, 100) + '...'
        });
      }
    });
    
    return issues;
  }

  async fixRoleAttributes(directory = '.') {
    console.log(chalk.blue('🎭 Fixing role attributes...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeRoleAttributes(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixRoleAttributesInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed role attributes in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} role attribute issues across ${results.length} files`));
    return results;
  }

  // Fix aria-labels for images and other elements
  async fixAriaLabels(directory = '.') {
    console.log(chalk.blue('🏷️ Fixing aria-label attributes...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fixed = this.fixAriaLabelsInContent(content);
        
        if (fixed.content !== content) {
          if (!this.config.dryRun) {
            if (this.config.backupFiles) {
              await fs.writeFile(`${file}.backup`, content);
            }
            await fs.writeFile(file, fixed.content);
          }
          
          console.log(chalk.green(`✅ Fixed aria-label attributes in: ${file}`));
          totalIssuesFound += fixed.changes;
        }
        
        results.push({ file, status: 'processed', changes: fixed.changes });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} aria-label issues across ${results.length} files`));
    return results;
  }

  fixAriaLabelsInContent(content) {
    let fixed = content;
    let changes = 0;
    
    // Fix images - add aria-label from alt text
    fixed = fixed.replace(
      /<img([^>]*>)/gi,
      (match) => {
        // Check if aria-label already exists
        if (/aria-label\s*=/i.test(match)) {
          return match; // Return unchanged if aria-label already exists
        }
        
        // Extract alt text to use for aria-label
        const altMatch = match.match(/alt\s*=\s*["']([^"']*)["']/i);
        if (altMatch && altMatch[1].trim()) {
          const altText = altMatch[1].trim();
          const updatedImg = match.replace(/(<img[^>]*?)(\s*>)/i, `$1 aria-label="${altText}"$2`);
          console.log(chalk.yellow(`  🏷️ Added aria-label="${altText}" to image element`));
          changes++;
          return updatedImg;
        }
        
        return match;
      }
    );
    
    // Fix buttons without aria-label but with text content
    fixed = fixed.replace(
      /<button([^>]*>)(.*?)<\/button>/gi,
      (match, attributes, content) => {
        // Skip if aria-label already exists
        if (/aria-label\s*=/i.test(attributes)) {
          return match;
        }
        
        // Extract text content for aria-label
        const textContent = content.replace(/<[^>]*>/g, '').trim();
        if (textContent) {
          const updatedButton = match.replace(/(<button[^>]*?)(\s*>)/i, `$1 aria-label="${textContent}"$2`);
          console.log(chalk.yellow(`  🏷️ Added aria-label="${textContent}" to button element`));
          changes++;
          return updatedButton;
        }
        
        return match;
      }
    );
    
    // Fix links without aria-label but with text content
    fixed = fixed.replace(
      /<a([^>]*href[^>]*>)(.*?)<\/a>/gi,
      (match, attributes, content) => {
        // Skip if aria-label already exists
        if (/aria-label\s*=/i.test(attributes)) {
          return match;
        }
        
        // Skip if it's just text content (not generic)
        const textContent = content.replace(/<[^>]*>/g, '').trim();
        const genericTexts = ['link', 'click here', 'read more', 'more info', 'here', 'this'];
        
        if (textContent && genericTexts.some(generic => 
          textContent.toLowerCase().includes(generic.toLowerCase()))) {
          // Extract meaningful context or use href for generic links
          const hrefMatch = attributes.match(/href\s*=\s*["']([^"']*)["']/i);
          if (hrefMatch && hrefMatch[1]) {
            const href = hrefMatch[1];
            let ariaLabel = textContent;
            
            // Improve generic link text
            if (href.includes('mailto:')) {
              ariaLabel = `Email: ${href.replace('mailto:', '')}`;
            } else if (href.includes('tel:')) {
              ariaLabel = `Phone: ${href.replace('tel:', '')}`;
            } else if (href.startsWith('http')) {
              const domain = new URL(href).hostname;
              ariaLabel = `Link to ${domain}`;
            }
            
            const updatedLink = match.replace(/(<a[^>]*?)(\s*>)/i, `$1 aria-label="${ariaLabel}"$2`);
            console.log(chalk.yellow(`  🏷️ Added aria-label="${ariaLabel}" to link element`));
            changes++;
            return updatedLink;
          }
        }
        
        return match;
      }
    );
    
    return { content: fixed, changes };
  }

  async addMainLandmarks(directory = '.') {
    console.log(chalk.yellow('🏗️ Main landmark detection (manual review required)...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const suggestions = [];
    
    for (const file of htmlFiles) {
      const content = await fs.readFile(file, 'utf8');
      
      if (!content.includes('<main')) {
        const mainCandidates = this.findMainContentCandidates(content);
        suggestions.push({
          file,
          candidates: mainCandidates,
          recommendation: 'Add <main> element around primary content'
        });
      }
    }
    
    return suggestions;
  }

  fixLangAttribute(content) {
    const langValue = this.config.language;
    
    return content
      .replace(/<html class="no-js" lang="">/g, `<html class="no-js" lang="${langValue}">`)
      .replace(/<html class="no-js">/g, `<html class="no-js" lang="${langValue}">`)
      .replace(/<html lang="">/g, `<html lang="${langValue}">`)
      .replace(/<html>/g, `<html lang="${langValue}">`);
  }

  fixAltAttributes(content) {
    let fixed = content;
    let changesMade = false;
    
    // Find all img tags and process them
    const imgRegex = /<img[^>]*>/gi;
    const imgTags = content.match(imgRegex) || [];
    
    for (let i = 0; i < imgTags.length; i++) {
      const imgTag = imgTags[i];
      let newImgTag = imgTag;
      
      // Check if img has alt attribute
      const hasAlt = /alt\s*=/i.test(imgTag);
      const hasEmptyAlt = /alt\s*=\s*[""'']\s*[""'']/i.test(imgTag);
      
      if (!hasAlt) {
        // Add alt attribute if missing - use contextual analysis
        const altText = this.generateAltText(imgTag, content, i);
        newImgTag = imgTag.replace(/(<img[^>]*)(>)/i, `$1 alt="${altText}"$2`);
        changesMade = true;
        console.log(chalk.yellow(`  ⚠️  Added missing alt attribute: ${imgTag.substring(0, 50)}...`));
        console.log(chalk.green(`      → "${altText}"`));
      } else if (hasEmptyAlt) {
        // Fix empty alt attributes based on context
        const altText = this.generateAltText(imgTag, content, i);
        newImgTag = imgTag.replace(/alt\s*=\s*[""''][""'']/i, `alt="${altText}"`);
        changesMade = true;
        console.log(chalk.yellow(`  ✏️  Fixed empty alt attribute: ${imgTag.substring(0, 50)}...`));
        console.log(chalk.green(`      → "${altText}"`));
      }
      
      if (newImgTag !== imgTag) {
        fixed = fixed.replace(imgTag, newImgTag);
      }
    }
    
    return fixed;
  }

  generateAltText(imgTag, htmlContent = '', imgIndex = 0) {
    // Use enhanced alt generator if enabled
    if (this.config.enhancedAltMode) {
      try {
        const analysis = this.enhancedAltChecker.analyzeImageContext(imgTag, htmlContent, imgIndex);
        const enhancedAlt = this.enhancedAltGenerator.generateDiverseAltText(imgTag, htmlContent, analysis);
        
        if (enhancedAlt && enhancedAlt.trim().length > 0) {
          return enhancedAlt;
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️ Enhanced alt generation failed, falling back to basic mode: ${error.message}`));
      }
    }
    
    // Fallback to original method
    const src = imgTag.match(/src\s*=\s*["']([^"']+)["']/i);
    const srcValue = src ? src[1].toLowerCase() : '';
    
    // Try to find contextual text around the image
    const contextualText = this.findContextualText(imgTag, htmlContent, imgIndex);
    if (contextualText) {
      return contextualText;
    }
    
    // Generate appropriate alt text based on image source
    if (srcValue.includes('logo')) {
      return 'ロゴ';
    } else if (srcValue.includes('icon')) {
      return 'アイコン';
    } else if (srcValue.includes('banner')) {
      return 'バナー';
    } else if (srcValue.includes('button')) {
      return 'ボタン';
    } else if (srcValue.includes('arrow')) {
      return '矢印';
    } else if (srcValue.includes('calendar')) {
      return 'カレンダー';
    } else if (srcValue.includes('video')) {
      return 'ビデオ';
    } else if (srcValue.includes('chart') || srcValue.includes('graph')) {
      return 'グラフ';
    } else if (srcValue.includes('photo') || srcValue.includes('img')) {
      return '写真';
    } else {
      return '画像';
    }
  }

  findContextualText(imgTag, htmlContent, imgIndex) {
    if (!htmlContent) return null;
    
    // Find the position of this specific img tag in the content
    const imgPosition = this.findImgPosition(imgTag, htmlContent, imgIndex);
    if (imgPosition === -1) return null;
    
    // Extract surrounding context (500 chars before and after)
    const contextStart = Math.max(0, imgPosition - 500);
    const contextEnd = Math.min(htmlContent.length, imgPosition + imgTag.length + 500);
    const context = htmlContent.substring(contextStart, contextEnd);
    
    // Try different strategies to find relevant text
    const strategies = [
      () => this.findTitleAttribute(imgTag),
      () => this.findDtText(context, imgTag),
      () => this.findParentLinkText(context, imgTag),
      () => this.findNearbyHeadings(context, imgTag),
      () => this.findFigcaptionText(context, imgTag),
      () => this.findNearbyText(context, imgTag),
      () => this.findAriaLabel(imgTag)
    ];
    
    for (const strategy of strategies) {
      const result = strategy();
      if (result && result.trim().length > 0 && result.trim().length <= 100) {
        return this.cleanText(result);
      }
    }
    
    return null;
  }

  findImgPosition(imgTag, htmlContent, imgIndex) {
    const imgRegex = /<img[^>]*>/gi;
    let match;
    let currentIndex = 0;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      if (currentIndex === imgIndex) {
        return match.index;
      }
      currentIndex++;
    }
    
    return -1;
  }

  findTitleAttribute(imgTag) {
    const titleMatch = imgTag.match(/title\s*=\s*["']([^"']+)["']/i);
    return titleMatch ? titleMatch[1] : null;
  }

  findAriaLabel(imgTag) {
    const ariaMatch = imgTag.match(/aria-label\s*=\s*["']([^"']+)["']/i);
    return ariaMatch ? ariaMatch[1] : null;
  }

  findDtText(context, imgTag) {
    // Look for dt (definition term) elements near the image
    const imgPos = context.indexOf(imgTag.substring(0, 50));
    if (imgPos === -1) return null;
    
    // Get surrounding context (larger range for dt detection)
    const contextStart = Math.max(0, imgPos - 800);
    const contextEnd = Math.min(context.length, imgPos + imgTag.length + 800);
    const surroundingContext = context.substring(contextStart, contextEnd);
    
    // Look for dt elements in various container patterns
    const dtPatterns = [
      // Pattern 1: dt inside dl near image
      /<dl[^>]*>[\s\S]*?<dt[^>]*>([^<]+)<\/dt>[\s\S]*?<\/dl>/gi,
      // Pattern 2: dt in definition list with dd containing image
      /<dt[^>]*>([^<]+)<\/dt>[\s\S]*?<dd[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/dd>/gi,
      // Pattern 3: dt followed by content containing image
      /<dt[^>]*>([^<]+)<\/dt>[\s\S]{0,500}?<img[^>]*>/gi,
      // Pattern 4: Simple dt near image
      /<dt[^>]*>([^<]+)<\/dt>/gi
    ];
    
    for (const pattern of dtPatterns) {
      const matches = [...surroundingContext.matchAll(pattern)];
      
      for (const match of matches) {
        // Check if this dt is related to our image
        if (this.isRelatedToImage(match[0], imgTag, surroundingContext)) {
          const dtText = match[1].trim();
          if (dtText && dtText.length > 0 && dtText.length <= 100) {
            console.log(chalk.blue(`    📅 Found dt text: "${dtText}"`));
            return dtText;
          }
        }
      }
    }
    
    return null;
  }

  isRelatedToImage(dtBlock, imgTag, context) {
    // Check if the dt block contains or is near the image
    const dtPos = context.indexOf(dtBlock);
    const imgPos = context.indexOf(imgTag.substring(0, 50));
    
    if (dtPos === -1 || imgPos === -1) return false;
    
    // If image is within the dt block
    if (dtBlock.includes(imgTag.substring(0, 50))) {
      return true;
    }
    
    // If dt and image are close to each other (within 600 characters)
    const distance = Math.abs(dtPos - imgPos);
    return distance <= 600;
  }

  findParentLinkText(context, imgTag) {
    // Find if image is inside a link and get link text
    const linkPattern = /<a[^>]*>([^<]*<img[^>]*>[^<]*)<\/a>/gi;
    const matches = context.match(linkPattern);
    
    if (matches) {
      for (const match of matches) {
        if (match.includes(imgTag.substring(0, 50))) {
          // Extract text content from the link
          const textMatch = match.match(/>([^<]+)</g);
          if (textMatch) {
            const linkText = textMatch
              .map(t => t.replace(/[><]/g, '').trim())
              .filter(t => t.length > 0 && !t.includes('img'))
              .join(' ');
            if (linkText) return linkText;
          }
        }
      }
    }
    
    return null;
  }

  findNearbyHeadings(context, imgTag) {
    // Look for headings (h1-h6) near the image
    const headingPattern = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
    const headings = [];
    let match;
    
    while ((match = headingPattern.exec(context)) !== null) {
      headings.push({
        text: match[1].trim(),
        position: match.index
      });
    }
    
    if (headings.length > 0) {
      // Find the closest heading
      const imgPos = context.indexOf(imgTag.substring(0, 50));
      let closest = headings[0];
      let minDistance = Math.abs(closest.position - imgPos);
      
      for (const heading of headings) {
        const distance = Math.abs(heading.position - imgPos);
        if (distance < minDistance) {
          closest = heading;
          minDistance = distance;
        }
      }
      
      return closest.text;
    }
    
    return null;
  }

  findFigcaptionText(context, imgTag) {
    // Look for figcaption associated with the image
    const figurePattern = /<figure[^>]*>[\s\S]*?<figcaption[^>]*>([^<]+)<\/figcaption>[\s\S]*?<\/figure>/gi;
    const matches = context.match(figurePattern);
    
    if (matches) {
      for (const match of matches) {
        if (match.includes(imgTag.substring(0, 50))) {
          const captionMatch = match.match(/<figcaption[^>]*>([^<]+)<\/figcaption>/i);
          if (captionMatch) {
            return captionMatch[1].trim();
          }
        }
      }
    }
    
    return null;
  }

  findNearbyText(context, imgTag) {
    // Look for text in nearby elements (p, div, span)
    const imgPos = context.indexOf(imgTag.substring(0, 50));
    if (imgPos === -1) return null;
    
    // Get text before and after the image
    const beforeText = context.substring(Math.max(0, imgPos - 200), imgPos);
    const afterText = context.substring(imgPos + imgTag.length, imgPos + imgTag.length + 200);
    
    // Extract meaningful text from nearby elements
    const textPattern = /<(?:p|div|span|h[1-6])[^>]*>([^<]+)<\/(?:p|div|span|h[1-6])>/gi;
    const texts = [];
    
    let match;
    while ((match = textPattern.exec(beforeText + afterText)) !== null) {
      const text = match[1].trim();
      if (text.length > 5 && text.length <= 50) {
        texts.push(text);
      }
    }
    
    // Return the most relevant text (shortest meaningful one)
    if (texts.length > 0) {
      return texts.sort((a, b) => a.length - b.length)[0];
    }
    
    return null;
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')
      .trim()
      .substring(0, 100);
  }

  analyzeRoleAttributes(content) {
    const issues = [];
    
    // Define elements that should have specific roles
    const roleRules = [
      {
        selector: /<button[^>]*>/gi,
        expectedRole: 'button',
        description: 'Button element should have role="button" or be implicit'
      },
      {
        selector: /<a[^>]*href[^>]*>/gi,
        expectedRole: 'link',
        description: 'Link element should have role="link" or be implicit'
      },
      {
        selector: /<img[^>]*>/gi,
        expectedRole: 'img',
        description: 'Image element should have role="img" or be implicit'
      },
      {
        selector: /<ul[^>]*>/gi,
        expectedRole: 'list',
        description: 'Unordered list should have role="list"'
      },
      {
        selector: /<ol[^>]*>/gi,
        expectedRole: 'list',
        description: 'Ordered list should have role="list"'
      },
      {
        selector: /<li[^>]*>/gi,
        expectedRole: 'listitem',
        description: 'List item should have role="listitem"'
      },
      {
        selector: /<nav[^>]*>/gi,
        expectedRole: 'navigation',
        description: 'Navigation element should have role="navigation"'
      },
      {
        selector: /<main[^>]*>/gi,
        expectedRole: 'main',
        description: 'Main element should have role="main"'
      },
      {
        selector: /<header[^>]*>/gi,
        expectedRole: 'banner',
        description: 'Header element should have role="banner"'
      },
      {
        selector: /<footer[^>]*>/gi,
        expectedRole: 'contentinfo',
        description: 'Footer element should have role="contentinfo"'
      }
    ];
    
    // Check for images that need role="img" and aria-label
    const images = content.match(/<img[^>]*>/gi) || [];
    images.forEach((img, index) => {
      if (!img.includes('role=')) {
        issues.push({
          type: '🖼️ Missing role',
          description: `Image ${index + 1} should have role="img"`,
          element: img.substring(0, 100) + '...'
        });
      }
      
      // Check for missing aria-label when alt exists
      const hasAriaLabel = /aria-label\s*=/i.test(img);
      const altMatch = img.match(/alt\s*=\s*["']([^"']*)["']/i);
      
      if (!hasAriaLabel && altMatch && altMatch[1].trim()) {
        issues.push({
          type: '🏷️ Missing aria-label',
          description: `Image ${index + 1} should have aria-label matching alt text`,
          element: img.substring(0, 100) + '...'
        });
      }
    });
    
    // Check for button elements with onclick that need role
    const buttonsWithOnclick = content.match(/<button[^>]*onclick[^>]*>/gi) || [];
    buttonsWithOnclick.forEach((button, index) => {
      if (!button.includes('role=')) {
        issues.push({
          type: '🔘 Missing role',
          description: `Button ${index + 1} with onclick should have role="button"`,
          element: button.substring(0, 100) + '...'
        });
      }
    });
    
    // Check for anchor elements that need role
    const anchors = content.match(/<a[^>]*href[^>]*>/gi) || [];
    anchors.forEach((anchor, index) => {
      if (!anchor.includes('role=')) {
        issues.push({
          type: '🔗 Missing role',
          description: `Anchor ${index + 1} should have role="link"`,
          element: anchor.substring(0, 100) + '...'
        });
      }
    });
    
    // Check for any element with onclick that needs role
    const elementsWithOnclick = content.match(/<(?!a|button)[a-zA-Z][a-zA-Z0-9]*[^>]*onclick[^>]*>/gi) || [];
    elementsWithOnclick.forEach((element, index) => {
      if (!element.includes('role=')) {
        const tagMatch = element.match(/<([a-zA-Z][a-zA-Z0-9]*)/);
        const tagName = tagMatch ? tagMatch[1] : 'element';
        issues.push({
          type: '🔘 Missing role',
          description: `${tagName} ${index + 1} with onclick should have role="button"`,
          element: element.substring(0, 100) + '...'
        });
      }
    });
    
    // Check for clickable divs that should have button role
    const clickableDivs = content.match(/<div[^>]*(?:onclick|class="[^"]*(?:btn|button|click)[^"]*")[^>]*>/gi) || [];
    clickableDivs.forEach((div, index) => {
      if (!div.includes('role=')) {
        issues.push({
          type: '🔘 Missing role',
          description: `Clickable div ${index + 1} should have role="button"`,
          element: div.substring(0, 100) + '...'
        });
      }
    });
    
    // Check for elements with tabindex that might need roles
    const tabindexElements = content.match(/<(?!a|button|input|select|textarea)[^>]*tabindex\s*=\s*[""']?[0-9-]+[""']?[^>]*>/gi) || [];
    tabindexElements.forEach((element, index) => {
      if (!element.includes('role=')) {
        issues.push({
          type: '⌨️ Missing role',
          description: `Focusable element ${index + 1} should have appropriate role`,
          element: element.substring(0, 100) + '...'
        });
      }
    });
    
    // Check for picture elements with role="img" that contain img elements
    const pictureWithImgPattern = /<picture[^>]*role\s*=\s*["']img["'][^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/picture>/gi;
    const pictureWithImgMatches = content.match(pictureWithImgPattern) || [];
    pictureWithImgMatches.forEach((pictureBlock, index) => {
      const imgInPicture = pictureBlock.match(/<img[^>]*>/i);
      if (imgInPicture && !/role\s*=/i.test(imgInPicture[0])) {
        issues.push({
          type: '🖼️ Role placement',
          description: `Picture ${index + 1} has role="img" but should be on the img element inside`,
          element: pictureBlock.substring(0, 100) + '...'
        });
      }
    });
    
    return issues;
  }

  fixPictureImgRoles(content) {
    let fixed = content;
    
    // Find all picture elements that contain img elements
    const picturePattern = /<picture[^>]*role\s*=\s*["']img["'][^>]*>[\s\S]*?<\/picture>/gi;
    const pictureMatches = content.match(picturePattern) || [];
    
    for (const pictureBlock of pictureMatches) {
      // Check if this picture contains an img element
      const imgInPicture = pictureBlock.match(/<img[^>]*>/i);
      
      if (imgInPicture) {
        const imgTag = imgInPicture[0];
        
        // Check if img already has role attribute
        const imgHasRole = /role\s*=/i.test(imgTag);
        
        if (!imgHasRole) {
          // Remove role="img" from picture element
          const pictureWithoutRole = pictureBlock.replace(/\s*role\s*=\s*["']img["']/i, '');
          
          // Add role="img" to img element
          let imgWithRole = imgTag.replace(/(<img[^>]*?)(\s*>)/i, '$1 role="img"$2');
          
          // Also add aria-label if img has alt but no aria-label
          const imgHasAriaLabel = /aria-label\s*=/i.test(imgWithRole);
          const altMatch = imgWithRole.match(/alt\s*=\s*["']([^"']*)["']/i);
          
          if (!imgHasAriaLabel && altMatch && altMatch[1].trim()) {
            const altText = altMatch[1].trim();
            imgWithRole = imgWithRole.replace(/(<img[^>]*?)(\s*>)/i, `$1 aria-label="${altText}"$2`);
            console.log(chalk.yellow(`  🏷️ Added aria-label="${altText}" to moved img element`));
          }
          
          // Replace the img in the modified picture block
          const updatedPictureBlock = pictureWithoutRole.replace(imgTag, imgWithRole);
          
          // Replace in the main content
          fixed = fixed.replace(pictureBlock, updatedPictureBlock);
          
          console.log(chalk.yellow(`  🖼️ Moved role="img" from <picture> to <img> element`));
        }
      }
    }
    
    return fixed;
  }

  fixRoleAttributesInContent(content) {
    let fixed = content;
    
    // Fix picture elements with img children - move role from picture to img
    fixed = this.fixPictureImgRoles(fixed);
    
    // Fix all images - add role="img" only
    fixed = fixed.replace(
      /<img([^>]*>)/gi,
      (match) => {
        // Check if role attribute already exists
        if (!/role\s*=/i.test(match)) {
          const updatedImg = match.replace(/(<img[^>]*?)(\s*>)/i, '$1 role="img"$2');
          console.log(chalk.yellow(`  🖼️ Added role="img" to image element`));
          return updatedImg;
        }
        
        return match;
      }
    );
    
    // Fix button elements with onclick - add role="button"
    fixed = fixed.replace(
      /<button([^>]*onclick[^>]*>)/gi,
      (match) => {
        // Check if role attribute already exists
        if (/role\s*=/i.test(match)) {
          return match; // Return unchanged if role already exists
        }
        console.log(chalk.yellow(`  🔘 Added role="button" to button with onclick`));
        return match.replace(/(<button[^>]*?)(\s*>)/i, '$1 role="button"$2');
      }
    );
    
    // Fix anchor elements - add role="link"
    fixed = fixed.replace(
      /<a([^>]*href[^>]*>)/gi,
      (match) => {
        // Check if role attribute already exists
        if (/role\s*=/i.test(match)) {
          return match; // Return unchanged if role already exists
        }
        console.log(chalk.yellow(`  🔗 Added role="link" to anchor element`));
        return match.replace(/(<a[^>]*?)(\s*>)/i, '$1 role="link"$2');
      }
    );
    
    // Fix any element with onclick (except a and button) - add role="button"
    fixed = fixed.replace(
      /<((?!a|button)[a-zA-Z][a-zA-Z0-9]*)([^>]*onclick[^>]*>)/gi,
      (match, tag) => {
        // Check if role attribute already exists
        if (/role\s*=/i.test(match)) {
          return match; // Return unchanged if role already exists
        }
        console.log(chalk.yellow(`  🔘 Added role="button" to ${tag} with onclick`));
        return match.replace(/(<[^>]*?)(\s*>)/i, '$1 role="button"$2');
      }
    );
    
    // Fix clickable divs - add role="button"
    fixed = fixed.replace(
      /<div([^>]*class="[^"]*(?:btn|button|click)[^"]*"[^>]*>)/gi,
      (match) => {
        // Check if role attribute already exists
        if (/role\s*=/i.test(match)) {
          return match; // Return unchanged if role already exists
        }
        console.log(chalk.yellow(`  🔘 Added role="button" to clickable div`));
        return match.replace(/(<div[^>]*?)(\s*>)/i, '$1 role="button"$2');
      }
    );
    
    // Fix focusable elements with tabindex
    fixed = fixed.replace(
      /<(div|span)([^>]*tabindex\s*=\s*[""']?[0-9-]+[""']?[^>]*>)/gi,
      (match, tag) => {
        // Check if role attribute already exists
        if (/role\s*=/i.test(match)) {
          return match; // Return unchanged if role already exists
        }
        console.log(chalk.yellow(`  ⌨️ Added role="button" to focusable ${tag}`));
        return match.replace(/(<[^>]*?)(\s*>)/i, '$1 role="button"$2');
      }
    );
    
    // Fix navigation lists that should be menus
    fixed = fixed.replace(
      /<ul([^>]*class="[^"]*(?:nav|menu)[^"]*"[^>]*>)/gi,
      (match) => {
        // Check if role attribute already exists
        if (/role\s*=/i.test(match)) {
          return match; // Return unchanged if role already exists
        }
        console.log(chalk.yellow(`  📋 Added role="menubar" to navigation list`));
        return match.replace(/(<ul[^>]*?)(\s*>)/i, '$1 role="menubar"$2');
      }
    );
    
    // Fix list items in navigation menus
    fixed = fixed.replace(
      /<li([^>]*class="[^"]*(?:nav|menu)[^"]*"[^>]*>)/gi,
      (match) => {
        // Check if role attribute already exists
        if (/role\s*=/i.test(match)) {
          return match; // Return unchanged if role already exists
        }
        console.log(chalk.yellow(`  📋 Added role="menuitem" to navigation list item`));
        return match.replace(/(<li[^>]*?)(\s*>)/i, '$1 role="menuitem"$2');
      }
    );
    
    return fixed;
  }

  findMainContentCandidates(content) {
    const candidates = [];
    
    // Look for common main content patterns
    const patterns = [
      /<div[^>]*class="[^"]*main[^"]*"/gi,
      /<div[^>]*class="[^"]*content[^"]*"/gi,
      /<section[^>]*class="[^"]*main[^"]*"/gi,
      /<article/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        candidates.push(...matches);
      }
    });
    
    return candidates;
  }

  async cleanupDuplicateRoles(directory = '.') {
    console.log(chalk.blue('🧹 Cleaning up duplicate role attributes...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalFixedFiles = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fixed = this.cleanupDuplicateRolesInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Cleaned duplicate roles in: ${file}`));
          results.push({ file, status: 'fixed' });
          totalFixedFiles++;
        } else {
          results.push({ file, status: 'no-change' });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Cleaned duplicate roles in ${totalFixedFiles} files`));
    return results;
  }

  cleanupDuplicateRolesInContent(content) {
    let fixed = content;
    let changesMade = false;
    
    // Pattern to match duplicate role attributes
    // Matches: role="value" role="value" or role="value" role="value" role="value" etc.
    const duplicateRolePattern = /(\s+role\s*=\s*["']([^"']+)["'])(\s+role\s*=\s*["']\2["'])+/gi;
    
    fixed = fixed.replace(duplicateRolePattern, (match, firstRole, roleValue) => {
      changesMade = true;
      console.log(chalk.yellow(`  🧹 Removed duplicate role="${roleValue}" attributes`));
      return firstRole; // Keep only the first occurrence
    });
    
    // Also handle cases where roles have different quotes but same value
    // e.g., role="button" role='button'
    const mixedQuotePattern = /(\s+role\s*=\s*["']([^"']+)["'])(\s+role\s*=\s*['"]?\2['"]?)+/gi;
    
    fixed = fixed.replace(mixedQuotePattern, (match, firstRole, roleValue) => {
      if (!changesMade) { // Only log if not already logged above
        changesMade = true;
        console.log(chalk.yellow(`  🧹 Removed duplicate role="${roleValue}" attributes (mixed quotes)`));
      }
      return firstRole;
    });
    
    return fixed;
  }

  async fixAllAccessibilityIssues(directory = '.') {
    console.log(chalk.blue('🚀 Starting comprehensive accessibility fixes...'));
    
    const results = {
      lang: [],
      alt: [],
      roles: [],
      cleanup: [],
      forms: [],
      buttons: [],
      links: [],
      landmarks: [],
      headings: [], // Analysis only
      brokenLinks: [] // Analysis only
    };
    
    try {
      // Step 1: Fix lang attributes
      console.log(chalk.yellow('\n📝 Step 1: HTML lang attributes...'));
      results.lang = await this.fixHtmlLang(directory);
      
      // Step 2: Fix alt attributes
      console.log(chalk.yellow('\n🖼️ Step 2: Alt attributes...'));
      results.alt = await this.fixEmptyAltAttributes(directory);
      
      // Step 3: Fix role attributes
      console.log(chalk.yellow('\n🎭 Step 3: Role attributes...'));
      results.roles = await this.fixRoleAttributes(directory);
      
      // Step 4: Fix form labels
      console.log(chalk.yellow('\n📋 Step 4: Form labels...'));
      results.forms = await this.fixFormLabels(directory);
      
      // Step 5: Fix button names
      console.log(chalk.yellow('\n🔘 Step 5: Button names...'));
      results.buttons = await this.fixButtonNames(directory);
      
      // Step 6: Fix link names
      console.log(chalk.yellow('\n🔗 Step 6: Link names...'));
      results.links = await this.fixLinkNames(directory);
      
      // Step 7: Fix landmarks
      console.log(chalk.yellow('\n🏛️ Step 7: Landmarks...'));
      results.landmarks = await this.fixLandmarks(directory);
      
      // Step 8: Analyze headings (no auto-fix)
      console.log(chalk.yellow('\n📑 Step 8: Heading analysis...'));
      results.headings = await this.analyzeHeadings(directory);
      
      // Step 9: Check broken links and missing resources (no auto-fix)
      console.log(chalk.yellow('\n🔗 Step 9: External links check...'));
      results.brokenLinks = await this.checkBrokenLinks(directory);
      
      console.log(chalk.yellow('\n📁 Step 9b: Missing resources check...'));
      results.missingResources = await this.check404Resources(directory);
      
      // Step 10: Cleanup duplicate roles
      console.log(chalk.yellow('\n🧹 Step 10: Cleanup duplicate roles...'));
      results.cleanup = await this.cleanupDuplicateRoles(directory);
      
      // Summary
      const totalFiles = new Set([
        ...results.lang.map(r => r.file),
        ...results.alt.map(r => r.file),
        ...results.roles.map(r => r.file),
        ...results.forms.map(r => r.file),
        ...results.buttons.map(r => r.file),
        ...results.links.map(r => r.file),
        ...results.landmarks.map(r => r.file),
        ...results.cleanup.map(r => r.file)
      ]).size;
      
      const totalFixed = new Set([
        ...results.lang.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.alt.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.roles.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.forms.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.buttons.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.links.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.landmarks.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.cleanup.filter(r => r.status === 'fixed').map(r => r.file)
      ]).size;
      
      const totalIssues = 
        results.lang.filter(r => r.status === 'fixed').length +
        results.alt.reduce((sum, r) => sum + (r.issues || 0), 0) +
        results.roles.reduce((sum, r) => sum + (r.issues || 0), 0) +
        results.forms.reduce((sum, r) => sum + (r.issues || 0), 0) +
        results.buttons.reduce((sum, r) => sum + (r.issues || 0), 0) +
        results.links.reduce((sum, r) => sum + (r.issues || 0), 0) +
        results.landmarks.reduce((sum, r) => sum + (r.issues || 0), 0) +
        results.cleanup.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green('\n🎉 All accessibility fixes completed!'));
      console.log(chalk.blue('📊 Final Summary:'));
      console.log(chalk.white(`   Total files scanned: ${totalFiles}`));
      console.log(chalk.green(`   Files fixed: ${totalFixed}`));
      console.log(chalk.yellow(`   Total issues resolved: ${totalIssues}`));
      
      if (this.config.dryRun) {
        console.log(chalk.cyan('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
      }
      
      return results;
      
    } catch (error) {
      console.error(chalk.red('❌ Error during comprehensive fix:'), error.message);
      throw error;
    }
  }

  // Fix form labels
  async fixFormLabels(directory = '.') {
    console.log(chalk.blue('📋 Fixing form labels...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeFormLabels(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixFormLabelsInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed form labels in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} form label issues across ${results.length} files`));
    return results;
  }

  analyzeFormLabels(content) {
    const issues = [];
    
    // Find input elements without labels
    const inputPattern = /<input[^>]*>/gi;
    const inputs = content.match(inputPattern) || [];
    
    inputs.forEach((input, index) => {
      const hasId = /id\s*=\s*["']([^"']+)["']/i.test(input);
      const hasAriaLabel = /aria-label\s*=/i.test(input);
      const hasAriaLabelledby = /aria-labelledby\s*=/i.test(input);
      const inputType = input.match(/type\s*=\s*["']([^"']+)["']/i);
      const type = inputType ? inputType[1].toLowerCase() : 'text';
      
      // Skip certain input types that don't need labels
      if (['hidden', 'submit', 'button', 'reset'].includes(type)) {
        return;
      }
      
      if (hasId) {
        const idMatch = input.match(/id\s*=\s*["']([^"']+)["']/i);
        const id = idMatch[1];
        const labelPattern = new RegExp(`<label[^>]*for\\s*=\\s*["']${id}["'][^>]*>`, 'i');
        const hasLabel = labelPattern.test(content);
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
          issues.push({
            type: '📋 Missing label',
            description: `Input ${index + 1} (type: ${type}) needs a label or aria-label`,
            element: input.substring(0, 100) + '...'
          });
        }
      } else if (!hasAriaLabel && !hasAriaLabelledby) {
        issues.push({
          type: '📋 Missing label/id',
          description: `Input ${index + 1} (type: ${type}) needs an id and label, or aria-label`,
          element: input.substring(0, 100) + '...'
        });
      }
    });
    
    return issues;
  }

  fixFormLabelsInContent(content) {
    let fixed = content;
    
    // Add aria-label to inputs without labels (basic fix)
    const inputPattern = /<input([^>]*type\s*=\s*["']([^"']+)["'][^>]*)>/gi;
    
    fixed = fixed.replace(inputPattern, (match, attributes, type) => {
      const lowerType = type.toLowerCase();
      
      // Skip certain input types
      if (['hidden', 'submit', 'button', 'reset'].includes(lowerType)) {
        return match;
      }
      
      const hasAriaLabel = /aria-label\s*=/i.test(match);
      const hasAriaLabelledby = /aria-labelledby\s*=/i.test(match);
      const hasId = /id\s*=\s*["']([^"']+)["']/i.test(match);
      
      if (!hasAriaLabel && !hasAriaLabelledby) {
        // Check if there's a corresponding label
        if (hasId) {
          const idMatch = match.match(/id\s*=\s*["']([^"']+)["']/i);
          const id = idMatch[1];
          const labelPattern = new RegExp(`<label[^>]*for\\s*=\\s*["']${id}["'][^>]*>`, 'i');
          
          if (!labelPattern.test(content)) {
            // Add basic aria-label
            const labelText = this.generateInputLabel(lowerType);
            console.log(chalk.yellow(`  📋 Added aria-label="${labelText}" to ${lowerType} input`));
            return match.replace(/(<input[^>]*?)(\s*>)/i, `$1 aria-label="${labelText}"$2`);
          }
        } else {
          // Add basic aria-label
          const labelText = this.generateInputLabel(lowerType);
          console.log(chalk.yellow(`  📋 Added aria-label="${labelText}" to ${lowerType} input`));
          return match.replace(/(<input[^>]*?)(\s*>)/i, `$1 aria-label="${labelText}"$2`);
        }
      }
      
      return match;
    });
    
    return fixed;
  }

  generateInputLabel(type) {
    const labels = {
      'text': 'テキスト入力',
      'email': 'メールアドレス',
      'password': 'パスワード',
      'tel': '電話番号',
      'url': 'URL',
      'search': '検索',
      'number': '数値',
      'date': '日付',
      'time': '時間',
      'checkbox': 'チェックボックス',
      'radio': 'ラジオボタン',
      'file': 'ファイル選択'
    };
    
    return labels[type] || 'フォーム入力';
  }

  // Fix button names
  async fixButtonNames(directory = '.') {
    console.log(chalk.blue('🔘 Fixing button names...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeButtonNames(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixButtonNamesInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed button names in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} button name issues across ${results.length} files`));
    return results;
  }

  analyzeButtonNames(content) {
    const issues = [];
    
    // Find buttons without discernible text
    const buttonPattern = /<button[^>]*>[\s\S]*?<\/button>/gi;
    const buttons = content.match(buttonPattern) || [];
    
    buttons.forEach((button, index) => {
      const hasAriaLabel = /aria-label\s*=/i.test(button);
      const hasAriaLabelledby = /aria-labelledby\s*=/i.test(button);
      const hasTitle = /title\s*=/i.test(button);
      
      // Extract text content
      const textContent = button.replace(/<[^>]*>/g, '').trim();
      
      if (!textContent && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        issues.push({
          type: '🔘 Empty button',
          description: `Button ${index + 1} has no discernible text`,
          element: button.substring(0, 100) + '...'
        });
      }
    });
    
    // Find input buttons without names
    const inputButtonPattern = /<input[^>]*type\s*=\s*["'](button|submit|reset)["'][^>]*>/gi;
    const inputButtons = content.match(inputButtonPattern) || [];
    
    inputButtons.forEach((input, index) => {
      const hasValue = /value\s*=/i.test(input);
      const hasAriaLabel = /aria-label\s*=/i.test(input);
      const hasTitle = /title\s*=/i.test(input);
      
      if (!hasValue && !hasAriaLabel && !hasTitle) {
        issues.push({
          type: '🔘 Input button without name',
          description: `Input button ${index + 1} needs value, aria-label, or title`,
          element: input.substring(0, 100) + '...'
        });
      }
    });
    
    return issues;
  }

  fixButtonNamesInContent(content) {
    let fixed = content;
    
    // Fix empty buttons
    fixed = fixed.replace(/<button([^>]*)>\s*<\/button>/gi, (match, attributes) => {
      const hasAriaLabel = /aria-label\s*=/i.test(match);
      const hasAriaLabelledby = /aria-labelledby\s*=/i.test(match);
      const hasTitle = /title\s*=/i.test(match);
      
      if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        console.log(chalk.yellow(`  🔘 Added aria-label to empty button`));
        return `<button${attributes} aria-label="ボタン">ボタン</button>`;
      }
      
      return match;
    });
    
    // Fix input buttons without value
    fixed = fixed.replace(/<input([^>]*type\s*=\s*["'](button|submit|reset)["'][^>]*)>/gi, (match, attributes, type) => {
      const hasValue = /value\s*=/i.test(match);
      const hasAriaLabel = /aria-label\s*=/i.test(match);
      const hasTitle = /title\s*=/i.test(match);
      
      if (!hasValue && !hasAriaLabel && !hasTitle) {
        const buttonText = type === 'submit' ? '送信' : type === 'reset' ? 'リセット' : 'ボタン';
        console.log(chalk.yellow(`  🔘 Added value="${buttonText}" to input ${type} button`));
        return match.replace(/(<input[^>]*?)(\s*>)/i, `$1 value="${buttonText}"$2`);
      }
      
      return match;
    });
    
    return fixed;
  }

  // Fix link names
  async fixLinkNames(directory = '.') {
    console.log(chalk.blue('🔗 Fixing link names...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeLinkNames(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixLinkNamesInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed link names in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} link name issues across ${results.length} files`));
    return results;
  }

  analyzeLinkNames(content) {
    const issues = [];
    
    // Find links without discernible text
    const linkPattern = /<a[^>]*href[^>]*>[\s\S]*?<\/a>/gi;
    const links = content.match(linkPattern) || [];
    
    links.forEach((link, index) => {
      const hasAriaLabel = /aria-label\s*=/i.test(link);
      const hasAriaLabelledby = /aria-labelledby\s*=/i.test(link);
      const hasTitle = /title\s*=/i.test(link);
      
      // Extract text content (excluding images)
      let textContent = link.replace(/<img[^>]*>/gi, '').replace(/<[^>]*>/g, '').trim();
      
      // Check for image alt text if link contains only images
      if (!textContent) {
        const imgMatch = link.match(/<img[^>]*alt\s*=\s*["']([^"']+)["'][^>]*>/i);
        if (imgMatch) {
          textContent = imgMatch[1].trim();
        }
      }
      
      if (!textContent && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        issues.push({
          type: '🔗 Empty link',
          description: `Link ${index + 1} has no discernible text`,
          element: link.substring(0, 100) + '...'
        });
      } else if (textContent && (textContent.toLowerCase() === 'click here' || textContent.toLowerCase() === 'read more' || textContent.toLowerCase() === 'here')) {
        issues.push({
          type: '🔗 Generic link text',
          description: `Link ${index + 1} has generic text: "${textContent}"`,
          element: link.substring(0, 100) + '...'
        });
      }
    });
    
    return issues;
  }

  fixLinkNamesInContent(content) {
    let fixed = content;
    
    // Fix empty links
    fixed = fixed.replace(/<a([^>]*href[^>]*)>\s*<\/a>/gi, (match, attributes) => {
      const hasAriaLabel = /aria-label\s*=/i.test(match);
      const hasAriaLabelledby = /aria-labelledby\s*=/i.test(match);
      const hasTitle = /title\s*=/i.test(match);
      
      if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        console.log(chalk.yellow(`  🔗 Added aria-label to empty link`));
        return `<a${attributes} aria-label="リンク">リンク</a>`;
      }
      
      return match;
    });
    
    // Fix links with only images but no alt text
    fixed = fixed.replace(/<a([^>]*href[^>]*)>(\s*<img[^>]*>\s*)<\/a>/gi, (match, attributes, imgTag) => {
      const hasAriaLabel = /aria-label\s*=/i.test(match);
      const hasAlt = /alt\s*=/i.test(imgTag);
      
      if (!hasAriaLabel && !hasAlt) {
        console.log(chalk.yellow(`  🔗 Added aria-label to image link`));
        return `<a${attributes} aria-label="画像リンク">${imgTag}</a>`;
      }
      
      return match;
    });
    
    return fixed;
  }

  // Fix landmarks
  async fixLandmarks(directory = '.') {
    console.log(chalk.blue('🏛️ Fixing landmarks...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeLandmarks(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixLandmarksInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed landmarks in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} landmark issues across ${results.length} files`));
    return results;
  }

  analyzeLandmarks(content) {
    const issues = [];
    
    // Check for main landmark
    const hasMain = /<main[^>]*>/i.test(content) || /role\s*=\s*["']main["']/i.test(content);
    if (!hasMain) {
      issues.push({
        type: '🏛️ Missing main landmark',
        description: 'Page should have a main landmark',
        suggestion: 'Add <main> element or role="main"'
      });
    }
    
    // Check for multiple main landmarks
    const mainCount = (content.match(/<main[^>]*>/gi) || []).length + 
                     (content.match(/role\s*=\s*["']main["']/gi) || []).length;
    if (mainCount > 1) {
      issues.push({
        type: '🏛️ Multiple main landmarks',
        description: `Found ${mainCount} main landmarks, should have only one`,
        suggestion: 'Keep only one main landmark per page'
      });
    }
    
    // Check for navigation landmarks
    const hasNav = /<nav[^>]*>/i.test(content) || /role\s*=\s*["']navigation["']/i.test(content);
    if (!hasNav) {
      // Look for navigation-like elements
      const navLikeElements = content.match(/<(?:ul|div)[^>]*class\s*=\s*["'][^"']*(?:nav|menu|navigation)[^"']*["'][^>]*>/gi);
      if (navLikeElements && navLikeElements.length > 0) {
        issues.push({
          type: '🏛️ Missing navigation landmark',
          description: 'Navigation elements should have nav tag or role="navigation"',
          suggestion: 'Use <nav> element or add role="navigation"'
        });
      }
    }
    
    return issues;
  }

  fixLandmarksInContent(content) {
    let fixed = content;
    
    // Add main landmark if missing (basic implementation)
    const hasMain = /<main[^>]*>/i.test(content) || /role\s*=\s*["']main["']/i.test(content);
    
    if (!hasMain) {
      // Look for content containers that could be main
      const contentPatterns = [
        /<div[^>]*class\s*=\s*["'][^"']*(?:content|main|container)[^"']*["'][^>]*>/gi,
        /<section[^>]*class\s*=\s*["'][^"']*(?:content|main)[^"']*["'][^>]*>/gi
      ];
      
      for (const pattern of contentPatterns) {
        const matches = fixed.match(pattern);
        if (matches && matches.length === 1) {
          // Add role="main" to the first suitable container
          fixed = fixed.replace(pattern, (match) => {
            if (!/role\s*=/i.test(match)) {
              console.log(chalk.yellow(`  🏛️ Added role="main" to content container`));
              return match.replace(/(<(?:div|section)[^>]*?)(\s*>)/i, '$1 role="main"$2');
            }
            return match;
          });
          break;
        }
      }
    }
    
    // Add navigation role to nav-like elements
    const navPattern = /<(?:ul|div)([^>]*class\s*=\s*["'][^"']*(?:nav|menu|navigation)[^"']*["'][^>]*)>/gi;
    fixed = fixed.replace(navPattern, (match, attributes) => {
      if (!/role\s*=/i.test(match)) {
        console.log(chalk.yellow(`  🏛️ Added role="navigation" to navigation element`));
        return match.replace(/(<(?:ul|div)[^>]*?)(\s*>)/i, '$1 role="navigation"$2');
      }
      return match;
    });
    
    return fixed;
  }

  // Check for broken external links only
  async checkBrokenLinks(directory = '.') {
    console.log(chalk.blue('🔗 Checking for broken external links...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = await this.analyzeBrokenLinks(content, file, 'external-only');
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            }
          });
        }
        
        results.push({ file, status: 'analyzed', issues: issues.length, brokenLinks: issues });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Analyzed external links in ${results.length} files`));
    console.log(chalk.gray('💡 Broken link issues require manual review and cannot be auto-fixed'));
    return results;
  }

  // Check for 404 resources (local files) only
  async check404Resources(directory = '.') {
    console.log(chalk.blue('📁 Checking for 404 resources (missing local files)...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = await this.analyzeBrokenLinks(content, file, 'local-only');
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            }
          });
        }
        
        results.push({ file, status: 'analyzed', issues: issues.length, missingResources: issues });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Analyzed local resources in ${results.length} files`));
    console.log(chalk.gray('💡 Missing resource issues require manual review and cannot be auto-fixed'));
    return results;
  }

  async analyzeBrokenLinks(content, filePath, mode = 'all') {
    const issues = [];
    const path = require('path');
    const http = require('http');
    const https = require('https');
    const { URL } = require('url');
    
    // Extract all links and resources
    let linkPatterns = [];
    
    if (mode === 'external-only') {
      // Only anchor links for external link checking
      linkPatterns = [
        { pattern: /<a[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Link', element: 'a' }
      ];
    } else if (mode === 'local-only') {
      // Only resources (not anchor links) for 404 resource checking
      linkPatterns = [
        { pattern: /<img[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Image', element: 'img' },
        { pattern: /<link[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'CSS', element: 'link' },
        { pattern: /<script[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Script', element: 'script' },
        { pattern: /<video[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Video', element: 'video' },
        { pattern: /<audio[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Audio', element: 'audio' }
      ];
    } else {
      // All patterns for comprehensive checking
      linkPatterns = [
        { pattern: /<a[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Link', element: 'a' },
        { pattern: /<img[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Image', element: 'img' },
        { pattern: /<link[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'CSS', element: 'link' },
        { pattern: /<script[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Script', element: 'script' },
        { pattern: /<video[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Video', element: 'video' },
        { pattern: /<audio[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'Audio', element: 'audio' }
      ];
    }
    
    const baseDir = path.dirname(filePath);
    
    for (const linkPattern of linkPatterns) {
      let match;
      while ((match = linkPattern.pattern.exec(content)) !== null) {
        const url = match[1];
        const issue = await this.checkSingleLink(url, baseDir, linkPattern.type, linkPattern.element, mode);
        if (issue) {
          issues.push(issue);
        }
      }
    }
    
    return issues;
  }

  async checkSingleLink(url, baseDir, resourceType, elementType, mode = 'all') {
    // Skip certain URLs
    if (this.shouldSkipUrl(url)) {
      return null;
    }
    
    try {
      if (this.isExternalUrl(url)) {
        // Check external URLs only if mode allows
        if (mode === 'local-only') {
          return null; // Skip external URLs in local-only mode
        }
        return await this.checkExternalUrl(url, resourceType, elementType);
      } else {
        // Check local files only if mode allows
        if (mode === 'external-only') {
          return null; // Skip local files in external-only mode
        }
        return await this.checkLocalFile(url, baseDir, resourceType, elementType);
      }
    } catch (error) {
      return {
        type: `🔗 ${resourceType} check error`,
        description: `Failed to check ${elementType}: ${url}`,
        suggestion: `Verify the ${resourceType.toLowerCase()} manually: ${error.message}`,
        url: url,
        resourceType: resourceType
      };
    }
  }

  shouldSkipUrl(url) {
    const skipPatterns = [
      /^#/,                    // Anchor links
      /^mailto:/,              // Email links
      /^tel:/,                 // Phone links
      /^javascript:/,          // JavaScript links
      /^data:/,                // Data URLs
      /^\{\{.*\}\}$/,         // Template variables
      /^\$\{.*\}$/,           // Template literals
      /^<%.*%>$/,             // Template tags
      /^\/\/$/,               // Protocol-relative empty
      /^https?:\/\/localhost/, // Localhost URLs
      /^https?:\/\/127\.0\.0\.1/, // Local IP
      /^https?:\/\/0\.0\.0\.0/    // All interfaces IP
    ];
    
    return skipPatterns.some(pattern => pattern.test(url));
  }

  isExternalUrl(url) {
    return /^https?:\/\//.test(url);
  }

  async checkExternalUrl(url, resourceType, elementType) {
    return new Promise((resolve) => {
      const http = require('http');
      const https = require('https');
      const { URL } = require('url');
      
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const timeout = 5000; // 5 second timeout
      const req = client.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'HEAD',
        timeout: timeout,
        headers: {
          'User-Agent': 'GBU-Accessibility-Checker/3.1.0'
        }
      }, (res) => {
        if (res.statusCode >= 400) {
          resolve({
            type: `🔗 ${resourceType} ${res.statusCode}`,
            description: `${elementType} returns ${res.statusCode}: ${url}`,
            suggestion: `Update or remove the broken ${resourceType.toLowerCase()} reference`,
            url: url,
            statusCode: res.statusCode,
            resourceType: resourceType
          });
        } else {
          resolve(null); // No issue
        }
      });
      
      req.on('error', (error) => {
        resolve({
          type: `🔗 ${resourceType} unreachable`,
          description: `${elementType} cannot be reached: ${url}`,
          suggestion: `Check network connection or update the ${resourceType.toLowerCase()} URL`,
          url: url,
          error: error.message,
          resourceType: resourceType
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          type: `🔗 ${resourceType} timeout`,
          description: `${elementType} request timed out: ${url}`,
          suggestion: `The ${resourceType.toLowerCase()} server may be slow or unreachable`,
          url: url,
          resourceType: resourceType
        });
      });
      
      req.end();
    });
  }

  async checkLocalFile(url, baseDir, resourceType, elementType) {
    const path = require('path');
    
    // Handle different URL types
    let filePath;
    if (url.startsWith('/')) {
      // Absolute path from web root - find project root and resolve from there
      const projectRoot = this.findProjectRoot(baseDir);
      filePath = path.join(projectRoot, url.substring(1));
    } else {
      // Relative path - resolve relative to current HTML file directory
      filePath = path.resolve(baseDir, url);
    }
    
    try {
      await require('fs').promises.access(filePath);
      return null; // File exists, no issue
    } catch (error) {
      return {
        type: `📁 ${resourceType} not found`,
        description: `${elementType} file does not exist: ${url}`,
        suggestion: `Create the missing file or update the ${resourceType.toLowerCase()} path`,
        url: url,
        filePath: filePath,
        resolvedPath: filePath,
        resourceType: resourceType
      };
    }
  }

  // Helper method to find project root directory
  findProjectRoot(startDir) {
    const path = require('path');
    const fs = require('fs');
    
    let currentDir = startDir;
    const root = path.parse(currentDir).root;
    
    // Look for common project root indicators
    while (currentDir !== root) {
      // Check for package.json, .git, or other project indicators
      const packageJsonPath = path.join(currentDir, 'package.json');
      const gitPath = path.join(currentDir, '.git');
      const nodeModulesPath = path.join(currentDir, 'node_modules');
      
      if (fs.existsSync(packageJsonPath) || fs.existsSync(gitPath) || fs.existsSync(nodeModulesPath)) {
        return currentDir;
      }
      
      // Move up one directory
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break; // Reached filesystem root
      currentDir = parentDir;
    }
    
    // If no project root found, use the original baseDir (fallback)
    return startDir;
  }

  // Analyze headings (no auto-fix, only suggestions)
  async analyzeHeadings(directory = '.') {
    console.log(chalk.blue('📑 Analyzing heading structure...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeHeadingStructure(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            }
          });
        }
        
        results.push({ file, status: 'analyzed', issues: issues.length, suggestions: issues });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Analyzed heading structure in ${results.length} files`));
    console.log(chalk.gray('💡 Heading issues require manual review and cannot be auto-fixed'));
    return results;
  }

  async fixFormLabels(directory = '.') {
    console.log(chalk.blue('📋 Fixing form labels...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeFormLabels(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixFormLabelsInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed form labels in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} form label issues across ${results.length} files`));
    return results;
  }

  analyzeFormLabels(content) {
    const issues = [];
    
    // Find all form input elements that need labels
    const inputElements = [
      'input[type="text"]', 'input[type="email"]', 'input[type="password"]',
      'input[type="tel"]', 'input[type="url"]', 'input[type="search"]',
      'input[type="number"]', 'input[type="date"]', 'input[type="time"]',
      'input[type="datetime-local"]', 'input[type="month"]', 'input[type="week"]',
      'input[type="color"]', 'input[type="range"]', 'input[type="file"]',
      'textarea', 'select'
    ];
    
    // Convert to regex patterns
    const inputPatterns = [
      /<input[^>]*type\s*=\s*["'](?:text|email|password|tel|url|search|number|date|time|datetime-local|month|week|color|range|file)["'][^>]*>/gi,
      /<textarea[^>]*>/gi,
      /<select[^>]*>/gi
    ];
    
    inputPatterns.forEach((pattern, patternIndex) => {
      const matches = content.match(pattern) || [];
      
      matches.forEach((element, index) => {
        const elementType = patternIndex === 0 ? 'input' : 
                           patternIndex === 1 ? 'textarea' : 'select';
        
        const issues_found = this.checkFormElementLabeling(element, content, elementType, index + 1);
        issues.push(...issues_found);
      });
    });
    
    return issues;
  }

  checkFormElementLabeling(element, content, elementType, index) {
    const issues = [];
    
    // Extract element attributes
    const id = this.extractAttributeValue(element, 'id');
    const name = this.extractAttributeValue(element, 'name');
    const ariaLabel = this.extractAttributeValue(element, 'aria-label');
    const ariaLabelledby = this.extractAttributeValue(element, 'aria-labelledby');
    const title = this.extractAttributeValue(element, 'title');
    const placeholder = this.extractAttributeValue(element, 'placeholder');
    
    let hasValidLabel = false;
    let labelMethods = [];
    
    // Check for explicit label (label[for="id"])
    if (id) {
      const explicitLabelRegex = new RegExp(`<label[^>]*for\\s*=\\s*["']${id}["'][^>]*>([^<]+)</label>`, 'i');
      const explicitLabel = content.match(explicitLabelRegex);
      if (explicitLabel && explicitLabel[1].trim()) {
        hasValidLabel = true;
        labelMethods.push('explicit label');
      } else {
        issues.push({
          type: '📋 Missing explicit label',
          description: `${elementType} ${index} with id="${id}" does not have an explicit <label for="${id}">`,
          element: element.substring(0, 100) + '...'
        });
      }
    }
    
    // Check for implicit label (wrapped in label)
    const elementPosition = content.indexOf(element);
    if (elementPosition !== -1) {
      const beforeElement = content.substring(0, elementPosition);
      const afterElement = content.substring(elementPosition + element.length);
      
      // Look for wrapping label
      const labelOpenRegex = /<label[^>]*>(?:[^<]*<[^>]*>)*[^<]*$/i;
      const labelCloseRegex = /^[^<]*(?:<[^>]*>[^<]*)*<\/label>/i;
      
      const hasOpenLabel = labelOpenRegex.test(beforeElement);
      const hasCloseLabel = labelCloseRegex.test(afterElement);
      
      if (hasOpenLabel && hasCloseLabel) {
        // Extract label text
        const labelMatch = beforeElement.match(/<label[^>]*>([^<]*)$/i);
        const labelText = labelMatch ? labelMatch[1].trim() : '';
        
        if (labelText) {
          hasValidLabel = true;
          labelMethods.push('implicit label');
        } else {
          issues.push({
            type: '📋 Empty implicit label',
            description: `${elementType} ${index} is wrapped in <label> but label text is empty`,
            element: element.substring(0, 100) + '...'
          });
        }
      } else {
        issues.push({
          type: '📋 Missing implicit label',
          description: `${elementType} ${index} does not have an implicit (wrapped) <label>`,
          element: element.substring(0, 100) + '...'
        });
      }
    }
    
    // Check aria-label
    if (ariaLabel && ariaLabel.trim()) {
      hasValidLabel = true;
      labelMethods.push('aria-label');
    } else {
      issues.push({
        type: '📋 Missing aria-label',
        description: `${elementType} ${index} aria-label attribute does not exist or is empty`,
        element: element.substring(0, 100) + '...'
      });
    }
    
    // Check aria-labelledby
    if (ariaLabelledby) {
      const referencedIds = ariaLabelledby.split(/\s+/);
      let validReferences = 0;
      
      referencedIds.forEach(refId => {
        if (refId.trim()) {
          const referencedElement = content.match(new RegExp(`<[^>]*id\\s*=\\s*["']${refId}["'][^>]*>([^<]*)</[^>]*>`, 'i'));
          if (referencedElement && referencedElement[1].trim()) {
            validReferences++;
          }
        }
      });
      
      if (validReferences > 0) {
        hasValidLabel = true;
        labelMethods.push('aria-labelledby');
      } else {
        issues.push({
          type: '📋 Invalid aria-labelledby',
          description: `${elementType} ${index} aria-labelledby references elements that do not exist or are empty`,
          element: element.substring(0, 100) + '...'
        });
      }
    } else {
      issues.push({
        type: '📋 Missing aria-labelledby',
        description: `${elementType} ${index} aria-labelledby attribute does not exist`,
        element: element.substring(0, 100) + '...'
      });
    }
    
    // Check title attribute
    if (!title || !title.trim()) {
      issues.push({
        type: '📋 Missing title',
        description: `${elementType} ${index} has no title attribute`,
        element: element.substring(0, 100) + '...'
      });
    }
    
    // Check if element needs role="none" or role="presentation" to override default semantics
    const hasRole = /role\s*=/i.test(element);
    if (!hasRole && !hasValidLabel) {
      issues.push({
        type: '📋 Missing role override',
        description: `${elementType} ${index} default semantics were not overridden with role="none" or role="presentation"`,
        element: element.substring(0, 100) + '...'
      });
    }
    
    return issues;
  }

  fixFormLabelsInContent(content) {
    let fixed = content;
    
    // Fix input elements
    const inputPatterns = [
      /<input[^>]*type\s*=\s*["'](?:text|email|password|tel|url|search|number|date|time|datetime-local|month|week|color|range|file)["'][^>]*>/gi,
      /<textarea[^>]*>/gi,
      /<select[^>]*>/gi
    ];
    
    inputPatterns.forEach(pattern => {
      fixed = fixed.replace(pattern, (match) => {
        return this.addFormElementLabeling(match, fixed);
      });
    });
    
    return fixed;
  }

  addFormElementLabeling(element, content) {
    let enhanced = element;
    
    // Extract current attributes
    const id = this.extractAttributeValue(element, 'id');
    const name = this.extractAttributeValue(element, 'name');
    const ariaLabel = this.extractAttributeValue(element, 'aria-label');
    const title = this.extractAttributeValue(element, 'title');
    const placeholder = this.extractAttributeValue(element, 'placeholder');
    
    // Generate appropriate label text
    let labelText = this.generateFormLabelText(element, name, placeholder);
    
    // Add aria-label if missing
    if (!ariaLabel && labelText) {
      enhanced = enhanced.replace(/(<(?:input|textarea|select)[^>]*?)(\s*\/?>)/i, `$1 aria-label="${labelText}"$2`);
      console.log(chalk.yellow(`  📋 Added aria-label="${labelText}" to form element`));
    }
    
    // Add title if missing
    if (!title && labelText) {
      enhanced = enhanced.replace(/(<(?:input|textarea|select)[^>]*?)(\s*\/?>)/i, `$1 title="${labelText}"$2`);
      console.log(chalk.yellow(`  📋 Added title="${labelText}" to form element`));
    }
    
    // Add id if missing (for potential explicit labeling)
    if (!id) {
      const generatedId = this.generateFormElementId(element, name);
      enhanced = enhanced.replace(/(<(?:input|textarea|select)[^>]*?)(\s*\/?>)/i, `$1 id="${generatedId}"$2`);
      console.log(chalk.yellow(`  📋 Added id="${generatedId}" to form element`));
    }
    
    return enhanced;
  }

  generateFormLabelText(element, name, placeholder) {
    const lang = this.config.language;
    
    // Try to extract meaningful text from various sources
    if (placeholder && placeholder.trim()) {
      return placeholder.trim();
    }
    
    if (name && name.trim()) {
      // Convert name to readable text
      const readable = name.replace(/[-_]/g, ' ')
                          .replace(/([a-z])([A-Z])/g, '$1 $2')
                          .toLowerCase();
      
      // Capitalize first letter
      return readable.charAt(0).toUpperCase() + readable.slice(1);
    }
    
    // Extract input type for generic labels
    const typeMatch = element.match(/type\s*=\s*["']([^"']+)["']/i);
    const inputType = typeMatch ? typeMatch[1] : 'text';
    
    // Generate type-specific labels
    const typeLabels = {
      ja: {
        text: 'テキスト入力',
        email: 'メールアドレス',
        password: 'パスワード',
        tel: '電話番号',
        url: 'URL',
        search: '検索',
        number: '数値',
        date: '日付',
        time: '時刻',
        file: 'ファイル選択',
        textarea: 'テキストエリア',
        select: '選択'
      },
      en: {
        text: 'Text input',
        email: 'Email address',
        password: 'Password',
        tel: 'Phone number',
        url: 'URL',
        search: 'Search',
        number: 'Number',
        date: 'Date',
        time: 'Time',
        file: 'File selection',
        textarea: 'Text area',
        select: 'Selection'
      },
      vi: {
        text: 'Nhập văn bản',
        email: 'Địa chỉ email',
        password: 'Mật khẩu',
        tel: 'Số điện thoại',
        url: 'URL',
        search: 'Tìm kiếm',
        number: 'Số',
        date: 'Ngày',
        time: 'Thời gian',
        file: 'Chọn file',
        textarea: 'Vùng văn bản',
        select: 'Lựa chọn'
      }
    };
    
    const labels = typeLabels[lang] || typeLabels.en;
    
    // Determine element type
    let elementType = inputType;
    if (element.includes('<textarea')) elementType = 'textarea';
    if (element.includes('<select')) elementType = 'select';
    
    return labels[elementType] || labels.text;
  }

  generateFormElementId(element, name) {
    if (name) {
      return `${name}_input`;
    }
    
    // Generate based on type
    const typeMatch = element.match(/type\s*=\s*["']([^"']+)["']/i);
    const inputType = typeMatch ? typeMatch[1] : 'text';
    
    const timestamp = Date.now().toString().slice(-6);
    return `${inputType}_${timestamp}`;
  }

  extractAttributeValue(element, attributeName) {
    const regex = new RegExp(`${attributeName}\\s*=\\s*["']([^"']*)["']`, 'i');
    const match = element.match(regex);
    return match ? match[1] : null;
  }

  analyzeHeadingStructure(content) {
    const issues = [];
    
    // Extract all headings with their levels and text
    const headingPattern = /<h([1-6])[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;
    
    while ((match = headingPattern.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      headings.push({ level, text, position: match.index });
    }
    
    if (headings.length === 0) {
      issues.push({
        type: '📑 No headings found',
        description: 'Page has no heading elements',
        suggestion: 'Add heading elements (h1-h6) to structure content'
      });
      return issues;
    }
    
    // Check for h1
    const hasH1 = headings.some(h => h.level === 1);
    if (!hasH1) {
      issues.push({
        type: '📑 Missing h1',
        description: 'Page should have exactly one h1 element',
        suggestion: 'Add an h1 element as the main page heading'
      });
    }
    
    // Check for multiple h1s
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count > 1) {
      issues.push({
        type: '📑 Multiple h1 elements',
        description: `Found ${h1Count} h1 elements, should have only one`,
        suggestion: 'Use only one h1 per page, use h2-h6 for subheadings'
      });
    }
    
    // Check heading order
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      if (current.level > previous.level + 1) {
        issues.push({
          type: '📑 Heading level skip',
          description: `Heading level jumps from h${previous.level} to h${current.level}`,
          suggestion: `Use h${previous.level + 1} instead of h${current.level}, or add intermediate headings`
        });
      }
    }
    
    // Check for empty headings
    headings.forEach((heading, index) => {
      if (!heading.text) {
        issues.push({
          type: '📑 Empty heading',
          description: `Heading ${index + 1} (h${heading.level}) is empty`,
          suggestion: 'Add descriptive text to the heading or remove it'
        });
      }
    });
    
    return issues;
  }

  async fixAllAccessibilityIssues(directory = '.') {
    console.log(chalk.blue('🚀 Starting comprehensive accessibility fixes...'));
    console.log('');
    
    const results = {
      totalFiles: 0,
      fixedFiles: 0,
      totalIssues: 0,
      steps: []
    };
    
    try {
      // Step 1: HTML lang attributes
      console.log(chalk.blue('📝 Step 1: HTML lang attributes...'));
      const langResults = await this.fixHtmlLang(directory);
      const langFixed = langResults.filter(r => r.status === 'fixed').length;
      results.steps.push({ step: 1, name: 'HTML lang attributes', fixed: langFixed });
      
      // Step 2: Alt attributes
      console.log(chalk.blue('🖼️ Step 2: Alt attributes...'));
      const altResults = await this.fixEmptyAltAttributes(directory);
      const altFixed = altResults.filter(r => r.status === 'fixed').length;
      const totalAltIssues = altResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 2, name: 'Alt attributes', fixed: altFixed, issues: totalAltIssues });
      
      // Step 3: Role attributes
      console.log(chalk.blue('🎭 Step 3: Role attributes...'));
      const roleResults = await this.fixRoleAttributes(directory);
      const roleFixed = roleResults.filter(r => r.status === 'fixed').length;
      const totalRoleIssues = roleResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 3, name: 'Role attributes', fixed: roleFixed, issues: totalRoleIssues });
      
      // Step 4: Form labels
      console.log(chalk.blue('📋 Step 4: Form labels...'));
      const formResults = await this.fixFormLabels(directory);
      const formFixed = formResults.filter(r => r.status === 'fixed').length;
      const totalFormIssues = formResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 4, name: 'Form labels', fixed: formFixed, issues: totalFormIssues });
      
      // Step 5: Button names
      console.log(chalk.blue('🔘 Step 5: Button names...'));
      const buttonResults = await this.fixButtonNames(directory);
      const buttonFixed = buttonResults.filter(r => r.status === 'fixed').length;
      const totalButtonIssues = buttonResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 5, name: 'Button names', fixed: buttonFixed, issues: totalButtonIssues });
      
      // Step 6: Link names
      console.log(chalk.blue('🔗 Step 6: Link names...'));
      const linkResults = await this.fixLinkNames(directory);
      const linkFixed = linkResults.filter(r => r.status === 'fixed').length;
      const totalLinkIssues = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 6, name: 'Link names', fixed: linkFixed, issues: totalLinkIssues });
      
      // Step 7: Landmarks
      console.log(chalk.blue('🏛️ Step 7: Landmarks...'));
      const landmarkResults = await this.fixLandmarks(directory);
      const landmarkFixed = landmarkResults.filter(r => r.status === 'fixed').length;
      const totalLandmarkIssues = landmarkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 7, name: 'Landmarks', fixed: landmarkFixed, issues: totalLandmarkIssues });
      
      // Step 8: Heading analysis
      console.log(chalk.blue('📑 Step 8: Heading analysis...'));
      const headingResults = await this.analyzeHeadings(directory);
      const totalHeadingSuggestions = headingResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 8, name: 'Heading analysis', suggestions: totalHeadingSuggestions });
      console.log(chalk.gray('💡 Heading issues require manual review and cannot be auto-fixed'));
      
      // Step 9: Broken links and missing resources check
      console.log(chalk.blue('🔗 Step 9a: External links check...'));
      const brokenLinksResults = await this.checkBrokenLinks(directory);
      const totalBrokenLinks = brokenLinksResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: '9a', name: 'External links check', issues: totalBrokenLinks });
      
      console.log(chalk.blue('📁 Step 9b: Missing resources check...'));
      const missingResourcesResults = await this.check404Resources(directory);
      const totalMissingResources = missingResourcesResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: '9b', name: 'Missing resources check', issues: totalMissingResources });
      
      console.log(chalk.gray('💡 Link and resource issues require manual review and cannot be auto-fixed'));
      
      // Step 10: Cleanup duplicate roles
      console.log(chalk.blue('🧹 Step 10: Cleanup duplicate roles...'));
      const cleanupResults = await this.cleanupDuplicateRoles(directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      results.steps.push({ step: 10, name: 'Cleanup duplicate roles', fixed: cleanupFixed });
      
      // Calculate totals
      results.totalFiles = Math.max(
        langResults.length, altResults.length, roleResults.length, formResults.length,
        buttonResults.length, linkResults.length, landmarkResults.length, 
        headingResults.length, brokenLinksResults.length, cleanupResults.length
      );
      
      results.fixedFiles = new Set([
        ...langResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...altResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...roleResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...formResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...buttonResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...linkResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...landmarkResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...cleanupResults.filter(r => r.status === 'fixed').map(r => r.file)
      ]).size;
      
      results.totalIssues = totalAltIssues + totalRoleIssues + totalFormIssues + 
                           totalButtonIssues + totalLinkIssues + totalLandmarkIssues;
      
      // Final summary
      console.log(chalk.green('\n🎉 All accessibility fixes completed!'));
      console.log(chalk.blue('📊 Final Summary:'));
      console.log(chalk.blue(`   Total files scanned: ${results.totalFiles}`));
      console.log(chalk.blue(`   Files fixed: ${results.fixedFiles}`));
      console.log(chalk.blue(`   Total issues resolved: ${results.totalIssues}`));
      
      if (this.config.dryRun) {
        console.log(chalk.yellow('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
      }
      
      return results;
      
    } catch (error) {
      console.error(chalk.red(`❌ Error during comprehensive fixes: ${error.message}`));
      throw error;
    }
  }

  async fixButtonNames(directory = '.') {
    console.log(chalk.blue('🔘 Fixing button names...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeButtonNames(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixButtonNamesInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed button names in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} button name issues across ${results.length} files`));
    return results;
  }

  analyzeButtonNames(content) {
    const issues = [];
    const buttonPattern = /<button[^>]*>[\s\S]*?<\/button>/gi;
    const buttons = content.match(buttonPattern) || [];
    
    buttons.forEach((button, index) => {
      const buttonText = button.replace(/<[^>]*>/g, '').trim();
      const hasAriaLabel = /aria-label\s*=/i.test(button);
      const hasTitle = /title\s*=/i.test(button);
      
      if (!buttonText && !hasAriaLabel && !hasTitle) {
        issues.push({
          type: '🔘 Empty button',
          description: `Button ${index + 1} has no text content, aria-label, or title`,
          element: button.substring(0, 100) + '...'
        });
      }
    });
    
    return issues;
  }

  fixButtonNamesInContent(content) {
    let fixed = content;
    
    const buttonPattern = /<button([^>]*)>([\s\S]*?)<\/button>/gi;
    
    fixed = fixed.replace(buttonPattern, (match, attributes, innerContent) => {
      const buttonText = innerContent.replace(/<[^>]*>/g, '').trim();
      const hasAriaLabel = /aria-label\s*=/i.test(attributes);
      const hasTitle = /title\s*=/i.test(attributes);
      
      if (!buttonText && !hasAriaLabel && !hasTitle) {
        const buttonName = this.generateButtonName(attributes, innerContent);
        const updatedAttributes = attributes + ` aria-label="${buttonName}" title="${buttonName}"`;
        console.log(chalk.yellow(`  🔘 Added aria-label and title to empty button: "${buttonName}"`));
        return `<button${updatedAttributes}>${innerContent}</button>`;
      }
      
      return match;
    });
    
    return fixed;
  }

  generateButtonName(attributes, innerContent) {
    const lang = this.config.language;
    
    // Try to extract meaningful name from onclick or other attributes
    const onclickMatch = attributes.match(/onclick\s*=\s*["']([^"']+)["']/i);
    if (onclickMatch) {
      const onclick = onclickMatch[1];
      if (onclick.includes('submit')) return lang === 'ja' ? '送信' : 'Submit';
      if (onclick.includes('cancel')) return lang === 'ja' ? 'キャンセル' : 'Cancel';
      if (onclick.includes('close')) return lang === 'ja' ? '閉じる' : 'Close';
      if (onclick.includes('save')) return lang === 'ja' ? '保存' : 'Save';
    }
    
    // Check for common class names
    const classMatch = attributes.match(/class\s*=\s*["']([^"']+)["']/i);
    if (classMatch) {
      const className = classMatch[1].toLowerCase();
      if (className.includes('submit')) return lang === 'ja' ? '送信' : 'Submit';
      if (className.includes('cancel')) return lang === 'ja' ? 'キャンセル' : 'Cancel';
      if (className.includes('close')) return lang === 'ja' ? '閉じる' : 'Close';
      if (className.includes('save')) return lang === 'ja' ? '保存' : 'Save';
    }
    
    return lang === 'ja' ? 'ボタン' : 'Button';
  }

  async fixLinkNames(directory = '.') {
    console.log(chalk.blue('🔗 Fixing link names...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeLinkNames(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixLinkNamesInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed link names in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} link name issues across ${results.length} files`));
    return results;
  }

  analyzeLinkNames(content) {
    const issues = [];
    const linkPattern = /<a[^>]*href[^>]*>[\s\S]*?<\/a>/gi;
    const links = content.match(linkPattern) || [];
    
    links.forEach((link, index) => {
      const linkText = link.replace(/<[^>]*>/g, '').trim();
      const hasAriaLabel = /aria-label\s*=/i.test(link);
      const hasTitle = /title\s*=/i.test(link);
      
      if (!linkText && !hasAriaLabel && !hasTitle) {
        issues.push({
          type: '🔗 Empty link',
          description: `Link ${index + 1} has no text content, aria-label, or title`,
          element: link.substring(0, 100) + '...'
        });
      }
      
      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'more', 'here', 'link'];
      if (genericTexts.some(generic => linkText.toLowerCase().includes(generic))) {
        issues.push({
          type: '🔗 Generic link text',
          description: `Link ${index + 1} has generic text: "${linkText}"`,
          element: link.substring(0, 100) + '...'
        });
      }
    });
    
    return issues;
  }

  fixLinkNamesInContent(content) {
    let fixed = content;
    
    const linkPattern = /<a([^>]*href[^>]*?)>([\s\S]*?)<\/a>/gi;
    
    fixed = fixed.replace(linkPattern, (match, attributes, innerContent) => {
      const linkText = innerContent.replace(/<[^>]*>/g, '').trim();
      const hasAriaLabel = /aria-label\s*=/i.test(attributes);
      const hasTitle = /title\s*=/i.test(attributes);
      
      if (!linkText && !hasAriaLabel && !hasTitle) {
        const linkName = this.generateLinkName(attributes, innerContent);
        const updatedAttributes = attributes + ` aria-label="${linkName}" title="${linkName}"`;
        console.log(chalk.yellow(`  🔗 Added aria-label and title to empty link: "${linkName}"`));
        return `<a${updatedAttributes}>${innerContent}</a>`;
      }
      
      return match;
    });
    
    return fixed;
  }

  generateLinkName(attributes, innerContent) {
    const lang = this.config.language;
    
    // Try to extract href for context
    const hrefMatch = attributes.match(/href\s*=\s*["']([^"']+)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (href.includes('mailto:')) return lang === 'ja' ? 'メール送信' : 'Send email';
      if (href.includes('tel:')) return lang === 'ja' ? '電話をかける' : 'Make call';
      if (href.includes('#')) return lang === 'ja' ? 'ページ内リンク' : 'Page anchor';
      if (href.includes('.pdf')) return lang === 'ja' ? 'PDFを開く' : 'Open PDF';
    }
    
    return lang === 'ja' ? 'リンク' : 'Link';
  }

  async fixLandmarks(directory = '.') {
    console.log(chalk.blue('🏛️ Fixing landmarks...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeLandmarks(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        results.push({ file, status: 'no-change', issues: issues.length });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} landmark issues across ${results.length} files`));
    return results;
  }

  analyzeLandmarks(content) {
    const issues = [];
    
    const hasMain = /<main[^>]*>/i.test(content);
    const hasNav = /<nav[^>]*>/i.test(content);
    const hasHeader = /<header[^>]*>/i.test(content);
    const hasFooter = /<footer[^>]*>/i.test(content);
    
    if (!hasMain) {
      issues.push({
        type: '🏛️ Missing main landmark',
        description: 'Page should have a main landmark',
        suggestion: 'Add <main> element around primary content'
      });
    }
    
    return issues;
  }

  async analyzeHeadings(directory = '.') {
    console.log(chalk.blue('📑 Analyzing heading structure...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeHeadingStructure(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            }
            totalIssuesFound++;
          });
        }
        
        results.push({ file, status: 'analyzed', issues: issues.length });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Analyzed heading structure in ${results.length} files`));
    console.log(chalk.gray('💡 Heading issues require manual review and cannot be auto-fixed'));
    return results;
  }



  async cleanupDuplicateRoles(directory = '.') {
    console.log(chalk.blue('🧹 Cleaning up duplicate role attributes...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fixed = this.cleanupDuplicateRolesInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Cleaned duplicate roles in: ${file}`));
          results.push({ file, status: 'fixed' });
          totalIssuesFound++;
        } else {
          results.push({ file, status: 'no-change' });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Cleaned duplicate roles in ${totalIssuesFound} files`));
    return results;
  }

  cleanupDuplicateRolesInContent(content) {
    let fixed = content;
    
    // Remove duplicate role attributes
    fixed = fixed.replace(/(\s+role\s*=\s*["'][^"']*["'])\s+role\s*=\s*["'][^"']*["']/gi, '$1');
    
    return fixed;
  }

  async fixNestedInteractiveControls(directory = '.') {
    console.log(chalk.blue('🎯 Fixing nested interactive controls...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeNestedInteractiveControls(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            }
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixNestedInteractiveControlsInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed nested interactive controls in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} nested interactive control issues across ${results.length} files`));
    return results;
  }

  analyzeNestedInteractiveControls(content) {
    const issues = [];
    
    // Define interactive elements and their roles
    const interactiveElements = [
      { tag: 'button', role: 'button' },
      { tag: 'a', role: 'link', requiresHref: true },
      { tag: 'input', role: 'textbox|button|checkbox|radio|slider|spinbutton' },
      { tag: 'textarea', role: 'textbox' },
      { tag: 'select', role: 'combobox|listbox' },
      { tag: 'details', role: 'group' },
      { tag: 'summary', role: 'button' }
    ];
    
    // Also check for elements with interactive roles
    const interactiveRoles = [
      'button', 'link', 'textbox', 'checkbox', 'radio', 'slider', 
      'spinbutton', 'combobox', 'listbox', 'menuitem', 'tab', 
      'treeitem', 'gridcell', 'option'
    ];
    
    // Find all interactive elements
    const interactiveSelectors = [];
    
    // Add tag-based selectors
    interactiveElements.forEach(element => {
      if (element.requiresHref) {
        interactiveSelectors.push(`<${element.tag}[^>]*href[^>]*>`);
      } else {
        interactiveSelectors.push(`<${element.tag}[^>]*>`);
      }
    });
    
    // Add role-based selectors
    interactiveRoles.forEach(role => {
      interactiveSelectors.push(`<[^>]*role\\s*=\\s*["']${role}["'][^>]*>`);
    });
    
    // Create combined regex pattern
    const interactivePattern = new RegExp(interactiveSelectors.join('|'), 'gi');
    
    // Find all interactive elements with their positions
    const interactiveMatches = [];
    let match;
    
    while ((match = interactivePattern.exec(content)) !== null) {
      const element = match[0];
      const startPos = match.index;
      const endPos = this.findElementEndPosition(content, element, startPos);
      
      if (endPos > startPos) {
        interactiveMatches.push({
          element: element,
          startPos: startPos,
          endPos: endPos,
          fullElement: content.substring(startPos, endPos)
        });
      }
    }
    
    // Check for nesting
    for (let i = 0; i < interactiveMatches.length; i++) {
      const parent = interactiveMatches[i];
      
      for (let j = 0; j < interactiveMatches.length; j++) {
        if (i === j) continue;
        
        const child = interactiveMatches[j];
        
        // Check if child is nested inside parent
        if (child.startPos > parent.startPos && child.endPos < parent.endPos) {
          const parentType = this.getInteractiveElementType(parent.element);
          const childType = this.getInteractiveElementType(child.element);
          
          issues.push({
            type: '🎯 Nested interactive controls',
            description: `${childType} is nested inside ${parentType}`,
            parentElement: parent.element.substring(0, 100) + '...',
            childElement: child.element.substring(0, 100) + '...',
            suggestion: `Remove interactive role from parent or child, or restructure HTML to avoid nesting`
          });
        }
      }
    }
    
    return issues;
  }

  findElementEndPosition(content, startTag, startPos) {
    // Extract tag name from start tag
    const tagMatch = startTag.match(/<(\w+)/);
    if (!tagMatch) return startPos + startTag.length;
    
    const tagName = tagMatch[1].toLowerCase();
    
    // Self-closing tags
    if (startTag.endsWith('/>') || ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tagName)) {
      return startPos + startTag.length;
    }
    
    // Find matching closing tag
    const closeTagPattern = new RegExp(`</${tagName}>`, 'i');
    const remainingContent = content.substring(startPos + startTag.length);
    const closeMatch = remainingContent.match(closeTagPattern);
    
    if (closeMatch) {
      return startPos + startTag.length + closeMatch.index + closeMatch[0].length;
    }
    
    // If no closing tag found, assume it ends at the start tag
    return startPos + startTag.length;
  }

  getInteractiveElementType(element) {
    // Extract tag name
    const tagMatch = element.match(/<(\w+)/);
    const tagName = tagMatch ? tagMatch[1].toLowerCase() : 'element';
    
    // Extract role if present
    const roleMatch = element.match(/role\s*=\s*["']([^"']+)["']/i);
    const role = roleMatch ? roleMatch[1] : null;
    
    if (role) {
      return `${tagName}[role="${role}"]`;
    }
    
    // Special cases
    if (tagName === 'a' && /href\s*=/i.test(element)) {
      return 'link';
    }
    
    if (tagName === 'input') {
      const typeMatch = element.match(/type\s*=\s*["']([^"']+)["']/i);
      const inputType = typeMatch ? typeMatch[1] : 'text';
      return `input[type="${inputType}"]`;
    }
    
    return tagName;
  }

  fixNestedInteractiveControlsInContent(content) {
    let fixed = content;
    
    // Strategy 1: Remove role attributes from parent containers that have interactive children
    const issues = this.analyzeNestedInteractiveControls(content);
    
    issues.forEach(issue => {
      // Try to fix by removing role from parent element
      const parentRoleMatch = issue.parentElement.match(/role\s*=\s*["'][^"']*["']/i);
      if (parentRoleMatch) {
        const parentWithoutRole = issue.parentElement.replace(/\s*role\s*=\s*["'][^"']*["']/i, '');
        fixed = fixed.replace(issue.parentElement, parentWithoutRole);
        console.log(chalk.yellow(`  🎯 Removed role attribute from parent element to fix nesting`));
      }
    });
    
    // Strategy 2: Convert div[role="button"] containing links to regular div
    fixed = fixed.replace(/<div([^>]*role\s*=\s*["']button["'][^>]*)>([\s\S]*?)<\/div>/gi, (match, attributes, content) => {
      // Check if content contains interactive elements
      const hasInteractiveChildren = /<(?:a\s[^>]*href|button|input|select|textarea)[^>]*>/i.test(content);
      
      if (hasInteractiveChildren) {
        // Remove role="button" and any button-related attributes
        const cleanAttributes = attributes
          .replace(/\s*role\s*=\s*["']button["']/i, '')
          .replace(/\s*tabindex\s*=\s*["'][^"']*["']/i, '')
          .replace(/\s*onclick\s*=\s*["'][^"']*["']/i, '');
        
        console.log(chalk.yellow(`  🎯 Converted div[role="button"] to regular div due to interactive children`));
        return `<div${cleanAttributes}>${content}</div>`;
      }
      
      return match;
    });
    
    // Strategy 3: Remove tabindex from parent containers with interactive children
    fixed = fixed.replace(/(<[^>]+)(\s+tabindex\s*=\s*["'][^"']*["'])([^>]*>[\s\S]*?<(?:a\s[^>]*href|button|input|select|textarea)[^>]*>[\s\S]*?<\/[^>]+>)/gi, (match, beforeTabindex, tabindexAttr, afterTabindex) => {
      console.log(chalk.yellow(`  🎯 Removed tabindex from parent element with interactive children`));
      return beforeTabindex + afterTabindex;
    });
    
    return fixed;
  }

  async fixAllAccessibilityIssues(directory = '.') {
    console.log(chalk.blue('🚀 Starting comprehensive accessibility fixes...'));
    console.log('');
    
    const results = {
      totalFiles: 0,
      fixedFiles: 0,
      totalIssues: 0,
      steps: []
    };
    
    try {
      // Step 1: HTML lang attributes
      console.log(chalk.blue('📝 Step 1: HTML lang attributes...'));
      const langResults = await this.fixHtmlLang(directory);
      const langFixed = langResults.filter(r => r.status === 'fixed').length;
      results.steps.push({ step: 1, name: 'HTML lang attributes', fixed: langFixed });
      
      // Step 2: Alt attributes
      console.log(chalk.blue('🖼️ Step 2: Alt attributes...'));
      const altResults = await this.fixEmptyAltAttributes(directory);
      const altFixed = altResults.filter(r => r.status === 'fixed').length;
      const totalAltIssues = altResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 2, name: 'Alt attributes', fixed: altFixed, issues: totalAltIssues });
      
      // Step 3: Role attributes
      console.log(chalk.blue('🎭 Step 3: Role attributes...'));
      const roleResults = await this.fixRoleAttributes(directory);
      const roleFixed = roleResults.filter(r => r.status === 'fixed').length;
      const totalRoleIssues = roleResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 3, name: 'Role attributes', fixed: roleFixed, issues: totalRoleIssues });
      
      // Step 4: Aria-label attributes
      console.log(chalk.blue('🏷️ Step 4: Aria-label attributes...'));
      const ariaResults = await this.fixAriaLabels(directory);
      const ariaFixed = ariaResults.filter(r => r.status === 'processed' && r.changes > 0).length;
      const totalAriaIssues = ariaResults.reduce((sum, r) => sum + (r.changes || 0), 0);
      results.steps.push({ step: 4, name: 'Aria-label attributes', fixed: ariaFixed, issues: totalAriaIssues });
      
      // Step 5: Form labels
      console.log(chalk.blue('📋 Step 5: Form labels...'));
      const formResults = await this.fixFormLabels(directory);
      const formFixed = formResults.filter(r => r.status === 'fixed').length;
      const totalFormIssues = formResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 5, name: 'Form labels', fixed: formFixed, issues: totalFormIssues });
      
      // Step 6: Nested interactive controls (NEW!)
      console.log(chalk.blue('🎯 Step 6: Nested interactive controls...'));
      const nestedResults = await this.fixNestedInteractiveControls(directory);
      const nestedFixed = nestedResults.filter(r => r.status === 'fixed').length;
      const totalNestedIssues = nestedResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 6, name: 'Nested interactive controls', fixed: nestedFixed, issues: totalNestedIssues });
      
      // Step 7: Button names
      console.log(chalk.blue('🔘 Step 7: Button names...'));
      const buttonResults = await this.fixButtonNames(directory);
      const buttonFixed = buttonResults.filter(r => r.status === 'fixed').length;
      const totalButtonIssues = buttonResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 7, name: 'Button names', fixed: buttonFixed, issues: totalButtonIssues });
      
      // Step 8: Link names
      console.log(chalk.blue('🔗 Step 8: Link names...'));
      const linkResults = await this.fixLinkNames(directory);
      const linkFixed = linkResults.filter(r => r.status === 'fixed').length;
      const totalLinkIssues = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 8, name: 'Link names', fixed: linkFixed, issues: totalLinkIssues });
      
      // Step 9: Landmarks
      console.log(chalk.blue('🏛️ Step 9: Landmarks...'));
      const landmarkResults = await this.fixLandmarks(directory);
      const landmarkFixed = landmarkResults.filter(r => r.status === 'fixed').length;
      const totalLandmarkIssues = landmarkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 9, name: 'Landmarks', fixed: landmarkFixed, issues: totalLandmarkIssues });
      
      // Step 10: Heading analysis
      console.log(chalk.blue('📑 Step 10: Heading analysis...'));
      const headingResults = await this.analyzeHeadings(directory);
      const totalHeadingSuggestions = headingResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: 10, name: 'Heading analysis', suggestions: totalHeadingSuggestions });
      console.log(chalk.gray('💡 Heading issues require manual review and cannot be auto-fixed'));
      
      // Step 11: Broken links and missing resources check
      console.log(chalk.blue('🔗 Step 11a: External links check...'));
      const brokenLinksResults = await this.checkBrokenLinks(directory);
      const totalBrokenLinks = brokenLinksResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: '11a', name: 'External links check', issues: totalBrokenLinks });
      
      console.log(chalk.blue('📁 Step 11b: Missing resources check...'));
      const missingResourcesResults = await this.check404Resources(directory);
      const totalMissingResources = missingResourcesResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      results.steps.push({ step: '11b', name: 'Missing resources check', issues: totalMissingResources });
      
      console.log(chalk.gray('💡 Link and resource issues require manual review and cannot be auto-fixed'));
      
      // Step 12: Cleanup duplicate roles
      console.log(chalk.blue('🧹 Step 12: Cleanup duplicate roles...'));
      const cleanupResults = await this.cleanupDuplicateRoles(directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      results.steps.push({ step: 12, name: 'Cleanup duplicate roles', fixed: cleanupFixed });
      
      // Calculate totals
      results.totalFiles = Math.max(
        langResults.length, altResults.length, roleResults.length, ariaResults.length, formResults.length,
        nestedResults.length, buttonResults.length, linkResults.length, landmarkResults.length, 
        headingResults.length, brokenLinksResults.length, cleanupResults.length
      );
      
      results.fixedFiles = new Set([
        ...langResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...altResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...roleResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...formResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...nestedResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...buttonResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...linkResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...landmarkResults.filter(r => r.status === 'fixed').map(r => r.file),
        ...cleanupResults.filter(r => r.status === 'fixed').map(r => r.file)
      ]).size;
      
      results.totalIssues = totalAltIssues + totalRoleIssues + totalFormIssues + totalNestedIssues +
                           totalButtonIssues + totalLinkIssues + totalLandmarkIssues;
      
      // Final summary
      console.log(chalk.green('\n🎉 All accessibility fixes completed!'));
      console.log(chalk.blue('📊 Final Summary:'));
      console.log(chalk.blue(`   Total files scanned: ${results.totalFiles}`));
      console.log(chalk.blue(`   Files fixed: ${results.fixedFiles}`));
      console.log(chalk.blue(`   Total issues resolved: ${results.totalIssues}`));
      
      if (this.config.dryRun) {
        console.log(chalk.yellow('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
      }
      
      return results;
      
    } catch (error) {
      console.error(chalk.red(`❌ Error during comprehensive fixes: ${error.message}`));
      throw error;
    }
  }

  async fixHeadingStructure(directory = '.') {
    console.log(chalk.blue('📑 Fixing heading structure...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    let totalIssuesFixed = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const analysis = this.analyzeHeadingStructure(content);
        
        if (analysis.issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          analysis.issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            }
            totalIssuesFound++;
          });
        }
        
        let fixed = content;
        let changesMade = false;
        
        if (this.config.autoFixHeadings) {
          fixed = this.fixHeadingStructureInContent(content, analysis);
          changesMade = fixed !== content;
          
          if (changesMade) {
            const fixedCount = this.countHeadingFixes(content, fixed);
            totalIssuesFixed += fixedCount;
            
            if (this.config.backupFiles) {
              await fs.writeFile(`${file}.backup`, content);
            }
            
            if (!this.config.dryRun) {
              await fs.writeFile(file, fixed);
            }
            
            console.log(chalk.green(`✅ Fixed heading structure in: ${file} (${fixedCount} fixes)`));
            results.push({ file, status: 'fixed', issues: analysis.issues.length, fixes: fixedCount });
          } else {
            results.push({ file, status: 'no-change', issues: analysis.issues.length });
          }
        } else {
          results.push({ file, status: 'analyzed', issues: analysis.issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} heading issues across ${results.length} files`));
    if (this.config.autoFixHeadings) {
      console.log(chalk.green(`   Fixed ${totalIssuesFixed} heading issues automatically`));
    } else {
      console.log(chalk.gray('💡 Use --auto-fix-headings option to enable automatic fixes'));
    }
    
    return results;
  }

  analyzeHeadingStructure(content) {
    const issues = [];
    const suggestions = [];
    
    // Extract all headings with their levels, text, and positions
    const headingPattern = /<h([1-6])[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;
    
    while ((match = headingPattern.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const rawText = match[2];
      const text = rawText.replace(/<[^>]*>/g, '').trim();
      const fullTag = match[0];
      
      headings.push({ 
        level, 
        text, 
        rawText,
        fullTag,
        position: match.index,
        originalMatch: match[0]
      });
    }
    
    if (headings.length === 0) {
      issues.push({
        type: '📑 No headings found',
        description: 'Page has no heading elements',
        suggestion: 'Add heading elements (h1-h6) to structure content',
        severity: 'error',
        fixable: false
      });
      return { issues, suggestions, headings };
    }
    
    // Check for h1
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      issues.push({
        type: '📑 Missing h1',
        description: 'Page should have exactly one h1 element',
        suggestion: 'Add an h1 element as the main page heading',
        severity: 'error',
        fixable: true,
        fix: 'add-h1'
      });
    } else if (h1Count > 1) {
      issues.push({
        type: '📑 Multiple h1 elements',
        description: `Found ${h1Count} h1 elements, should have only one`,
        suggestion: 'Convert extra h1 elements to h2-h6 as appropriate',
        severity: 'error',
        fixable: true,
        fix: 'fix-multiple-h1'
      });
    }
    
    // Check heading order and hierarchy
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      // Check for level skipping
      if (current.level > previous.level + 1) {
        issues.push({
          type: '📑 Heading level skip',
          description: `Heading level jumps from h${previous.level} to h${current.level}`,
          suggestion: `Use h${previous.level + 1} instead of h${current.level}`,
          severity: 'warning',
          fixable: true,
          fix: 'fix-level-skip',
          targetIndex: i,
          correctLevel: previous.level + 1
        });
      }
    }
    
    // Check for empty headings
    headings.forEach((heading, index) => {
      if (!heading.text) {
        issues.push({
          type: '📑 Empty heading',
          description: `Heading ${index + 1} (h${heading.level}) is empty`,
          suggestion: 'Add descriptive text to the heading or remove it',
          severity: 'error',
          fixable: true,
          fix: 'fix-empty-heading',
          targetIndex: index
        });
      }
    });
    
    // Check for consecutive headings with same level and similar content
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      if (current.level === previous.level && 
          current.text.toLowerCase() === previous.text.toLowerCase() &&
          current.text.length > 0) {
        issues.push({
          type: '📑 Duplicate heading',
          description: `Duplicate h${current.level} heading: "${current.text}"`,
          suggestion: 'Make heading text unique or merge content',
          severity: 'warning',
          fixable: false
        });
      }
    }
    
    return { issues, suggestions, headings };
  }

  fixHeadingStructureInContent(content, analysis) {
    let fixed = content;
    const { issues, headings } = analysis;
    
    // Sort issues by position (descending) to avoid position shifts
    const fixableIssues = issues
      .filter(issue => issue.fixable)
      .sort((a, b) => (b.targetIndex || 0) - (a.targetIndex || 0));
    
    fixableIssues.forEach(issue => {
      switch (issue.fix) {
        case 'add-h1':
          fixed = this.addMissingH1(fixed);
          break;
          
        case 'fix-multiple-h1':
          fixed = this.fixMultipleH1(fixed, headings);
          break;
          
        case 'fix-level-skip':
          if (issue.targetIndex !== undefined && issue.correctLevel) {
            fixed = this.fixHeadingLevelSkip(fixed, headings[issue.targetIndex], issue.correctLevel);
          }
          break;
          
        case 'fix-empty-heading':
          if (issue.targetIndex !== undefined) {
            fixed = this.fixEmptyHeading(fixed, headings[issue.targetIndex]);
          }
          break;
      }
    });
    
    return fixed;
  }

  addMissingH1(content) {
    // Try to find the first heading and convert it to h1
    const firstHeadingMatch = content.match(/<h([2-6])[^>]*>([\s\S]*?)<\/h[2-6]>/i);
    
    if (firstHeadingMatch) {
      const level = firstHeadingMatch[1];
      const replacement = firstHeadingMatch[0].replace(
        new RegExp(`<h${level}([^>]*)>`, 'i'),
        '<h1$1>'
      ).replace(
        new RegExp(`</h${level}>`, 'i'),
        '</h1>'
      );
      
      const result = content.replace(firstHeadingMatch[0], replacement);
      console.log(chalk.yellow(`  📑 Converted first h${level} to h1`));
      return result;
    }
    
    // If no headings found, try to add h1 based on title or first significant text
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      // Insert h1 after opening body tag
      const bodyMatch = content.match(/(<body[^>]*>)/i);
      if (bodyMatch) {
        const h1Element = `\n  <h1>${title}</h1>\n`;
        const result = content.replace(bodyMatch[1], bodyMatch[1] + h1Element);
        console.log(chalk.yellow(`  📑 Added h1 element with title: "${title}"`));
        return result;
      }
    }
    
    return content;
  }

  fixMultipleH1(content, headings) {
    const h1Elements = headings.filter(h => h.level === 1);
    
    // Keep the first h1, convert others to h2
    for (let i = 1; i < h1Elements.length; i++) {
      const h1 = h1Elements[i];
      const replacement = h1.fullTag.replace(/<h1([^>]*)>/i, '<h2$1>').replace(/<\/h1>/i, '</h2>');
      content = content.replace(h1.fullTag, replacement);
      console.log(chalk.yellow(`  📑 Converted extra h1 to h2: "${h1.text}"`));
    }
    
    return content;
  }

  fixHeadingLevelSkip(content, heading, correctLevel) {
    const replacement = heading.fullTag
      .replace(new RegExp(`<h${heading.level}([^>]*)>`, 'i'), `<h${correctLevel}$1>`)
      .replace(new RegExp(`</h${heading.level}>`, 'i'), `</h${correctLevel}>`);
    
    const result = content.replace(heading.fullTag, replacement);
    console.log(chalk.yellow(`  📑 Fixed level skip: h${heading.level} → h${correctLevel} for "${heading.text}"`));
    return result;
  }

  fixEmptyHeading(content, heading) {
    // Generate meaningful text based on context
    const contextText = this.generateHeadingText(content, heading);
    
    if (contextText) {
      const replacement = heading.fullTag.replace(
        /<h([1-6])([^>]*)>[\s\S]*?<\/h[1-6]>/i,
        `<h$1$2>${contextText}</h$1>`
      );
      
      const result = content.replace(heading.fullTag, replacement);
      console.log(chalk.yellow(`  📑 Added text to empty heading: "${contextText}"`));
      return result;
    }
    
    // If can't generate text, remove the empty heading
    const result = content.replace(heading.fullTag, '');
    console.log(chalk.yellow(`  📑 Removed empty h${heading.level} heading`));
    return result;
  }

  generateHeadingText(content, heading) {
    const lang = this.config.language;
    
    // Try to find nearby text content
    const position = heading.position;
    const contextRange = 500;
    const beforeContext = content.substring(Math.max(0, position - contextRange), position);
    const afterContext = content.substring(position + heading.fullTag.length, position + heading.fullTag.length + contextRange);
    
    // Look for meaningful text in nearby paragraphs
    const nearbyText = (beforeContext + afterContext).replace(/<[^>]*>/g, ' ').trim();
    const words = nearbyText.split(/\s+/).filter(word => word.length > 2);
    
    if (words.length > 0) {
      const meaningfulWords = words.slice(0, 3);
      return meaningfulWords.join(' ');
    }
    
    // Fallback to generic text based on language
    const genericTexts = {
      ja: ['見出し', 'セクション', 'コンテンツ'],
      en: ['Heading', 'Section', 'Content'],
      vi: ['Tiêu đề', 'Phần', 'Nội dung']
    };
    
    const texts = genericTexts[lang] || genericTexts.en;
    return texts[0];
  }

  countHeadingFixes(originalContent, fixedContent) {
    // Count the number of heading-related changes
    const originalHeadings = (originalContent.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || []).length;
    const fixedHeadings = (fixedContent.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || []).length;
    
    // Simple heuristic: count tag changes
    let changes = 0;
    
    // Count h1 additions
    const originalH1 = (originalContent.match(/<h1[^>]*>/gi) || []).length;
    const fixedH1 = (fixedContent.match(/<h1[^>]*>/gi) || []).length;
    changes += Math.abs(fixedH1 - originalH1);
    
    // Count level changes (rough estimate)
    for (let level = 1; level <= 6; level++) {
      const originalCount = (originalContent.match(new RegExp(`<h${level}[^>]*>`, 'gi')) || []).length;
      const fixedCount = (fixedContent.match(new RegExp(`<h${level}[^>]*>`, 'gi')) || []).length;
      changes += Math.abs(fixedCount - originalCount);
    }
    
    return Math.max(1, Math.floor(changes / 2)); // Rough estimate
  }

  async fixDescriptionLists(directory = '.') {
    console.log(chalk.blue('📋 Fixing description list structure...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeDescriptionListStructure(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            }
            totalIssuesFound++;
          });
        }
        
        const fixed = this.fixDescriptionListStructureInContent(content);
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          console.log(chalk.green(`✅ Fixed description list structure in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} description list issues across ${results.length} files`));
    return results;
  }

  analyzeDescriptionListStructure(content) {
    const issues = [];
    
    // Find all dl elements
    const dlPattern = /<dl[^>]*>([\s\S]*?)<\/dl>/gi;
    let dlMatch;
    let dlIndex = 0;
    
    while ((dlMatch = dlPattern.exec(content)) !== null) {
      dlIndex++;
      const dlContent = dlMatch[1];
      const dlElement = dlMatch[0];
      
      // Analyze the content inside dl
      const dtElements = (dlContent.match(/<dt[^>]*>[\s\S]*?<\/dt>/gi) || []);
      const ddElements = (dlContent.match(/<dd[^>]*>[\s\S]*?<\/dd>/gi) || []);
      
      // Check for empty dl
      if (dtElements.length === 0 && ddElements.length === 0) {
        issues.push({
          type: '📋 Empty description list',
          description: `Description list ${dlIndex} is empty`,
          suggestion: 'Add dt/dd pairs or remove the empty dl element',
          severity: 'error',
          dlIndex,
          fix: 'remove-empty-dl'
        });
        continue;
      }
      
      // Check for missing dt elements
      if (dtElements.length === 0 && ddElements.length > 0) {
        issues.push({
          type: '📋 Missing dt elements',
          description: `Description list ${dlIndex} has dd elements but no dt elements`,
          suggestion: 'Add dt elements to describe the dd content',
          severity: 'error',
          dlIndex,
          fix: 'add-missing-dt'
        });
      }
      
      // Check for missing dd elements
      if (dtElements.length > 0 && ddElements.length === 0) {
        issues.push({
          type: '📋 Missing dd elements',
          description: `Description list ${dlIndex} has dt elements but no dd elements`,
          suggestion: 'Add dd elements to provide descriptions',
          severity: 'error',
          dlIndex,
          fix: 'add-missing-dd'
        });
      }
      
      // Check for improper nesting (non-dt/dd elements directly in dl)
      const invalidChildren = dlContent.match(/<(?!dt|dd|\/dt|\/dd)[a-zA-Z][^>]*>/g);
      if (invalidChildren) {
        const invalidTags = [...new Set(invalidChildren.map(tag => tag.match(/<([a-zA-Z]+)/)[1]))];
        issues.push({
          type: '📋 Invalid dl children',
          description: `Description list ${dlIndex} contains invalid child elements: ${invalidTags.join(', ')}`,
          suggestion: 'Only dt and dd elements should be direct children of dl',
          severity: 'warning',
          dlIndex,
          fix: 'wrap-invalid-children'
        });
      }
      
      // Check for empty dt/dd elements
      dtElements.forEach((dt, index) => {
        const dtText = dt.replace(/<[^>]*>/g, '').trim();
        if (!dtText) {
          issues.push({
            type: '📋 Empty dt element',
            description: `Empty dt element in description list ${dlIndex}`,
            suggestion: 'Add descriptive text to the dt element',
            severity: 'warning',
            dlIndex,
            dtIndex: index,
            fix: 'fix-empty-dt'
          });
        }
      });
      
      ddElements.forEach((dd, index) => {
        const ddText = dd.replace(/<[^>]*>/g, '').trim();
        if (!ddText) {
          issues.push({
            type: '📋 Empty dd element',
            description: `Empty dd element in description list ${dlIndex}`,
            suggestion: 'Add descriptive content to the dd element',
            severity: 'warning',
            dlIndex,
            ddIndex: index,
            fix: 'fix-empty-dd'
          });
        }
      });
      
      // Check for proper dt/dd pairing
      if (dtElements.length > 0 && ddElements.length > 0) {
        // Basic check: should have at least one dd for each dt
        if (ddElements.length < dtElements.length) {
          issues.push({
            type: '📋 Insufficient dd elements',
            description: `Description list ${dlIndex} has ${dtElements.length} dt elements but only ${ddElements.length} dd elements`,
            suggestion: 'Each dt should have at least one corresponding dd element',
            severity: 'warning',
            dlIndex
          });
        }
      }
    }
    
    return issues;
  }

  fixDescriptionListStructureInContent(content) {
    let fixed = content;
    
    // Fix empty dl elements
    fixed = fixed.replace(/<dl[^>]*>\s*<\/dl>/gi, (match) => {
      console.log(chalk.yellow(`  📋 Removed empty description list`));
      return '';
    });
    
    // Fix dl elements with only whitespace
    fixed = fixed.replace(/<dl[^>]*>[\s\n\r]*<\/dl>/gi, (match) => {
      console.log(chalk.yellow(`  📋 Removed empty description list`));
      return '';
    });
    
    // Fix dl elements with invalid direct children
    fixed = fixed.replace(/<dl([^>]*)>([\s\S]*?)<\/dl>/gi, (match, attributes, content) => {
      // Extract dt and dd elements
      const dtElements = content.match(/<dt[^>]*>[\s\S]*?<\/dt>/gi) || [];
      const ddElements = content.match(/<dd[^>]*>[\s\S]*?<\/dd>/gi) || [];
      
      // Find invalid children (not dt or dd)
      let cleanContent = content;
      
      // Remove invalid direct children by wrapping them in dd
      cleanContent = cleanContent.replace(/<(?!dt|dd|\/dt|\/dd)([a-zA-Z][^>]*)>([\s\S]*?)<\/[a-zA-Z]+>/gi, (invalidMatch, tag, innerContent) => {
        console.log(chalk.yellow(`  📋 Wrapped invalid child element in dd`));
        return `<dd>${invalidMatch}</dd>`;
      });
      
      // Handle text nodes that are not in dt/dd
      cleanContent = cleanContent.replace(/^([^<]+)(?=<(?:dt|dd))/gm, (textMatch) => {
        const trimmed = textMatch.trim();
        if (trimmed) {
          console.log(chalk.yellow(`  📋 Wrapped loose text in dd`));
          return `<dd>${trimmed}</dd>`;
        }
        return '';
      });
      
      return `<dl${attributes}>${cleanContent}</dl>`;
    });
    
    // Add missing dd elements for dt elements without corresponding dd
    fixed = fixed.replace(/<dl([^>]*)>([\s\S]*?)<\/dl>/gi, (match, attributes, content) => {
      const dtPattern = /<dt[^>]*>([\s\S]*?)<\/dt>/gi;
      const ddPattern = /<dd[^>]*>[\s\S]*?<\/dd>/gi;
      
      const dtMatches = [...content.matchAll(dtPattern)];
      const ddMatches = [...content.matchAll(ddPattern)];
      
      if (dtMatches.length > 0 && ddMatches.length === 0) {
        // Add dd elements after each dt
        let fixedContent = content;
        
        // Process from end to beginning to maintain positions
        for (let i = dtMatches.length - 1; i >= 0; i--) {
          const dtMatch = dtMatches[i];
          const dtText = dtMatch[1].replace(/<[^>]*>/g, '').trim();
          const ddText = this.generateDescriptionForTerm(dtText);
          
          const insertPosition = dtMatch.index + dtMatch[0].length;
          fixedContent = fixedContent.slice(0, insertPosition) + 
                        `\n    <dd>${ddText}</dd>` + 
                        fixedContent.slice(insertPosition);
        }
        
        console.log(chalk.yellow(`  📋 Added missing dd elements for ${dtMatches.length} dt elements`));
        return `<dl${attributes}>${fixedContent}</dl>`;
      }
      
      return match;
    });
    
    // Fix empty dt/dd elements
    fixed = fixed.replace(/<dt[^>]*>\s*<\/dt>/gi, (match) => {
      const lang = this.config.language;
      const defaultText = lang === 'ja' ? '項目' : lang === 'vi' ? 'Mục' : 'Term';
      console.log(chalk.yellow(`  📋 Added text to empty dt element`));
      return match.replace(/>\s*</, `>${defaultText}<`);
    });
    
    fixed = fixed.replace(/<dd[^>]*>\s*<\/dd>/gi, (match) => {
      const lang = this.config.language;
      const defaultText = lang === 'ja' ? '説明' : lang === 'vi' ? 'Mô tả' : 'Description';
      console.log(chalk.yellow(`  📋 Added text to empty dd element`));
      return match.replace(/>\s*</, `>${defaultText}<`);
    });
    
    return fixed;
  }

  generateDescriptionForTerm(termText) {
    const lang = this.config.language;
    
    // Try to generate meaningful description based on term
    if (termText) {
      const descriptions = {
        ja: `${termText}の説明`,
        en: `Description of ${termText}`,
        vi: `Mô tả về ${termText}`
      };
      return descriptions[lang] || descriptions.en;
    }
    
    // Fallback to generic description
    const fallbacks = {
      ja: '説明',
      en: 'Description',
      vi: 'Mô tả'
    };
    
    return fallbacks[lang] || fallbacks.en;
  }

  /**
   * Fix heading structure issues
   * Ensures proper heading hierarchy: only one h1, proper nesting, no duplicates in same section
   */
  async fixHeadingStructure(directory = '.') {
    console.log(chalk.blue('📑 Fixing heading structure...'));
    
    const htmlFiles = await this.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    let totalFixesApplied = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const analysis = this.analyzeHeadingStructure(content);
        
        if (analysis.issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          analysis.issues.forEach(issue => {
            console.log(chalk.yellow(`  📑 ${issue.type}: ${issue.description}`));
            console.log(chalk.gray(`    💡 ${issue.suggestion}`));
            totalIssuesFound++;
          });
        }
        
        let fixed = content;
        let fixesApplied = 0;
        
        if (this.config.autoFixHeadings) {
          const fixResult = this.fixHeadingStructureInContent(content, analysis);
          fixed = fixResult.content;
          fixesApplied = fixResult.fixes;
          totalFixesApplied += fixesApplied;
          
          if (fixesApplied > 0) {
            console.log(chalk.green(`✅ Fixed heading structure in: ${file} (${fixesApplied} fixes)`));
          }
        }
        
        if (fixed !== content) {
          if (this.config.backupFiles) {
            await fs.writeFile(`${file}.backup`, content);
          }
          
          if (!this.config.dryRun) {
            await fs.writeFile(file, fixed);
          }
          
          results.push({ 
            file, 
            status: 'fixed', 
            issues: analysis.issues.length,
            fixes: fixesApplied
          });
        } else {
          results.push({ 
            file, 
            status: 'no-change', 
            issues: analysis.issues.length,
            fixes: 0
          });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} heading issues across ${results.length} files`));
    if (this.config.autoFixHeadings) {
      console.log(chalk.blue(`   Fixed ${totalFixesApplied} heading issues automatically`));
    } else {
      console.log(chalk.gray('💡 Use --auto-fix-headings option to enable automatic fixes'));
    }
    
    return results;
  }

  /**
   * Analyze heading structure for issues
   */
  analyzeHeadingStructure(content) {
    const issues = [];
    const headings = [];
    
    // Extract all headings with their positions and context
    const headingRegex = /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
    let match;
    let headingIndex = 0;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headingIndex++;
      const level = parseInt(match[1]);
      const attributes = match[2];
      const text = match[3].replace(/<[^>]*>/g, '').trim();
      const fullMatch = match[0];
      const position = match.index;
      
      // Find the section context (look for parent elements)
      const beforeContent = content.substring(0, position);
      const sectionContext = this.findSectionContext(beforeContent);
      
      headings.push({
        level,
        text,
        attributes,
        fullMatch,
        position,
        index: headingIndex,
        sectionContext
      });
    }
    
    if (headings.length === 0) {
      return { issues, headings };
    }
    
    // Check for multiple h1 elements
    const h1Elements = headings.filter(h => h.level === 1);
    if (h1Elements.length > 1) {
      issues.push({
        type: 'Multiple h1 elements',
        description: `Found ${h1Elements.length} h1 elements, should have only one`,
        suggestion: 'Convert extra h1 elements to h2-h6 as appropriate',
        severity: 'error',
        headings: h1Elements,
        fix: 'convert-extra-h1'
      });
    } else if (h1Elements.length === 0) {
      issues.push({
        type: 'Missing h1 element',
        description: 'Page should have exactly one h1 element',
        suggestion: 'Convert the first heading to h1 or add an h1 element',
        severity: 'error',
        fix: 'add-missing-h1'
      });
    }
    
    // Check for heading level skipping
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      if (current.level > previous.level + 1) {
        issues.push({
          type: 'Heading level skip',
          description: `Heading level jumps from h${previous.level} to h${current.level}`,
          suggestion: `Use h${previous.level + 1} instead of h${current.level}`,
          severity: 'warning',
          heading: current,
          previousHeading: previous,
          fix: 'fix-level-skip'
        });
      }
    }
    
    // Check for empty headings
    headings.forEach(heading => {
      if (!heading.text || heading.text.length === 0) {
        issues.push({
          type: 'Empty heading',
          description: `Heading ${heading.index} (h${heading.level}) is empty`,
          suggestion: 'Add descriptive text to the heading or remove it',
          severity: 'warning',
          heading,
          fix: 'fix-empty-heading'
        });
      }
    });
    
    // Check for duplicate headings in the same section
    const sectionGroups = {};
    headings.forEach(heading => {
      const sectionKey = heading.sectionContext || 'root';
      if (!sectionGroups[sectionKey]) {
        sectionGroups[sectionKey] = [];
      }
      sectionGroups[sectionKey].push(heading);
    });
    
    Object.entries(sectionGroups).forEach(([section, sectionHeadings]) => {
      const textGroups = {};
      sectionHeadings.forEach(heading => {
        if (heading.text) {
          const normalizedText = heading.text.toLowerCase().trim();
          if (!textGroups[normalizedText]) {
            textGroups[normalizedText] = [];
          }
          textGroups[normalizedText].push(heading);
        }
      });
      
      Object.entries(textGroups).forEach(([text, duplicates]) => {
        if (duplicates.length > 1 && duplicates[0].level === duplicates[1].level) {
          issues.push({
            type: 'Duplicate heading',
            description: `Duplicate h${duplicates[0].level} heading: "${text}"`,
            suggestion: 'Make heading text unique or merge content',
            severity: 'warning',
            headings: duplicates,
            section,
            fix: 'fix-duplicate-heading'
          });
        }
      });
    });
    
    return { issues, headings };
  }

  /**
   * Find section context for a heading
   */
  findSectionContext(beforeContent) {
    // Look for common section elements
    const sectionPatterns = [
      /<section[^>]*>/gi,
      /<article[^>]*>/gi,
      /<main[^>]*>/gi,
      /<div[^>]*class[^>]*section[^>]*>/gi,
      /<div[^>]*id[^>]*section[^>]*>/gi
    ];
    
    let lastSectionMatch = null;
    let lastSectionPosition = -1;
    
    sectionPatterns.forEach(pattern => {
      let match;
      pattern.lastIndex = 0; // Reset regex
      while ((match = pattern.exec(beforeContent)) !== null) {
        if (match.index > lastSectionPosition) {
          lastSectionPosition = match.index;
          lastSectionMatch = match[0];
        }
      }
    });
    
    return lastSectionMatch ? `section_${lastSectionPosition}` : 'root';
  }

  /**
   * Fix heading structure issues in content
   */
  fixHeadingStructureInContent(content, analysis) {
    let fixed = content;
    let fixesApplied = 0;
    
    if (!analysis || !analysis.issues) {
      return { content: fixed, fixes: fixesApplied };
    }
    
    // Sort issues by position (from end to start to avoid position shifts)
    const sortedIssues = analysis.issues
      .filter(issue => issue.fix)
      .sort((a, b) => {
        const posA = a.heading?.position || a.headings?.[0]?.position || 0;
        const posB = b.heading?.position || b.headings?.[0]?.position || 0;
        return posB - posA;
      });
    
    sortedIssues.forEach(issue => {
      switch (issue.fix) {
        case 'convert-extra-h1':
          // Convert extra h1 elements to h2
          if (issue.headings && issue.headings.length > 1) {
            // Keep the first h1, convert others to h2
            for (let i = 1; i < issue.headings.length; i++) {
              const heading = issue.headings[i];
              const newHeading = heading.fullMatch.replace(/h1/gi, 'h2');
              fixed = fixed.replace(heading.fullMatch, newHeading);
              console.log(chalk.yellow(`  📑 Converted extra h1 to h2: "${heading.text}"`));
              fixesApplied++;
            }
          }
          break;
          
        case 'add-missing-h1':
          // Convert the first heading to h1
          if (analysis.headings && analysis.headings.length > 0) {
            const firstHeading = analysis.headings[0];
            const newHeading = firstHeading.fullMatch.replace(
              new RegExp(`h${firstHeading.level}`, 'gi'), 
              'h1'
            );
            fixed = fixed.replace(firstHeading.fullMatch, newHeading);
            console.log(chalk.yellow(`  📑 Converted first heading to h1: "${firstHeading.text}"`));
            fixesApplied++;
          }
          break;
          
        case 'fix-level-skip':
          // Fix heading level skipping
          if (issue.heading && issue.previousHeading) {
            const correctLevel = issue.previousHeading.level + 1;
            const newHeading = issue.heading.fullMatch.replace(
              new RegExp(`h${issue.heading.level}`, 'gi'),
              `h${correctLevel}`
            );
            fixed = fixed.replace(issue.heading.fullMatch, newHeading);
            console.log(chalk.yellow(`  📑 Fixed level skip: h${issue.heading.level} → h${correctLevel} for "${issue.heading.text}"`));
            fixesApplied++;
          }
          break;
          
        case 'fix-empty-heading':
          // Add text to empty headings based on context
          if (issue.heading) {
            const contextText = this.generateHeadingText(issue.heading, content);
            const newHeading = issue.heading.fullMatch.replace(
              /(<h[1-6][^>]*>)(\s*)(.*?)(\s*)(<\/h[1-6]>)/i,
              `$1${contextText}$5`
            );
            fixed = fixed.replace(issue.heading.fullMatch, newHeading);
            console.log(chalk.yellow(`  📑 Added text to empty heading: "${contextText}"`));
            fixesApplied++;
          }
          break;
          
        case 'fix-duplicate-heading':
          // Make duplicate headings unique by adding numbers
          if (issue.headings && issue.headings.length > 1) {
            for (let i = 1; i < issue.headings.length; i++) {
              const heading = issue.headings[i];
              const newText = `${heading.text} (${i + 1})`;
              const newHeading = heading.fullMatch.replace(
                heading.text,
                newText
              );
              fixed = fixed.replace(heading.fullMatch, newHeading);
              console.log(chalk.yellow(`  📑 Made duplicate heading unique: "${newText}"`));
              fixesApplied++;
            }
          }
          break;
      }
    });
    
    return { content: fixed, fixes: fixesApplied };
  }

  /**
   * Generate appropriate text for empty headings based on context
   */
  generateHeadingText(heading, content) {
    // Look for context around the heading
    const position = heading.position;
    const beforeText = content.substring(Math.max(0, position - 200), position);
    const afterText = content.substring(position + heading.fullMatch.length, position + heading.fullMatch.length + 200);
    
    // Extract meaningful words from surrounding content
    const contextWords = (beforeText + ' ' + afterText)
      .replace(/<[^>]*>/g, ' ')
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !/^\d+$/.test(word))
      .slice(0, 3);
    
    if (contextWords.length > 0) {
      return contextWords.join(' ');
    }
    
    // Fallback based on heading level
    const levelNames = {
      1: 'Main Content',
      2: 'Section',
      3: 'Subsection', 
      4: 'Details',
      5: 'Information',
      6: 'Notes'
    };
    
    return levelNames[heading.level] || 'Content';
  }

  async findHtmlFiles(directory) {
    const files = [];
    
    // Check if the path is a file or directory
    const stat = await fs.stat(directory);
    
    if (stat.isFile()) {
      // If it's a file, check if it's HTML
      if (directory.endsWith('.html')) {
        files.push(directory);
      }
      return files;
    }
    
    // If it's a directory, scan recursively
    async function scan(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await scan(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    }
    
    await scan(directory);
    return files;
  }

  // Check for unused files in the project - enhanced for comprehensive project-wide scanning
  async checkUnusedFiles(directory = '.') {
    console.log(chalk.blue('🗂️ Analyzing unused files across entire project...'));
    
    const startTime = Date.now();
    
    // Determine scan directory - use specified directory or project root for comprehensive scanning
    const scanDirectory = path.resolve(directory);
    console.log(chalk.gray(`📁 Scanning directory: ${path.relative(process.cwd(), scanDirectory) || '.'}`));
    
    // Get all project files from scan directory
    const allFiles = await this.findAllProjectFiles(scanDirectory);
    console.log(chalk.gray(`📊 Found ${allFiles.length} total files in scan area`));
    
    // Get referenced files from scan directory
    const referencedFiles = await this.findReferencedFiles(scanDirectory);
    console.log(chalk.gray(`🔍 Found ${referencedFiles.size} referenced files`));
    

    
    // Find unused files
    const unusedFiles = [];
    
    for (const file of allFiles) {
      // Skip certain directories and files that shouldn't be considered "unused"
      if (this.shouldSkipUnusedCheck(file)) {
        continue;
      }
      
      // Check if file is referenced anywhere in the scan area
      const relativePath = path.relative(scanDirectory, file);
      const isReferenced = this.isFileReferenced(file, relativePath, referencedFiles, scanDirectory);
      

      
      if (!isReferenced) {
        const stats = await require('fs').promises.stat(file);
        const fileSize = this.formatFileSize(stats.size);
        const fileType = this.getFileType(file);
        
        unusedFiles.push({
          path: file,
          relativePath: relativePath,
          size: stats.size,
          formattedSize: fileSize,
          type: fileType,
          description: `File not referenced anywhere in project: ${relativePath}`,
          suggestion: `Consider removing if truly unused: ${relativePath}`
        });
      }
    }
    
    // Sort by size (largest first)
    unusedFiles.sort((a, b) => b.size - a.size);
    
    // Display results
    if (unusedFiles.length === 0) {
      console.log(chalk.green('✅ No unused files found! All files are properly referenced.'));
    } else {
      console.log(chalk.yellow(`\n📋 Found ${unusedFiles.length} potentially unused files:`));
      
      unusedFiles.forEach((file, index) => {
        const icon = this.getFileIcon(file.type);
        console.log(chalk.yellow(`  ${index + 1}. ${icon} ${file.relativePath} (${file.formattedSize})`));
      });
      
      const totalSize = unusedFiles.reduce((sum, file) => sum + file.size, 0);
      console.log(chalk.blue(`\n📊 Total unused file size: ${this.formatFileSize(totalSize)}`));
      console.log(chalk.gray('💡 Review these files before deleting - some may be used dynamically or required for deployment'));
    }
    
    const endTime = Date.now();
    console.log(chalk.gray(`⏱️ Analysis completed in ${endTime - startTime}ms`));
    
    return {
      unusedFiles: unusedFiles,
      totalFiles: allFiles.length,
      referencedFiles: referencedFiles.size,
      unusedCount: unusedFiles.length,
      totalUnusedSize: unusedFiles.reduce((sum, file) => sum + file.size, 0)
    };
  }

  // Enhanced file reference checking - now works with relative paths
  isFileReferenced(filePath, relativePath, referencedFiles, projectRoot) {
    // Check various possible reference formats
    const possibleRefs = [
      relativePath,                                    // relative/to/file.ext
      '/' + relativePath,                              // /relative/to/file.ext  
      './' + relativePath,                             // ./relative/to/file.ext
      '../' + relativePath,                            // ../relative/to/file.ext
      path.basename(filePath),                         // file.ext
      '/' + path.basename(filePath),                   // /file.ext
      relativePath.replace(/\\/g, '/'),                // normalize windows paths
      '/' + relativePath.replace(/\\/g, '/'),          // /normalized/path
      relativePath.replace(/^\.\//, ''),               // remove leading ./
      relativePath.replace(/^\//, ''),                 // remove leading /
    ];
    
    // Check if any reference format exists in the set
    for (const ref of possibleRefs) {
      if (referencedFiles.has(ref)) {
        return true;
      }
    }
    
    // Additional checks for path variations
    const fileName = path.basename(filePath);
    const relativeDir = path.dirname(relativePath);
    
    // Check for references that might include parent directory names
    for (const ref of referencedFiles) {
      // If reference ends with the filename, check if path context matches
      if (ref.endsWith('/' + fileName) || ref === fileName) {
        return true;
      }
      
      // Check for absolute paths that correspond to our relative path
      if (ref.startsWith('/') && ref.includes(fileName)) {
        const refWithoutLeading = ref.substring(1);
        if (refWithoutLeading === relativePath || refWithoutLeading.endsWith('/' + fileName)) {
          return true;
        }
      }
    }
    
    return false;
  }

  async findAllProjectFiles(directory) {
    const files = [];
    // Only check web assets: CSS, HTML, JS, and images
    const extensions = ['.css', '.html', '.htm', '.js', '.jsx', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
    
    const scan = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            // Skip common directories that shouldn't be analyzed
            if (!this.shouldSkipDirectory(entry.name)) {
              await scan(fullPath);
            }
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
        console.log(chalk.gray(`⚠️ Skipping directory ${dir}: ${error.message}`));
      }
    };
    
    await scan(directory);
    return files;
  }

  // Enhanced reference finding across entire project
  async findReferencedFiles(directory) {
    const referencedFiles = new Set();
    
    // Find all source files that could contain references
    const sourceFiles = await this.findSourceFiles(directory);
    console.log(chalk.gray(`🔍 Scanning ${sourceFiles.length} source files for references...`));
    
    for (const sourceFile of sourceFiles) {
      try {
        const content = await fs.readFile(sourceFile, 'utf-8');
        const baseDir = path.dirname(sourceFile);
        
        // Extract references based on file type
        const refs = this.extractAllReferences(content, baseDir, sourceFile);
        refs.forEach(ref => referencedFiles.add(ref));
        
      } catch (error) {
        console.log(chalk.gray(`⚠️ Could not read ${sourceFile}: ${error.message}`));
      }
    }
    
    return referencedFiles;
  }

  // Find HTML, CSS/SCSS, JS, and other source files to scan for references
  async findSourceFiles(directory) {
    const sourceFiles = [];
    
    const walk = async (dir) => {
      try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = await fs.stat(filePath);
          
          if (stat.isDirectory()) {
            if (!this.shouldSkipDirectory(file)) {
              await walk(filePath);
            }
          } else {
            // Include HTML, CSS/SCSS, JavaScript, TypeScript, Vue, PHP, JSON, XML, SVG
            const ext = path.extname(file).toLowerCase();
            if (['.html', '.htm', '.css', '.scss', '.sass', 
                 '.js', '.jsx', '.ts', '.tsx', '.mjs',
                 '.vue', '.php', '.json', '.xml', '.svg'].includes(ext)) {
              sourceFiles.push(filePath);
            }
          }
        }
      } catch (error) {
        console.log(chalk.gray(`⚠️ Could not read directory ${dir}: ${error.message}`));
      }
    };
    
    await walk(directory);
    return sourceFiles;
  }

  // Enhanced reference extraction from HTML, CSS, JS, and other source files
  extractAllReferences(content, baseDir, sourceFile) {
    const references = [];
    const ext = path.extname(sourceFile).toLowerCase();
    
    if (['.html', '.htm'].includes(ext)) {
      // Extract from HTML files - main entry points
      const htmlRefs = this.extractHtmlReferences(content, baseDir);
      references.push(...htmlRefs);
      
    } else if (['.css', '.scss', '.sass'].includes(ext)) {
      // Extract from CSS/SCSS files - background images
      const cssRefs = this.extractCssReferences(content, baseDir);
      references.push(...cssRefs);
      
    } else if (['.js', '.jsx', '.ts', '.tsx', '.mjs'].includes(ext)) {
      // Extract from JavaScript/TypeScript files - imports, requires, dynamic imports
      const jsRefs = this.extractJsReferences(content, baseDir);
      references.push(...jsRefs);
      
    } else if (ext === '.vue') {
      // Extract from Vue files - template, script, and style sections
      const vueRefs = this.extractVueReferences(content, baseDir);
      references.push(...vueRefs);
      
    } else if (ext === '.json') {
      // Extract from JSON files - config files, manifests
      const jsonRefs = this.extractJsonReferences(content, baseDir);
      references.push(...jsonRefs);
      
    } else if (['.xml', '.svg'].includes(ext)) {
      // Extract from XML/SVG files - embedded references
      const xmlRefs = this.extractXmlReferences(content, baseDir);
      references.push(...xmlRefs);
      
    } else if (ext === '.php') {
      // Extract from PHP files - mixed HTML/PHP content
      const phpRefs = this.extractPhpReferences(content, baseDir);
      references.push(...phpRefs);
    }
    
    return references;
  }

  extractHtmlReferences(content, baseDir) {
    const references = [];
    
    // HTML patterns for file references
    const patterns = [
      // Images
      /<img[^>]*src\s*=\s*["']([^"']+)["']/gi,
      // Srcset (responsive images)
      /<img[^>]*srcset\s*=\s*["']([^"']+)["']/gi,
      /<source[^>]*srcset\s*=\s*["']([^"']+)["']/gi,
      // Data attributes (lazy loading, etc.)
      /data-src\s*=\s*["']([^"']+)["']/gi,
      /data-background\s*=\s*["']([^"']+)["']/gi,
      /data-image\s*=\s*["']([^"']+)["']/gi,
      /data-bg\s*=\s*["']([^"']+)["']/gi,
      /data-lazy\s*=\s*["']([^"']+)["']/gi,
      // Links (CSS, other files)
      /<link[^>]*href\s*=\s*["']([^"']+)["']/gi,
      // Scripts
      /<script[^>]*src\s*=\s*["']([^"']+)["']/gi,
      // Anchors to other HTML files
      /<a[^>]*href\s*=\s*["']([^"'#]+\.html?)["']/gi,
      // Video/Audio
      /<(?:video|audio)[^>]*src\s*=\s*["']([^"']+)["']/gi,
      // Object/Embed
      /<(?:object|embed)[^>]*src\s*=\s*["']([^"']+)["']/gi,
      // Iframe
      /<iframe[^>]*src\s*=\s*["']([^"']+)["']/gi,
      // Meta (for icons)
      /<meta[^>]*content\s*=\s*["']([^"']+\.(ico|png|jpg|jpeg|svg))["']/gi,
      // Server Side Includes (SSI)
      /<!--#include\s+virtual\s*=\s*["']([^"']+)["']\s*-->/gi,
      /<!--#include\s+file\s*=\s*["']([^"']+)["']\s*-->/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const url = match[1];
        
        // Handle srcset format: "image1.jpg 1x, image2.jpg 2x"
        if (pattern.source.includes('srcset')) {
          const srcsetUrls = url.split(',').map(item => item.trim().split(' ')[0]);
          srcsetUrls.forEach(srcUrl => {
            if (this.isLocalFile(srcUrl)) {
              this.addNormalizedUrl(references, srcUrl);
            }
          });
        } else {
          if (this.isLocalFile(url)) {
            this.addNormalizedUrl(references, url);
          }
        }
      }
    }
    
    return references;
  }

  // Helper method to add normalized URL variations
  addNormalizedUrl(references, url) {
    // Store original URL and normalized versions for matching
    references.push(url);
    if (url.startsWith('/')) {
      references.push(url.substring(1)); // Remove leading slash
    }
    if (!url.startsWith('./') && !url.startsWith('/')) {
      references.push('./' + url); // Add leading ./
    }
  }

  extractCssReferences(content, baseDir) {
    const references = [];
    
    // CSS patterns for file references  
    const patterns = [
      // url() function - background images, fonts, etc.
      /url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi,
      // @import CSS files
      /@import\s+["']([^"']+)["']/gi,
      // CSS custom properties with URLs
      /--[^:]+:\s*url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const url = match[1];
        if (this.isLocalFile(url)) {
          this.addNormalizedUrl(references, url);
        }
      }
    }
    
    return references;
  }

  extractJsReferences(content, baseDir) {
    const references = [];
    
    // JavaScript/TypeScript patterns for file references
    const patterns = [
      // ES6 import statements
      /import\s+.*?from\s+["']([^"']+)["']/gi,
      // Dynamic imports
      /import\s*\(\s*["']([^"']+)["']\s*\)/gi,
      // CommonJS require
      /require\s*\(\s*["']([^"']+)["']\s*\)/gi,
      // fetch() API calls
      /fetch\s*\(\s*["']([^"']+)["']\s*\)/gi,
      // XMLHttpRequest
      /\.open\s*\(\s*["'][^"']*["']\s*,\s*["']([^"']+)["']/gi,
      // String literals that look like paths
      /["']([^"']*\.(html|css|js|json|xml|jpg|jpeg|png|gif|svg|webp|ico))["']/gi,
      // Template literals with paths
      /`([^`]*\.(html|css|js|json|xml|jpg|jpeg|png|gif|svg|webp|ico))`/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const url = match[1];
        if (this.isLocalFile(url)) {
          this.addNormalizedUrl(references, url);
        }
      }
    }
    
    return references;
  }

  extractVueReferences(content, baseDir) {
    const references = [];
    
    // Extract from template section (HTML-like)
    const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
    if (templateMatch) {
      const htmlRefs = this.extractHtmlReferences(templateMatch[1], baseDir);
      references.push(...htmlRefs);
    }
    
    // Extract from script section (JS-like)
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (scriptMatch) {
      const jsRefs = this.extractJsReferences(scriptMatch[1], baseDir);
      references.push(...jsRefs);
    }
    
    // Extract from style section (CSS-like)
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch) {
      const cssRefs = this.extractCssReferences(styleMatch[1], baseDir);
      references.push(...cssRefs);
    }
    
    return references;
  }

  extractJsonReferences(content, baseDir) {
    const references = [];
    
    try {
      // Parse JSON and look for string values that might be file paths
      const data = JSON.parse(content);
      
      const findPaths = (obj) => {
        if (typeof obj === 'string') {
          // Check if string looks like a file path
          if (/\.(html|css|js|json|xml|jpg|jpeg|png|gif|svg|webp|ico)$/i.test(obj)) {
            if (this.isLocalFile(obj)) {
              this.addNormalizedUrl(references, obj);
            }
          }
        } else if (Array.isArray(obj)) {
          obj.forEach(item => findPaths(item));
        } else if (obj && typeof obj === 'object') {
          Object.values(obj).forEach(value => findPaths(value));
        }
      };
      
      findPaths(data);
    } catch (error) {
      // If JSON parsing fails, try regex patterns
      const patterns = [
        /["']([^"']*\.(html|css|js|json|xml|jpg|jpeg|png|gif|svg|webp|ico))["']/gi
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const url = match[1];
          if (this.isLocalFile(url)) {
            this.addNormalizedUrl(references, url);
          }
        }
      }
    }
    
    return references;
  }

  extractXmlReferences(content, baseDir) {
    const references = [];
    
    // XML/SVG patterns for file references
    const patterns = [
      // href attributes
      /href\s*=\s*["']([^"']+)["']/gi,
      // src attributes
      /src\s*=\s*["']([^"']+)["']/gi,
      // xlink:href (SVG)
      /xlink:href\s*=\s*["']([^"']+)["']/gi,
      // file attributes
      /file\s*=\s*["']([^"']+)["']/gi,
      // path attributes with file extensions
      /path\s*=\s*["']([^"']*\.(html|css|js|jpg|jpeg|png|gif|svg))["']/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const url = match[1];
        if (this.isLocalFile(url)) {
          this.addNormalizedUrl(references, url);
        }
      }
    }
    
    return references;
  }

  extractPhpReferences(content, baseDir) {
    const references = [];
    
    // PHP can contain HTML, so extract HTML references first
    const htmlRefs = this.extractHtmlReferences(content, baseDir);
    references.push(...htmlRefs);
    
    // PHP-specific patterns
    const patterns = [
      // include/require statements
      /(?:include|require|include_once|require_once)\s*\(\s*["']([^"']+)["']\s*\)/gi,
      // file_get_contents
      /file_get_contents\s*\(\s*["']([^"']+)["']\s*\)/gi,
      // readfile
      /readfile\s*\(\s*["']([^"']+)["']\s*\)/gi,
      // fopen
      /fopen\s*\(\s*["']([^"']+)["']\s*,/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const url = match[1];
        if (this.isLocalFile(url)) {
          this.addNormalizedUrl(references, url);
        }
      }
    }
    
    return references;
  }

  async findCssFiles(directory) {
    const files = [];
    
    async function scan(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            await scan(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.css')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }
    
    await scan(directory);
    return files;
  }

  async findJsFiles(directory) {
    const files = [];
    
    async function scan(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            await scan(fullPath);
          } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.mjs'))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }
    
    await scan(directory);
    return files;
  }

  shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules', '.git', '.svn', '.hg', 'bower_components',
      'vendor', 'tmp', 'temp', '.cache', 'dist', 'build', 'coverage',
      '.nyc_output', '.vscode', '.idea', '__pycache__', '.DS_Store'
    ];
    return skipDirs.includes(dirName) || dirName.startsWith('.');
  }

  shouldSkipUnusedCheck(filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Skip index files - they are main entry points
    if (/^index\d*\.(html?|htm)$/i.test(fileName)) {
      return true;
    }
    
    // Skip OGP images - usually referenced with absolute paths in meta tags
    if (/^ogp\.(png|jpg|jpeg)$/i.test(fileName)) {
      return true;
    }
    
    // Skip certain file types and patterns - but only in root directory
    const skipPatterns = [
      // Common files that might not be directly referenced - only in root
      /^(main|app)\.(html|js|css)$/i,
      /^(readme|license|changelog)/i,
      /^package\.json$/i,
      /^\.gitignore$/i,
      /^robots\.txt$/i,
      /^sitemap\.xml$/i,
      // Backup files
      /\.backup$/i,
      // Test directories
      /test|spec|__tests__/i
    ];
    
    // Only skip favicon in root directory, not in assets folders
    if (/^favicon\.(ico|png)$/i.test(fileName) && !relativePath.includes('/')) {
      return true;
    }
    
    return skipPatterns.some(pattern => 
      pattern.test(fileName) || pattern.test(dirName)
    );
  }

  getFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const typeMap = {
      '.html': 'HTML',
      '.css': 'CSS',
      '.js': 'JavaScript',
      '.mjs': 'JavaScript Module',
      '.jpg': 'Image',
      '.jpeg': 'Image',
      '.png': 'Image',
      '.gif': 'Image',
      '.svg': 'SVG',
      '.webp': 'Image',
      '.ico': 'Icon',
      '.pdf': 'PDF',
      '.mp4': 'Video',
      '.webm': 'Video',
      '.mp3': 'Audio',
      '.wav': 'Audio'
    };
    
    return typeMap[ext] || 'File';
  }

  isLocalFile(url) {
    return !url.startsWith('http://') && 
           !url.startsWith('https://') && 
           !url.startsWith('//') &&
           !url.startsWith('data:') &&
           !url.startsWith('mailto:') &&
           !url.startsWith('tel:') &&
           !url.startsWith('#');
  }

  resolveFilePath(url, baseDir) {
    try {
      let filePath;
      
      if (url.startsWith('/')) {
        // Absolute path from web root
        filePath = path.join(baseDir, url.substring(1));
      } else {
        // Relative path
        filePath = path.resolve(baseDir, url);
      }
      
      return filePath;
    } catch (error) {
      return null;
    }
  }

  // Check for dead code in CSS and JavaScript files
  async checkDeadCode(directory = '.') {
    console.log(chalk.blue('☠️ Checking for dead code...'));
    
    const results = [];
    
    // Check CSS dead code
    const cssDeadCode = await this.checkDeadCss(directory);
    results.push(...cssDeadCode);
    
    // Check JavaScript dead code
    const jsDeadCode = await this.checkDeadJs(directory);
    results.push(...jsDeadCode);
    
    console.log(chalk.blue(`\n📊 Summary: Found ${results.length} potential dead code issues`));
    console.log(chalk.gray('💡 Dead code analysis is heuristic - manual review recommended'));
    
    return results;
  }

  async checkDeadCss(directory) {
    console.log(chalk.cyan('🎨 Analyzing CSS dead code...'));
    
    const results = [];
    const cssFiles = await this.findCssFiles(directory);
    const htmlFiles = await this.findHtmlFiles(directory);
    
    // Get all HTML content to check against
    let allHtmlContent = '';
    for (const htmlFile of htmlFiles) {
      try {
        const content = await fs.readFile(htmlFile, 'utf8');
        allHtmlContent += content + '\n';
      } catch (error) {
        // Skip files we can't read
      }
    }
    
    for (const cssFile of cssFiles) {
      try {
        const content = await fs.readFile(cssFile, 'utf8');
        const deadRules = this.findDeadCssRules(content, allHtmlContent);
        
        if (deadRules.length > 0) {
          const relativePath = path.relative(directory, cssFile);
          console.log(chalk.cyan(`\n📁 ${relativePath}:`));
          
          deadRules.forEach(rule => {
            console.log(chalk.yellow(`  ☠️ Potentially dead CSS: ${rule.selector}`));
            results.push({
              type: '☠️ Dead CSS rule',
              description: `CSS selector not found in HTML: ${rule.selector}`,
              suggestion: `Consider removing unused CSS rule: ${rule.selector}`,
              filePath: cssFile,
              relativePath: relativePath,
              selector: rule.selector,
              lineNumber: rule.lineNumber
            });
          });
        }
        
      } catch (error) {
        console.error(chalk.red(`❌ Error analyzing CSS ${cssFile}: ${error.message}`));
      }
    }
    
    return results;
  }

  findDeadCssRules(cssContent, htmlContent) {
    const deadRules = [];
    
    // Simple CSS parser to extract selectors
    const cssRules = this.parseCssSelectors(cssContent);
    
    for (const rule of cssRules) {
      if (this.isCssSelectorUsed(rule.selector, htmlContent)) {
        continue; // Selector is used
      }
      
      // Skip certain selectors that are commonly dynamic
      if (this.shouldSkipCssSelector(rule.selector)) {
        continue;
      }
      
      deadRules.push(rule);
    }
    
    return deadRules;
  }

  parseCssSelectors(cssContent) {
    const rules = [];
    const lines = cssContent.split('\n');
    let inRule = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip comments and empty lines
      if (line.startsWith('/*') || line.includes('*/') || !line) {
        continue;
      }
      
      // Skip @rules like @media, @keyframes
      if (line.startsWith('@')) {
        continue;
      }
      
      // Check if we're entering a rule block
      if (line.includes('{')) {
        inRule = true;
        // Extract selector part before the {
        const selectorPart = line.split('{')[0].trim();
        if (selectorPart && !selectorPart.includes(':') && !selectorPart.includes(';')) {
          rules.push({
            selector: selectorPart,
            lineNumber: i + 1
          });
        }
        continue;
      }
      
      // Check if we're exiting a rule block
      if (line.includes('}')) {
        inRule = false;
        continue;
      }
      
      // If we're not in a rule and line doesn't contain CSS properties, it might be a selector
      if (!inRule && !line.includes(':') && !line.includes(';') && line.length > 0) {
        rules.push({
          selector: line,
          lineNumber: i + 1
        });
      }
    }
    
    return rules;
  }

  isCssSelectorUsed(selector, htmlContent) {
    // Simple heuristic checks
    
    // Check for class selectors
    if (selector.startsWith('.')) {
      const className = selector.substring(1).split(/[:\s>+~]/)[0];
      return htmlContent.includes(`class="${className}"`) || 
             htmlContent.includes(`class='${className}'`) ||
             htmlContent.includes(`class=".*${className}.*"`) ||
             htmlContent.includes(`class='.*${className}.*'`);
    }
    
    // Check for ID selectors
    if (selector.startsWith('#')) {
      const idName = selector.substring(1).split(/[:\s>+~]/)[0];
      return htmlContent.includes(`id="${idName}"`) || 
             htmlContent.includes(`id='${idName}'`);
    }
    
    // Check for tag selectors
    const tagMatch = selector.match(/^([a-zA-Z]+)/);
    if (tagMatch) {
      const tagName = tagMatch[1].toLowerCase();
      return htmlContent.toLowerCase().includes(`<${tagName}`);
    }
    
    return true; // Conservative approach - assume complex selectors are used
  }

  shouldSkipCssSelector(selector) {
    const skipPatterns = [
      // Pseudo-classes and pseudo-elements
      /:hover|:focus|:active|:visited|:before|:after/,
      // Media queries and complex selectors
      /@media|@keyframes|@font-face/,
      // Dynamic classes that might be added by JavaScript
      /\.active|\.selected|\.hidden|\.show|\.hide/,
      // Common framework classes
      /\.btn|\.form|\.nav|\.modal|\.tooltip/
    ];
    
    return skipPatterns.some(pattern => pattern.test(selector));
  }

  async checkDeadJs(directory) {
    console.log(chalk.cyan('📜 Analyzing JavaScript dead code...'));
    
    const results = [];
    const jsFiles = await this.findJsFiles(directory);
    const htmlFiles = await this.findHtmlFiles(directory);
    
    // Get all HTML content to check against
    let allHtmlContent = '';
    for (const htmlFile of htmlFiles) {
      try {
        const content = await fs.readFile(htmlFile, 'utf8');
        allHtmlContent += content + '\n';
      } catch (error) {
        // Skip files we can't read
      }
    }
    
    for (const jsFile of jsFiles) {
      try {
        const content = await fs.readFile(jsFile, 'utf8');
        const deadCode = this.findDeadJsCode(content, allHtmlContent, jsFile);
        
        if (deadCode.length > 0) {
          const relativePath = path.relative(directory, jsFile);
          console.log(chalk.cyan(`\n📁 ${relativePath}:`));
          
          deadCode.forEach(code => {
            console.log(chalk.yellow(`  ☠️ Potentially dead JS: ${code.name}`));
            results.push({
              type: '☠️ Dead JavaScript',
              description: `${code.type} not referenced: ${code.name}`,
              suggestion: `Consider removing unused ${code.type.toLowerCase()}: ${code.name}`,
              filePath: jsFile,
              relativePath: relativePath,
              name: code.name,
              codeType: code.type,
              lineNumber: code.lineNumber
            });
          });
        }
        
      } catch (error) {
        console.error(chalk.red(`❌ Error analyzing JS ${jsFile}: ${error.message}`));
      }
    }
    
    return results;
  }

  findDeadJsCode(jsContent, htmlContent, jsFilePath) {
    const deadCode = [];
    
    // Find function declarations
    const functions = this.parseJsFunctions(jsContent);
    const variables = this.parseJsVariables(jsContent);
    
    // Check if functions are used
    for (const func of functions) {
      if (!this.isJsFunctionUsed(func.name, jsContent, htmlContent)) {
        deadCode.push({
          type: 'Function',
          name: func.name,
          lineNumber: func.lineNumber
        });
      }
    }
    
    // Check if variables are used
    for (const variable of variables) {
      if (!this.isJsVariableUsed(variable.name, jsContent, htmlContent)) {
        deadCode.push({
          type: 'Variable',
          name: variable.name,
          lineNumber: variable.lineNumber
        });
      }
    }
    
    return deadCode;
  }

  parseJsFunctions(jsContent) {
    const functions = [];
    const lines = jsContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Function declarations
      const funcMatch = line.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
      if (funcMatch) {
        functions.push({
          name: funcMatch[1],
          lineNumber: i + 1
        });
      }
      
      // Arrow functions assigned to variables
      const arrowMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\([^)]*\)\s*=>/);
      if (arrowMatch) {
        functions.push({
          name: arrowMatch[1],
          lineNumber: i + 1
        });
      }
    }
    
    return functions;
  }

  parseJsVariables(jsContent) {
    const variables = [];
    const lines = jsContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Variable declarations
      const varMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (varMatch && !line.includes('=') && !line.includes('function')) {
        variables.push({
          name: varMatch[1],
          lineNumber: i + 1
        });
      }
    }
    
    return variables;
  }

  isJsFunctionUsed(functionName, jsContent, htmlContent) {
    // Check if function is called in JS
    const jsCallPattern = new RegExp(`${functionName}\\s*\\(`, 'g');
    if (jsCallPattern.test(jsContent)) {
      return true;
    }
    
    // Check if function is referenced in HTML (onclick, etc.)
    const htmlCallPattern = new RegExp(`${functionName}\\s*\\(`, 'g');
    if (htmlCallPattern.test(htmlContent)) {
      return true;
    }
    
    // Check for event handlers in HTML
    const eventPattern = new RegExp(`on\\w+\\s*=\\s*["'][^"']*${functionName}`, 'g');
    if (eventPattern.test(htmlContent)) {
      return true;
    }
    
    return false;
  }

  isJsVariableUsed(variableName, jsContent, htmlContent) {
    // Create pattern that excludes the declaration line
    const lines = jsContent.split('\n');
    let usageFound = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip the declaration line
      if (line.includes(`${variableName}`) && 
          (line.includes('const ') || line.includes('let ') || line.includes('var '))) {
        continue;
      }
      
      // Check for usage
      const usagePattern = new RegExp(`\\b${variableName}\\b`);
      if (usagePattern.test(line)) {
        usageFound = true;
        break;
      }
    }
    
    return usageFound;
  }

  // Check file sizes and suggest optimizations
  async checkFileSizes(directory = '.') {
    console.log(chalk.blue('📏 Analyzing file sizes and suggesting optimizations...'));
    
    const results = [];
    const allFiles = await this.findAllProjectFiles(directory);
    const sizeThresholds = {
      image: 500 * 1024,      // 500KB for images
      // css: 100 * 1024,        // 100KB for CSS
      js: 200 * 1024,         // 200KB for JavaScript
      // html: 50 * 1024,        // 50KB for HTML
      video: 10 * 1024 * 1024, // 10MB for videos
      audio: 5 * 1024 * 1024,  // 5MB for audio
      other: 1 * 1024 * 1024   // 1MB for other files
    };
    
    let totalSize = 0;
    const fileSizes = [];
    
    for (const file of allFiles) {
      try {
        const stats = await require('fs').promises.stat(file);
        const fileSize = stats.size;
        const fileType = this.getFileCategory(file);
        const relativePath = path.relative(directory, file);
        
        totalSize += fileSize;
        fileSizes.push({
          path: file,
          relativePath: relativePath,
          size: fileSize,
          type: fileType,
          sizeFormatted: this.formatFileSize(fileSize)
        });
        
        // Check if file exceeds threshold
        const threshold = sizeThresholds[fileType] || sizeThresholds.other;
        if (fileSize > threshold) {
          const suggestions = this.getSizeOptimizationSuggestions(file, fileSize, fileType);
          
          console.log(chalk.yellow(`  📏 Large ${fileType}: ${relativePath} (${this.formatFileSize(fileSize)})`));
          suggestions.forEach(suggestion => {
            console.log(chalk.gray(`    💡 ${suggestion}`));
          });
          
          results.push({
            type: `📏 Large ${fileType}`,
            description: `File size ${this.formatFileSize(fileSize)} exceeds recommended ${this.formatFileSize(threshold)}`,
            filePath: file,
            relativePath: relativePath,
            size: fileSize,
            sizeFormatted: this.formatFileSize(fileSize),
            threshold: threshold,
            thresholdFormatted: this.formatFileSize(threshold),
            suggestions: suggestions,
            fileType: fileType
          });
        }
      } catch (error) {
        // Skip files we can't read
      }
    }
    
    // Sort files by size (largest first)
    fileSizes.sort((a, b) => b.size - a.size);
    
    // Get type breakdown for return data only
    const typeBreakdown = this.getFileSizeBreakdown(fileSizes);
    
    console.log(chalk.blue(`\n📊 Summary: Found ${results.length} files that could be optimized`));
    console.log(chalk.gray('💡 File size analysis is based on common best practices'));
    
    return {
      largeFiles: results,
      allFiles: fileSizes,
      totalSize: totalSize,
      totalFiles: fileSizes.length,
      typeBreakdown: typeBreakdown
    };
  }

  getFileCategory(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp'].includes(ext)) {
      return 'image';
    } else if (['.css', '.scss', '.sass', '.less'].includes(ext)) {
      return 'css';
    } else if (['.js', '.mjs', '.ts', '.jsx', '.tsx'].includes(ext)) {
      return 'js';
    } else if (['.html', '.htm', '.xhtml'].includes(ext)) {
      return 'html';
    } else if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'].includes(ext)) {
      return 'video';
    } else if (['.mp3', '.wav', '.ogg', '.aac', '.flac'].includes(ext)) {
      return 'audio';
    } else if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
      return 'document';
    } else if (['.zip', '.rar', '.tar', '.gz', '.7z'].includes(ext)) {
      return 'archive';
    } else if (['.ttf', '.woff', '.woff2', '.otf', '.eot'].includes(ext)) {
      return 'font';
    } else {
      return 'other';
    }
  }

  getFileIcon(fileType) {
    const icons = {
      image: '🖼️',
      css: '🎨',
      js: '📜',
      html: '📄',
      video: '🎥',
      audio: '🎵',
      document: '📃',
      archive: '📦',
      font: '🔤',
      other: '📄'
    };
    return icons[fileType] || '📄';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getSizeOptimizationSuggestions(filePath, fileSize, fileType) {
    const suggestions = [];
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    switch (fileType) {
      case 'image':
        if (['.jpg', '.jpeg'].includes(ext)) {
          suggestions.push('Compress JPEG with tools like ImageOptim, TinyPNG, or jpegoptim');
          suggestions.push('Consider converting to WebP format for better compression');
          if (fileSize > 1024 * 1024) {
            suggestions.push('Resize image dimensions if currently larger than needed');
          }
        } else if (ext === '.png') {
          suggestions.push('Compress PNG with tools like OptiPNG, PNGCrush, or TinyPNG');
          suggestions.push('Consider converting to WebP for smaller size');
          suggestions.push('Use JPEG for photos if transparency not needed');
        } else if (ext === '.svg') {
          suggestions.push('Minify SVG code with SVGO or similar tools');
          suggestions.push('Remove unnecessary metadata and comments');
        } else if (ext === '.gif') {
          suggestions.push('Consider converting to WebP or MP4 for animations');
          suggestions.push('Reduce color palette if possible');
        }
        break;
        
      case 'js':
        suggestions.push('Minify JavaScript code with tools like UglifyJS or Terser');
        suggestions.push('Enable gzip/brotli compression on your web server');
        suggestions.push('Consider code splitting for large bundles');
        suggestions.push('Remove unused code and dead code elimination');
        if (fileSize > 500 * 1024) {
          suggestions.push('Consider breaking into smaller modules');
        }
        break;
        
      case 'css':
        suggestions.push('Minify CSS with tools like CleanCSS or cssnano');
        suggestions.push('Remove unused CSS rules (run --dead-code analysis)');
        suggestions.push('Enable gzip/brotli compression on your web server');
        suggestions.push('Consider using CSS-in-JS or CSS modules for better tree-shaking');
        break;
        
      case 'html':
        suggestions.push('Minify HTML by removing whitespace and comments');
        suggestions.push('Enable gzip/brotli compression on your web server');
        suggestions.push('Inline critical CSS for above-the-fold content');
        break;
        
      case 'video':
        suggestions.push('Compress video with H.264 or H.265 codecs');
        suggestions.push('Consider multiple quality versions (720p, 1080p)');
        suggestions.push('Use streaming formats like HLS or DASH for large videos');
        suggestions.push('Consider hosting on CDN or video platforms');
        break;
        
      case 'audio':
        suggestions.push('Use compressed formats like MP3 or AAC instead of WAV');
        suggestions.push('Reduce bitrate if quality allows (128-192 kbps often sufficient)');
        suggestions.push('Consider streaming for long audio files');
        break;
        
      case 'font':
        suggestions.push('Use WOFF2 format for better compression');
        suggestions.push('Subset fonts to include only needed characters');
        suggestions.push('Consider using system fonts or web font alternatives');
        break;
        
      case 'document':
        if (ext === '.pdf') {
          suggestions.push('Compress PDF with tools like Ghostscript or online compressors');
          suggestions.push('Reduce image quality in PDF if acceptable');
        }
        break;
        
      default:
        suggestions.push('Enable compression on your web server');
        suggestions.push('Consider if this file is necessary in production');
    }
    
    // General suggestions for all large files
    if (fileSize > 1024 * 1024) {
      suggestions.push('Consider lazy loading if not needed immediately');
      suggestions.push('Use CDN for better delivery performance');
    }
    
    return suggestions;
  }

  getFileSizeBreakdown(fileSizes) {
    const breakdown = {};
    
    fileSizes.forEach(file => {
      if (!breakdown[file.type]) {
        breakdown[file.type] = {
          count: 0,
          totalSize: 0
        };
      }
      breakdown[file.type].count++;
      breakdown[file.type].totalSize += file.size;
    });
    
    // Sort by total size
    const sortedBreakdown = {};
    Object.entries(breakdown)
      .sort(([,a], [,b]) => b.totalSize - a.totalSize)
      .forEach(([key, value]) => {
        sortedBreakdown[key] = value;
      });
    
    return sortedBreakdown;
  }

  // Extract import/require statements
  extractImportReferences(content, baseDir) {
    const references = [];
    
    // ES6 imports and CommonJS requires
    const importPatterns = [
      /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      /import\s+['"]([^'"]+)['"]/g
    ];
    
    importPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const importPath = match[1];
        
        // Skip npm packages (don't start with . or /)
        if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
          continue;
        }
        
        // Resolve the import path
        const resolved = this.resolveImportPath(importPath, baseDir);
        if (resolved) {
          references.push(resolved);
        }
      }
    });
    
    return references;
  }

  // Extract JSON references
  extractJsonReferences(content, baseDir) {
    const references = [];
    
    try {
      const json = JSON.parse(content);
      
      // Extract file references from JSON values
      const extractFromObject = (obj) => {
        if (typeof obj === 'string') {
          // Check if it looks like a file path
          if (obj.includes('.') && (obj.includes('/') || obj.includes('\\'))) {
            const resolved = this.resolveFilePath(obj, baseDir);
            if (resolved) {
              references.push(resolved);
            }
          }
        } else if (typeof obj === 'object' && obj !== null) {
          Object.values(obj).forEach(value => {
            if (Array.isArray(value)) {
              value.forEach(extractFromObject);
            } else {
              extractFromObject(value);
            }
          });
        }
      };
      
      extractFromObject(json);
    } catch (error) {
      // Invalid JSON, skip
    }
    
    return references;
  }

  // Extract generic file references
  extractGenericReferences(content, baseDir) {
    const references = [];
    
    // Look for file-like patterns
    const patterns = [
      /['"]((?:\.{1,2}\/)?[^'"]*\.[a-zA-Z0-9]{1,5})['"]/g,  // Quoted file paths
      /src\s*=\s*['"']([^'"']+)['"']/g,                      // src attributes
      /href\s*=\s*['"']([^'"']+)['"']/g,                     // href attributes
      /url\s*\(\s*['"']?([^'"')]+)['"']?\s*\)/g              // CSS url()
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const filePath = match[1];
        
        if (this.isLocalFile(filePath)) {
          const resolved = this.resolveFilePath(filePath, baseDir);
          if (resolved) {
            references.push(resolved);
          }
        }
      }
    });
    
    return references;
  }

  // Resolve import paths (handle extensions and index files)
  resolveImportPath(importPath, baseDir) {
    const possiblePaths = [
      importPath,
      importPath + '.js',
      importPath + '.jsx', 
      importPath + '.ts',
      importPath + '.tsx',
      importPath + '/index.js',
      importPath + '/index.jsx',
      importPath + '/index.ts', 
      importPath + '/index.tsx'
    ];
    
    for (const possiblePath of possiblePaths) {
      const resolved = this.resolveFilePath(possiblePath, baseDir);
      if (resolved) {
        return resolved;
      }
    }
    
    return null;
  }
}

module.exports = AccessibilityFixer;