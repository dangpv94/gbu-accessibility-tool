# GBU Accessibility Package

🚀 **Automated accessibility fixes for HTML files** - Smart, context-aware accessibility improvements with zero configuration.

[![npm version](https://badge.fury.io/js/gbu-accessibility-package.svg)](https://www.npmjs.com/package/gbu-accessibility-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen)](https://nodejs.org/)

## ✨ Features

### 🎯 **Core Accessibility Fixes**
- 🖼️ **Smart Alt Text Generation** - Context-aware alt attributes for images
- 🏷️ **Aria Label Support** - Automatic aria-label matching alt text
- 🌐 **HTML Lang Attributes** - Automatic language attribute fixes
- 🎭 **Role Attributes** - WCAG-compliant role attribute management
- 🏷️ **Aria Labels** - Automatic aria-label generation from alt text and content
- 📋 **Form Labels** - Fix missing labels with intelligent aria-label generation
- 🔘 **Button Names** - Fix empty buttons and input buttons without names
- 🔗 **Link Names** - Fix empty links and detect generic link text
- 🏛️ **Landmarks** - Add missing main and navigation landmarks
- 📑 **Heading Analysis & Auto-Fix** - Analyze heading structure with optional auto-fix using `--auto-fix-headings`
- 🎯 **Nested Controls Detection** - Detect and fix nested interactive controls
- 🔍 **Broken Links Detection** - Detect broken external links
- 📁 **404 Resources Detection** - Detect missing local resources (images, CSS, JS, etc.)
- 🏷️ **Google Tag Manager Check** - Validate GTM installation (script + noscript)
- 🗂️ **Unused Files Detection** - Find files not referenced anywhere in the project
- ☠️ **Dead Code Analysis** - Detect unused CSS rules and JavaScript functions
- 📏 **File Size Analysis** - Check file sizes and suggest optimizations
- 🧹 **Duplicate Cleanup** - Remove duplicate role attributes

### 🚀 **Enhanced Alt Attribute Features (Integrated!)**
- 🔍 **Comprehensive Analysis** - Image type classification and quality checking built-in
- 🎨 **Diverse Alt Generation** - Multiple strategies for creative alt text integrated in core
- 🌐 **Multi-language Support** - Japanese, English, Vietnamese vocabulary built-in
- 🎭 **Creativity Levels** - Conservative, Balanced, Creative modes
- 🧠 **Context Awareness** - Brand, emotional, and technical context integration
- 📊 **Data Visualization** - Specialized descriptions for charts and graphs
- 🧹 **Clean Architecture** - All enhanced features integrated in a single file

### 🛠️ **Utility Features**
- 📁 **Batch Processing** - Process entire directories recursively
- 💾 **Optional Backups** - Create backup files when needed with --backup flag
- 🔍 **Dry Run Mode** - Preview changes before applying
- 📊 **Detailed Reports** - Comprehensive fix summaries
- ⚡ **Individual Fix Modes** - Target specific accessibility issues

## 🚀 Quick Start

### Installation

```bash
# Global installation (recommended)
npm install -g gbu-accessibility-package

# Local installation
npm install gbu-accessibility-package
```

### Uninstall and Reinstall

```bash
# Uninstall global package
npm uninstall -g gbu-accessibility-package

# Uninstall local package
npm uninstall gbu-accessibility-package

# Clear npm cache (recommended when having issues)
npm cache clean --force

# Reinstall latest version
npm install -g gbu-accessibility-package@latest

# Check installed version
npm list -g gbu-accessibility-package
gbu-a11y --version

# Install specific version
npm install -g gbu-accessibility-package@3.2.1
```

### Installation Troubleshooting

```bash
# If permission errors (macOS/Linux)
sudo npm install -g gbu-accessibility-package

# If cache issues
npm cache clean --force
npm install -g gbu-accessibility-package --force

# Verify installation
which gbu-a11y
gbu-a11y --help

# Update to latest version
npm update -g gbu-accessibility-package
```

### Basic Usage

```bash
# Comprehensive fixes (default mode)
gbu-a11y

# Preview changes (dry run)
gbu-a11y --dry-run

# Fix specific directory
gbu-a11y ./src

# Fix specific file
gbu-a11y index.html
```

### Enhanced Alt Attribute Mode

```bash
# Enable enhanced alt attribute analysis
gbu-a11y --enhanced-alt

# Creative alt text generation with emotions
gbu-a11y --enhanced-alt --alt-creativity creative --include-emotions

# Strict quality checking
gbu-a11y --enhanced-alt --strict-alt

# English with creative mode
gbu-a11y -l en --enhanced-alt --alt-creativity creative
```

## 📖 Detailed Usage

### Command Line Options

```bash
gbu-a11y [options] [directory/file]

Basic Options:
  -d, --directory <path>    Target directory (default: current directory)
  -l, --language <lang>     Language for lang attribute (default: ja)
  --backup                 Create backup files
  --no-backup              Don't create backup files (default)
  --dry-run                Preview changes without applying

Fix Modes:
  --comprehensive, --all   Run comprehensive fixes (default)
  --alt-only               Fix alt attributes + cleanup
  --lang-only              Fix HTML lang attributes + cleanup
  --role-only              Fix role attributes + cleanup
  --aria-label-only        Fix aria-label attributes + cleanup
  --forms-only             Fix form labels + cleanup
  --buttons-only           Fix button names + cleanup
  --links-only             Fix link names + cleanup
  --landmarks-only         Fix landmarks + cleanup
  --headings-only          Analyze heading structure with optional auto-fix
  --auto-fix-headings      Enable automatic heading structure fixes
  --links-check            Check for broken links and 404 resources (comprehensive, no auto-fix)
  --broken-links           Check for broken external links only (no auto-fix)
  --404-resources          Check for missing local resources only (no auto-fix)
  --gtm-check              Check Google Tag Manager installation (no auto-fix)
  --unused-files           Check for unused files in project
  --dead-code              Check for dead code in CSS and JavaScript
  --file-size, --size-check Check file sizes and suggest optimizations
  --cleanup-only           Only cleanup duplicate role attributes

Enhanced Alt Options:
  --enhanced-alt           Use enhanced alt attribute analysis and generation
  --alt-creativity <mode>  Alt text creativity: conservative, balanced, creative
  --include-emotions       Include emotional descriptors in alt text
  --strict-alt             Enable strict alt attribute quality checking

Help:
  -h, --help               Show help message
  -v, --version            Show version number
```

### Examples

```bash
# Basic comprehensive fixes
gbu-a11y

# Preview all changes
gbu-a11y --dry-run

# Fix with English language
gbu-a11y -l en ./public

# Individual fix types
gbu-a11y --alt-only          # Fix alt attributes + cleanup
gbu-a11y --aria-label-only   # Fix aria-label attributes + cleanup
gbu-a11y --forms-only        # Fix form labels + cleanup
gbu-a11y --buttons-only      # Fix button names + cleanup
gbu-a11y --headings-only     # Analyze heading structure
gbu-a11y --headings-only --auto-fix-headings  # Auto-fix heading structure
gbu-a11y --links-check       # Check broken links and missing resources + cleanup
gbu-a11y --broken-links      # Check broken external links only + cleanup
gbu-a11y --404-resources     # Check missing local resources only + cleanup
gbu-a11y --gtm-check         # Check Google Tag Manager installation
gbu-a11y --unused-files      # Check for unused files in project
gbu-a11y --dead-code         # Check for dead CSS and JavaScript code
gbu-a11y --file-size         # Check file sizes and suggest optimizations

# Enhanced alt attribute features
gbu-a11y --enhanced-alt                                    # Basic enhanced mode
gbu-a11y --enhanced-alt --alt-creativity creative          # Creative descriptions
gbu-a11y --enhanced-alt --include-emotions                 # Include emotional context
gbu-a11y --enhanced-alt --strict-alt                       # Strict quality checking
gbu-a11y -l en --enhanced-alt --alt-creativity creative    # English creative mode

# Combine with other options
gbu-a11y --enhanced-alt --backup ./src                     # Enhanced mode with backups
gbu-a11y --enhanced-alt --dry-run                          # Preview enhanced fixes
```

## 🎨 Enhanced Alt Attribute Features

### Creativity Levels

#### Conservative
- Simple, factual descriptions
- Focus on basic functionality
- Minimal vocabulary variation

**Example**: `alt="Chart"`, `alt="Logo"`

#### Balanced (Default)
- Context-aware descriptions
- Moderate creativity
- Balance between simple and detailed

**Example**: `alt="Sales performance chart"`, `alt="Company logo"`

#### Creative
- Rich, detailed descriptions
- Emotional context integration
- High brand and context awareness

**Example**: `alt="Dynamic sales performance chart showing impressive 25% quarterly growth"`, `alt="Innovative technology company logo representing digital transformation"`

### Image Type Classification

- **Decorative Images**: Automatically detected and marked with `alt=""`
- **Functional Icons**: Described by their action (e.g., "Open chat", "Search")
- **Data Visualizations**: Include chart type, trends, and key data points
- **Complex Images**: Short alt + recommendation for detailed description
- **Logos**: Include brand name and "logo" keyword
- **Content Images**: Context-aware descriptions based on surrounding content

### Quality Checks

- ❌ **Error Level**: Missing alt, empty alt for content, generic text
- ⚠️ **Warning Level**: Too long/short, redundant words, filename in alt
- ℹ️ **Info Level**: Optimization suggestions, consistency checks

## 📋 Programmatic Usage

### Basic Usage

```javascript
const { AccessibilityFixer } = require('gbu-accessibility-package');

const fixer = new AccessibilityFixer({
  language: 'ja',
  backupFiles: true,
  dryRun: false
});

// Fix all accessibility issues
fixer.fixAllAccessibilityIssues('./src').then(results => {
  console.log('Accessibility fixes completed:', results);
});

// Fix specific issues
await fixer.fixEmptyAltAttributes('./src');
await fixer.fixFormLabels('./src');
await fixer.fixButtonNames('./src');
```

### Enhanced Alt Attribute Mode (Integrated)

```javascript
const { AccessibilityFixer } = require('gbu-accessibility-package');

// Use AccessibilityFixer with enhanced mode (integrated)
const fixer = new AccessibilityFixer({
  language: 'en',
  enhancedAltMode: true,
  altCreativity: 'creative',
  includeEmotions: true,
  strictAltChecking: true
});

await fixer.fixEmptyAltAttributes('./src');

// All enhanced features are now integrated in AccessibilityFixer
// No need to import separate classes
const results = await fixer.fixAllAccessibilityIssues('./src');
console.log('Accessibility fixes completed with enhanced features:', results);

// New: Check for unused files
await fixer.checkUnusedFiles('./src');

// New: Check for dead code
await fixer.checkDeadCode('./src');

// New: Check file sizes
await fixer.checkFileSizes('./src');
```

## 🎯 What Gets Fixed

### Alt Attributes (Enhanced Mode)
- **Missing alt attributes** → Context-aware alt text generation
- **Empty alt attributes** → Smart content-based descriptions
- **Generic alt text** → Specific, meaningful descriptions
- **Too long alt text** → Optimized length with key information
- **Redundant words** → Clean, concise descriptions
- **Data visualizations** → Chart type + trends + key data

### Form Accessibility
- **Missing form labels** → Intelligent aria-label generation
- **Unlabeled inputs** → Context-based label suggestions
- **Form structure** → Proper label associations

### Interactive Elements
- **Empty buttons** → Action-based button names
- **Generic link text** → Descriptive link purposes
- **Missing button names** → Function-based descriptions

### Document Structure
- **Missing lang attributes** → Automatic language detection
- **Missing landmarks** → Main and navigation landmarks
- **Heading structure** → Analysis and auto-fix with `--auto-fix-headings`
  - Fix multiple h1 elements
  - Fix heading level skipping (h2 → h4)
  - Add text to empty headings
  - Fix duplicate headings
- **Nested interactive controls** → Detect and fix nested controls
- **Role attributes** → WCAG-compliant role assignments

### Link Validation
- **Broken External Links** → Detect HTTP 404, 500, timeout errors on external URLs
  - Invalid URLs → Detect malformed URL formats
  - Slow links → Warn about timeouts and slow responses
  - Network errors → Connection failures and unreachable hosts
- **404 Missing Resources** → Check for missing local files
  - Images (img src), CSS files (link href), JavaScript files (script src)
  - Video/audio sources, other local assets
  - Relative and absolute path checking

### Project Optimization
- **Unused Files** → Detect files not referenced anywhere in the project
  - Images, CSS, SCSS/Sass, JavaScript, JSX, TypeScript, Vue, PHP, JSON, Markdown, XML, PDF, Video, Audio files
  - Local file references analysis
  - Heuristic detection with manual review recommendations
- **Dead Code Analysis** → Find unused CSS rules and JavaScript functions
  - CSS selectors not used in HTML
  - JavaScript functions never called
  - Variables declared but never used
  - Smart skipping of dynamic patterns
- **Google Tag Manager Check** → Validate GTM installation
  - Detect GTM script in `<head>` section
  - Verify noscript fallback in `<body>` section
  - Check container ID consistency
  - Validate proper positioning of both snippets
  - Reports: complete installation, missing components, position issues
- **File Size Analysis** → Check file sizes and suggest optimizations
  - Detect large files exceeding recommended thresholds
  - Type-specific optimization suggestions (images, CSS, JS, etc.)
  - File size breakdown by type
  - Top 10 largest files reporting

## 🏷️ Google Tag Manager Validation

The `--gtm-check` feature validates proper Google Tag Manager installation across your project.

### What It Checks

1. **Script in `<head>`**: Verifies GTM script is present before `</head>` closing tag
2. **Noscript in `<body>`**: Confirms noscript fallback is immediately after `<body>` opening tag
3. **Container ID**: Ensures both snippets use the same GTM container ID (format: GTM-XXXXXX)
4. **Position Validation**: Checks optimal placement of both code snippets

### Usage

```bash
# Check GTM installation in entire project
gbu-a11y --gtm-check

# Check specific directory
gbu-a11y --gtm-check ./public

# Alternative commands
gbu-a11y --check-gtm
gbu-a11y --google-tag-manager
```

### Example Output

```
🏷️ Đang kiểm tra cài đặt Google Tag Manager (GTM)...

📁 public/index.html:
  ✅ GTM Container ID: GTM-ABC1234
  ✅ Script trong head: Đã đặt đúng vị trí trước </head>
  ✅ Noscript trong body: Đã đặt đúng vị trí sau <body>

📁 public/about.html:
  ✅ GTM Container ID: GTM-ABC1234
  ✅ Script trong head: Đã đặt đúng vị trí trước </head>
  ❌ Noscript trong body: Thiếu sau thẻ <body>
  ❌ Thiếu GTM Noscript: Tìm thấy GTM script nhưng thiếu noscript dự phòng trong <body>
    💡 Thêm đoạn mã GTM noscript ngay sau thẻ mở <body>

📊 Tóm tắt: Đã phân tích 2 file
  ✅ File có GTM: 2
  ⚠️ File có vấn đề về GTM: 1
💡 GTM cần có cả <script> trong <head> và <noscript> sau <body>
```

### GTM Installation Requirements

For proper GTM installation, each page should have:

1. **Script snippet in `<head>`**:
```html
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXX');</script>
  <!-- End Google Tag Manager -->
</head>
```

2. **Noscript snippet immediately after `<body>`**:
```html
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  
  <!-- Your page content -->
</body>
```

### Common Issues Detected

- ❌ **Missing Script**: GTM script not found in `<head>`
- ❌ **Missing Noscript**: Noscript fallback not found after `<body>`
- ⚠️ **Wrong Position**: Script or noscript not in optimal position
- ❌ **ID Mismatch**: Different container IDs between script and noscript
- ⚠️ **Incomplete Installation**: Only one of the two required snippets present

## 🔧 Package Management

### Check package information
```bash
# Check current version
gbu-a11y --version
npm list -g gbu-accessibility-package

# View package info
npm info gbu-accessibility-package

# Verify installation
which gbu-a11y
npm list -g | grep gbu-accessibility-package
```

### Update package
```bash
# Check for new versions
npm outdated -g gbu-accessibility-package

# Update to latest version
npm update -g gbu-accessibility-package

# Or reinstall latest version
npm uninstall -g gbu-accessibility-package
npm install -g gbu-accessibility-package@latest
```

### Cache management
```bash
# Verify cache
npm cache verify

# Clean cache (when having issues)
npm cache clean --force

# View cache location
npm config get cache
```

## 🧪 Testing and Demo

```bash
# Test the package
npm test

# Demo basic features
npm run demo

# Demo enhanced alt features
npm run demo-enhanced

# Demo creative alt generation
npm run demo-creative

# Test enhanced alt features
npm run test-enhanced-alt
```

## 📊 Performance

- **Basic Mode**: Fast processing, suitable for large projects
- **Enhanced Mode**: ~20-30% slower but 85-90% improvement in alt text quality
- **Memory Usage**: +15-20% for enhanced vocabulary and analysis
- **Accuracy**: 95%+ detection of accessibility issues

## 🌐 Language Support

- **Japanese (ja)**: Default language with rich vocabulary
- **English (en)**: Comprehensive English support
- **Vietnamese (vi)**: Vietnamese language support

Enhanced alt features include language-specific vocabulary and grammar rules for natural, contextually appropriate descriptions.

## 📚 Documentation

- [Enhanced Alt Features Guide](./ENHANCED_ALT_FEATURES.md) - Detailed documentation for enhanced alt attribute features
- [Quick Start Guide](./QUICK_START.md) - Get started quickly
- [Package Summary](./PACKAGE_SUMMARY.md) - Overview of all features
- [Changelog](./CHANGELOG.md) - Version history and updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

```bash
git clone https://github.com/example/gbu-accessibility-tool.git
cd gbu-accessibility-tool/accessibility-package
npm install
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with accessibility best practices in mind
- Follows WCAG guidelines
- Inspired by the need for automated accessibility improvements
- Community feedback and contributions

---

**Made with ❤️ by the GBU Team**

For more information, visit our [GitHub repository](https://github.com/example/gbu-accessibility-tool).