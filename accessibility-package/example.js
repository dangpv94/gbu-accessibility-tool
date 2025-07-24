/**
 * Example usage of Accessibility Fixer
 * Demonstrates different ways to use the tool
 */

const AccessibilityFixer = require('./lib/fixer.js');
const chalk = require('chalk');

async function example1_BasicUsage() {
  console.log(chalk.blue('\n📝 Example 1: Basic Usage'));
  
  const fixer = new AccessibilityFixer({
    language: 'ja',
    backupFiles: true,
    dryRun: true  // Preview mode
  });

  // Fix all accessibility issues
  await fixer.fixHtmlLang('./demo');
  await fixer.fixEmptyAltAttributes('./demo');
  await fixer.fixRoleAttributes('./demo');
}

async function example2_EnglishProject() {
  console.log(chalk.blue('\n📝 Example 2: English Project'));
  
  const fixer = new AccessibilityFixer({
    language: 'en',
    backupFiles: false,
    dryRun: false
  });

  const results = await fixer.fixRoleAttributes('./demo');
  console.log(`Fixed ${results.filter(r => r.status === 'fixed').length} files`);
}

async function example3_StepByStep() {
  console.log(chalk.blue('\n📝 Example 3: Step by Step'));
  
  const fixer = new AccessibilityFixer({
    language: 'vi',
    backupFiles: true,
    dryRun: false
  });

  // Step 1: Fix lang attributes first
  console.log('Step 1: Lang attributes...');
  await fixer.fixHtmlLang('./demo');

  // Step 2: Fix alt attributes
  console.log('Step 2: Alt attributes...');
  await fixer.fixEmptyAltAttributes('./demo');

  // Step 3: Fix role attributes
  console.log('Step 3: Role attributes...');
  await fixer.fixRoleAttributes('./demo');

  console.log('✅ All done!');
}

async function example4_CustomConfig() {
  console.log(chalk.blue('\n📝 Example 4: Custom Configuration'));
  
  // Custom configuration for specific needs
  const fixer = new AccessibilityFixer({
    language: 'zh',
    backupFiles: true,
    dryRun: true
  });

  // Only fix specific issues
  const altResults = await fixer.fixEmptyAltAttributes('./demo');
  
  // Analyze results
  const fixedFiles = altResults.filter(r => r.status === 'fixed');
  const totalIssues = altResults.reduce((sum, r) => sum + (r.issues || 0), 0);
  
  console.log(`Found ${totalIssues} alt attribute issues in ${fixedFiles.length} files`);
}

async function example5_ErrorHandling() {
  console.log(chalk.blue('\n📝 Example 5: Error Handling'));
  
  const fixer = new AccessibilityFixer({
    language: 'ja',
    backupFiles: true,
    dryRun: false
  });

  try {
    const results = await fixer.fixRoleAttributes('./nonexistent-directory');
    console.log('Results:', results);
  } catch (error) {
    console.error(chalk.red('Error occurred:'), error.message);
    // Handle error appropriately
  }
}

// Run examples
async function runExamples() {
  console.log(chalk.green('🚀 Accessibility Fixer Examples\n'));
  
  await example1_BasicUsage();
  await example2_EnglishProject();
  await example3_StepByStep();
  await example4_CustomConfig();
  await example5_ErrorHandling();
  
  console.log(chalk.green('\n✅ All examples completed!'));
}

// Uncomment to run examples
// runExamples();

module.exports = {
  example1_BasicUsage,
  example2_EnglishProject,
  example3_StepByStep,
  example4_CustomConfig,
  example5_ErrorHandling
};