/**
 * Form Fixer
 * Fix form labels and input associations
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class FormFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      ...config
    };
  }

  async fix(directory = '.') {
    console.log(chalk.blue('📝 Đang sửa form labels...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
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
        
        const fixed = this.fixFormLabels(content);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
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
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalIssuesFound} vấn đề form trong ${results.length} file`));
    return results;
  }

  analyzeFormLabels(content) {
    const issues = [];
    
    // Check for inputs without labels
    const inputRegex = /<input[^>]*>/gi;
    const inputs = content.match(inputRegex) || [];
    
    inputs.forEach((input, index) => {
      const hasId = /id\s*=\s*["']([^"']+)["']/i.test(input);
      const hasAriaLabel = /aria-label\s*=\s*["']([^"']+)["']/i.test(input);
      const hasAriaLabelledby = /aria-labelledby\s*=\s*["']([^"']+)["']/i.test(input);
      const type = input.match(/type\s*=\s*["']([^"']+)["']/i);
      const typeValue = type ? type[1] : 'text';
      
      // Skip hidden inputs
      if (typeValue === 'hidden') return;
      
      if (hasId) {
        const id = input.match(/id\s*=\s*["']([^"']+)["']/i)[1];
        const labelRegex = new RegExp(`<label[^>]*for\\s*=\\s*["']${id}["'][^>]*>`, 'i');
        const hasLabel = labelRegex.test(content);
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
          issues.push({
            type: '❌ Missing label',
            description: `Input ${index + 1} (id="${id}") has no associated label`
          });
        }
      } else if (!hasAriaLabel && !hasAriaLabelledby) {
        issues.push({
          type: '⚠️  Missing ID and label',
          description: `Input ${index + 1} has no ID and no aria-label`
        });
      }
    });
    
    return issues;
  }

  fixFormLabels(content) {
    let fixed = content;
    
    // Add missing IDs to inputs
    const inputRegex = /<input(?![^>]*id\s*=)([^>]*)>/gi;
    let inputIdCounter = 1;
    
    fixed = fixed.replace(inputRegex, (match, attrs) => {
      const type = match.match(/type\s*=\s*["']([^"']+)["']/i);
      const typeValue = type ? type[1] : 'text';
      
      // Skip hidden inputs
      if (typeValue === 'hidden') return match;
      
      // Skip if already has aria-label or aria-labelledby
      if (/aria-label(?:ledby)?\s*=/.test(match)) return match;
      
      const newId = `input-${inputIdCounter++}`;
      return `<input id="${newId}"${attrs}>`;
    });
    
    // Add labels for inputs with IDs but no labels
    const inputsWithIds = fixed.match(/<input[^>]*id\s*=\s*["']([^"']+)["'][^>]*>/gi) || [];
    
    inputsWithIds.forEach(input => {
      const idMatch = input.match(/id\s*=\s*["']([^"']+)["']/i);
      if (!idMatch) return;
      
      const id = idMatch[1];
      const labelRegex = new RegExp(`<label[^>]*for\\s*=\\s*["']${id}["'][^>]*>`, 'i');
      
      if (!labelRegex.test(fixed)) {
        const type = input.match(/type\s*=\s*["']([^"']+)["']/i);
        const typeValue = type ? type[1] : 'text';
        
        // Skip hidden inputs
        if (typeValue === 'hidden') return;
        
        // Skip if has aria-label
        if (/aria-label\s*=/.test(input)) return;
        
        const labelText = this.generateFormLabelText(input);
        const label = `<label for="${id}">${labelText}</label>\n`;
        
        // Insert label before input
        fixed = fixed.replace(input, label + input);
      }
    });
    
    return fixed;
  }

  generateFormLabelText(inputTag) {
    const type = inputTag.match(/type\s*=\s*["']([^"']+)["']/i);
    const typeValue = type ? type[1].toLowerCase() : 'text';
    const name = inputTag.match(/name\s*=\s*["']([^"']+)["']/i);
    const nameValue = name ? name[1] : '';
    
    // Generate label based on type or name
    const typeLabels = {
      'text': 'テキスト',
      'email': 'メールアドレス',
      'password': 'パスワード',
      'tel': '電話番号',
      'url': 'URL',
      'search': '検索',
      'number': '数値',
      'date': '日付',
      'time': '時刻',
      'checkbox': 'チェックボックス',
      'radio': 'ラジオボタン',
      'file': 'ファイル',
      'submit': '送信',
      'reset': 'リセット'
    };
    
    if (nameValue) {
      return nameValue.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return typeLabels[typeValue] || 'テキスト';
  }
}

module.exports = FormFixer;
