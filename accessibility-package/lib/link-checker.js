/**
 * Link Checker
 * Check for broken links and 404 resources
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const FileUtils = require('./file-utils');

class LinkChecker {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'ja',
      checkExternal: config.checkExternal || false,
      timeout: config.timeout || 5000,
      ...config
    };
  }

  async check(directory = '.') {
    console.log(chalk.blue('🔗 Đang kiểm tra broken links...'));
    
    const htmlFiles = await FileUtils.findHtmlFiles(directory);
    const results = [];
    let totalBrokenLinks = 0;
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const brokenLinks = await this.checkBrokenLinks(content, file, directory);
        
        if (brokenLinks.length > 0) {
          console.log(chalk.cyan(`\n📁 ${file}:`));
          brokenLinks.forEach(link => {
            console.log(chalk.red(`  ❌ ${link.type}: ${link.url}`));
            console.log(chalk.gray(`     ${link.reason}`));
            totalBrokenLinks++;
          });
        }
        
        results.push({ 
          file, 
          brokenLinks: brokenLinks.length,
          links: brokenLinks
        });
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${file}: ${error.message}`));
        results.push({ file, status: 'error', error: error.message });
      }
    }
    
    console.log(chalk.blue(`\n📊 Tóm tắt: Tìm thấy ${totalBrokenLinks} broken links trong ${results.length} file`));
    return results;
  }

  async checkBrokenLinks(content, htmlFile, baseDir) {
    const brokenLinks = [];
    
    // Check internal links
    const linkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[1];
      
      // Skip external URLs if not checking external
      if (href.startsWith('http://') || href.startsWith('https://')) {
        if (!this.config.checkExternal) continue;
        // External link checking would require actual HTTP requests
        // Skipping for now as it's complex and slow
        continue;
      }
      
      // Skip anchors, mailto, tel, javascript
      if (href.startsWith('#') || href.startsWith('mailto:') || 
          href.startsWith('tel:') || href.startsWith('javascript:')) {
        continue;
      }
      
      // Check if local file exists
      const absolutePath = this.resolveLocalPath(href, htmlFile, baseDir);
      
      try {
        await fs.access(absolutePath);
      } catch (error) {
        brokenLinks.push({
          type: 'Broken link',
          url: href,
          reason: `File not found: ${absolutePath}`
        });
      }
    }
    
    // Check image sources
    const imgRegex = /<img\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
    
    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1];
      
      // Skip external URLs and data URLs
      if (src.startsWith('http://') || src.startsWith('https://') || 
          src.startsWith('data:')) {
        continue;
      }
      
      // Check if local file exists
      const absolutePath = this.resolveLocalPath(src, htmlFile, baseDir);
      
      try {
        await fs.access(absolutePath);
      } catch (error) {
        brokenLinks.push({
          type: 'Missing image',
          url: src,
          reason: `Image file not found: ${absolutePath}`
        });
      }
    }
    
    // Check CSS links
    const cssRegex = /<link\s+[^>]*href\s*=\s*["']([^"']+\.css)["'][^>]*>/gi;
    
    while ((match = cssRegex.exec(content)) !== null) {
      const href = match[1];
      
      // Skip external URLs
      if (href.startsWith('http://') || href.startsWith('https://')) {
        continue;
      }
      
      const absolutePath = this.resolveLocalPath(href, htmlFile, baseDir);
      
      try {
        await fs.access(absolutePath);
      } catch (error) {
        brokenLinks.push({
          type: 'Missing CSS',
          url: href,
          reason: `CSS file not found: ${absolutePath}`
        });
      }
    }
    
    // Check script sources
    const scriptRegex = /<script\s+[^>]*src\s*=\s*["']([^"']+\.js)["'][^>]*>/gi;
    
    while ((match = scriptRegex.exec(content)) !== null) {
      const src = match[1];
      
      // Skip external URLs
      if (src.startsWith('http://') || src.startsWith('https://')) {
        continue;
      }
      
      const absolutePath = this.resolveLocalPath(src, htmlFile, baseDir);
      
      try {
        await fs.access(absolutePath);
      } catch (error) {
        brokenLinks.push({
          type: 'Missing script',
          url: src,
          reason: `Script file not found: ${absolutePath}`
        });
      }
    }
    
    return brokenLinks;
  }

  resolveLocalPath(href, htmlFile, baseDir) {
    const htmlDir = path.dirname(htmlFile);
    
    // Remove query string and hash
    const cleanHref = href.split('?')[0].split('#')[0];
    
    // If href starts with /, it's relative to baseDir
    if (cleanHref.startsWith('/')) {
      return path.join(baseDir, cleanHref.substring(1));
    }
    
    // Otherwise, it's relative to the HTML file's directory
    return path.join(htmlDir, cleanHref);
  }
}

module.exports = LinkChecker;
