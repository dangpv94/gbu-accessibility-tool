#!/bin/bash

# Deploy Accessibility Package to Another Project
echo "🚀 Deploying Accessibility Package to Another Project"
echo "====================================================="

# Check if target directory is provided
if [ -z "$1" ]; then
    echo "❌ Please provide target project directory"
    echo "Usage: ./deploy-to-project.sh /path/to/target/project"
    exit 1
fi

TARGET_DIR="$1"

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Target directory does not exist: $TARGET_DIR"
    exit 1
fi

echo "📁 Target directory: $TARGET_DIR"
echo ""

# Method 1: Copy package files
echo "📦 Method 1: Copying package files..."
cp -r . "$TARGET_DIR/accessibility-package"
echo "✅ Package files copied"

# Method 2: Create package.json entry
echo ""
echo "📝 Method 2: Adding to package.json (if exists)..."
if [ -f "$TARGET_DIR/package.json" ]; then
    echo "   Found package.json in target project"
    echo "   Add this to your package.json dependencies:"
    echo '   "accessibility-toolkit": "file:./accessibility-package"'
    echo ""
    echo "   Then run: npm install"
else
    echo "   No package.json found - manual installation only"
fi

# Method 3: Create usage instructions
echo ""
echo "📋 Creating usage instructions..."
cat > "$TARGET_DIR/ACCESSIBILITY_USAGE.md" << 'EOF'
# Accessibility Package Usage

## Installation

### Option 1: Use CLI commands directly
```bash
# Make sure the package is linked globally
cd accessibility-package
npm link

# Use commands
a11y-fix all --dry-run    # Preview fixes
a11y-fix all              # Apply fixes
a11y-test run             # Run tests
```

### Option 2: Use programmatically
```javascript
const { AccessibilityTester, AccessibilityFixer } = require('./accessibility-package');

// Fix accessibility issues
const fixer = new AccessibilityFixer({ language: 'ja' });
await fixer.fixHtmlLang();
await fixer.fixEmptyAltAttributes();

// Test accessibility
const tester = new AccessibilityTester({
  pages: ['index.html', 'about.html']
});
await tester.testPages();
```

### Option 3: Copy enhancement script
Copy `accessibility-package/assets/common/js/accessibility-enhancements.js` to your project and include it in your HTML:

```html
<script src="/assets/common/js/accessibility-enhancements.js"></script>
```

## Quick Commands

- `a11y-fix lang --language ja` - Fix HTML lang attributes
- `a11y-fix alt` - Fix empty alt attributes  
- `a11y-fix all --dry-run` - Preview all fixes
- `a11y-test run --files index.html` - Test specific files
- `a11y-test run` - Test all HTML files

## Configuration

Create `a11y.config.js` in your project root:

```javascript
module.exports = {
  testing: {
    baseUrl: 'http://localhost:8080',
    pages: ['index.html', 'about.html']
  },
  fixing: {
    language: 'ja',
    backupFiles: true
  }
};
```
EOF

echo "✅ Usage instructions created: $TARGET_DIR/ACCESSIBILITY_USAGE.md"

# Method 4: Copy enhancement script to common location
echo ""
echo "🎨 Method 4: Copying enhancement script..."
mkdir -p "$TARGET_DIR/assets/common/js"
cp ../assets/common/js/accessibility-enhancements.js "$TARGET_DIR/assets/common/js/" 2>/dev/null || echo "   Enhancement script not found in parent, skipping..."

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps in target project:"
echo "1. cd $TARGET_DIR"
echo "2. Read ACCESSIBILITY_USAGE.md for instructions"
echo "3. Run: cd accessibility-package && npm install && npm link"
echo "4. Test: a11y-fix all --dry-run"
echo ""
echo "🔗 The package is now available in: $TARGET_DIR/accessibility-package"