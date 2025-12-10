/**
 * Meta Tags Checker
 * Check and fix meta tags for SEO and accessibility
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class MetaTagsChecker {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      siteName: config.siteName || '',
      ...config
    };
  }

  async check(directory = '.') {
    console.log(chalk.blue('🏷️  Đang kiểm tra meta tags...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const analysis = this.analyzeMetaTags(content);
        
        if (analysis.issues.length > 0 || analysis.warnings.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          
          analysis.issues.forEach(issue => {
            console.log(chalk.red(`  ❌ ${issue}`));
            totalIssuesFound++;
          });
          
          analysis.warnings.forEach(warning => {
            console.log(chalk.yellow(`  ⚠️  ${warning}`));
          });
        }
        
        results.push({ 
          file, 
          issues: analysis.issues.length,
          warnings: analysis.warnings.length,
          meta: analysis.meta
        });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalIssuesFound} vấn đề meta tags trong ${results.length} file`));
    return results;
  }

  async fix(directory = '.') {
    console.log(chalk.blue('🏷️  Đang sửa meta tags...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fixed = this.fixMetaTags(content);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
          console.log(chalk.green(`✅ Fixed meta tags in: ${file}`));
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

  analyzeMetaTags(content) {
    const issues = [];
    const warnings = [];
    const meta = {};
    
    // Check for charset
    const charsetRegex = /<meta\s+charset\s*=\s*["']([^"']+)["']/i;
    const charsetMatch = content.match(charsetRegex);
    
    if (charsetMatch) {
      meta.charset = charsetMatch[1];
      if (charsetMatch[1].toUpperCase() !== 'UTF-8') {
        warnings.push(`Charset is ${charsetMatch[1]}, recommended: UTF-8`);
      }
    } else {
      issues.push('Missing charset meta tag');
    }
    
    // Check for viewport
    const viewportRegex = /<meta\s+name\s*=\s*["']viewport["']\s+content\s*=\s*["']([^"']+)["']/i;
    const viewportMatch = content.match(viewportRegex);
    
    if (viewportMatch) {
      meta.viewport = viewportMatch[1];
    } else {
      issues.push('Missing viewport meta tag');
    }
    
    // Check for description
    const descRegex = /<meta\s+name\s*=\s*["']description["']\s+content\s*=\s*["']([^"']+)["']/i;
    const descMatch = content.match(descRegex);
    
    if (descMatch) {
      meta.description = descMatch[1];
      if (descMatch[1].length < 50) {
        warnings.push(`Description is too short (${descMatch[1].length} chars, recommended: 50-160)`);
      } else if (descMatch[1].length > 160) {
        warnings.push(`Description is too long (${descMatch[1].length} chars, recommended: 50-160)`);
      }
    } else {
      warnings.push('Missing description meta tag');
    }
    
    // Check for keywords
    const keywordsRegex = /<meta\s+name\s*=\s*["']keywords["']\s+content\s*=\s*["']([^"']+)["']/i;
    const keywordsMatch = content.match(keywordsRegex);
    
    if (keywordsMatch) {
      meta.keywords = keywordsMatch[1];
    }
    
    // Check for title
    const titleRegex = /<title>(.*?)<\/title>/i;
    const titleMatch = content.match(titleRegex);
    
    if (titleMatch) {
      meta.title = titleMatch[1];
      if (titleMatch[1].length === 0) {
        issues.push('Title is empty');
      } else if (titleMatch[1].length < 10) {
        warnings.push(`Title is too short (${titleMatch[1].length} chars, recommended: 10-70)`);
      } else if (titleMatch[1].length > 70) {
        warnings.push(`Title is too long (${titleMatch[1].length} chars, recommended: 10-70)`);
      }
    } else {
      issues.push('Missing <title> tag');
    }
    
    // Check for Open Graph tags
    const ogTitleRegex = /<meta\s+property\s*=\s*["']og:title["']\s+content\s*=\s*["']([^"']+)["']/i;
    const ogTitleMatch = content.match(ogTitleRegex);
    
    if (ogTitleMatch) {
      meta.ogTitle = ogTitleMatch[1];
    }
    
    // Check for typos in meta tags
    const typoPatterns = [
      { pattern: /<meta\s+name\s*=\s*["']veiwport["']/i, typo: 'veiwport', correct: 'viewport' },
      { pattern: /<meta\s+name\s*=\s*["']desciption["']/i, typo: 'desciption', correct: 'description' },
      { pattern: /<meta\s+name\s*=\s*["']autor["']/i, typo: 'autor', correct: 'author' }
    ];
    
    typoPatterns.forEach(({ pattern, typo, correct }) => {
      if (pattern.test(content)) {
        issues.push(`Typo in meta tag name: "${typo}" should be "${correct}"`);
      }
    });
    
    return { issues, warnings, meta };
  }

  fixMetaTags(content) {
    let fixed = content;
    
    // Fix common typos
    const typoFixes = [
      { pattern: /<meta\s+name\s*=\s*["']veiwport["']/gi, replacement: '<meta name="viewport"' },
      { pattern: /<meta\s+name\s*=\s*["']desciption["']/gi, replacement: '<meta name="description"' },
      { pattern: /<meta\s+name\s*=\s*["']autor["']/gi, replacement: '<meta name="author"' }
    ];
    
    typoFixes.forEach(({ pattern, replacement }) => {
      fixed = fixed.replace(pattern, replacement);
    });
    
    // Add missing charset if not present
    if (!/<meta\s+charset/i.test(fixed)) {
      fixed = fixed.replace(/<head>/i, '<head>\n  <meta charset="UTF-8">');
    }
    
    // Add missing viewport if not present
    if (!/<meta\s+name\s*=\s*["']viewport["']/i.test(fixed)) {
      fixed = fixed.replace(/<head>/i, '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }
    
    return fixed;
  }
}

module.exports = MetaTagsChecker;
