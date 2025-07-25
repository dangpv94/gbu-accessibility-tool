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
  backupFiles: true, // Default to true for safety
  dryRun: false,
  help: false,
  cleanupOnly: false,
  comprehensive: false, // Keep for backward compatibility
  altOnly: false,
  langOnly: false,
  roleOnly: false,
  formsOnly: false,
  buttonsOnly: false,
  linksOnly: false,
  landmarksOnly: false,
  headingsOnly: false
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
    case '--backup':
      options.backupFiles = true;
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
      options.comprehensive = true; // Keep for backward compatibility
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
    case '--forms-only':
      options.formsOnly = true;
      break;
    case '--buttons-only':
      options.buttonsOnly = true;
      break;
    case '--links-only':
      options.linksOnly = true;
      break;
    case '--landmarks-only':
      options.landmarksOnly = true;
      break;
    case '--headings-only':
      options.headingsOnly = true;
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
  --backup                 Create backup files (default: enabled)
  --no-backup              Don't create backup files
  --dry-run                Preview changes without applying
  --comprehensive, --all   Run comprehensive fixes (same as default)
  --cleanup-only           Only cleanup duplicate role attributes
  --alt-only               Fix alt attributes + cleanup
  --lang-only              Fix HTML lang attributes + cleanup
  --role-only              Fix role attributes + cleanup
  --forms-only             Fix form labels + cleanup
  --buttons-only           Fix button names + cleanup
  --links-only             Fix link names + cleanup
  --landmarks-only         Fix landmarks + cleanup
  --headings-only          Analyze heading structure (no auto-fix)
  -h, --help               Show this help message

Examples:
  node cli.js                          # Comprehensive fixes (default mode)
  node cli.js --comprehensive          # Comprehensive fixes (same as default)
  node cli.js --alt-only               # Fix alt attributes + cleanup
  node cli.js --forms-only             # Fix form labels + cleanup
  node cli.js --buttons-only           # Fix button names + cleanup
  node cli.js --links-only             # Fix link names + cleanup
  node cli.js --landmarks-only         # Fix landmarks + cleanup
  node cli.js --headings-only          # Analyze heading structure only
  node cli.js --cleanup-only           # Only cleanup duplicate roles
  node cli.js ./src                    # Fix src directory (comprehensive)
  node cli.js -l en --dry-run ./dist   # Preview comprehensive fixes in English
  node cli.js --no-backup ./public    # Comprehensive fixes without backups

Features:
  ✅ Alt attributes for images
  ✅ Lang attributes for HTML
  ✅ Role attributes for accessibility
  ✅ Context-aware text generation
  ✅ Automatic backups
`));
  process.exit(0);
}


// Helper function to show completion message with backup info
function showCompletionMessage(options, mode = 'fixes') {
  if (options.dryRun) {
    console.log(chalk.cyan('\n💡 This was a dry run. Use without --dry-run to apply changes.'));
  } else {
    console.log(chalk.green(`\n🎉 ${mode} completed successfully!`));
    if (options.backupFiles) {
      console.log(chalk.gray('   📁 Backup files created with .backup extension'));
      console.log(chalk.gray('   💡 Use --no-backup to disable backups in future runs'));
    } else {
      console.log(chalk.yellow('   ⚠️  No backup files created (--no-backup was used)'));
      console.log(chalk.gray('   💡 Use --backup to enable backups for safety'));
    }
  }
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
    // Handle different modes - All modes now include cleanup
    if (options.cleanupOnly || options.altOnly || options.langOnly || options.roleOnly || 
        options.formsOnly || options.buttonsOnly || options.linksOnly || options.landmarksOnly || options.headingsOnly) {
      // Individual modes - handle each separately, then run cleanup
    } else {
      // Default mode: Run comprehensive fix (all fixes including cleanup)
      console.log(chalk.blue('🎯 Running comprehensive accessibility fixes...'));
      const results = await fixer.fixAllAccessibilityIssues(options.directory);
      
      // Results already logged in the method
      return;
    }
    
    // Individual modes
    if (options.cleanupOnly) {
      // Only cleanup duplicate roles
      console.log(chalk.blue('🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Cleanup');
      return;
      
    } else if (options.cleanupOnly) {
      // Only cleanup duplicate roles
      console.log(chalk.blue('🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Cleanup');
      return;
      
    } else if (options.altOnly) {
      // Fix alt attributes + cleanup
      console.log(chalk.blue('🖼️ Running alt attribute fixes + cleanup...'));
      const altResults = await fixer.fixEmptyAltAttributes(options.directory);
      const altFixed = altResults.filter(r => r.status === 'fixed').length;
      const totalAltIssues = altResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed alt attributes in ${altFixed} files (${totalAltIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Alt attribute fixes + cleanup');
      return;
      
    } else if (options.langOnly) {
      // Fix lang attributes + cleanup
      console.log(chalk.blue('📝 Running HTML lang attribute fixes + cleanup...'));
      const langResults = await fixer.fixHtmlLang(options.directory);
      const langFixed = langResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Fixed lang attributes in ${langFixed} files`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Lang attribute fixes + cleanup');
      return;
      
    } else if (options.roleOnly) {
      // Fix role attributes + cleanup
      console.log(chalk.blue('🎭 Running role attribute fixes + cleanup...'));
      const roleResults = await fixer.fixRoleAttributes(options.directory);
      const roleFixed = roleResults.filter(r => r.status === 'fixed').length;
      const totalRoleIssues = roleResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed role attributes in ${roleFixed} files (${totalRoleIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Role attribute fixes + cleanup');
      return;
      
    } else if (options.formsOnly) {
      // Fix form labels + cleanup
      console.log(chalk.blue('📋 Running form label fixes + cleanup...'));
      const formResults = await fixer.fixFormLabels(options.directory);
      const formFixed = formResults.filter(r => r.status === 'fixed').length;
      const totalFormIssues = formResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed form labels in ${formFixed} files (${totalFormIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Form label fixes + cleanup');
      return;
      
    } else if (options.buttonsOnly) {
      // Fix button names + cleanup
      console.log(chalk.blue('🔘 Running button name fixes + cleanup...'));
      const buttonResults = await fixer.fixButtonNames(options.directory);
      const buttonFixed = buttonResults.filter(r => r.status === 'fixed').length;
      const totalButtonIssues = buttonResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed button names in ${buttonFixed} files (${totalButtonIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Button name fixes + cleanup');
      return;
      
    } else if (options.linksOnly) {
      // Fix link names + cleanup
      console.log(chalk.blue('🔗 Running link name fixes + cleanup...'));
      const linkResults = await fixer.fixLinkNames(options.directory);
      const linkFixed = linkResults.filter(r => r.status === 'fixed').length;
      const totalLinkIssues = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed link names in ${linkFixed} files (${totalLinkIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Link name fixes + cleanup');
      return;
      
    } else if (options.landmarksOnly) {
      // Fix landmarks + cleanup
      console.log(chalk.blue('🏛️ Running landmark fixes + cleanup...'));
      const landmarkResults = await fixer.fixLandmarks(options.directory);
      const landmarkFixed = landmarkResults.filter(r => r.status === 'fixed').length;
      const totalLandmarkIssues = landmarkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed landmarks in ${landmarkFixed} files (${totalLandmarkIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Landmark fixes + cleanup');
      return;
      
    } else if (options.headingsOnly) {
      // Analyze headings only (no fixes, no cleanup)
      console.log(chalk.blue('📑 Running heading analysis only...'));
      const headingResults = await fixer.analyzeHeadings(options.directory);
      const totalSuggestions = headingResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Analyzed headings in ${headingResults.length} files (${totalSuggestions} suggestions)`));
      console.log(chalk.gray('💡 Heading issues require manual review and cannot be auto-fixed'));
      
      showCompletionMessage(options, 'Heading analysis');
      return;
    }

  } catch (error) {
    console.error(chalk.red('❌ Error occurred:'), error.message);
    process.exit(1);
  }
}

// Run the CLI
main();