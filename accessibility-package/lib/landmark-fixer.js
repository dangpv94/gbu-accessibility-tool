/**
 * Landmark Fixer
 * Fix ARIA landmarks and main content areas
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class LandmarkFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      ...config
    };
  }

  async fix(directory = '.') {
    console.log(chalk.blue('🗺️  Đang sửa landmarks...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
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
        
        const fixed = this.fixLandmarks(content);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
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
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalIssuesFound} vấn đề landmarks trong ${results.length} file`));
    return results;
  }

  analyzeLandmarks(content) {
    const issues = [];
    
    // Check for missing main landmark
    const hasMain = /<main[\s>]/i.test(content) || /role\s*=\s*["']main["']/i.test(content);
    if (!hasMain && /<body/i.test(content)) {
      issues.push({
        type: '⚠️  Missing main landmark',
        description: 'Page has no <main> element or role="main"'
      });
    }
    
    // Check for multiple main landmarks
    const mainCount = (content.match(/<main[\s>]/gi) || []).length + 
                     (content.match(/role\s*=\s*["']main["']/gi) || []).length;
    if (mainCount > 1) {
      issues.push({
        type: '❌ Multiple main landmarks',
        description: `Found ${mainCount} main landmarks (should have only one)`
      });
    }
    
    return issues;
  }

  fixLandmarks(content) {
    let fixed = content;
    
    // Add main landmark if missing
    const hasMain = /<main[\s>]/i.test(fixed) || /role\s*=\s*["']main["']/i.test(fixed);
    const hasBody = /<body/i.test(fixed);
    
    if (!hasMain && hasBody) {
      // Try to wrap content in main element
      // Look for common patterns like <div id="content"> or <div class="content">
      const contentDivPatterns = [
        { pattern: /<div\s+id\s*=\s*["']content["'][^>]*>/i, replacement: '<main id="content">' },
        { pattern: /<div\s+class\s*=\s*["']content["'][^>]*>/i, replacement: '<main class="content">' },
        { pattern: /<div\s+id\s*=\s*["']main-content["'][^>]*>/i, replacement: '<main id="main-content">' }
      ];
      
      let replaced = false;
      for (const { pattern, replacement } of contentDivPatterns) {
        if (pattern.test(fixed)) {
          fixed = fixed.replace(pattern, replacement);
          // Also replace the closing </div> for this specific div
          // This is a simplified approach - in production, you'd want proper HTML parsing
          const closingDivIndex = fixed.lastIndexOf('</div>');
          if (closingDivIndex !== -1) {
            fixed = fixed.substring(0, closingDivIndex) + '</main>' + fixed.substring(closingDivIndex + 6);
          }
          replaced = true;
          console.log(chalk.green('  ✅ Converted content div to <main> element'));
          break;
        }
      }
      
      if (!replaced) {
        console.log(chalk.yellow('  ℹ️  No main landmark added (manual review recommended)'));
      }
    }
    
    return fixed;
  }
}

module.exports = LandmarkFixer;
