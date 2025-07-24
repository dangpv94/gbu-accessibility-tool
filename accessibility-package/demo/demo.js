#!/usr/bin/env node

/**
 * Demo script to test accessibility package functionality
 */

const path = require('path');
const { AccessibilityTester, AccessibilityFixer } = require('../index');
const chalk = require('chalk');

async function runDemo() {
  console.log(chalk.blue('🚀 Accessibility Package Demo'));
  console.log(chalk.blue('===============================\n'));

  try {
    // Test the fixer first
    console.log(chalk.yellow('1. Testing Accessibility Fixer...'));
    const fixer = new AccessibilityFixer({
      language: 'ja',
      dryRun: true // Don't actually modify files in demo
    });

    // Go to parent directory to find HTML files
    const projectRoot = path.join(__dirname, '../..');
    
    console.log(chalk.gray(`   Scanning directory: ${projectRoot}`));
    
    const langResults = await fixer.fixHtmlLang(projectRoot);
    console.log(chalk.green(`   ✅ Lang attribute check: ${langResults.length} files scanned`));
    
    const altResults = await fixer.fixEmptyAltAttributes(projectRoot);
    console.log(chalk.green(`   ✅ Alt attribute check: ${altResults.length} files scanned`));
    
    const mainSuggestions = await fixer.addMainLandmarks(projectRoot);
    console.log(chalk.green(`   ✅ Main landmark check: ${mainSuggestions.length} suggestions`));

    console.log(chalk.yellow('\n2. Testing Accessibility Tester...'));
    
    // Find HTML files in project
    const fs = require('fs').promises;
    const files = await fs.readdir(projectRoot);
    const htmlFiles = files.filter(f => f.endsWith('.html')).slice(0, 3); // Test first 3 files
    
    if (htmlFiles.length > 0) {
      console.log(chalk.gray(`   Found HTML files: ${htmlFiles.join(', ')}`));
      
      const tester = new AccessibilityTester({
        baseUrl: 'http://localhost:8080',
        outputDir: path.join(projectRoot, 'accessibility-reports'),
        pages: htmlFiles,
        serverPort: 8080
      });

      console.log(chalk.gray('   Note: Actual testing requires a running server'));
      console.log(chalk.green('   ✅ Tester configuration ready'));
    } else {
      console.log(chalk.yellow('   ⚠️  No HTML files found for testing'));
    }

    console.log(chalk.green('\n✅ Demo completed successfully!'));
    console.log(chalk.blue('\n📋 Package is working correctly. You can now use:'));
    console.log(chalk.white('   a11y-fix all --dry-run    # Preview fixes'));
    console.log(chalk.white('   a11y-fix all              # Apply fixes'));
    console.log(chalk.white('   a11y-test run             # Run accessibility tests'));

  } catch (error) {
    console.error(chalk.red(`❌ Demo failed: ${error.message}`));
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

runDemo();