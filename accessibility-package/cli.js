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
  version: false,
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
  unusedFilesListOnly: false,
  deleteUnusedFilesFromList: false,
  deadCodeOnly: false,
  fileSizeOnly: false,
  listFile: 'unused-files-list.txt',
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
    case '--version':
    case '-v':
      options.version = true;
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
    case '--aria-label-only':
      options.ariaLabelOnly = true;
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
    case '--gtm-check':
    case '--check-gtm':
    case '--google-tag-manager':
      options.gtmCheckOnly = true;
      break;
    case '--check-meta':
    case '--meta-check':
      options.checkMetaOnly = true;
      break;
    case '--fix-meta':
    case '--meta-fix':
      options.fixMetaOnly = true;
      break;
    case '--full-report':
    case '--report':
    case '--excel-report':
      options.fullReport = true;
      break;
    case '-o':
    case '--output':
      options.reportOutput = args[++i];
      break;
    case '--unused-files':
      options.unusedFilesOnly = true;
      break;
    case '--unused-files-list':
      options.unusedFilesListOnly = true;
      break;
    case '--delete-unused-files':
      options.deleteUnusedFilesFromList = true;
      break;
    case '--list-file':
      options.listFile = args[++i];
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
if (options.version) {
  const packageJson = require('./package.json');
  console.log(chalk.blue(`🔧 GBU Accessibility Package v${packageJson.version}`));
  process.exit(0);
}

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
  --aria-label-only        Fix aria-label attributes + cleanup
  --forms-only             Fix form labels + cleanup
  --buttons-only           Fix button names + cleanup
  --links-only             Fix link names + cleanup
  --landmarks-only         Fix landmarks + cleanup
  --headings-only          Analyze heading structure (no auto-fix)
  --links-check            Check for broken links and 404 resources (no auto-fix)
  --broken-links           Check for broken external links only (no auto-fix)
  --404-resources          Check for missing local resources only (no auto-fix)
  --gtm-check              Check Google Tag Manager installation (no auto-fix)
  --check-meta             Check meta tags and Open Graph Protocol (no auto-fix)
  --fix-meta               Auto-fix missing meta tags and OGP tags
  --full-report            Generate comprehensive Excel report (all checks)
  -o, --output <file>      Output path for Excel report (use with --full-report)
  --unused-files           Check for unused files in project (no auto-fix)
  --unused-files-list      Create unused-files-list.txt from detected unused files
  --delete-unused-files    Delete all files listed in unused-files-list.txt
  --list-file <file>       Custom list file name/path inside target directory
  --dead-code              Check for dead code in CSS and JavaScript (no auto-fix)
  --file-size, --size-check Check file sizes and suggest optimizations (no auto-fix)
  --enhanced-alt           Use enhanced alt attribute analysis and generation
  --alt-creativity <mode>  Alt text creativity: conservative, balanced, creative (default: balanced)
  --include-emotions       Include emotional descriptors in alt text
  --strict-alt             Enable strict alt attribute quality checking
  -h, --help               Show this help message
  -v, --version            Show version number

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
  node cli.js --gtm-check              # Check Google Tag Manager installation
  node cli.js --check-meta             # Check meta tags and Open Graph Protocol
  node cli.js --fix-meta               # Auto-fix missing meta tags and OGP
  node cli.js --fix-meta --dry-run     # Preview meta tag fixes
  node cli.js --full-report            # Generate comprehensive Excel report
  node cli.js --full-report ./project -o report.xlsx  # Custom output path
  node cli.js --unused-files           # Check for unused files in project
  node cli.js --unused-files-list      # Create ./unused-files-list.txt
  node cli.js --delete-unused-files    # Delete files listed in ./unused-files-list.txt
  node cli.js --delete-unused-files --dry-run  # Preview files that would be deleted
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
function showCompletionMessage(options, mode = 'sửa lỗi') {
  if (options.dryRun) {
    console.log(chalk.cyan('\n💡 Đây là chế độ xem trước. Sử dụng không có --dry-run để áp dụng thay đổi.'));
  } else {
    console.log(chalk.green(`\n🎉 ${mode} hoàn tất thành công!`));
    if (options.backupFiles) {
      console.log(chalk.gray('   📁 Đã tạo file backup với đuôi .backup'));
      console.log(chalk.gray('   💡 Sử dụng --no-backup để tắt backup trong các lần chạy sau'));
    } else {
      console.log(chalk.blue('   ⚡ Không tạo file backup (mặc định để xử lý nhanh hơn)'));
      console.log(chalk.gray('   💡 Sử dụng --backup để bật tính năng backup để an toàn'));
    }
  }
}

// Main function
async function main() {
  console.log(chalk.blue('🚀 Đang khởi động Accessibility Fixer...'));
  console.log(chalk.gray(`Thư mục: ${path.resolve(options.directory)}`));
  console.log(chalk.gray(`Ngôn ngữ: ${options.language}`));
  console.log(chalk.gray(`Backup: ${options.backupFiles ? 'Có' : 'Không'}`));
  console.log(chalk.gray(`Chế độ: ${options.dryRun ? 'Xem trước (Preview)' : 'Áp dụng thay đổi'}`));
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
    // Handle Full Report mode first
    if (options.fullReport) {
      console.log(chalk.blue('📊 Đang tạo báo cáo toàn diện...'));
      await fixer.generateFullReport(options.directory, options.reportOutput);
      return;
    }
    
    // Handle different modes - All modes now include cleanup
    if (options.cleanupOnly || options.altOnly || options.langOnly || options.roleOnly || options.ariaLabelOnly ||
        options.formsOnly || options.nestedOnly || options.buttonsOnly || options.linksOnly || options.landmarksOnly || 
        options.headingsOnly || options.dlOnly || options.linksCheckOnly || options.brokenLinksOnly || options.missingResourcesOnly || options.gtmCheckOnly || options.checkMetaOnly || options.fixMetaOnly || options.unusedFilesOnly || options.unusedFilesListOnly || options.deleteUnusedFilesFromList || options.deadCodeOnly || options.fileSizeOnly) {
      // Individual modes - handle each separately, then run cleanup
    } else {
      // Default mode: Run comprehensive fix (all fixes including cleanup)
      console.log(chalk.blue('🎯 Đang chạy sửa lỗi accessibility toàn diện...'));
      const results = await fixer.fixAllAccessibilityIssues(options.directory);
      
      // Results already logged in the method
      return;
    }
    
    // Individual modes
    if (options.cleanupOnly) {
      // Only cleanup duplicate roles
      console.log(chalk.blue('🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Dọn dẹp');
      return;
      
    } else if (options.cleanupOnly) {
      // Only cleanup duplicate roles
      console.log(chalk.blue('🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Dọn dẹp');
      return;
      
    } else if (options.altOnly) {
      // Fix alt attributes + cleanup
      console.log(chalk.blue('🖼️ Đang sửa thuộc tính alt + dọn dẹp...'));
      const altResults = await fixer.fixEmptyAltAttributes(options.directory);
      const altFixed = altResults.filter(r => r.status === 'fixed').length;
      const totalAltIssues = altResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa thuộc tính alt trong ${altFixed} file (${totalAltIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa thuộc tính alt + dọn dẹp');
      return;
      
    } else if (options.langOnly) {
      // Fix lang attributes + cleanup
      console.log(chalk.blue('📝 Đang sửa thuộc tính HTML lang + dọn dẹp...'));
      const langResults = await fixer.fixHtmlLang(options.directory);
      const langFixed = langResults.filter(r => r.status === 'fixed').length;
      
      console.log(chalk.green(`\n✅ Đã sửa thuộc tính lang trong ${langFixed} file`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa thuộc tính lang + dọn dẹp');
      return;
      
    } else if (options.roleOnly) {
      // Fix role attributes + cleanup
      console.log(chalk.blue('🎭 Đang sửa thuộc tính role + dọn dẹp...'));
      const roleResults = await fixer.fixRoleAttributes(options.directory);
      const roleFixed = roleResults.filter(r => r.status === 'fixed').length;
      const totalRoleIssues = roleResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa thuộc tính role trong ${roleFixed} file (${totalRoleIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa thuộc tính role + dọn dẹp');
      return;
      
    } else if (options.ariaLabelOnly) {
      // Fix aria-label attributes + cleanup
      console.log(chalk.blue('🏷️ Đang sửa thuộc tính aria-label + dọn dẹp...'));
      const ariaResults = await fixer.fixAriaLabels(options.directory);
      const ariaFixed = ariaResults.filter(r => r.status === 'processed' && r.changes > 0).length;
      const totalAriaIssues = ariaResults.reduce((sum, r) => sum + (r.changes || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa thuộc tính aria-label trong ${ariaFixed} file (${totalAriaIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa thuộc tính aria-label + dọn dẹp');
      return;
      
    } else if (options.formsOnly) {
      // Fix form labels + cleanup
      console.log(chalk.blue('📋 Đang sửa nhãn form + dọn dẹp...'));
      const formResults = await fixer.fixFormLabels(options.directory);
      const formFixed = formResults.filter(r => r.status === 'fixed').length;
      const totalFormIssues = formResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa nhãn form trong ${formFixed} file (${totalFormIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa nhãn form + dọn dẹp');
      return;
      
    } else if (options.nestedOnly) {
      // Fix nested interactive controls + cleanup
      console.log(chalk.blue('🎯 Đang sửa các control tương tác lồng nhau + dọn dẹp...'));
      const nestedResults = await fixer.fixNestedInteractiveControls(options.directory);
      const nestedFixed = nestedResults.filter(r => r.status === 'fixed').length;
      const totalNestedIssues = nestedResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa các control tương tác lồng nhau trong ${nestedFixed} file (${totalNestedIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa các control tương tác lồng nhau + dọn dẹp');
      return;
      
    } else if (options.buttonsOnly) {
      // Fix button names + cleanup
      console.log(chalk.blue('🔘 Đang sửa tên button + dọn dẹp...'));
      const buttonResults = await fixer.fixButtonNames(options.directory);
      const buttonFixed = buttonResults.filter(r => r.status === 'fixed').length;
      const totalButtonIssues = buttonResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa tên button trong ${buttonFixed} file (${totalButtonIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa tên button + dọn dẹp');
      return;
      
    } else if (options.linksOnly) {
      // Fix link names + cleanup
      console.log(chalk.blue('🔗 Đang sửa tên link + dọn dẹp...'));
      const linkResults = await fixer.fixLinkNames(options.directory);
      const linkFixed = linkResults.filter(r => r.status === 'fixed').length;
      const totalLinkIssues = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa tên link trong ${linkFixed} file (${totalLinkIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa tên link + dọn dẹp');
      return;
      
    } else if (options.landmarksOnly) {
      // Fix landmarks + cleanup
      console.log(chalk.blue('🏛️ Đang sửa landmark + dọn dẹp...'));
      const landmarkResults = await fixer.fixLandmarks(options.directory);
      const landmarkFixed = landmarkResults.filter(r => r.status === 'fixed').length;
      const totalLandmarkIssues = landmarkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa landmark trong ${landmarkFixed} file (${totalLandmarkIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa landmark + dọn dẹp');
      return;
      
    } else if (options.headingsOnly) {
      // Fix heading structure + cleanup
      console.log(chalk.blue('📑 Đang sửa cấu trúc heading + dọn dẹp...'));
      const headingResults = await fixer.fixHeadingStructure(options.directory);
      const headingFixed = headingResults.filter(r => r.status === 'fixed').length;
      const totalHeadingIssues = headingResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      const totalHeadingFixes = headingResults.reduce((sum, r) => sum + (r.fixes || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã xử lý heading trong ${headingResults.length} file (${totalHeadingIssues} vấn đề tìm thấy)`));
      if (options.autoFixHeadings) {
        console.log(chalk.green(`✅ Đã sửa ${totalHeadingFixes} vấn đề heading tự động`));
      } else {
        console.log(chalk.gray('💡 Sử dụng --auto-fix-headings để bật tính năng tự động sửa heading'));
      }
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa cấu trúc heading + dọn dẹp');
      return;
      
    } else if (options.dlOnly) {
      // Fix description lists + cleanup
      console.log(chalk.blue('📋 Đang sửa danh sách mô tả + dọn dẹp...'));
      const dlResults = await fixer.fixDescriptionLists(options.directory);
      const dlFixed = dlResults.filter(r => r.status === 'fixed').length;
      const totalDlIssues = dlResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã sửa danh sách mô tả trong ${dlFixed} file (${totalDlIssues} vấn đề)`));
      
      // Run cleanup
      console.log(chalk.blue('\n🧹 Đang dọn dẹp các thuộc tính role trùng lặp...'));
      const cleanupResults = await fixer.cleanupDuplicateRoles(options.directory);
      const cleanupFixed = cleanupResults.filter(r => r.status === 'fixed').length;
      console.log(chalk.green(`✅ Đã dọn dẹp role trùng lặp trong ${cleanupFixed} file`));
      
      showCompletionMessage(options, 'Sửa danh sách mô tả + dọn dẹp');
      return;
      
    } else if (options.linksCheckOnly) {
      // Check broken links and 404 resources (backward compatibility)
      console.log(chalk.blue('🔗 Đang kiểm tra link và tài nguyên toàn diện...'));
      const linkResults = await fixer.checkBrokenLinks(options.directory);
      const resourceResults = await fixer.check404Resources(options.directory);
      const totalLinkIssues = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      const totalResourceIssues = resourceResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã kiểm tra link trong ${linkResults.length} file (${totalLinkIssues} vấn đề link)`));
      console.log(chalk.green(`✅ Đã kiểm tra tài nguyên trong ${resourceResults.length} file (${totalResourceIssues} vấn đề tài nguyên)`));
      console.log(chalk.gray('💡 Vấn đề về link và tài nguyên cần xem xét thủ công và không thể tự động sửa'));
      
      showCompletionMessage(options, 'Kiểm tra link và tài nguyên');
      return;
      
    } else if (options.brokenLinksOnly) {
      // Check broken external links only 
      console.log(chalk.blue('🔗 Đang kiểm tra link bên ngoài bị lỗi...'));
      const linkResults = await fixer.checkBrokenLinks(options.directory);
      const totalBrokenLinks = linkResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã kiểm tra link bên ngoài trong ${linkResults.length} file (${totalBrokenLinks} vấn đề)`));
      console.log(chalk.gray('💡 Vấn đề link bị lỗi cần xem xét thủ công và không thể tự động sửa'));
      
      showCompletionMessage(options, 'Kiểm tra link bị lỗi');
      return;
      
    } else if (options.missingResourcesOnly) {
      // Check 404 resources only (missing local files)
      console.log(chalk.blue('📁 Đang kiểm tra tài nguyên thiếu...'));
      const resourceResults = await fixer.check404Resources(options.directory);
      const totalMissingResources = resourceResults.reduce((sum, r) => sum + (r.issues || 0), 0);
      
      console.log(chalk.green(`\n✅ Đã kiểm tra tài nguyên cục bộ trong ${resourceResults.length} file (${totalMissingResources} vấn đề)`));
      console.log(chalk.gray('💡 Vấn đề tài nguyên thiếu cần xem xét thủ công và không thể tự động sửa'));
      
      showCompletionMessage(options, 'Kiểm tra tài nguyên thiếu');
      return;
      
    } else if (options.gtmCheckOnly) {
      // Check Google Tag Manager installation only (no fixes)
      console.log(chalk.blue('🏷️ Đang kiểm tra Google Tag Manager...'));
      const gtmResults = await fixer.checkGoogleTagManager(options.directory);
      const filesWithGTM = gtmResults.filter(r => r.gtmAnalysis?.hasGTM).length;
      const filesWithIssues = gtmResults.filter(r => r.gtmAnalysis?.issues?.length > 0).length;
      
      console.log(chalk.green(`\n✅ Phân tích hoàn tất: Tìm thấy ${filesWithGTM} file có GTM`));
      if (filesWithIssues > 0) {
        console.log(chalk.yellow(`⚠️ ${filesWithIssues} file có vấn đề về cài đặt GTM`));
      }
      console.log(chalk.gray('💡 GTM cần có cả <script> trong <head> và <noscript> sau <body>'));
      
      showCompletionMessage(options, 'Kiểm tra GTM');
      return;
      
    } else if (options.checkMetaOnly) {
      // Check meta tags only (no fixes)
      console.log(chalk.blue('🏷️ Đang kiểm tra meta tags và Open Graph Protocol...'));
      await fixer.checkMetaTags(options.directory);
      
      showCompletionMessage(options, 'Kiểm tra meta tags');
      return;
      
    } else if (options.fixMetaOnly) {
      // Fix meta tags
      console.log(chalk.blue('🔧 Đang tự động sửa meta tags...')); 
      await fixer.fixMetaTags(options.directory, { dryRun: options.dryRun, backup: options.backupFiles });
      
      showCompletionMessage(options, 'Sửa meta tags');
      return;
      
    } else if (options.unusedFilesOnly) {
      // Check unused files only (no fixes, no cleanup)
      console.log(chalk.blue('🗂️ Đang kiểm tra file không sử dụng...'));
      const unusedResults = await fixer.checkUnusedFiles(options.directory);
      const totalUnusedFiles = unusedResults.unusedCount;
      
      if (totalUnusedFiles === 0) {
        console.log(chalk.green(`\n✅ Không tìm thấy file không sử dụng! Tất cả ${unusedResults.totalFiles} file đều được tham chiếu đúng cách.`));
      } else {
        console.log(chalk.green(`\n✅ Phân tích hoàn tất: Tìm thấy ${totalUnusedFiles} file không sử dụng trong tổng số ${unusedResults.totalFiles} file`));
        console.log(chalk.gray(`📊 ${unusedResults.referencedFiles} file được tham chiếu, ${totalUnusedFiles} file có thể không sử dụng`));
      }
      console.log(chalk.gray('💡 Phát hiện file không sử dụng dựa trên heuristic - khuyến nghị xem xét thủ công'));
      
      showCompletionMessage(options, 'Kiểm tra file không sử dụng');
      return;

    } else if (options.unusedFilesListOnly) {
      console.log(chalk.blue('📝 Đang tạo danh sách file không sử dụng...'));
      const listResults = await fixer.generateUnusedFilesList(options.directory, options.listFile);

      console.log(chalk.green(`\n✅ Đã tạo file list: ${listResults.outputPath}`));
      console.log(chalk.gray(`📊 ${listResults.unusedCount} path đã được ghi vào list`));
      console.log(chalk.gray('💡 Danh sách dùng path tương đối so với thư mục target và có thể dùng lại với --delete-unused-files'));
      return;

    } else if (options.deleteUnusedFilesFromList) {
      console.log(chalk.blue('🗑️ Đang xóa file theo danh sách unused files...'));
      const deleteResults = await fixer.deleteUnusedFilesFromList(options.directory, options.listFile, {
        dryRun: options.dryRun
      });

      console.log(chalk.green(`\n✅ ${options.dryRun ? 'Đã mô phỏng xóa' : 'Đã xử lý xóa'} ${deleteResults.deletedCount} file từ list`));
      console.log(chalk.gray(`📄 File list: ${deleteResults.listPath}`));

      if (deleteResults.missingCount > 0) {
        console.log(chalk.yellow(`⚠️ ${deleteResults.missingCount} file trong list không còn tồn tại`));
      }

      if (deleteResults.skippedCount > 0) {
        console.log(chalk.yellow(`⚠️ ${deleteResults.skippedCount} entry bị bỏ qua vì không an toàn hoặc không hợp lệ`));
      }

      if (options.dryRun) {
        console.log(chalk.cyan('\n💡 Đây là chế độ xem trước. Chạy lại không kèm --dry-run để xóa thật.'));
      } else {
        console.log(chalk.gray('💡 File list được giữ nguyên để bạn có thể đối chiếu sau khi xóa'));
      }
      return;
      
    } else if (options.deadCodeOnly) {
      // Check dead code only (no fixes, no cleanup)
      console.log(chalk.blue('☠️ Đang kiểm tra mã không sử dụng...'));
      const deadCodeResults = await fixer.checkDeadCode(options.directory);
      const totalDeadCode = deadCodeResults.length;
      
      console.log(chalk.green(`\n✅ Đã kiểm tra mã không sử dụng (${totalDeadCode} vấn đề tiềm ẩn)`));
      console.log(chalk.gray('💡 Phân tích mã không sử dụng dựa trên heuristic - khuyến nghị xem xét thủ công'));
      
      showCompletionMessage(options, 'Kiểm tra mã không sử dụng');
      return;
      
    } else if (options.fileSizeOnly) {
      // Check file sizes only (no fixes, no cleanup)
      console.log(chalk.blue('📏 Đang phân tích kích thước file...'));
      const sizeResults = await fixer.checkFileSizes(options.directory);
      const totalLargeFiles = sizeResults.largeFiles.length;
      
      console.log(chalk.green(`\n✅ Đã phân tích ${sizeResults.totalFiles} file (${totalLargeFiles} file có kích thước lớn)`));
      console.log(chalk.gray('💡 Phân tích kích thước file dựa trên best practices phổ biến'));
      
      showCompletionMessage(options, 'Phân tích kích thước file');
      return;
    }

  } catch (error) {
    console.error(chalk.red('❌ Đã xảy ra lỗi:'), error.message);
    process.exit(1);
  }
}

// Run the CLI
main();
