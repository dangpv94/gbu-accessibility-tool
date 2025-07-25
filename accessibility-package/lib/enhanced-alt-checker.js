/**
 * Enhanced Alt Attribute Checker
 * Cải tiến tính năng kiểm tra alt attribute đa dạng và toàn diện hơn
 */

const chalk = require('chalk');

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

  /**
   * Phân tích toàn diện các vấn đề alt attribute
   */
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

  /**
   * Phân tích ngữ cảnh và mục đích của hình ảnh
   */
  analyzeImageContext(imgTag, htmlContent, imgIndex) {
    const src = this.extractAttribute(imgTag, 'src');
    const alt = this.extractAttribute(imgTag, 'alt');
    const title = this.extractAttribute(imgTag, 'title');
    const ariaLabel = this.extractAttribute(imgTag, 'aria-label');
    const role = this.extractAttribute(imgTag, 'role');
    
    // Phân tích vị trí và ngữ cảnh
    const position = this.findImagePosition(imgTag, htmlContent, imgIndex);
    const surroundingContext = this.extractSurroundingContext(htmlContent, position, 1000);
    
    // Xác định loại hình ảnh
    const imageType = this.classifyImageType(imgTag, surroundingContext, src);
    
    // Phân tích cấu trúc HTML xung quanh
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

  /**
   * Kiểm tra chất lượng alt text theo nhiều tiêu chí
   */
  checkAltQuality(imgTag, analysis) {
    const issues = [];
    const { alt, imageType, src } = analysis;
    
    // 1. Kiểm tra cơ bản - thiếu alt
    if (!this.hasAttribute(imgTag, 'alt')) {
      issues.push({
        type: 'MISSING_ALT',
        severity: 'ERROR',
        message: 'Thiếu thuộc tính alt',
        description: 'Tất cả hình ảnh phải có thuộc tính alt'
      });
      return issues; // Không cần kiểm tra thêm nếu thiếu alt
    }

    // 2. Kiểm tra alt rỗng
    if (alt === '') {
      if (imageType === 'decorative') {
        // OK cho hình trang trí
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

    // 3. Kiểm tra độ dài alt text
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

    // 4. Kiểm tra chất lượng nội dung alt
    const contentIssues = this.checkAltContent(alt, src, imageType);
    issues.push(...contentIssues);

    // 5. Kiểm tra tính nhất quán với các thuộc tính khác
    const consistencyIssues = this.checkAttributeConsistency(analysis);
    issues.push(...consistencyIssues);

    // 6. Kiểm tra theo loại hình ảnh cụ thể
    const typeSpecificIssues = this.checkTypeSpecificRequirements(analysis);
    issues.push(...typeSpecificIssues);

    return issues;
  }

  /**
   * Phân loại hình ảnh theo mục đích sử dụng
   */
  classifyImageType(imgTag, context, src) {
    const srcLower = (src || '').toLowerCase();
    const contextLower = context.toLowerCase();
    
    // Hình trang trí
    if (this.isDecorativeImage(imgTag, context, src)) {
      return 'decorative';
    }
    
    // Hình biểu đồ/dữ liệu
    if (this.isDataVisualization(srcLower, contextLower)) {
      return 'data-visualization';
    }
    
    // Hình phức tạp (cần mô tả dài)
    if (this.isComplexImage(srcLower, contextLower)) {
      return 'complex';
    }
    
    // Logo/thương hiệu
    if (this.isLogo(srcLower, contextLower)) {
      return 'logo';
    }
    
    // Icon chức năng
    if (this.isFunctionalIcon(imgTag, context, srcLower)) {
      return 'functional-icon';
    }
    
    // Hình ảnh nội dung
    if (this.isContentImage(contextLower)) {
      return 'content';
    }
    
    return 'informative';
  }

  /**
   * Kiểm tra nội dung alt text
   */
  checkAltContent(alt, src, imageType) {
    const issues = [];
    
    if (!alt) return issues;
    
    const altLower = alt.toLowerCase();
    const srcLower = (src || '').toLowerCase();
    
    // Kiểm tra từ khóa không nên có
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
    
    // Kiểm tra lặp lại tên file
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
    
    // Kiểm tra alt text chung chung
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
    
    // Kiểm tra theo loại hình ảnh
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

  /**
   * Tạo đề xuất cải thiện alt text
   */
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

  /**
   * Tạo alt text dựa trên ngữ cảnh
   */
  generateContextualAlt(analysis) {
    const { context, src, structural } = analysis;
    
    // Tìm tiêu đề gần nhất
    const nearbyHeading = this.findNearbyHeading(context);
    if (nearbyHeading) {
      return nearbyHeading;
    }
    
    // Tìm text trong link chứa hình
    if (structural.parentLink) {
      const linkText = this.extractLinkText(structural.parentLink);
      if (linkText) {
        return linkText;
      }
    }
    
    // Tìm figcaption
    if (structural.figcaption) {
      return structural.figcaption;
    }
    
    // Tìm text xung quanh
    const surroundingText = this.extractSurroundingText(context);
    if (surroundingText) {
      return surroundingText;
    }
    
    // Fallback dựa trên src
    return this.generateFallbackAlt(src);
  }

  // Helper methods cho việc phân loại hình ảnh
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

  // Helper methods khác
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
    
    // Tìm thẻ mở gần nhất trước img
    const beforeImg = context.substring(0, imgIndex);
    const openTagRegex = new RegExp(`<${tagName}[^>]*>`, 'gi');
    const closeTagRegex = new RegExp(`</${tagName}>`, 'gi');
    
    let openTags = 0;
    let lastOpenMatch = null;
    
    // Đếm thẻ mở và đóng để tìm parent
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
    
    // Kiểm tra tính nhất quán giữa alt và aria-label
    if (alt && ariaLabel && alt !== ariaLabel) {
      issues.push({
        type: 'INCONSISTENT_LABELS',
        severity: 'WARNING',
        message: 'Alt text và aria-label không nhất quán',
        description: 'Alt và aria-label nên có nội dung giống nhau'
      });
    }
    
    // Kiểm tra title attribute
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

  // Các method helper khác...
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
    // Loại bỏ HTML tags và lấy text xung quanh
    const textOnly = context.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textOnly.split(' ');
    
    // Lấy 3-5 từ có nghĩa
    const meaningfulWords = words.filter(word => 
      word.length > 2 && !/^\d+$/.test(word)
    ).slice(0, 5);
    
    return meaningfulWords.join(' ');
  }

  generateFallbackAlt(src) {
    if (!src) return '画像';
    
    const filename = src.split('/').pop().split('.')[0];
    
    // Cải thiện tên file thành alt text
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim() || '画像';
  }

  extractBrandName(context, src) {
    // Tìm tên thương hiệu từ context hoặc src
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
    // Tìm hành động từ context xung quanh icon
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

module.exports = EnhancedAltChecker;