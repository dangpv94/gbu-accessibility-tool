/**
 * Role Attributes Fixer
 * Fix missing and invalid ARIA role attributes
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class RoleAttributesFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      ...config
    };
    
    // Valid ARIA roles
    this.validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
      'contentinfo', 'definition', 'dialog', 'directory', 'document',
      'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
      'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
      'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
      'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
      'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
      'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
      'tooltip', 'tree', 'treegrid', 'treeitem'
    ];
  }

  async fix(directory = '.') {
    console.log(chalk.blue('🎭 Đang sửa thuộc tính role...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const issues = this.analyzeRoleAttributes(content);
        
        if (issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
          });
        }
        
        let fixed = this.fixRoleAttributes(content);
        fixed = this.cleanupDuplicateRoles(fixed);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
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
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Đã xử lý ${results.length} file`));
    return results;
  }

  analyzeRoleAttributes(content) {
    const issues = [];
    
    // Check for invalid roles
    const roleRegex = /role\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = roleRegex.exec(content)) !== null) {
      const role = match[1];
      if (!this.validRoles.includes(role.toLowerCase())) {
        issues.push({
          type: '❌ Invalid role',
          description: `Role "${role}" is not a valid ARIA role`
        });
      }
    }
    
    // Check for duplicate roles
    const duplicateRoleRegex = /<[^>]*\s+role\s*=\s*["'][^"']*["'][^>]*\s+role\s*=\s*["'][^"']*["'][^>]*>/gi;
    const duplicates = content.match(duplicateRoleRegex) || [];
    if (duplicates.length > 0) {
      issues.push({
        type: '⚠️  Duplicate roles',
        description: `Found ${duplicates.length} element(s) with duplicate role attributes`
      });
    }
    
    return issues;
  }

  fixRoleAttributes(content) {
    let fixed = content;
    
    // Fix common semantic elements that don't need explicit roles
    const redundantRoles = [
      { pattern: /<nav\s+role\s*=\s*["']navigation["']/gi, replacement: '<nav' },
      { pattern: /<main\s+role\s*=\s*["']main["']/gi, replacement: '<main' },
      { pattern: /<header\s+role\s*=\s*["']banner["']/gi, replacement: '<header' },
      { pattern: /<footer\s+role\s*=\s*["']contentinfo["']/gi, replacement: '<footer' },
      { pattern: /<aside\s+role\s*=\s*["']complementary["']/gi, replacement: '<aside' },
      { pattern: /<article\s+role\s*=\s*["']article["']/gi, replacement: '<article' },
      { pattern: /<section\s+role\s*=\s*["']region["']/gi, replacement: '<section' },
      { pattern: /<form\s+role\s*=\s*["']form["']/gi, replacement: '<form' },
      { pattern: /<button\s+role\s*=\s*["']button["']/gi, replacement: '<button' }
    ];
    
    redundantRoles.forEach(({ pattern, replacement }) => {
      fixed = fixed.replace(pattern, replacement);
    });
    
    return fixed;
  }

  cleanupDuplicateRoles(content) {
    let fixed = content;
    
    // Remove duplicate role attributes
    const duplicateRoleRegex = /(<[^>]*\s+role\s*=\s*["']([^"']+)["'][^>]*)\s+role\s*=\s*["'][^"']*["']/gi;
    fixed = fixed.replace(duplicateRoleRegex, '$1');
    
    return fixed;
  }
}

module.exports = RoleAttributesFixer;
