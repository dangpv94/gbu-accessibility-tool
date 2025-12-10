/**
 * File Utilities
 * Common file operations for accessibility tools
 */

const fs = require('fs').promises;
const path = require('path');

class FileUtils {
  /**
   * Find all HTML files in a directory
   */
  static async findHtmlFiles(directory) {
    const files = [];
    
    // Check if the path is a file or directory
    const stat = await fs.stat(directory);
    
    if (stat.isFile()) {
      // If it's a file, check if it's HTML
      if (directory.endsWith('.html')) {
        files.push(directory);
      }
      return files;
    }
    
    // If it's a directory, scan recursively
    async function scan(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await scan(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    }
    
    await scan(directory);
    return files;
  }

  /**
   * Find all files in a directory recursively
   */
  static async findAllFiles(directory) {
    const files = [];
    
    async function walk(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await walk(fullPath);
          } else if (entry.isFile()) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }
    
    await walk(directory);
    return files;
  }

  /**
   * Check if a directory should be skipped
   */
  static shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules',
      '.git',
      '.svn',
      '.hg',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      'vendor',
      'bower_components'
    ];
    
    return skipDirs.includes(dirName) || dirName.startsWith('.');
  }

  /**
   * Format file size to human readable format
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get file type from extension
   */
  static getFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    const typeMap = {
      '.html': 'HTML',
      '.htm': 'HTML',
      '.css': 'CSS',
      '.js': 'JavaScript',
      '.jsx': 'JavaScript',
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript',
      '.json': 'JSON',
      '.xml': 'XML',
      '.svg': 'SVG',
      '.png': 'Image',
      '.jpg': 'Image',
      '.jpeg': 'Image',
      '.gif': 'Image',
      '.webp': 'Image',
      '.ico': 'Icon',
      '.woff': 'Font',
      '.woff2': 'Font',
      '.ttf': 'Font',
      '.eot': 'Font'
    };
    
    return typeMap[ext] || 'Other';
  }

  /**
   * Get file icon based on type
   */
  static getFileIcon(fileType) {
    const iconMap = {
      'HTML': '📄',
      'CSS': '🎨',
      'JavaScript': '📜',
      'TypeScript': '📘',
      'JSON': '📋',
      'Image': '🖼️',
      'Icon': '🎯',
      'Font': '🔤',
      'SVG': '🎨',
      'Other': '📁'
    };
    
    return iconMap[fileType] || '📁';
  }

  /**
   * Write file with backup option
   */
  static async writeFile(filePath, content, options = {}) {
    const { backup = false, dryRun = false } = options;
    
    if (backup && !dryRun) {
      const backupPath = `${filePath}.backup`;
      const originalContent = await fs.readFile(filePath, 'utf8');
      await fs.writeFile(backupPath, originalContent);
    }
    
    if (!dryRun) {
      await fs.writeFile(filePath, content);
    }
  }
}

module.exports = FileUtils;
