/**
 * Accessibility Fixer - Modular Version
 * Orchestrates accessibility fixes using specialized modules
 */

const chalk = require('chalk');

// Import specialized modules
const EnhancedAltGenerator = require('./alt-generator');
const EnhancedAltChecker = require('./alt-checker');
const HtmlLangFixer = require('./html-lang-fixer');
const AltAttributesFixer = require('./alt-attributes-fixer');
const RoleAttributesFixer = require('./role-attributes-fixer');
const AriaFixer = require('./aria-fixer');
const FormFixer = require('./form-fixer');
const InteractiveControlsFixer = require('./interactive-controls-fixer');
const LandmarkFixer = require('./landmark-fixer');
const HeadingFixer = require('./heading-fixer');
const LinkChecker = require('./link-checker');
const GtmChecker = require('./gtm-checker');
const MetaTagsChecker = require('./meta-tags-checker');
const UnusedFilesChecker = require('./unused-files-checker');

class AccessibilityFixer {
  constructor(config = {}) {
    this.config = {
      backupFiles: config.backupFiles === true,
      language: config.language || 'ja',
      dryRun: config.dryRun || false,
      enhancedAltMode: config.enhancedAltMode || false,
      altCreativity: config.altCreativity || 'balanced',
      includeEmotions: config.includeEmotions || false,
      strictAltChecking: config.strictAltChecking || false,
      autoFixHeadings: config.autoFixHeadings || false,
      fixDescriptionLists: config.fixDescriptionLists || true,
      checkExternal: config.checkExternal || false,
      siteName: config.siteName || '',
      ...config
    };
    
    // Initialize enhanced alt tools (for backward compatibility)
    this.enhancedAltChecker = new EnhancedAltChecker({
      language: this.config.language,
      strictMode: this.config.strictAltChecking,
      checkDecorative: true,
      checkInformative: true,
      checkComplex: true
    });
    
    this.enhancedAltGenerator = new EnhancedAltGenerator({
      language: this.config.language,
      creativity: this.config.altCreativity,
      includeEmotions: this.config.includeEmotions,
      includeBrandContext: true
    });
    
    // Initialize specialized fixers
    this.htmlLangFixer = new HtmlLangFixer(this.config);
    this.altAttributesFixer = new AltAttributesFixer(this.config);
    this.roleAttributesFixer = new RoleAttributesFixer(this.config);
    this.ariaFixer = new AriaFixer(this.config);
    this.formFixer = new FormFixer(this.config);
    this.interactiveControlsFixer = new InteractiveControlsFixer(this.config);
    this.landmarkFixer = new LandmarkFixer(this.config);
    this.headingFixer = new HeadingFixer(this.config);
    this.linkChecker = new LinkChecker(this.config);
    this.gtmChecker = new GtmChecker(this.config);
    this.metaTagsChecker = new MetaTagsChecker(this.config);
    this.unusedFilesChecker = new UnusedFilesChecker(this.config);
  }

  // Delegate methods to specialized modules
  
  async fixHtmlLang(directory = '.') {
    return await this.htmlLangFixer.fix(directory);
  }

  async fixEmptyAltAttributes(directory = '.') {
    return await this.altAttributesFixer.fix(directory);
  }

  async fixRoleAttributes(directory = '.') {
    return await this.roleAttributesFixer.fix(directory);
  }

  async fixAriaLabels(directory = '.') {
    return await this.ariaFixer.fix(directory);
  }

  async fixFormLabels(directory = '.') {
    return await this.formFixer.fix(directory);
  }

  async fixButtonNames(directory = '.') {
    // Part of interactive controls
    return await this.interactiveControlsFixer.fix(directory);
  }

  async fixLinkNames(directory = '.') {
    // Part of interactive controls  
    return await this.interactiveControlsFixer.fix(directory);
  }

  async fixNestedInteractiveControls(directory = '.') {
    return await this.interactiveControlsFixer.fix(directory);
  }

  async fixLandmarks(directory = '.') {
    return await this.landmarkFixer.fix(directory);
  }

  async analyzeHeadings(directory = '.') {
    return await this.headingFixer.fix(directory);
  }

  async fixHeadingStructure(directory = '.') {
    return await this.headingFixer.fix(directory);
  }

  async checkBrokenLinks(directory = '.') {
    return await this.linkChecker.check(directory);
  }

  async checkGoogleTagManager(directory = '.') {
    return await this.gtmChecker.check(directory);
  }

  async checkMetaTags(directory = '.') {
    return await this.metaTagsChecker.check(directory);
  }

  async fixMetaTags(directory = '.') {
    return await this.metaTagsChecker.fix(directory);
  }

  async checkUnusedFiles(directory = '.') {
    return await this.unusedFilesChecker.check(directory);
  }

  // Legacy methods for backward compatibility
  async fixDescriptionLists(directory = '.') {
    console.log(chalk.yellow('⚠️  fixDescriptionLists is deprecated. This feature has been moved to a specialized module.'));
    console.log(chalk.gray('   No action taken. Please use the dedicated description list fixer if needed.'));
    return [];
  }

  async fixAriaLabelsInContent(directory = '.') {
    return await this.ariaFixer.fix(directory);
  }

  // Analysis methods that combine multiple checkers
  async analyzeAltAttributes(content) {
    return this.altAttributesFixer.analyzeAltAttributes(content);
  }

  async analyzeRoleAttributes(content) {
    return this.roleAttributesFixer.analyzeRoleAttributes(content);
  }

  async analyzeFormLabels(content) {
    return this.formFixer.analyzeFormLabels(content);
  }

  async analyzeLandmarks(content) {
    return this.landmarkFixer.analyzeLandmarks(content);
  }

  async analyzeMetaTags(content) {
    return this.metaTagsChecker.analyzeMetaTags(content);
  }

  async analyzeGTMInstallation(content) {
    return this.gtmChecker.analyzeGTMInstallation(content);
  }

  // Comprehensive fix method
  async fixAll(directory = '.') {
    console.log(chalk.blue.bold('\n🚀 Starting comprehensive accessibility fixes...\n'));
    
    const results = {
      htmlLang: await this.fixHtmlLang(directory),
      altAttributes: await this.fixEmptyAltAttributes(directory),
      roleAttributes: await this.fixRoleAttributes(directory),
      ariaLabels: await this.ariaFixer.fix(directory),
      formLabels: await this.formFixer.fix(directory),
      interactiveControls: await this.interactiveControlsFixer.fix(directory),
      landmarks: await this.landmarkFixer.fix(directory),
      metaTags: await this.metaTagsChecker.fix(directory)
    };
    
    console.log(chalk.blue.bold('\n✅ All fixes completed!\n'));
    
    return results;
  }

  // Comprehensive check method (non-fixing)
  async checkAll(directory = '.') {
    console.log(chalk.blue.bold('\n🔍 Starting comprehensive accessibility checks...\n'));
    
    const results = {
      headings: await this.headingFixer.fix(directory),
      brokenLinks: await this.linkChecker.check(directory),
      gtm: await this.gtmChecker.check(directory),
      metaTags: await this.metaTagsChecker.check(directory),
      unusedFiles: await this.unusedFilesChecker.check(directory)
    };
    
    console.log(chalk.blue.bold('\n✅ All checks completed!\n'));
    
    return results;
  }
}

module.exports = AccessibilityFixer;
