/**
 * HTML Lang Attribute Fixer
 * Fix missing or empty lang attributes in HTML tags
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class HtmlLangFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      ...config
    };
  }

  async fix(directory = '.') {
    console.log(chalk.blue('📝 Đang sửa thuộc tính HTML lang...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fixed = this.fixLangAttribute(content);
        
        if (fixed !== content) {
          await FileUtils.writeFile(file, fixed, {
            backup: this.config.backupFiles,
            dryRun: this.config.dryRun
          });
          
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

  fixLangAttribute(content) {
    const langValue = this.config.language;
    
    return content
      .replace(/<html class="no-js" lang="">/g, `<html class="no-js" lang="${langValue}">`)
      .replace(/<html class="no-js">/g, `<html class="no-js" lang="${langValue}">`)
      .replace(/<html lang="">/g, `<html lang="${langValue}">`)
      .replace(/<html>/g, `<html lang="${langValue}">`);
  }
}

module.exports = HtmlLangFixer;
