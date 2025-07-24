#!/usr/bin/env node

/**
 * Accessibility Fixer CLI
 * Command line interface for the accessibility fixer tool
 */

const AccessibilityFixer = require('./lib/fixer.js');
const chalk = require('chalk');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  directory: '.',
  language: 'ja',
  backupFiles: true,
  dryRun: false,
  help: false,
  cleanupOnly: false,
  comprehensive: false,
  altOnly: false,
  langOnly: false,
  roleOnly: false
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  switch (arg) {
    case '--help':
    case '-h':
      options.help = true;
      break;
    case '--directory':
    case '-d':
      options.directory = args[++i];
      break;
    case '--language':
    case '-l':
      options.language = args[++i];
      break;
    case '--no-backup':
      options.backupFiles = false;
      break;
    case '--dry-run':
      options.dryRun = true;
      break;
    case '--cleanup-only':
      options.cleanupOnly = true;
      break;
    case '--comprehensive':
    case '--all':
      options.comprehensive = true;
      break;
    case '--alt-only':
      options.altOnly = true;
      break;
    case '--lang-only':
      options.langOnly = true;
      break;
    case '--role-only':
      options.roleOnly = true;
      break;
    default:
      if (!arg.startsWith('-')) {
        options.directory = arg;
      }
  }
}

// Show help
if (options.help) {
  console.log(chalk.blue(`
🔧 Accessibility Fixer CLI

Usage: node cli.js [options] [directory]

Options:
  -d, --directory <path>    Target directory (default: current directory)
  -l, --language <lang>     Language for lang attribute (default: ja)
  --no-backup              Don't create backup files
  --dry-run                Preview changes without applying
  --comprehensive, --all   Run all fixes including cleanup (recommended)
  --cleanup-only           Only cleanup duplicate role attributes
  --alt-only               Only fix alt attributes for images
  --lang-only              Only fix HTML lang attributes
  --role-only              Only fix role attributes
  -h, --help               Show this help message

Examples:
  node cli.js                          # Fix current directory (standard fixes)
  node cli.js --comprehensive          # Run all fixes including cleanup
  node cli.js --alt-only               # Only fix alt attributes
  node cli.js --lang-only              # Only fix lang attributes
  node cli.js --role-only              # Only fix role attributes
  node cli.js --cleanup-only           # Only cleanup duplicate roles
  node cli.js ./src                    # Fix src directory
  node cli.js -l en --dry-run ./dist   # Preview fixes for dist directory in English
  node cli.js --no-backup ./public    # Fix without creating backups

Features:
  ✅ Alt attributes for images
  ✅ Lang attributes for HTML
  ✅ Role attributes for accessibility
  ✅ Context-aware text generation
  ✅ Automatic backups
`));
  process.exit(0);
}

// Main function
async function main() {
  console.log(chalk.blue('🚀 Starting Accessibility Fixer...'));
  console.log(chalk.gray(`Directory: ${path.resolve(options.directory)}`));
  console.log(chalk.gray(`Language: ${options.language}`));
  console.log(chalk.gray(`Backup: ${options.backupFiles ? 'Yes' : 'No'}`));
  console.log(chalk.gray(`Mode: ${options.dryRun ? 'Dry Run (Preview)' : 'Apply Changes'}`));
  console.log('');

  const fixer = new AccessibilityFixer({
    language: options.language,
    backupFiles: options.backupFiles,
    dryRun: options.dryRun
  });

  try {
    // Handle different modes
    if (options.comprehensive) {
      // Run comprehensive fix (all fixes including cleanup)
      console.log(chalk.blue('🎯 Running comprehensive accessibility fixes...'));
      const results = await fixer.fixAllAccessibilityIssues(options.directory);
      
      // Results already logged in the method
      return;
      
    } else if (options.cleanupOnly) {
      // Only cleanup duplicate roles
      console.log(chalk.blue('🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      if (options.dryRun) {
        console.log(chalk.cyan('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
      } else {
        console.log(chalk.green('\n🎉 Cleanup completed successfully!'));
      }
      return;
      
    } else if (options.altOnly) {
      // Only fix alt attributes
      console.log(chalk.blue('🖼️ Running alt attribute fixes only...'));
      const altResults = await fixer.fixEmptyAltAttributes(options.directory);
      const altFixed = altResults.filter(r => r.status === 'fixed').length;
      const totalAltIssues = altResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed alt attributes in ${altFixed} files (${totalAltIssues} issues)`));
      
      if (options.dryRun) {
        console.log(chalk.cyan('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
      } else {
        console.log(chalk.green('\n🎉 Alt attribute fixes completed successfully!'));
      }
      return;
      
    } else if (options.langOnly) {
      // Only fix lang attributes
      console.log(chalk.blue('📝 Running HTML lang attribute fixes only...'));
      const langResults = await fixer.fixHtmlLang(options.directory);
      const langFixed = langResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Fixed lang attributes in ${langFixed} files`));
      
      if (options.dryRun) {
        console.log(chalk.cyan('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
      } else {
        console.log(chalk.green('\n🎉 Lang attribute fixes completed successfully!'));
      }
      return;
      
    } else if (options.roleOnly) {
      // Only fix role attributes
      console.log(chalk.blue('🎭 Running role attribute fixes only...'));
      const roleResults = await fixer.fixRoleAttributes(options.directory);
      const roleFixed = roleResults.filter(r => r.status === 'fixed').length;
      const totalRoleIssues = roleResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed role attributes in ${roleFixed} files (${totalRoleIssues} issues)`));
      
      if (options.dryRun) {
        console.log(chalk.cyan('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
      } else {
        console.log(chalk.green('\n🎉 Role attribute fixes completed successfully!'));
      }
      return;
    }

    // Standard mode - run individual fixes
    // Fix HTML lang attributes
    console.log(chalk.yellow('📝 Step 1: Fixing HTML lang attributes...'));
    const langResults = await fixer.fixHtmlLang(options.directory);
    const langFixed = langResults.filter(r => r.status === 'fixed').length;
    console.log(chalk.green(`✅ Fixed lang attributes in ${langFixed} files`));
    console.log('');

    // Fix alt attributes
    console.log(chalk.yellow('🖼️  Step 2: Fixing alt attributes...'));
    const altResults = await fixer.fixEmptyAltAttributes(options.directory);
    const altFixed = altResults.filter(r => r.status === 'fixed').length;
    const totalAltIssues = altResults.reduce((sum, r) => sum + (r.issues || 0), 0);
    console.log(chalk.green(`✅ Fixed alt attributes in ${altFixed} files (${totalAltIssues} issues)`));
    console.log('');

    // Fix role attributes
    console.log(chalk.yellow('🎭 Step 3: Fixing role attributes...'));
    const roleResults = await fixer.fixRoleAttributes(options.directory);
    const roleFixed = roleResults.filter(r => r.status === 'fixed').length;
    const totalRoleIssues = roleResults.reduce((sum, r) => sum + (r.issues || 0), 0);
    console.log(chalk.green(`✅ Fixed role attributes in ${roleFixed} files (${totalRoleIssues} issues)`));
    console.log('');

    // Summary
    const totalFiles = new Set([
      ...langResults.map(r => r.file),
      ...altResults.map(r => r.file),
      ...roleResults.map(r => r.file)
    ]).size;

    const totalFixed = new Set([
      ...langResults.filter(r => r.status === 'fixed').map(r => r.file),
      ...altResults.filter(r => r.status === 'fixed').map(r => r.file),
      ...roleResults.filter(r => r.status === 'fixed').map(r => r.file)
    ]).size;

    const totalIssues = totalAltIssues + totalRoleIssues + langFixed;

    console.log(chalk.blue('📊 Summary:'));
    console.log(chalk.white(`   Total files scanned: ${totalFiles}`));
    console.log(chalk.green(`   Files fixed: ${totalFixed}`));
    console.log(chalk.yellow(`   Total issues resolved: ${totalIssues}`));
    
    if (options.dryRun) {
      console.log(chalk.cyan('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
    } else {
      console.log(chalk.green('\n🎉 All accessibility fixes completed successfully!'));
      if (options.backupFiles) {
        console.log(chalk.gray('   Backup files created with .backup extension'));
      }
    }
    
    // Suggest cleanup if not comprehensive mode
    console.log(chalk.blue('\n💡 Pro tip: Use --comprehensive to include duplicate role cleanup!'));

  } catch (error) {
    console.error(chalk.red('❌ Error occurred:'), error.message);
    process.exit(1);
  }
}

// Run the CLI
main();