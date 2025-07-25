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
      cleanup: []
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
      
      // Step 4: Cleanup duplicate roles
      console.log(chalk.yellow('\n🧹 Step 4: Cleanup duplicate roles...'));
      results.cleanup = await this.cleanupDuplicateRoles(directory);
      
      // Summary
      const totalFiles = new Set([
        ...results.lang.map(r => r.file),
        ...results.alt.map(r => r.file),
        ...results.roles.map(r => r.file),
        ...results.cleanup.map(r => r.file)
      ]).size;
      
      const totalFixed = new Set([
        ...results.lang.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.alt.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.roles.filter(r => r.status === 'fixed').map(r => r.file),
        ...results.cleanup.filter(r => r.status === 'fixed').map(r => r.file)
      ]).size;
      
      const totalIssues = 
        results.lang.filter(r => r.status === 'fixed').length +
        results.alt.reduce((sum, r) => sum + (r.issues || 0), 0) +
        results.roles.reduce((sum, r) => sum + (r.issues || 0), 0) +
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