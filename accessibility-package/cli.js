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
  backupFiles: false, // Default to false for faster processing
  dryRun: false,
  help: false,
  cleanupOnly: false,
  comprehensive: false, // Keep for backward compatibility
  altOnly: false,
  langOnly: false,
  roleOnly: false,
  formsOnly: false,
  nestedOnly: false,
  buttonsOnly: false,
  linksOnly: false,
  landmarksOnly: false,
  headingsOnly: false,
  dlOnly: false,
  brokenLinksOnly: false,
  unusedFilesOnly: false,
  deadCodeOnly: false,
  fileSizeOnly: false,
  // Enhanced alt options
  enhancedAlt: false,
  altCreativity: 'balanced', // conservative, balanced, creative
  includeEmotions: false,
  strictAltChecking: false,
  // Advanced features options
  autoFixHeadings: false,
  fixDescriptionLists: true
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
    case '--nested-only':
      options.nestedOnly = true;
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
    case '--dl-only':
      options.dlOnly = true;
      break;
    case '--links-check':
      options.linksCheckOnly = true;
      break;
    case '--broken-links':
      options.brokenLinksOnly = true;
      break;
    case '--404-resources':
    case '--missing-resources':
      options.missingResourcesOnly = true;
      break;
    case '--unused-files':
      options.unusedFilesOnly = true;
      break;
    case '--dead-code':
      options.deadCodeOnly = true;
      break;
    case '--file-size':
    case '--size-check':
      options.fileSizeOnly = true;
      break;
    case '--auto-fix-headings':
      options.autoFixHeadings = true;
      break;
    case '--no-fix-dl':
      options.fixDescriptionLists = false;
      break;
    case '--enhanced-alt':
      options.enhancedAlt = true;
      break;
    case '--alt-creativity':
      options.altCreativity = args[++i];
      break;
    case '--include-emotions':
      options.includeEmotions = true;
      break;
    case '--strict-alt':
      options.strictAltChecking = true;
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
  --backup                 Create backup files
  --no-backup              Don't create backup files (default)
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
  --links-check            Check for broken links and 404 resources (no auto-fix)
  --broken-links           Check for broken external links only (no auto-fix)
  --404-resources          Check for missing local resources only (no auto-fix)
  --unused-files           Check for unused files in project (no auto-fix)
  --dead-code              Check for dead code in CSS and JavaScript (no auto-fix)
  --file-size, --size-check Check file sizes and suggest optimizations (no auto-fix)
  --enhanced-alt           Use enhanced alt attribute analysis and generation
  --alt-creativity <mode>  Alt text creativity: conservative, balanced, creative (default: balanced)
  --include-emotions       Include emotional descriptors in alt text
  --strict-alt             Enable strict alt attribute quality checking
  -h, --help               Show this help message

Enhanced Alt Features:
  --enhanced-alt           Comprehensive alt attribute analysis with:
                          • Image type classification (decorative, functional, complex, etc.)
                          • Content quality checking (length, redundancy, generic text)
                          • Context-aware alt text generation
                          • Multi-language vocabulary support
                          • Brand and emotional context integration
                          • Technical image description (charts, graphs)

Alt Creativity Modes:
  conservative            Simple, factual descriptions
  balanced               Context-aware with moderate creativity (default)
  creative               Rich descriptions with emotions and brand context

Examples:
  node cli.js                          # Comprehensive fixes (no backup by default)
  node cli.js --comprehensive          # Comprehensive fixes (same as default)
  node cli.js --alt-only               # Fix alt attributes + cleanup
  node cli.js --forms-only             # Fix form labels + cleanup
  node cli.js --buttons-only           # Fix button names + cleanup
  node cli.js --links-only             # Fix link names + cleanup
  node cli.js --landmarks-only         # Fix landmarks + cleanup
  node cli.js --headings-only          # Analyze heading structure only
  node cli.js --links-check            # Check for broken links and 404s
  node cli.js --broken-links           # Check for broken external links only
  node cli.js --404-resources          # Check for missing local resources only
  node cli.js --unused-files           # Check for unused files in project
  node cli.js --dead-code              # Check for dead CSS and JavaScript code
  node cli.js --file-size              # Check file sizes and suggest optimizations
  node cli.js --cleanup-only           # Only cleanup duplicate roles
  node cli.js ./src                    # Fix src directory (comprehensive)
  node cli.js -l en --dry-run ./dist   # Preview comprehensive fixes in English
  node cli.js --backup ./public       # Comprehensive fixes with backups
  node cli.js --enhanced-alt           # Use enhanced alt attribute analysis
  node cli.js --enhanced-alt --alt-creativity creative  # Creative alt text generation
  node cli.js --enhanced-alt --include-emotions         # Include emotional context
  node cli.js --strict-alt --enhanced-alt              # Strict quality checking

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
      console.log(chalk.blue('   ⚡ No backup files created (default behavior for faster processing)'));
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
    dryRun: options.dryRun,
    enhancedAltMode: options.enhancedAlt,
    altCreativity: options.altCreativity,
    includeEmotions: options.includeEmotions,
    strictAltChecking: options.strictAltChecking,
    autoFixHeadings: options.autoFixHeadings,
    fixDescriptionLists: options.fixDescriptionLists
  });

  try {
    // Handle different modes - All modes now include cleanup
    if (options.cleanupOnly || options.altOnly || options.langOnly || options.roleOnly || 
        options.formsOnly || options.nestedOnly || options.buttonsOnly || options.linksOnly || options.landmarksOnly || 
        options.headingsOnly || options.dlOnly || options.linksCheckOnly || options.brokenLinksOnly || options.missingResourcesOnly || options.unusedFilesOnly || options.deadCodeOnly || options.fileSizeOnly) {
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
      
    } else if (options.nestedOnly) {
      // Fix nested interactive controls + cleanup
      console.log(chalk.blue('🎯 Running nested interactive controls fixes + cleanup...'));
      const nestedResults = await fixer.fixNestedInteractiveControls(options.directory);
      const nestedFixed = nestedResults.filter(r => r.status === 'fixed').length;
      const totalNestedIssues = nestedResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed nested interactive controls in ${nestedFixed} files (${totalNestedIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Nested interactive controls fixes + cleanup');
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
      // Fix heading structure + cleanup
      console.log(chalk.blue('📑 Running heading structure fixes + cleanup...'));
      const headingResults = await fixer.fixHeadingStructure(options.directory);
      const headingFixed = headingResults.filter(r => r.status === 'fixed').length;
      const totalHeadingIssues = headingResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      const totalHeadingFixes = headingResults.reduce((sum, r) => sum + (r.fixes || 0), 0);
      
      console.log(chalk.green(`\n✅ Processed headings in ${headingResults.length} files (${totalHeadingIssues} issues found)`));
      if (options.autoFixHeadings) {
        console.log(chalk.green(`✅ Fixed ${totalHeadingFixes} heading issues automatically`));
      } else {
        console.log(chalk.gray('💡 Use --auto-fix-headings to enable automatic heading fixes'));
      }
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Heading structure fixes + cleanup');
      return;
      
    } else if (options.dlOnly) {
      // Fix description lists + cleanup
      console.log(chalk.blue('📋 Running description list fixes + cleanup...'));
      const dlResults = await fixer.fixDescriptionLists(options.directory);
      const dlFixed = dlResults.filter(r => r.status === 'fixed').length;
      const totalDlIssues = dlResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Fixed description lists in ${dlFixed} files (${totalDlIssues} issues)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Running cleanup for duplicate role attributes...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Cleaned duplicate roles in ${cleanupFixed} files`));
      
      showCompletionMessage(options, 'Description list fixes + cleanup');
      return;
      
    } else if (options.linksCheckOnly) {
      // Check broken links and 404 resources (backward compatibility)
      console.log(chalk.blue('🔗 Running comprehensive links and resources check...'));
      const linkResults = await fixer.checkBrokenLinks(options.directory);
      const resourceResults = await fixer.check404Resources(options.directory);
      const totalLinkIssues = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      const totalResourceIssues = resourceResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Checked links in ${linkResults.length} files (${totalLinkIssues} link issues found)`));
      console.log(chalk.green(`✅ Checked resources in ${resourceResults.length} files (${totalResourceIssues} resource issues found)`));
      console.log(chalk.gray('💡 Link and resource issues require manual review and cannot be auto-fixed'));
      
      showCompletionMessage(options, 'Links and resources check');
      return;
      
    } else if (options.brokenLinksOnly) {
      // Check broken external links only 
      console.log(chalk.blue('🔗 Running broken external links check only...'));
      const linkResults = await fixer.checkBrokenLinks(options.directory);
      const totalBrokenLinks = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Checked external links in ${linkResults.length} files (${totalBrokenLinks} issues found)`));
      console.log(chalk.gray('💡 Broken link issues require manual review and cannot be auto-fixed'));
      
      showCompletionMessage(options, 'Broken external links check');
      return;
      
    } else if (options.missingResourcesOnly) {
      // Check 404 resources only (missing local files)
      console.log(chalk.blue('📁 Running missing resources check only...'));
      const resourceResults = await fixer.check404Resources(options.directory);
      const totalMissingResources = resourceResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Checked local resources in ${resourceResults.length} files (${totalMissingResources} issues found)`));
      console.log(chalk.gray('💡 Missing resource issues require manual review and cannot be auto-fixed'));
      
      showCompletionMessage(options, 'Missing resources check');
      return;
      
    } else if (options.unusedFilesOnly) {
      // Check unused files only (no fixes, no cleanup)
      console.log(chalk.blue('🗂️ Running unused files check only...'));
      const unusedResults = await fixer.checkUnusedFiles(options.directory);
      const totalUnusedFiles = unusedResults.length;
      
      console.log(chalk.green(`\n✅ Checked project files (${totalUnusedFiles} unused files found)`));
      console.log(chalk.gray('💡 Unused file detection is heuristic - manual review recommended'));
      
      showCompletionMessage(options, 'Unused files check');
      return;
      
    } else if (options.deadCodeOnly) {
      // Check dead code only (no fixes, no cleanup)
      console.log(chalk.blue('☠️ Running dead code check only...'));
      const deadCodeResults = await fixer.checkDeadCode(options.directory);
      const totalDeadCode = deadCodeResults.length;
      
      console.log(chalk.green(`\n✅ Checked for dead code (${totalDeadCode} potential issues found)`));
      console.log(chalk.gray('💡 Dead code analysis is heuristic - manual review recommended'));
      
      showCompletionMessage(options, 'Dead code check');
      return;
      
    } else if (options.fileSizeOnly) {
      // Check file sizes only (no fixes, no cleanup)
      console.log(chalk.blue('📏 Running file size analysis only...'));
      const sizeResults = await fixer.checkFileSizes(options.directory);
      const totalLargeFiles = sizeResults.largeFiles.length;
      
      console.log(chalk.green(`\n✅ Analyzed ${sizeResults.totalFiles} files (${totalLargeFiles} large files found)`));
      console.log(chalk.gray('💡 File size analysis is based on common best practices'));
      
      showCompletionMessage(options, 'File size analysis');
      return;
    }

  } catch (error) {
    console.error(chalk.red('❌ Error occurred:'), error.message);
    process.exit(1);
  }
}

// Run the CLI
main();