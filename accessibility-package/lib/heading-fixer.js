/**
 * Heading Fixer
 * Fix heading structure and hierarchy
 */

const fs = require('fs').promises;
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class HeadingFixer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      backupFiles: config.backupFiles || false,
      dryRun: config.dryRun || false,
      ...config
    };
  }

  async fix(directory = '.') {
    console.log(chalk.blue('📋 Đang phân tích cấu trúc heading...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    let totalIssuesFound = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const analysis = this.analyzeHeadingStructure(content);
        
        if (analysis.issues.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          console.log(chalk.blue('  Heading structure:'));
          
          analysis.headings.forEach(heading => {
            const indent = '  '.repeat(heading.level);
            console.log(chalk.gray(`    ${indent}${heading.tag}: ${heading.text.substring(0, 50)}...`));
          });
          
          analysis.issues.forEach(issue => {
            console.log(chalk.yellow(`  ${issue.type}: ${issue.description}`));
            totalIssuesFound++;
          });
        }
        
        results.push({ 
          file, 
          headings: analysis.headings.length,
          issues: analysis.issues.length 
        });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalIssuesFound} vấn đề heading trong ${results.length} file`));
    return results;
  }

  analyzeHeadingStructure(content) {
    const headings = [];
    const issues = [];
    
    // Extract all headings
    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      headings.push({ level, tag: `h${level}`, text });
    }
    
    // Check for issues
    if (headings.length === 0) {
      issues.push({
        type: 'ℹ️  No headings',
        description: 'Page has no heading elements'
      });
      return { headings, issues };
    }
    
    // Check if starts with h1
    if (headings[0].level !== 1) {
      issues.push({
        type: '⚠️  Missing h1',
        description: `First heading is <h${headings[0].level}>, should be <h1>`
      });
    }
    
    // Check for multiple h1s
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count > 1) {
      issues.push({
        type: '⚠️  Multiple h1 elements',
        description: `Found ${h1Count} <h1> elements (best practice is to have only one)`
      });
    }
    
    // Check for skipped levels
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level;
      const currLevel = headings[i].level;
      
      if (currLevel > prevLevel + 1) {
        issues.push({
          type: '❌ Skipped heading level',
          description: `Heading level jumps from <h${prevLevel}> to <h${currLevel}> (skipped h${prevLevel + 1})`
        });
      }
    }
    
    // Check for empty headings
    headings.forEach((heading, index) => {
      if (!heading.text || heading.text.length === 0) {
        issues.push({
          type: '❌ Empty heading',
          description: `<${heading.tag}> at position ${index + 1} is empty`
        });
      }
    });
    
    return { headings, issues };
  }
}

module.exports = HeadingFixer;
