/**
 * Alt Attributes Fixer
 * Fix missing and empty alt attributes in images
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');
const EnhancedAltGenerator = require('./alt-generator');
const EnhancedAltChecker = require('./alt-checker');

class AltAttributesFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      enhancedAltMode: config.enhancedAltMode || false,
      altCreativity: config.altCreativity || 'balanced',
      includeEmotions: config.includeEmotions || false,
      strictAltChecking: config.strictAltChecking || false,
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

  async fix(directory = '.') {
    console.log(chalk.blue('🖼️ Đang sửa thuộc tính alt rỗng...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    let enhancedIssues = [];
    
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
          const issues = this.analyzeAltAttributes(content);
          
          if (issues.length > 0) {
            console.log(chalk.cyan(`\n📁 ${file}:`));
            issues.forEach(issue => {
              console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
              totalIssuesFound++;
            });
          }
          enhancedIssues = issues;
        }
        
        const fixed = this.fixAltAttributes(content);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
          console.log(chalk.green(`✅ Fixed alt attributes in: ${file}`));
          results.push({ 
            file, 
            status: 'fixed', 
            issues: this.config.enhancedAltMode ? 
              enhancedIssues.reduce((sum, ei) => sum + (ei.issues ? ei.issues.length : 1), 0) : 
              enhancedIssues.length 
          });
        } else {
          results.push({ 
            file, 
            status: 'no-change', 
            issues: this.config.enhancedAltMode ? 
              enhancedIssues.reduce((sum, ei) => sum + (ei.issues ? ei.issues.length : 1), 0) : 
              enhancedIssues.length 
          });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalIssuesFound} vấn đề thuộc tính alt trong ${results.length} file`));
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

  fixAltAttributes(content) {
    let fixed = content;
    const imgRegex = /<img[^>]*>/gi;
    const imgTags = content.match(imgRegex) || [];
    
    for (let i = 0; i < imgTags.length; i++) {
      const imgTag = imgTags[i];
      let newImgTag = imgTag;
      
      const hasAlt = /alt\s*=/i.test(imgTag);
      const hasEmptyAlt = /alt\s*=\s*[""'']\s*[""'']/i.test(imgTag);
      
      if (!hasAlt) {
        const altText = this.generateAltText(imgTag, content, i);
        newImgTag = imgTag.replace(/(<img[^>]*)(>)/i, `$1 alt="${altText}"$2`);
        console.log(chalk.yellow(`  ⚠️  Added missing alt attribute: ${imgTag.substring(0, 50)}...`));
        console.log(chalk.green(`      → "${altText}"`));
      } else if (hasEmptyAlt) {
        const altText = this.generateAltText(imgTag, content, i);
        newImgTag = imgTag.replace(/alt\s*=\s*[""''][""'']/i, `alt="${altText}"`);
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
    
    const src = imgTag.match(/src\s*=\s*["']([^"']+)["']/i);
    const srcValue = src ? src[1].toLowerCase() : '';
    
    if (srcValue.includes('logo')) return 'ロゴ';
    if (srcValue.includes('icon')) return 'アイコン';
    if (srcValue.includes('banner')) return 'バナー';
    if (srcValue.includes('button')) return 'ボタン';
    if (srcValue.includes('arrow')) return '矢印';
    if (srcValue.includes('calendar')) return 'カレンダー';
    if (srcValue.includes('video')) return 'ビデオ';
    if (srcValue.includes('chart') || srcValue.includes('graph')) return 'グラフ';
    if (srcValue.includes('photo') || srcValue.includes('img')) return '写真';
    
    return '画像';
  }
}

module.exports = AltAttributesFixer;
