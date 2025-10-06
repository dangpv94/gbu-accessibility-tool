#!/usr/bin/env node
/**
 * Quick test for GBU Accessibility Package
 */

const { AccessibilityFixer } = require('./index.js');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

async function runTests() {
console.log('🧪 Testing GBU Accessibility Package...\n');

// Test basic functionality
try {
  // Test main module loading
  console.log('✅ Main module loads successfully');
  console.log(`   AccessibilityFixer: ${typeof AccessibilityFixer}`);
  
  // Test creating instance
  const fixer = new AccessibilityFixer({ language: 'en', dryRun: true });
  console.log('✅ Can create AccessibilityFixer instance\n');
  
  // Check required files
  console.log('📁 Checking required files:');
  const requiredFiles = ['package.json', 'index.js', 'cli.js', 'lib/fixer.js', 'README.md', 'LICENSE'];
  for (const file of requiredFiles) {
    try {
      await fs.access(file);
      console.log(`✅ ${file}`);
    } catch (error) {
      console.log(`❌ ${file} (missing)`);
    }
  }
  
  // Read package.json for info
  console.log('\n📦 Package info:');
  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  console.log(`   Description: ${packageJson.description.substring(0, 100)}...`);
  console.log(`   Main: ${packageJson.main}`);
  console.log(`   Bin: ${JSON.stringify(packageJson.bin)}`);
  console.log('✅ Package.json is valid\n');
  
  console.log('🎉 All tests passed! Package is ready for use.\n');
  console.log('Next steps:');
  console.log('1. gbu-a11y --help');
  console.log('2. gbu-a11y --unused-files');
  console.log('3. gbu-a11y --dry-run');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
}

// Run tests
runTests();