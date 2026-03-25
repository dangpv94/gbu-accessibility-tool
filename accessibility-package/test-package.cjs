#!/usr/bin/env node
/**
 * Quick test for GBU Accessibility Package
 */

const { AccessibilityFixer } = require('./index.js');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

async function createUnusedFilesFixture(tempDir) {
  await fs.writeFile(
    path.join(tempDir, 'index.html'),
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="./style.css?4f4be17fc854ef0e">
  <script src="./bundle.js?4f4be17fc854ef0e"></script>
</head>
<body>
  <img src="./image.png?cache=12345" alt="Example image">
</body>
</html>`,
    'utf8'
  );

  await fs.writeFile(
    path.join(tempDir, 'style.css'),
    `body { background-image: url("./bg.png?cache=98765"); }`,
    'utf8'
  );
  await fs.writeFile(path.join(tempDir, 'bundle.js'), `import './chunk.js?build=20260325';`, 'utf8');
  await fs.writeFile(path.join(tempDir, 'chunk.js'), `console.log('chunk loaded');`, 'utf8');
  await fs.writeFile(path.join(tempDir, 'image.png'), 'placeholder', 'utf8');
  await fs.writeFile(path.join(tempDir, 'bg.png'), 'placeholder', 'utf8');
}

async function testUnusedFilesWithQueryParams() {
  console.log('🧪 Regression test: unused files should ignore query/hash suffixes');

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gbu-a11y-unused-files-'));

  try {
    await createUnusedFilesFixture(tempDir);

    const fixer = new AccessibilityFixer({ language: 'en', dryRun: true });
    const result = await fixer.checkUnusedFiles(tempDir);
    const unusedPaths = result.unusedFiles.map(file => file.relativePath).sort();

    const shouldBeReferenced = ['style.css', 'bundle.js', 'chunk.js', 'image.png', 'bg.png'];
    const missingReferences = shouldBeReferenced.filter(file => unusedPaths.includes(file));

    if (missingReferences.length > 0) {
      throw new Error(`Query/hash references were not resolved correctly: ${missingReferences.join(', ')}`);
    }

    console.log('✅ Query/hash suffixes are handled correctly\n');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function testUnusedFilesListWorkflow() {
  console.log('🧪 Regression test: unused files list export and deletion workflow');

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gbu-a11y-unused-list-'));

  try {
    await createUnusedFilesFixture(tempDir);
    await fs.writeFile(path.join(tempDir, 'unused-style.css'), '.unused { display: none; }', 'utf8');
    await fs.writeFile(path.join(tempDir, 'unused-script.js'), 'console.log("unused");', 'utf8');

    await execFileAsync('node', ['cli.js', '--unused-files-list', tempDir], {
      cwd: __dirname
    });

    const listPath = path.join(tempDir, 'unused-files-list.txt');
    const listContent = await fs.readFile(listPath, 'utf8');
    const listEntries = listContent.split(/\r?\n/).filter(Boolean).sort();

    const expectedEntries = ['unused-script.js', 'unused-style.css'];
    if (JSON.stringify(listEntries) !== JSON.stringify(expectedEntries)) {
      throw new Error(`Unexpected unused files list content: ${listEntries.join(', ')}`);
    }

    await execFileAsync('node', ['cli.js', '--delete-unused-files', tempDir], {
      cwd: __dirname
    });

    const remainingFiles = await fs.readdir(tempDir);
    if (remainingFiles.includes('unused-style.css') || remainingFiles.includes('unused-script.js')) {
      throw new Error('Unused files were not deleted from list');
    }

    await fs.access(path.join(tempDir, 'style.css'));
    await fs.access(path.join(tempDir, 'bundle.js'));
    await fs.access(listPath);

    console.log('✅ Unused files list export and deletion work correctly\n');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

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

  await testUnusedFilesWithQueryParams();
  await testUnusedFilesListWorkflow();
  
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
