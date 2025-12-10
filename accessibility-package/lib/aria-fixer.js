/**
 * ARIA Fixer
 * Fix ARIA labels and attributes
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class AriaFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      ...config
    };
  }

  async fix(directory = '.') {
    console.log(chalk.blue('🏷️  Đang sửa ARIA labels...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        let fixed = content;
        
        // Fix aria-labels
        fixed = this.fixAriaLabels(fixed);
        fixed = this.fixAriaLabelsInContent(fixed);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
          console.log(chalk.green(`✅ Fixed ARIA labels in: ${file}`));
          results.push({ file, status: 'fixed' });
        } else {
          results.push({ file, status: 'no-change' });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Đã xử lý ${results.length} file`));
    return results;
  }

  fixAriaLabels(content) {
    let fixed = content;
    
    // Fix common ARIA label patterns
    const ariaLabelPatterns = [
      // aria-label with value but no closing quote
      { 
        pattern: /aria-label\s*=\s*["']([^"']+)(?!["'])/gi,
        replacement: (match, value) => `aria-label="${value}"`
      },
      // Empty aria-label
      {
        pattern: /<button([^>]*)\s+aria-label\s*=\s*["']\s*["']/gi,
        replacement: '<button$1'
      },
      // Duplicate aria-label
      {
        pattern: /(<[^>]*\s+aria-label\s*=\s*["']([^"']+)["'][^>]*)\s+aria-label\s*=\s*["'][^"']*["']/gi,
        replacement: '$1'
      }
    ];
    
    ariaLabelPatterns.forEach(({ pattern, replacement }) => {
      if (typeof replacement === 'function') {
        fixed = fixed.replace(pattern, replacement);
      } else {
        fixed = fixed.replace(pattern, replacement);
      }
    });
    
    return fixed;
  }

  fixAriaLabelsInContent(content) {
    let fixed = content;
    
    // Add aria-label to interactive elements without labels
    const interactiveElements = [
      { 
        tag: 'button',
        pattern: /<button(?![^>]*aria-label)(?![^>]*>.*<\/button>)/gi,
        getLabel: (match) => {
          const innerText = match.match(/>([^<]+)</);
          return innerText ? innerText[1].trim() : 'ボタン';
        }
      }
    ];
    
    interactiveElements.forEach(({ tag, pattern, getLabel }) => {
      const matches = content.match(pattern) || [];
      matches.forEach(match => {
        if (!match.includes('aria-label')) {
          const label = getLabel(match);
          const withLabel = match.replace(`<${tag}`, `<${tag} aria-label="${label}"`);
          fixed = fixed.replace(match, withLabel);
        }
      });
    });
    
    return fixed;
  }
}

module.exports = AriaFixer;
