# 🚀 Deploy Instructions - GBU Accessibility Package

Package đã sẵn sàng để deploy lên npm! Tất cả tests đã pass.

## ✅ Pre-Deploy Checklist

- [x] Package structure hoàn chỉnh
- [x] All required files present
- [x] Tests passing
- [x] Documentation complete
- [x] Version updated (1.2.0)

## 🎯 Deploy Commands

### 1. Đăng nhập npm
```bash
npm login
# Nhập username, password, email và 2FA code
```

### 2. Verify login
```bash
npm whoami
# Kiểm tra đã đăng nhập đúng account
```

### 3. Final test
```bash
cd accessibility-package
npm run test
# Đảm bảo tất cả tests pass
```

### 4. Deploy
```bash
npm publish
# Package sẽ được publish lên npm
```

### 5. Verify deployment
```bash
# Kiểm tra trên npm
npm view gbu-accessibility-package

# Test cài đặt
npm install -g gbu-accessibility-package
gbu-a11y --version
gbu-a11y --help
```

## 📖 User Instructions (Sau khi deploy)

### Cài đặt
```bash
# Global installation (khuyến nghị)
npm install -g gbu-accessibility-package

# Local installation
npm install gbu-accessibility-package
```

### Sử dụng CLI
```bash
# Fix current directory
gbu-a11y

# Preview changes
gbu-a11y --dry-run

# Comprehensive fix (khuyến nghị)
gbu-a11y --comprehensive

# Fix specific directory
gbu-a11y ./src

# Fix with different language
gbu-a11y -l en ./public

# Help
gbu-a11y --help
```

### Sử dụng Programmatically
```javascript
const AccessibilityFixer = require('gbu-accessibility-package');

const fixer = new AccessibilityFixer({
  language: 'ja',
  backupFiles: true,
  dryRun: false
});

// Fix all accessibility issues
fixer.fixAllAccessibilityIssues('./src').then(results => {
  console.log('Accessibility fixes completed:', results);
});
```

## 🔄 Update Workflow (Tương lai)

### Khi có bug fixes hoặc features mới:
```bash
# 1. Fix code
# 2. Test
npm run test

# 3. Update version
npm version patch  # 1.2.0 -> 1.2.1 (bug fix)
npm version minor  # 1.2.0 -> 1.3.0 (new feature)
npm version major  # 1.2.0 -> 2.0.0 (breaking change)

# 4. Publish
npm publish

# 5. Tag git (if using git)
git push origin main --tags
```

## 📊 Package Features

### ✨ What it fixes:
- **Alt attributes**: Missing and empty alt text with smart generation
- **Lang attributes**: HTML language attributes
- **Role attributes**: WCAG-compliant role attributes
- **Duplicate cleanup**: Removes duplicate role attributes

### 🛡️ Safety features:
- **Automatic backups**: Creates .backup files
- **Dry run mode**: Preview changes before applying
- **Duplicate prevention**: Won't add existing attributes
- **Error handling**: Continues on individual file errors

### 🎯 Smart features:
- **Context-aware alt text**: Uses surrounding content
- **Batch processing**: Handles entire directories
- **Comprehensive mode**: All fixes in one command
- **Detailed reporting**: Shows exactly what was fixed

## 🎉 Ready to Deploy!

Package `gbu-accessibility-package` version 1.2.0 is ready for npm publication.

**Final command:**
```bash
cd accessibility-package && npm publish
```

After successful deployment, users can install with:
```bash
npm install -g gbu-accessibility-package
```