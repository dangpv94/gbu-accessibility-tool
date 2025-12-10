/**
 * Google Tag Manager Checker
 * Check GTM installation and configuration
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class GtmChecker {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      ...config
    };
  }

  async check(directory = '.') {
    console.log(chalk.blue('📊 Đang kiểm tra Google Tag Manager...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const analysis = this.analyzeGTMInstallation(content);
        
        if (analysis.issues.length > 0 || analysis.warnings.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          
          if (analysis.gtmId) {
            console.log(chalk.green(`  ✅ GTM ID: ${analysis.gtmId}`));
          }
          
          analysis.issues.forEach(issue => {
            console.log(chalk.red(`  ❌ ${issue}`));
            totalIssuesFound++;
          });
          
          analysis.warnings.forEach(warning => {
            console.log(chalk.yellow(`  ⚠️  ${warning}`));
          });
        } else if (analysis.gtmId) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          console.log(chalk.green(`  ✅ GTM installed correctly: ${analysis.gtmId}`));
        }
        
        results.push({ 
          file, 
          gtmId: analysis.gtmId,
          hasHeadScript: analysis.hasHeadScript,
          hasBodyNoscript: analysis.hasBodyNoscript,
          issues: analysis.issues.length,
          warnings: analysis.warnings.length
        });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalIssuesFound} vấn đề GTM trong ${results.length} file`));
    return results;
  }

  analyzeGTMInstallation(content) {
    const issues = [];
    const warnings = [];
    let gtmId = null;
    let hasHeadScript = false;
    let hasBodyNoscript = false;
    
    // Check for GTM head script
    const gtmHeadRegex = /googletagmanager\.com\/gtm\.js\?id=(GTM-[A-Z0-9]+)/i;
    const headMatch = content.match(gtmHeadRegex);
    
    if (headMatch) {
      hasHeadScript = true;
      gtmId = headMatch[1];
      
      // Check if script is in <head>
      const headSection = content.match(/<head[\s\S]*?<\/head>/i);
      if (headSection && !headSection[0].includes(headMatch[0])) {
        warnings.push('GTM script found but not in <head> section');
      }
    } else {
      issues.push('Missing GTM head script (gtm.js)');
    }
    
    // Check for GTM noscript in body
    const gtmNoscriptRegex = /<noscript>[\s\S]*?googletagmanager\.com\/ns\.html\?id=(GTM-[A-Z0-9]+)[\s\S]*?<\/noscript>/i;
    const noscriptMatch = content.match(gtmNoscriptRegex);
    
    if (noscriptMatch) {
      hasBodyNoscript = true;
      const noscriptId = noscriptMatch[1];
      
      // Check if IDs match
      if (gtmId && noscriptId !== gtmId) {
        issues.push(`GTM ID mismatch: head script has ${gtmId}, noscript has ${noscriptId}`);
      }
      
      // Check if noscript is right after <body>
      const bodySection = content.match(/<body[^>]*>[\s\S]{0,200}/i);
      if (bodySection && !bodySection[0].includes('<noscript>')) {
        warnings.push('GTM noscript found but not immediately after <body>');
      }
    } else {
      issues.push('Missing GTM noscript fallback in <body>');
    }
    
    // Check for incomplete GTM setup
    if (hasHeadScript && !hasBodyNoscript) {
      issues.push('Incomplete GTM installation: missing noscript fallback');
    } else if (!hasHeadScript && hasBodyNoscript) {
      issues.push('Incomplete GTM installation: missing head script');
    }
    
    return {
      gtmId,
      hasHeadScript,
      hasBodyNoscript,
      issues,
      warnings
    };
  }
}

module.exports = GtmChecker;
