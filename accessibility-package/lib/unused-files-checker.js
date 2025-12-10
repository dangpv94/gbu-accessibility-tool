/**
 * Unused Files Checker
 * Find unused CSS, JS, and HTML files in the project
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class UnusedFilesChecker {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      checkCSS: config.checkCSS !== false,
      checkJS: config.checkJS !== false,
      checkHTML: config.checkHTML !== false,
      ignorePatterns: config.ignorePatterns || ['node_modules', '.git', 'dist', 'build'],
      ...config
    };
  }

  async check(directory = '.') {
    console.log(chalk.blue('🔍 Đang kiểm tra unused files...'));
    
    const results = {
      unusedCSS: [],
      unusedJS: [],
      unusedHTML: [],
      totalUnused: 0
    };
    
    try {
      // Find all HTML files first
      const htmlFiles = await FileUtils.findHtmlFiles(directory);
      
      // Read all HTML content
      const htmlContents = await Promise.all(
        htmlFiles.map(async file => ({
          file,
          content: await fs.readFile(file, 'utf8')
        }))
      );
      
      // Check for unused CSS files
      if (this.config.checkCSS) {
        results.unusedCSS = await this.findUnusedCSSFiles(directory, htmlContents);
      }
      
      // Check for unused JS files
      if (this.config.checkJS) {
        results.unusedJS = await this.findUnusedJSFiles(directory, htmlContents);
      }
      
      // Check for unused HTML files
      if (this.config.checkHTML) {
        results.unusedHTML = await this.findUnusedHTMLFiles(directory, htmlContents);
      }
      
      results.totalUnused = results.unusedCSS.length + results.unusedJS.length + results.unusedHTML.length;
      
      // Display results
      if (results.unusedCSS.length > 0) {
        console.log(chalk.yellow(`\n📄 Unused CSS files (${results.unusedCSS.length}):`));
        results.unusedCSS.forEach(file => {
          const size = FileUtils.formatFileSize(file.size);
          console.log(chalk.gray(`  ${file.path} (${size})`));
        });
      }
      
      if (results.unusedJS.length > 0) {
        console.log(chalk.yellow(`\n📜 Unused JS files (${results.unusedJS.length}):`));
        results.unusedJS.forEach(file => {
          const size = FileUtils.formatFileSize(file.size);
          console.log(chalk.gray(`  ${file.path} (${size})`));
        });
      }
      
      if (results.unusedHTML.length > 0) {
        console.log(chalk.yellow(`\n📋 Unused HTML files (${results.unusedHTML.length}):`));
        results.unusedHTML.forEach(file => {
          console.log(chalk.gray(`  ${file.path}`));
        });
      }
      
      if (results.totalUnused === 0) {
        console.log(chalk.green('\n✅ No unused files found!'));
      } else {
        console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${results.totalUnused} unused files`));
      }
      
    } catch (error) {
      console.error(chalk.red(`❌ Error checking unused files: ${error.message}`));
    }
    
    return results;
  }

  async findUnusedCSSFiles(directory, htmlContents) {
    const unusedCSS = [];
    const allCSSFiles = await this.findFilesByExtension(directory, '.css');
    
    for (const cssFile of allCSSFiles) {
      const relativePath = path.relative(directory, cssFile);
      const fileName = path.basename(cssFile);
      
      // Check if this CSS file is referenced in any HTML
      let isReferenced = false;
      for (const { content } of htmlContents) {
        // Check for various reference patterns
        if (content.includes(relativePath) || 
            content.includes(fileName) ||
            content.includes(relativePath.replace(/\\/g, '/'))) {
          isReferenced = true;
          break;
        }
      }
      
      if (!isReferenced) {
        const stats = await fs.stat(cssFile);
        unusedCSS.push({
          path: relativePath,
          absolutePath: cssFile,
          size: stats.size
        });
      }
    }
    
    return unusedCSS;
  }

  async findUnusedJSFiles(directory, htmlContents) {
    const unusedJS = [];
    const allJSFiles = await this.findFilesByExtension(directory, '.js');
    
    for (const jsFile of allJSFiles) {
      const relativePath = path.relative(directory, jsFile);
      const fileName = path.basename(jsFile);
      
      // Check if this JS file is referenced in any HTML
      let isReferenced = false;
      for (const { content } of htmlContents) {
        if (content.includes(relativePath) || 
            content.includes(fileName) ||
            content.includes(relativePath.replace(/\\/g, '/'))) {
          isReferenced = true;
          break;
        }
      }
      
      if (!isReferenced) {
        const stats = await fs.stat(jsFile);
        unusedJS.push({
          path: relativePath,
          absolutePath: jsFile,
          size: stats.size
        });
      }
    }
    
    return unusedJS;
  }

  async findUnusedHTMLFiles(directory, htmlContents) {
    const unusedHTML = [];
    const allHTMLFiles = htmlContents.map(h => h.file);
    
    // Common entry points that are always considered "used"
    const entryPoints = ['index.html', 'home.html', 'main.html'];
    
    for (const htmlFile of allHTMLFiles) {
      const relativePath = path.relative(directory, htmlFile);
      const fileName = path.basename(htmlFile);
      
      // Skip entry points
      if (entryPoints.includes(fileName.toLowerCase())) {
        continue;
      }
      
      // Check if this HTML file is linked from any other HTML
      let isLinked = false;
      for (const { content, file } of htmlContents) {
        // Don't check the file against itself
        if (file === htmlFile) continue;
        
        if (content.includes(relativePath) || 
            content.includes(fileName) ||
            content.includes(relativePath.replace(/\\/g, '/'))) {
          isLinked = true;
          break;
        }
      }
      
      if (!isLinked) {
        unusedHTML.push({
          path: relativePath,
          absolutePath: htmlFile
        });
      }
    }
    
    return unusedHTML;
  }

  async findFilesByExtension(directory, extension) {
    const files = [];
    
    async function scan(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip ignored directories
          if (FileUtils.shouldSkipDirectory(entry.name)) {
            continue;
          }
          
          await scan(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    }
    
    await scan(directory);
    return files;
  }
}

module.exports = UnusedFilesChecker;
