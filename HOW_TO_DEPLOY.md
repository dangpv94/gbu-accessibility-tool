# 🚀 Hướng dẫn Deploy Package lên NPM

## Bước 1: Chuẩn bị
```bash
cd accessibility-package

# Kiểm tra thông tin package
cat package.json

# Đảm bảo tất cả files cần thiết có sẵn
ls -la
```

## Bước 2: Đăng nhập NPM
```bash
# Đăng nhập npm (cần tài khoản npm.js)
npm login

# Kiểm tra đã đăng nhập
npm whoami
```

## Bước 3: Kiểm tra tên package
```bash
# Kiểm tra tên có sẵn không
npm view gbu-accessibility-package

# Nếu đã tồn tại, thay đổi tên trong package.json:
# "name": "gbu-accessibility-fixer"
# hoặc "name": "@your-username/accessibility-package"
```

## Bước 4: Test local
```bash
# Tạo package local để test
npm pack

# Cài đặt test
npm install -g ./gbu-accessibility-package-1.2.0.tgz

# Test commands
gbu-a11y --help
gbu-a11y --dry-run
```

## Bước 5: Deploy
```bash
# Publish lên npm
npm publish

# Nếu cần update version
npm version patch  # 1.2.0 -> 1.2.1
npm publish
```

## Bước 6: Verify
```bash
# Kiểm tra trên npm
npm view gbu-accessibility-package

# Test cài đặt từ npm
npm uninstall -g gbu-accessibility-package
npm install -g gbu-accessibility-package

# Test hoạt động
gbu-a11y --version
```

## Hướng dẫn sử dụng cho Users

### Cài đặt
```bash
# Global (khuyến nghị)
npm install -g gbu-accessibility-package

# Local
npm install gbu-accessibility-package
```

### Sử dụng
```bash
# Fix current directory
gbu-a11y

# Preview changes
gbu-a11y --dry-run

# Comprehensive fix
gbu-a11y --comprehensive

# Fix specific directory
gbu-a11y ./src

# Help
gbu-a11y --help
```

### Programmatic Usage
```javascript
const AccessibilityFixer = require('gbu-accessibility-package');

const fixer = new AccessibilityFixer({
  language: 'ja',
  backupFiles: true,
  dryRun: false
});

// Fix all issues
fixer.fixAllAccessibilityIssues('./src').then(results => {
  console.log('Fixed:', results);
});
```

## Troubleshooting

### Package name exists
- Thay đổi tên trong package.json
- Sử dụng scoped package: `@username/package-name`

### Permission errors
```bash
# Config npm prefix
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Update package
```bash
# Tăng version
npm version patch

# Publish
npm publish

# Tag git
git push origin main --tags
```

---

🎉 **Package đã sẵn sàng deploy!**