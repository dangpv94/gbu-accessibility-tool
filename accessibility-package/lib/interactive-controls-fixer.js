/**
 * Interactive Controls Fixer
 * Fix buttons, links, and nested interactive controls
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class InteractiveControlsFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      ...config
    };
  }

  async fix(directory = '.') {
    console.log(chalk.blue('🔘 Đang sửa interactive controls...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        let issues = [];
        
        // Analyze different types of issues
        issues = issues.concat(this.analyzeButtonNames(content));
        issues = issues.concat(this.analyzeLinkNames(content));
        issues = issues.concat(this.analyzeNestedControls(content));
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        let fixed = content;
        fixed = this.fixButtonNames(fixed);
        fixed = this.fixLinkNames(fixed);
        fixed = this.fixNestedInteractiveControls(fixed);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
          console.log(chalk.green(`✅ Fixed interactive controls in: ${file}`));
          results.push({ file, status: 'fixed', issues: issues.length });
        } else {
          results.push({ file, status: 'no-change', issues: issues.length });
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalIssuesFound} vấn đề controls trong ${results.length} file`));
    return results;
  }

  analyzeButtonNames(content) {
    const issues = [];
    const buttonRegex = /<button[^>]*>[\s\S]*?<\/button>/gi;
    const buttons = content.match(buttonRegex) || [];
    
    buttons.forEach((button, index) => {
      const hasAriaLabel = /aria-label\s*=\s*["']([^"']+)["']/i.test(button);
      const innerText = button.replace(/<[^>]*>/g, '').trim();
      
      if (!hasAriaLabel && !innerText) {
        issues.push({
          type: '❌ Empty button',
          description: `Button ${index + 1} has no text or aria-label`
        });
      }
    });
    
    return issues;
  }

  analyzeLinkNames(content) {
    const issues = [];
    const linkRegex = /<a\s+[^>]*href[^>]*>[\s\S]*?<\/a>/gi;
    const links = content.match(linkRegex) || [];
    
    links.forEach((link, index) => {
      const hasAriaLabel = /aria-label\s*=\s*["']([^"']+)["']/i.test(link);
      const innerText = link.replace(/<[^>]*>/g, '').trim();
      
      if (!hasAriaLabel && !innerText) {
        issues.push({
          type: '❌ Empty link',
          description: `Link ${index + 1} has no text or aria-label`
        });
      }
    });
    
    return issues;
  }

  analyzeNestedControls(content) {
    const issues = [];
    
    // Check for buttons inside links
    const nestedButtonInLink = /<a[^>]*>[\s\S]*?<button[\s\S]*?<\/button>[\s\S]*?<\/a>/gi;
    const nestedButtons = content.match(nestedButtonInLink) || [];
    
    if (nestedButtons.length > 0) {
      issues.push({
        type: '⚠️  Nested interactive controls',
        description: `Found ${nestedButtons.length} button(s) nested inside link(s)`
      });
    }
    
    // Check for links inside buttons
    const nestedLinkInButton = /<button[^>]*>[\s\S]*?<a[\s\S]*?<\/a>[\s\S]*?<\/button>/gi;
    const nestedLinks = content.match(nestedLinkInButton) || [];
    
    if (nestedLinks.length > 0) {
      issues.push({
        type: '⚠️  Nested interactive controls',
        description: `Found ${nestedLinks.length} link(s) nested inside button(s)`
      });
    }
    
    return issues;
  }

  fixButtonNames(content) {
    let fixed = content;
    
    // Fix buttons without text or aria-label
    const buttonRegex = /<button(?![^>]*aria-label)([^>]*)>([\s\S]*?)<\/button>/gi;
    
    fixed = fixed.replace(buttonRegex, (match, attrs, innerContent) => {
      const innerText = innerContent.replace(/<[^>]*>/g, '').trim();
      
      if (!innerText) {
        // Button has no text, add aria-label
        return `<button aria-label="ボタン"${attrs}>${innerContent}</button>`;
      }
      
      return match;
    });
    
    return fixed;
  }

  fixLinkNames(content) {
    let fixed = content;
    
    // Fix links without text or aria-label
    const linkRegex = /<a\s+(?![^>]*aria-label)([^>]*href[^>]*)>([\s\S]*?)<\/a>/gi;
    
    fixed = fixed.replace(linkRegex, (match, attrs, innerContent) => {
      const innerText = innerContent.replace(/<[^>]*>/g, '').trim();
      
      if (!innerText) {
        // Link has no text, add aria-label
        const href = match.match(/href\s*=\s*["']([^"']+)["']/i);
        const hrefValue = href ? href[1] : '';
        const label = hrefValue ? `リンク: ${hrefValue}` : 'リンク';
        
        return `<a aria-label="${label}" ${attrs}>${innerContent}</a>`;
      }
      
      return match;
    });
    
    return fixed;
  }

  fixNestedInteractiveControls(content) {
    let fixed = content;
    
    // This is a complex issue that usually requires manual intervention
    // We'll just warn about it for now
    const nestedButtonInLink = /<a[^>]*>[\s\S]*?<button[\s\S]*?<\/button>[\s\S]*?<\/a>/gi;
    const nestedButtons = fixed.match(nestedButtonInLink) || [];
    
    if (nestedButtons.length > 0) {
      console.log(chalk.yellow(`⚠️  Found ${nestedButtons.length} nested button(s) in link(s). Manual review recommended.`));
    }
    
    return fixed;
  }
}

module.exports = InteractiveControlsFixer;
