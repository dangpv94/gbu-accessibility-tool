/**
 * Accessibility Tester
 * Automated testing using axe-core and custom rules
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

class AccessibilityTester {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:8080',
      outputDir: config.outputDir || 'accessibility-reports',
      pages: config.pages || [],
      serverPort: config.serverPort || 8080,
      ...config
    };
  }

  async startServer() {
    console.log(chalk.blue('🌐 Starting local server...'));
    
    return new Promise((resolve, reject) => {
      // Try python3 first, then python
      const pythonCmd = this.findPython();
      const server = spawn(pythonCmd, ['-m', 'http.server', this.config.serverPort.toString()], {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      server.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Serving HTTP')) {
          console.log(chalk.green('✅ Server started successfully'));
        }
      });
      
      server.stderr.on('data', (data) => {
        const error = data.toString();
        if (!error.includes('Serving HTTP')) {
          console.error(chalk.red(`Server error: ${error}`));
        }
      });
      
      server.on('error', (error) => {
        reject(new Error(`Failed to start server: ${error.message}`));
      });
      
      // Wait for server to start
      setTimeout(() => resolve(server), 3000);
    });
  }

  findPython() {
    // Check which python command is available
    const { execSync } = require('child_process');
    try {
      execSync('python3 --version', { stdio: 'ignore' });
      return 'python3';
    } catch {
      try {
        execSync('python --version', { stdio: 'ignore' });
        return 'python';
      } catch {
        throw new Error('Python not found. Please install Python to run the test server.');
      }
    }
  }

  async testPages(pages = null) {
    const testPages = pages || this.config.pages;
    
    if (testPages.length === 0) {
      throw new Error('No pages specified for testing');
    }

    console.log(chalk.blue('🧪 Running accessibility tests...'));
    
    // Create output directory
    await fs.mkdir(this.config.outputDir, { recursive: true });
    
    const results = [];
    
    for (const page of testPages) {
      const url = page.startsWith('http') ? page : `${this.config.baseUrl}/${page}`;
      const filename = this.generateReportFilename(url);
      const outputPath = path.join(this.config.outputDir, filename);
      
      console.log(chalk.yellow(`Testing: ${url}`));
      
      try {
        await this.runAxeTest(url, outputPath);
        results.push({ url, status: 'success', reportPath: outputPath });
      } catch (error) {
        console.error(chalk.red(`Failed to test ${url}: ${error.message}`));
        results.push({ url, status: 'error', error: error.message });
      }
    }
    
    return results;
  }

  async runAxeTest(url, outputPath) {
    return new Promise((resolve, reject) => {
      const axe = spawn('axe', [url, '--save', outputPath]);
      
      axe.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`axe-core exited with code ${code}`));
        }
      });
      
      axe.on('error', (error) => {
        reject(error);
      });
    });
  }

  generateReportFilename(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.replace(/\//g, '-').replace(/^-/, '') || 'index';
    return `${pathname}-report.json`;
  }

  async generateSummary() {
    const reportFiles = await fs.readdir(this.config.outputDir);
    const jsonFiles = reportFiles.filter(file => file.endsWith('.json'));
    
    let totalViolations = 0;
    let totalPasses = 0;
    const violationsByType = {};
    
    for (const file of jsonFiles) {
      const reportPath = path.join(this.config.outputDir, file);
      const reportData = JSON.parse(await fs.readFile(reportPath, 'utf8'));
      
      totalViolations += reportData.violations?.length || 0;
      totalPasses += reportData.passes?.length || 0;
      
      reportData.violations?.forEach(violation => {
        violationsByType[violation.id] = (violationsByType[violation.id] || 0) + 1;
      });
    }
    
    return {
      totalFiles: jsonFiles.length,
      totalViolations,
      totalPasses,
      violationsByType
    };
  }
}

module.exports = AccessibilityTester;