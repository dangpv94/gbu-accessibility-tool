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
# Fix current directory
gbu-a11y

# Preview changes (dry run)
gbu-a11y --dry-run

# Fix specific directory
gbu-a11y ./src

# Comprehensive fixes (recommended)
gbu-a11y --comprehensive

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
  --comprehensive, --all   Run all fixes including cleanup (recommended)
  --cleanup-only           Only cleanup duplicate role attributes
  --alt-only               Only fix alt attributes for images
  --lang-only              Only fix HTML lang attributes
  --role-only              Only fix role attributes
  -h, --help               Show help message
```

### Examples

```bash
# Basic fixes for current directory (all standard fixes)
gbu-a11y

# Preview all changes
gbu-a11y --dry-run --comprehensive

# Fix with English language
gbu-a11y -l en ./public

# Individual fix types
gbu-a11y --alt-only          # Only fix alt attributes
gbu-a11y --lang-only         # Only fix lang attributes
gbu-a11y --role-only         # Only fix role attributes
gbu-a11y --cleanup-only      # Only cleanup duplicates

# Combine with other options
gbu-a11y --alt-only --dry-run ./src    # Preview alt fixes only
gbu-a11y --role-only -l en ./public    # Fix roles with English lang

# Backup options
gbu-a11y --backup ./dist             # Explicitly enable backups (default)
gbu-a11y --no-backup ./dist          # Disable backups for faster processing
```

## 🔧 Programmatic Usage

```javascript
const AccessibilityFixer = require("gbu-accessibility-package");

const fixer = new AccessibilityFixer({
  language: "en",
  backupFiles: true,
  dryRun: false,
});

// Fix all accessibility issues
async function fixAccessibility() {
  try {
    const results = await fixer.fixAllAccessibilityIssues("./src");
    console.log("Fixed files:", results);
  } catch (error) {
    console.error("Error:", error);
  }
}

fixAccessibility();
```

## 🎯 Fix Modes

### Individual Fix Options

You can now fix specific accessibility issues individually:

- `--alt-only` - Only fix alt attributes for images
- `--lang-only` - Only fix HTML lang attributes
- `--role-only` - Only fix role attributes
- `--cleanup-only` - Only cleanup duplicate role attributes

### Combined Modes

- **Standard mode** (default) - Fixes alt, lang, and role attributes
- `--comprehensive` - All fixes including duplicate cleanup

```bash
# Fix only missing alt attributes
gbu-a11y --alt-only

# Fix only HTML lang attributes
gbu-a11y --lang-only

# Fix only role attributes
gbu-a11y --role-only

# Clean up duplicate roles only
gbu-a11y --cleanup-only

# All fixes (recommended)
gbu-a11y --comprehensive
```

## 🔧 What Gets Fixed

### 1. Alt Attributes

- **Missing alt attributes** → Adds contextual alt text
- **Empty alt attributes** → Generates meaningful descriptions
- **Context-aware generation** → Uses surrounding text, headings, captions

```html
<!-- Before -->
<img src="logo.png" />
<img src="chart.jpg" alt="" />

<!-- After -->
<img src="logo.png" alt="ロゴ" />
<img src="chart.jpg" alt="グラフ" />
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
      <html lang="ja"></html>
    </html>
  </html>
</html>
```

### 3. Role Attributes & Aria Labels

- **Images** → `role="img"` + `aria-label` (matching alt text)
- **Picture elements** → Moves `role="img"` from `<picture>` to `<img>` inside
- **Links** → `role="link"`
- **Clickable elements** → `role="button"`
- **Navigation lists** → `role="menubar"`
- **Menu items** → `role="menuitem"`

```html
<!-- Before -->
<img src="icon.png" alt="Icon" />
<picture role="img">
  <img src="photo.jpg" alt="Photo" />
</picture>
<a href="/home">Home</a>
<div class="btn-click">Click me</div>

<!-- After -->
<img src="icon.png" alt="Icon" role="img" aria-label="Icon" />
<picture>
  <img src="photo.jpg" alt="Photo" role="img" aria-label="Photo" />
</picture>
<a href="/home" role="link">Home</a>
<div class="btn-click" role="button">Click me</div>
```

### 4. Aria Label Enhancement

- **Automatic aria-label** → Adds `aria-label` matching `alt` text for images
- **Preserves existing** → Won't override existing `aria-label` attributes
- **Smart detection** → Only adds when `alt` text exists and is not empty

```html
<!-- Before -->
<img src="chart.jpg" alt="Sales Chart" />

<!-- After -->
<img src="chart.jpg" alt="Sales Chart" role="img" aria-label="Sales Chart" />
```

### 5. Duplicate Cleanup

- **Removes duplicate role attributes**
- **Preserves first occurrence**
- **Handles mixed quote styles**

```html
<!-- Before -->
<img src="test.jpg" role="img" role="img" alt="Test" />

<!-- After -->
<img src="test.jpg" role="img" alt="Test" />
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

### Standard Mode

```
🚀 Starting Accessibility Fixer...
📝 Step 1: Fixing HTML lang attributes...
✅ Fixed lang attributes in 5 files

🖼️ Step 2: Fixing alt attributes...
✅ Fixed alt attributes in 12 files (34 issues)

🎭 Step 3: Fixing role attributes...
✅ Fixed role attributes in 8 files (67 issues)

📊 Summary:
   Total files scanned: 25
   Files fixed: 15
   Total issues resolved: 106

🎉 All accessibility fixes completed successfully!
```

### Comprehensive Mode

```
🎯 Running comprehensive accessibility fixes...
📝 Step 1: HTML lang attributes...
🖼️ Step 2: Alt attributes...
🎭 Step 3: Role attributes...
🧹 Step 4: Cleanup duplicate roles...

🎉 All accessibility fixes completed!
📊 Final Summary:
   Total files scanned: 25
   Files fixed: 15
   Total issues resolved: 106
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

## 🛠️ Configuration

### Package.json Scripts

```json
{
  "scripts": {
    "a11y:fix": "gbu-a11y",
    "a11y:check": "gbu-a11y --dry-run",
    "a11y:comprehensive": "gbu-a11y --comprehensive",
    "a11y:cleanup": "gbu-a11y --cleanup-only",
    "a11y:alt": "gbu-a11y --alt-only",
    "a11y:lang": "gbu-a11y --lang-only",
    "a11y:role": "gbu-a11y --role-only"
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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/your-org/gbu-accessibility-package/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/your-org/gbu-accessibility-package/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/gbu-accessibility-package/discussions)

## 🏆 Why Choose GBU Accessibility Package?

- ✅ **Zero Configuration** - Works out of the box
- ✅ **Smart & Context-Aware** - Not just generic fixes
- ✅ **Safe & Reliable** - Automatic backups and dry run
- ✅ **Comprehensive** - Covers all major accessibility issues
- ✅ **Fast & Efficient** - Batch processing with detailed reports
- ✅ **WCAG Compliant** - Follows accessibility standards

---

Made with ❤️ by the GBU Team
