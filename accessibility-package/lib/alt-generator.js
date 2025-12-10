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

module.exports = EnhancedAltGenerator;
