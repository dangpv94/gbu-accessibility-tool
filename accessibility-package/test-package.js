#!/usr/bin/env node

/**
 * Test script for GBU Accessibility Package
 * Run this before publishing to npm
 */

const fs = require('fs');
const path = require('path');
const AccessibilityFixer = require('./index.js');

console.log('🧪 Testing GBU Accessibility Package...\n');

// Test 1: Check if main module loads
try {
  console.log('✅ Main module loads successfully');
  console.log('   AccessibilityFixer:', typeof AccessibilityFixer);
} catch (error) {
  console.error('❌ Failed to load main module:', error.message);
  process.exit(1);
}

// Test 2: Create instance
try {
  const fixer = new AccessibilityFixer({
    language: 'ja',
    backupFiles: false,
    dryRun: true
  });
  console.log('✅ Can create AccessibilityFixer instance');
} catch (error) {
  console.error('❌ Failed to create instance:', error.message);
  process.exit(1);
}

// Test 3: Check required files exist
const requiredFiles = [
  'package.json',
  'index.js',
  'cli.js',
  'lib/fixer.js',
  'README.md',
  'LICENSE'
];

console.log('\n📁 Checking required files:');
for (const file of requiredFiles) {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ Missing: ${file}`);
    process.exit(1);
  }
}

// Test 4: Check package.json
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('\n📦 Package info:');
  console.log(`   Name: ${pkg.name}`);
  console.log(`   Version: ${pkg.version}`);
  console.log(`   Description: ${pkg.description}`);
  console.log(`   Main: ${pkg.main}`);
  console.log(`   Bin: ${JSON.stringify(pkg.bin)}`);
  
  // Check required fields
  const requiredFields = ['name', 'version', 'description', 'main', 'bin', 'keywords', 'author', 'license'];
  for (const field of requiredFields) {
    if (!pkg[field]) {
      console.error(`❌ Missing package.json field: ${field}`);
      process.exit(1);
    }
  }
  console.log('✅ Package.json is valid');
} catch (error) {
  console.error('❌ Invalid package.json:', error.message);
  process.exit(1);
}

// Test 5: Create test HTML and process
const testHtml = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <img src="test.jpg">
  <a href="#test">Link</a>
  <div class="btn-click">Button</div>
</body>
</html>`;

const testFile = path.join(__dirname, 'test-temp.html');

async function testProcessing() {
  try {
    // Write test file
    fs.writeFileSync(testFile, testHtml);
    
    // Process with fixer
    const fixer = new AccessibilityFixer({
      language: 'ja',
      backupFiles: false,
      dryRun: true
    });
    
    console.log('\n🔧 Testing processing functionality:');
    
    // Test individual methods
    const langResults = await fixer.fixHtmlLang(testFile);
    console.log(`✅ fixHtmlLang: ${langResults.length} files processed`);
    
    const altResults = await fixer.fixEmptyAltAttributes(testFile);
    console.log(`✅ fixEmptyAltAttributes: ${altResults.length} files processed`);
    
    const roleResults = await fixer.fixRoleAttributes(testFile);
    console.log(`✅ fixRoleAttributes: ${roleResults.length} files processed`);
    
    // Test comprehensive method
    const allResults = await fixer.fixAllAccessibilityIssues(testFile);
    console.log(`✅ fixAllAccessibilityIssues: processed successfully`);
    
    // Cleanup
    fs.unlinkSync(testFile);
    if (fs.existsSync(testFile + '.backup')) {
      fs.unlinkSync(testFile + '.backup');
    }
    
    console.log('✅ All processing tests passed');
    
  } catch (error) {
    console.error('❌ Processing test failed:', error.message);
    // Cleanup on error
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    if (fs.existsSync(testFile + '.backup')) fs.unlinkSync(testFile + '.backup');
    process.exit(1);
  }
}

// Run async tests
testProcessing().then(() => {
  console.log('\n🎉 All tests passed! Package is ready for publishing.');
  console.log('\nNext steps:');
  console.log('1. npm login');
  console.log('2. npm publish');
  console.log('3. npm install -g gbu-accessibility-package');
  console.log('4. gbu-a11y --help');
}).catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  process.exit(1);
});