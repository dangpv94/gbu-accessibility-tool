#!/usr/bin/env node

/**
 * CLI tool for accessibility testing
 */

const { program } = require('commander');
const { AccessibilityTester } = require('../index');
const chalk = require('chalk');

program
  .name('a11y-test')
  .description('Accessibility testing CLI tool')
  .version('1.0.0');

program
  .command('run')
  .description('Run accessibility tests')
  .option('-u, --base-url <url>', 'Base URL for testing', 'http://localhost:8080')
  .option('-p, --port <port>', 'Server port', '8080')
  .option('-o, --output <dir>', 'Output directory', 'accessibility-reports')
  .option('-f, --files <files...>', 'HTML files to test')
  .action(async (options) => {
    try {
      const tester = new AccessibilityTester({
        baseUrl: options.baseUrl,
        serverPort: parseInt(options.port),
        outputDir: options.output,
        pages: options.files || []
      });

      // Auto-discover pages if none specified
      if (!options.files || options.files.length === 0) {
        console.log(chalk.yellow('No files specified, auto-discovering HTML files...'));
        const fs = require('fs').promises;
        const files = await fs.readdir('.');
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        tester.config.pages = htmlFiles;
      }

      const server = await tester.startServer();
      const results = await tester.testPages();
      
      // Kill server
      server.kill();
      
      const summary = await tester.generateSummary();
      
      console.log(chalk.green('\n✅ Testing completed!'));
      console.log(chalk.blue(`📊 Summary:`));
      console.log(`   Files tested: ${summary.totalFiles}`);
      console.log(`   Total violations: ${summary.totalViolations}`);
      console.log(`   Total passes: ${summary.totalPasses}`);
      
      if (Object.keys(summary.violationsByType).length > 0) {
        console.log(chalk.yellow('\n🔍 Common violations:'));
        Object.entries(summary.violationsByType)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .forEach(([type, count]) => {
            console.log(`   ${type}: ${count}`);
          });
      }
      
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();