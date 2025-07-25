/**
 * Accessibility Fixer
 * Automated fixes for common accessibility issues
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

class AccessibilityFixer {
  constructor(config = {}) {
    this.config = {
      backupFiles: config.backupFiles !== false,
      language: config.language || 'ja',
      dryRun: config.dryRun || false,
      ...config
    };
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
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeAltAttributes(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
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
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Summary: Found ${totalIssuesFound} alt attribute issues across ${results.length} files`));
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
    
    // Fix all images - add role="img" and aria-label
    fixed = fixed.replace(
      /<img([^>]*>)/gi,
      (match) => {
        let updatedImg = match;
        let hasChanges = false;
        
        // Check if role attribute already exists
        if (!/role\s*=/i.test(match)) {
          updatedImg = updatedImg.replace(/(<img[^>]*?)(\s*>)/i, '$1 role="img"$2');
          console.log(chalk.yellow(`  🖼️ Added role="img" to image element`));
          hasChanges = true;
        }
        
        // Check if aria-label already exists
        if (!/aria-label\s*=/i.test(match)) {
          // Extract alt text to use for aria-label
          const altMatch = match.match(/alt\s*=\s*["']([^"']*)["']/i);
          if (altMatch && altMatch[1].trim()) {
            const altText = altMatch[1].trim();
            updatedImg = updatedImg.replace(/(<img[^>]*?)(\s*>)/i, `$1 aria-label="${altText}"$2`);
            console.log(chalk.yellow(`  🏷️ Added aria-label="${altText}" to image element`));
            hasChanges = true;
          }
        }
        
        return updatedImg;
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
      headings: [] // Analysis only
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
      
      // Step 9: Cleanup duplicate roles
      console.log(chalk.yellow('\n🧹 Step 9: Cleanup duplicate roles...'));
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
}

module.exports = AccessibilityFixer;