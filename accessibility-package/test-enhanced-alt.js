#!/usr/bin/env node

/**
 * Enhanced Alt Attribute Testing Script
 * Demo script to showcase improved alt attribute checking capabilities
 */

const AccessibilityFixer = require('./lib/fixer.js');
const chalk = require('chalk');

async function testEnhancedAltFeatures() {
  console.log(chalk.blue('🧪 Testing Enhanced Alt Attribute Features\n'));

  // Test different configurations
  const testConfigs = [
    {
      name: 'Basic Mode (Original)',
      config: {
        language: 'ja',
        dryRun: true,
        enhancedAltMode: false
      }
    },
    {
      name: 'Enhanced Mode - Conservative',
      config: {
        language: 'ja',
        dryRun: true,
        enhancedAltMode: true,
        altCreativity: 'conservative',
        includeEmotions: false,
        strictAltChecking: true
      }
    },
    {
      name: 'Enhanced Mode - Balanced',
      config: {
        language: 'ja',
        dryRun: true,
        enhancedAltMode: true,
        altCreativity: 'balanced',
        includeEmotions: false,
        strictAltChecking: false
      }
    },
    {
      name: 'Enhanced Mode - Creative with Emotions',
      config: {
        language: 'ja',
        dryRun: true,
        enhancedAltMode: true,
        altCreativity: 'creative',
        includeEmotions: true,
        strictAltChecking: false
      }
    },
    {
      name: 'Enhanced Mode - English Creative',
      config: {
        language: 'en',
        dryRun: true,
        enhancedAltMode: true,
        altCreativity: 'creative',
        includeEmotions: true,
        strictAltChecking: false
      }
    }
  ];

  for (const testConfig of testConfigs) {
    console.log(chalk.cyan(`\n${'='.repeat(60)}`));
    console.log(chalk.cyan(`🔬 Testing: ${testConfig.name}`));
    console.log(chalk.cyan(`${'='.repeat(60)}\n`));

    const fixer = new AccessibilityFixer(testConfig.config);

    try {
      console.log(chalk.yellow(`Configuration:`));
      console.log(chalk.gray(`  Language: ${testConfig.config.language}`));
      console.log(chalk.gray(`  Enhanced Mode: ${testConfig.config.enhancedAltMode}`));
      console.log(chalk.gray(`  Creativity: ${testConfig.config.altCreativity || 'N/A'}`));
      console.log(chalk.gray(`  Include Emotions: ${testConfig.config.includeEmotions}`));
      console.log(chalk.gray(`  Strict Checking: ${testConfig.config.strictAltChecking}`));
      console.log('');

      // Test on the enhanced alt test file
      const results = await fixer.fixEmptyAltAttributes('./demo');

      // Summary
      const fixedFiles = results.filter(r => r.status === 'fixed').length;
      const totalIssues = results.reduce((sum, r) => sum + (r.issues || 0), 0);

      console.log(chalk.green(`\n📊 Test Results:`));
      console.log(chalk.green(`  Files processed: ${results.length}`));
      console.log(chalk.green(`  Files with fixes: ${fixedFiles}`));
      console.log(chalk.green(`  Total issues found: ${totalIssues}`));

    } catch (error) {
      console.error(chalk.red(`❌ Test failed: ${error.message}`));
    }

    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(chalk.blue('\n🎉 Enhanced Alt Attribute Testing Complete!'));
  console.log(chalk.gray('\nKey improvements in enhanced mode:'));
  console.log(chalk.gray('• Image type classification (decorative, functional, complex, etc.)'));
  console.log(chalk.gray('• Content quality checking (length, redundancy, generic text)'));
  console.log(chalk.gray('• Context-aware alt text generation'));
  console.log(chalk.gray('• Multi-language vocabulary support'));
  console.log(chalk.gray('• Brand and emotional context integration'));
  console.log(chalk.gray('• Technical image description (charts, graphs)'));
  console.log(chalk.gray('• Comprehensive recommendations'));
}

// Run the test
if (require.main === module) {
  testEnhancedAltFeatures().catch(console.error);
}

module.exports = { testEnhancedAltFeatures };