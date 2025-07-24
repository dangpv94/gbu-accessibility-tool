#!/usr/bin/env node

/**
 * CLI tool for accessibility fixes
 */

const { program } = require('commander');
const { AccessibilityFixer } = require('../index');
const chalk = require('chalk');

program
  .name('a11y-fix')
  .description('Accessibility fixing CLI tool')
  .version('1.0.0');

program
  .command('lang')
  .description('Fix HTML lang attributes')
  .option('-d, --directory <dir>', 'Directory to scan', '.')
  .option('-l, --language <lang>', 'Language code', 'ja')
  .option('--no-backup', 'Skip creating backup files')
  .option('--dry-run', 'Show what would be changed without making changes')
  .action(async (options) => {
    try {
      const fixer = new AccessibilityFixer({
        language: options.language,
        backupFiles: options.backup,
        dryRun: options.dryRun
      });

      const results = await fixer.fixHtmlLang(options.directory);
      
      const fixed = results.filter(r => r.status === 'fixed').length;
      const errors = results.filter(r => r.status === 'error').length;
      
      console.log(chalk.green(`\n✅ Lang attribute fixes completed!`));
      console.log(`   Files fixed: ${fixed}`);
      console.log(`   Errors: ${errors}`);
      
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('alt')
  .description('Fix empty alt attributes')
  .option('-d, --directory <dir>', 'Directory to scan', '.')
  .option('--no-backup', 'Skip creating backup files')
  .option('--dry-run', 'Show what would be changed without making changes')
  .action(async (options) => {
    try {
      const fixer = new AccessibilityFixer({
        backupFiles: options.backup,
        dryRun: options.dryRun
      });

      const results = await fixer.fixEmptyAltAttributes(options.directory);
      
      const fixed = results.filter(r => r.status === 'fixed').length;
      const errors = results.filter(r => r.status === 'error').length;
      
      console.log(chalk.green(`\n✅ Alt attribute fixes completed!`));
      console.log(`   Files fixed: ${fixed}`);
      console.log(`   Errors: ${errors}`);
      
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('role')
  .description('Fix role attributes')
  .option('-d, --directory <dir>', 'Directory to scan', '.')
  .option('--no-backup', 'Skip creating backup files')
  .option('--dry-run', 'Show what would be changed without making changes')
  .action(async (options) => {
    try {
      const fixer = new AccessibilityFixer({
        backupFiles: options.backup,
        dryRun: options.dryRun
      });

      const results = await fixer.fixRoleAttributes(options.directory);
      
      const fixed = results.filter(r => r.status === 'fixed').length;
      const errors = results.filter(r => r.status === 'error').length;
      
      console.log(chalk.green(`\n✅ Role attribute fixes completed!`));
      console.log(`   Files fixed: ${fixed}`);
      console.log(`   Errors: ${errors}`);
      
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('all')
  .description('Run all automated fixes')
  .option('-d, --directory <dir>', 'Directory to scan', '.')
  .option('-l, --language <lang>', 'Language code', 'ja')
  .option('--no-backup', 'Skip creating backup files')
  .option('--dry-run', 'Show what would be changed without making changes')
  .action(async (options) => {
    try {
      const fixer = new AccessibilityFixer({
        language: options.language,
        backupFiles: options.backup,
        dryRun: options.dryRun
      });

      console.log(chalk.blue('🔧 Running all accessibility fixes...\n'));
      
      await fixer.fixHtmlLang(options.directory);
      await fixer.fixEmptyAltAttributes(options.directory);
      await fixer.fixRoleAttributes(options.directory);
      
      const suggestions = await fixer.addMainLandmarks(options.directory);
      
      if (suggestions.length > 0) {
        console.log(chalk.yellow('\n📋 Manual fixes needed:'));
        suggestions.forEach(suggestion => {
          console.log(`   ${suggestion.file}: ${suggestion.recommendation}`);
        });
      }
      
      console.log(chalk.green('\n✅ All automated fixes completed!'));
      
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();