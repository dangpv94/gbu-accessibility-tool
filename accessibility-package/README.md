# GBU Accessibility Package

🚀 **Automated accessibility fixes for HTML files** - Smart, context-aware accessibility improvements with zero configuration.

[![npm version](https://badge.fury.io/js/gbu-accessibility-package.svg)](https://www.npmjs.com/package/gbu-accessibility-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen)](https://nodejs.org/)

## ✨ Features

- 🖼️ **Smart Alt Text Generation** - Context-aware alt attributes for images
- 🏷️ **Aria Label Support** - Automatic aria-label matching alt text
- 🌐 **HTML Lang Attributes** - Automatic language attribute fixes
- 🎭 **Role Attributes** - WCAG-compliant role attribute management
- 📋 **Form Labels** - Fix missing labels with intelligent aria-label generation
- 🔘 **Button Names** - Fix empty buttons and input buttons without names
- 🔗 **Link Names** - Fix empty links and detect generic link text
- 🏛️ **Landmarks** - Add missing main and navigation landmarks
- 📑 **Heading Analysis** - Analyze heading structure with suggestions (no auto-fix)
- 🧹 **Duplicate Cleanup** - Remove duplicate role attributes
- 📁 **Batch Processing** - Process entire directories recursively
- 💾 **Automatic Backups** - Safe modifications with backup files
- 🔍 **Dry Run Mode** - Preview changes before applying
- 📊 **Detailed Reports** - Comprehensive fix summaries

## 🚀 Quick Start

### Installation

```bash
# Global installation (recommended)
npm install -g gbu-accessibility-package

# Local installation
npm install gbu-accessibility-package
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

## 📖 Detailed Usage

### Command Line Options

```bash
gbu-a11y [options] [directory/file]

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
  -h, --help               Show help message
```

### Examples

```bash
# Comprehensive fixes (default - includes cleanup)
gbu-a11y

# Preview all changes
gbu-a11y --dry-run

# Fix with English language
gbu-a11y -l en ./public

# Individual fix types (all include cleanup)
gbu-a11y --alt-only          # Fix alt attributes + cleanup
gbu-a11y --forms-only        # Fix form labels + cleanup
gbu-a11y --buttons-only      # Fix button names + cleanup
gbu-a11y --links-only        # Fix link names + cleanup
gbu-a11y --landmarks-only    # Fix landmarks + cleanup
gbu-a11y --headings-only     # Analyze heading structure
gbu-a11y --cleanup-only      # Only cleanup duplicates

# Combine with other options
gbu-a11y --alt-only --dry-run ./src    # Preview alt fixes + cleanup
gbu-a11y --forms-only -l en ./public   # Form fixes + cleanup with English lang

# Backup options
gbu-a11y --backup ./dist             # Explicitly enable backups (default)
gbu-a11y --no-backup ./dist          # Disable backups for faster processing
```

## 🔧 Programmatic Usage

```javascript
const AccessibilityFixer = require('gbu-accessibility-package');

const fixer = new AccessibilityFixer({
  language: 'en',
  backupFiles: true,
  dryRun: false
});

// Fix all accessibility issues
async function fixAccessibility() {
  try {
    const results = await fixer.fixAllAccessibilityIssues('./src');
    console.log('Fixed files:', results);
  } catch (error) {
    console.error('Error:', error);
  }
}

fixAccessibility();
```

## 🎯 Fix Modes

### Comprehensive Mode (Default)
Runs all fixes including cleanup:

1. **HTML lang attributes** - Adds missing language attributes
2. **Alt attributes** - Generates contextual alt text + aria-label
3. **Role attributes** - Adds appropriate ARIA roles + picture handling
4. **Form labels** - Fixes missing input labels
5. **Button names** - Fixes empty buttons
6. **Link names** - Fixes empty links and detects generic text
7. **Landmarks** - Adds main and navigation landmarks
8. **Heading analysis** - Analyzes structure (suggestions only)
9. **Cleanup** - Removes duplicate role attributes

### Individual Fix Options
Each individual mode includes cleanup step:

- `--alt-only` - Alt attributes + cleanup
- `--forms-only` - Form labels + cleanup
- `--buttons-only` - Button names + cleanup
- `--links-only` - Link names + cleanup
- `--landmarks-only` - Landmarks + cleanup
- `--headings-only` - Heading analysis only (no cleanup)

## 🔧 What Gets Fixed

### 1. Alt Attributes & Aria Labels
- **Missing alt attributes** → Adds contextual alt text
- **Empty alt attributes** → Generates meaningful descriptions
- **Automatic aria-label** → Adds aria-label matching alt text
- **Context-aware generation** → Uses surrounding text, headings, captions

```html
<!-- Before -->
<img src="logo.png">
<img src="chart.jpg" alt="">

<!-- After -->
<img src="logo.png" alt="ロゴ" role="img" aria-label="ロゴ">
<img src="chart.jpg" alt="グラフ" role="img" aria-label="グラフ">
```

### 2. HTML Lang Attributes
- **Missing lang attributes** → Adds specified language
- **Empty lang attributes** → Sets proper language code

```html
<!-- Before -->
<html>
<html lang="">

<!-- After -->
<html lang="ja">
<html lang="ja">
```

### 3. Role Attributes
- **Images** → `role="img"`
- **Picture elements** → Moves `role="img"` from `<picture>` to `<img>` inside
- **Links** → `role="link"`
- **Clickable elements** → `role="button"`
- **Navigation lists** → `role="menubar"`
- **Menu items** → `role="menuitem"`

```html
<!-- Before -->
<img src="icon.png" alt="Icon">
<picture role="img">
  <img src="photo.jpg" alt="Photo">
</picture>
<a href="/home">Home</a>
<div class="btn-click">Click me</div>

<!-- After -->
<img src="icon.png" alt="Icon" role="img" aria-label="Icon">
<picture>
  <img src="photo.jpg" alt="Photo" role="img" aria-label="Photo">
</picture>
<a href="/home" role="link">Home</a>
<div class="btn-click" role="button">Click me</div>
```

### 4. Form Labels
- **Input elements without labels** → Adds appropriate `aria-label`
- **Supports multiple input types** → text, email, password, tel, etc.

```html
<!-- Before -->
<input type="text" placeholder="Name">
<input type="email">
<input type="password">

<!-- After -->
<input type="text" placeholder="Name" aria-label="テキスト入力">
<input type="email" aria-label="メールアドレス">
<input type="password" aria-label="パスワード">
```

### 5. Button Names
- **Empty buttons** → Adds text content and aria-label
- **Input buttons without value** → Adds appropriate value

```html
<!-- Before -->
<button></button>
<input type="submit">
<input type="button">

<!-- After -->
<button aria-label="ボタン">ボタン</button>
<input type="submit" value="送信">
<input type="button" value="ボタン">
```

### 6. Link Names
- **Empty links** → Adds aria-label
- **Generic text detection** → Identifies "Click here", "Read more"
- **Image-only links** → Handles links containing only images

```html
<!-- Before -->
<a href="/home"></a>
<a href="/more">Click here</a>
<a href="/image"><img src="icon.png"></a>

<!-- After -->
<a href="/home" aria-label="リンク">リンク</a>
<a href="/more">Click here</a> <!-- Detected but not auto-fixed -->
<a href="/image" aria-label="画像リンク"><img src="icon.png"></a>
```

### 7. Landmarks
- **Missing main landmark** → Adds `role="main"`
- **Missing navigation landmark** → Adds `role="navigation"`

```html
<!-- Before -->
<div class="content">
  <p>Main content</p>
</div>
<ul class="navigation">
  <li><a href="/home">Home</a></li>
</ul>

<!-- After -->
<div class="content" role="main">
  <p>Main content</p>
</div>
<ul class="navigation" role="navigation">
  <li><a href="/home">Home</a></li>
</ul>
```

### 8. Heading Analysis
- **Multiple h1 detection** → Identifies and suggests fixes
- **Heading level skipping** → Detects jumps (h1 → h3)
- **Empty headings** → Identifies headings without content
- **Analysis only** → Provides suggestions, no auto-fix for content safety

### 9. Duplicate Cleanup
- **Removes duplicate role attributes** → Keeps first occurrence
- **Handles mixed quotes** → role="button" role='button'

```html
<!-- Before -->
<img src="test.jpg" role="img" role="img" alt="Test">

<!-- After -->
<img src="test.jpg" role="img" alt="Test">
```

## 🌟 Smart Alt Text Generation

The package uses intelligent context analysis to generate meaningful alt text:

### Context Sources
1. **Title attributes**
2. **Aria-label attributes**  
3. **Definition terms (dt elements)**
4. **Parent link text**
5. **Nearby headings**
6. **Figure captions**
7. **Surrounding text content**

### Fallback Patterns
- `logo.png` → "ロゴ" (Logo)
- `icon.svg` → "アイコン" (Icon)
- `banner.jpg` → "バナー" (Banner)
- `chart.png` → "グラフ" (Chart)
- Generic images → "画像" (Image)

## 📊 Output Examples

### Comprehensive Mode
```
🚀 Starting Accessibility Fixer...
🎯 Running comprehensive accessibility fixes...

📝 Step 1: HTML lang attributes...
✅ Fixed lang attributes in 5 files

🖼️ Step 2: Alt attributes...
✅ Fixed alt attributes in 12 files (34 issues)

🎭 Step 3: Role attributes...  
✅ Fixed role attributes in 8 files (67 issues)

📋 Step 4: Form labels...
✅ Fixed form labels in 6 files (15 issues)

🔘 Step 5: Button names...
✅ Fixed button names in 4 files (8 issues)

🔗 Step 6: Link names...
✅ Fixed link names in 7 files (12 issues)

🏛️ Step 7: Landmarks...
✅ Fixed landmarks in 3 files (5 issues)

📑 Step 8: Heading analysis...
✅ Analyzed headings in 10 files (18 suggestions)

🧹 Step 9: Cleanup duplicate roles...
✅ Cleaned duplicate roles in 2 files

🎉 All accessibility fixes completed!
📊 Final Summary:
   Total files scanned: 25
   Files fixed: 20
   Total issues resolved: 164
```

## 🔒 Safety Features

### Backup Options
- **Default behavior**: Creates `.backup` files automatically for safety
- **Disable backups**: Use `--no-backup` for faster processing
- **Explicit enable**: Use `--backup` to be explicit about backup creation

```bash
# Safe mode (default) - creates backups
gbu-a11y --comprehensive

# Fast mode - no backups
gbu-a11y --no-backup --comprehensive

# Explicit backup mode
gbu-a11y --backup --comprehensive
```

### Other Safety Features
- **Dry run mode** for safe previewing with `--dry-run`
- **Non-destructive** - only adds missing attributes
- **Duplicate prevention** - won't add existing attributes
- **Error handling** - continues processing on individual file errors

## 🔧 Package Management

### Uninstall and Reinstall

If you encounter issues or want to update to the latest version:

```bash
# Uninstall global package
npm uninstall -g gbu-accessibility-package

# Clear npm cache
npm cache clean --force

# Reinstall latest version
npm install -g gbu-accessibility-package@latest

# Verify installation
gbu-a11y --version
gbu-a11y --help
```

### Local Project Management

```bash
# Remove from local project
npm uninstall gbu-accessibility-package

# Clear package-lock and node_modules
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Add latest version
npm install gbu-accessibility-package@latest
```

### Clear Backup Files

```bash
# Remove all backup files in current directory
find . -name "*.backup" -type f -delete

# Remove backup files in specific directory
find ./src -name "*.backup" -type f -delete

# Using npm script (if configured)
npm run cleanup-backups
```

### Troubleshooting Installation

```bash
# Check npm configuration
npm config list

# Reset npm registry (if needed)
npm config set registry https://registry.npmjs.org/

# Check global packages
npm list -g --depth=0

# Fix permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Alternative: Use npx without global install
npx gbu-accessibility-package --help
```

### Version Management

```bash
# Check current version
gbu-a11y --version

# Check available versions
npm view gbu-accessibility-package versions --json

# Install specific version
npm install -g gbu-accessibility-package@2.0.0

# Update to latest
npm update -g gbu-accessibility-package
```

## 🛠️ Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "a11y:fix": "gbu-a11y",
    "a11y:check": "gbu-a11y --dry-run",
    "a11y:comprehensive": "gbu-a11y --comprehensive",
    "a11y:forms": "gbu-a11y --forms-only",
    "a11y:buttons": "gbu-a11y --buttons-only",
    "a11y:links": "gbu-a11y --links-only",
    "a11y:landmarks": "gbu-a11y --landmarks-only",
    "a11y:headings": "gbu-a11y --headings-only",
    "a11y:cleanup": "gbu-a11y --cleanup-only",
    "cleanup-backups": "find . -name '*.backup' -type f -delete"
  }
}
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Check Accessibility
  run: npx gbu-accessibility-package --dry-run

- name: Fix Accessibility Issues  
  run: npx gbu-accessibility-package --comprehensive
```

## 📋 Accessibility Standards Coverage

This package addresses common issues found by axe DevTools:

### ✅ Supported
- `image-alt` - Images must have alternate text
- `html-has-lang` - HTML element must have lang attribute
- `label` - Form elements must have labels (basic support)
- `button-name` - Buttons must have discernible text
- `link-name` - Links must have discernible text (basic support)
- `landmark-one-main` - Document should have one main landmark
- `region` - Page content should be contained by landmarks
- `heading-order` - Heading levels analysis (suggestions only)
- Duplicate role attributes cleanup

### 🔄 Future Enhancements
- `color-contrast` - Color contrast checking
- `focus-order-semantics` - Focus order validation
- Advanced ARIA attributes validation
- Table accessibility features
- List structure validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Package Not Found or Command Not Working
```bash
# Check if package is installed globally
npm list -g gbu-accessibility-package

# If not found, install globally
npm install -g gbu-accessibility-package

# Check PATH includes npm global bin
echo $PATH | grep npm

# Add npm global bin to PATH (if needed)
export PATH=$PATH:$(npm config get prefix)/bin
```

#### Permission Errors
```bash
# macOS/Linux: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) $(npm config get prefix)

# Alternative: Use npx
npx gbu-accessibility-package --help

# Windows: Run as Administrator or use npx
```

#### Package Not Working After Update
```bash
# Complete reinstall
npm uninstall -g gbu-accessibility-package
npm cache clean --force
npm install -g gbu-accessibility-package@latest

# Verify installation
gbu-a11y --version
which gbu-a11y
```

#### Files Not Being Processed
```bash
# Check file extensions (only .html files supported)
ls -la *.html

# Check file permissions
ls -la your-file.html

# Run with verbose output
gbu-a11y --dry-run your-file.html
```

#### Backup Files Accumulating
```bash
# Clean all backup files
find . -name "*.backup" -type f -delete

# Prevent backup creation
gbu-a11y --no-backup

# Configure cleanup script
echo 'alias cleanup-backups="find . -name \"*.backup\" -type f -delete"' >> ~/.bashrc
```

#### Performance Issues
```bash
# Use --no-backup for faster processing
gbu-a11y --no-backup

# Process specific directories instead of entire project
gbu-a11y ./src

# Use individual modes for targeted fixes
gbu-a11y --alt-only ./images
```

#### Node.js Version Issues
```bash
# Check Node.js version (requires >=12.0.0)
node --version

# Update Node.js if needed
# Visit: https://nodejs.org/

# Use nvm to manage Node.js versions
nvm install 18
nvm use 18
```

### Getting Help

If you're still experiencing issues:

1. **Check the version**: `gbu-a11y --version`
2. **Try dry run first**: `gbu-a11y --dry-run`
3. **Check file permissions**: `ls -la your-files.html`
4. **Clear cache and reinstall**: See package management section above
5. **Use npx as alternative**: `npx gbu-accessibility-package --help`

## 🆘 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/dangpv94/gbu-accessibility-tool/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/dangpv94/gbu-accessibility-tool/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/dangpv94/gbu-accessibility-tool/discussions)

## 🏆 Why Choose GBU Accessibility Package?

- ✅ **Zero Configuration** - Works out of the box
- ✅ **Smart & Context-Aware** - Not just generic fixes
- ✅ **Safe & Reliable** - Automatic backups and dry run
- ✅ **Comprehensive** - Covers all major accessibility issues
- ✅ **Fast & Efficient** - Batch processing with detailed reports
- ✅ **WCAG Compliant** - Follows accessibility standards
- ✅ **axe DevTools Compatible** - Fixes common axe issues
- ✅ **Individual Control** - Fix specific issues or everything
- ✅ **Safe Heading Analysis** - Suggests instead of auto-fixing
- ✅ **Multi-language Support** - Japanese, English, and extensible

---

Made with ❤️ by the GBU Team