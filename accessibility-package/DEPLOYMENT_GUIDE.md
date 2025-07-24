# 📦 Deployment Guide - GBU Accessibility Package

Hướng dẫn chi tiết để deploy package lên npm và sử dụng.

## 🚀 Bước 1: Chuẩn bị Deploy

### 1.1 Kiểm tra thông tin package
```bash
cd accessibility-package
cat package.json
```

### 1.2 Đăng nhập npm
```bash
# Đăng nhập npm (cần tài khoản npm)
npm login

# Kiểm tra user hiện tại
npm whoami
```

### 1.3 Kiểm tra tên package có sẵn không
```bash
# Kiểm tra tên package
npm view gbu-accessibility-package

# Nếu package đã tồn tại, thay đổi tên trong package.json
# Ví dụ: "gbu-accessibility-fixer", "accessibility-helper-gbu", etc.
```

## 🔧 Bước 2: Chuẩn bị Files

### 2.1 Tạo .npmignore (nếu cần)
```bash
# Tạo file .npmignore để loại trừ files không cần thiết
cat > .npmignore << EOF
*.backup
test-*
.DS_Store
.vscode/
.idea/
*.log
node_modules/
coverage/
.nyc_output/
EOF
```

### 2.2 Test package locally
```bash
# Test cài đặt local
npm pack
npm install -g ./gbu-accessibility-package-1.2.0.tgz

# Test commands
gbu-a11y --help
gbu-a11y --dry-run
```

## 📤 Bước 3: Deploy lên npm

### 3.1 Publish package
```bash
# Publish lần đầu
npm publish

# Nếu package đã tồn tại, tăng version trước
npm version patch  # 1.2.0 -> 1.2.1
npm version minor  # 1.2.0 -> 1.3.0  
npm version major  # 1.2.0 -> 2.0.0

# Sau đó publish
npm publish
```

### 3.2 Verify deployment
```bash
# Kiểm tra package trên npm
npm view gbu-accessibility-package

# Test cài đặt từ npm
npm install -g gbu-accessibility-package
```

## 📋 Bước 4: Hướng dẫn sử dụng cho End Users

### 4.1 Cài đặt Global (Khuyến nghị)
```bash
# Cài đặt global để sử dụng CLI
npm install -g gbu-accessibility-package

# Verify installation
gbu-a11y --version
gbu-a11y --help
```

### 4.2 Cài đặt Local (Cho dự án cụ thể)
```bash
# Trong thư mục dự án
npm install gbu-accessibility-package

# Sử dụng với npx
npx gbu-a11y --help

# Hoặc thêm vào package.json scripts
```

### 4.3 Sử dụng cơ bản
```bash
# Fix thư mục hiện tại
gbu-a11y

# Preview trước khi fix
gbu-a11y --dry-run

# Fix comprehensive (khuyến nghị)
gbu-a11y --comprehensive

# Fix thư mục cụ thể
gbu-a11y ./src

# Fix với ngôn ngữ khác
gbu-a11y -l en ./public
```

## 🔄 Bước 5: Update và Maintenance

### 5.1 Update package
```bash
# Khi có thay đổi code
git add .
git commit -m "Fix: Prevent duplicate role attributes"

# Tăng version
npm version patch

# Publish version mới
npm publish

# Push changes to git
git push origin main --tags
```

### 5.2 Deprecate version cũ (nếu cần)
```bash
# Deprecate version cụ thể
npm deprecate gbu-accessibility-package@1.1.0 "Please upgrade to 1.2.0 - fixes duplicate role issue"

# Unpublish (chỉ trong 72h đầu)
npm unpublish gbu-accessibility-package@1.2.0
```

## 📊 Bước 6: Monitoring và Analytics

### 6.1 Kiểm tra download stats
```bash
# Xem thống kê download
npm view gbu-accessibility-package

# Hoặc truy cập: https://www.npmjs.com/package/gbu-accessibility-package
```

### 6.2 Quản lý versions
```bash
# Xem tất cả versions
npm view gbu-accessibility-package versions --json

# Xem version hiện tại
npm view gbu-accessibility-package version
```

## 🛡️ Bước 7: Security và Best Practices

### 7.1 Enable 2FA cho npm account
```bash
# Enable 2FA
npm profile enable-2fa auth-and-writes

# Verify 2FA status
npm profile get
```

### 7.2 Sử dụng npm tokens cho CI/CD
```bash
# Tạo token cho automation
npm token create --read-only

# Sử dụng trong GitHub Actions
# NPM_TOKEN trong secrets
```

## 📝 Bước 8: Documentation và Support

### 8.1 Tạo GitHub repository
```bash
# Tạo repo và push code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/gbu-accessibility-package.git
git push -u origin main
```

### 8.2 Update package.json với repo info
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/gbu-accessibility-package.git"
  },
  "homepage": "https://github.com/your-username/gbu-accessibility-package#readme",
  "bugs": {
    "url": "https://github.com/your-username/gbu-accessibility-package/issues"
  }
}
```

## 🎯 Quick Commands Summary

```bash
# Deploy workflow
npm login
npm publish

# User installation
npm install -g gbu-accessibility-package

# Basic usage
gbu-a11y --comprehensive

# Update workflow  
npm version patch
npm publish
```

## ⚠️ Troubleshooting

### Package name already exists
```bash
# Thay đổi tên trong package.json
"name": "gbu-accessibility-fixer"
# hoặc
"name": "@your-username/accessibility-package"
```

### Permission errors
```bash
# Sử dụng sudo (không khuyến nghị)
sudo npm install -g gbu-accessibility-package

# Hoặc config npm prefix
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Version conflicts
```bash
# Force update version
npm version patch --force

# Reset version
npm version 1.2.0 --allow-same-version
```

---

🎉 **Chúc mừng!** Package của bạn đã sẵn sàng để deploy và sử dụng trên npm!