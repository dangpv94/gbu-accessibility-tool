# 🚀 Quick Start Guide

Hướng dẫn nhanh để sử dụng GBU Accessibility Package trong 5 phút.

## ⚡ Cài đặt nhanh

```bash
# 1. Cài đặt global (khuyến nghị)
npm install -g gbu-accessibility-package

# 2. Hoặc cài đặt local
npm install gbu-accessibility-package

# 3. Chạy ngay!
gbu-a11y
```

## 🔄 Cài đặt lại / Cập nhật

```bash
# Gỡ cài đặt cũ
npm uninstall -g gbu-accessibility-package

# Xóa cache
npm cache clean --force

# Cài đặt phiên bản mới nhất
npm install -g gbu-accessibility-package@latest

# Kiểm tra version
gbu-a11y --version
```

## 🎯 Sử dụng cơ bản

### Cách 1: CLI (Đơn giản nhất)

```bash
# Fix toàn bộ dự án (current directory)
gbu-a11y

# Fix thư mục cụ thể
gbu-a11y ./src

# Preview trước khi fix
gbu-a11y --dry-run

# Fix với ngôn ngữ khác
gbu-a11y -l en ./dist

# Fix comprehensive (khuyến nghị)
gbu-a11y --comprehensive
```

### Cách 2: Node.js Script

Tạo file `fix.js`:

```javascript
const AccessibilityFixer = require('gbu-accessibility-package');

const fixer = new AccessibilityFixer({
  language: 'ja',     // Thay đổi theo dự án
  backupFiles: true,
  dryRun: false
});

async function fix() {
  // Fix tất cả issues
  await fixer.fixAllAccessibilityIssues('.');
  console.log('✅ Done!');
}

fix();
```

Chạy: `node fix.js`

## 📋 Checklist nhanh

- [ ] `npm install -g gbu-accessibility-package`
- [ ] Backup code (git commit)
- [ ] Chạy `gbu-a11y --dry-run` để preview
- [ ] Chạy `gbu-a11y --comprehensive` để fix
- [ ] Kiểm tra kết quả
- [ ] Commit changes

## 🎨 Kết quả mong đợi

### Trước:
```html
<html>
<body>
  <img src="logo.png">
  <a href="/about">About</a>
  <button onclick="submit()">Submit</button>
</body>
</html>
```

### Sau:
```html
<html lang="ja">
<body>
  <img src="logo.png" alt="ロゴ" role="img">
  <a href="/about" role="link">About</a>
  <button onclick="submit()" role="button">Submit</button>
</body>
</html>
```

## 🔧 Tùy chỉnh nhanh

### Thay đổi ngôn ngữ
```javascript
// Trong config
language: 'en'  // 'ja', 'vi', 'zh', etc.
```

### Không tạo backup
```bash
gbu-a11y --no-backup
```

### Chỉ preview
```bash
gbu-a11y --dry-run
```

## ❓ Troubleshooting

**Lỗi "Cannot find module"**
```bash
# Cài đặt lại
npm uninstall -g gbu-accessibility-package
npm cache clean --force
npm install -g gbu-accessibility-package
```

**Lỗi permission (macOS/Linux)**
```bash
sudo npm install -g gbu-accessibility-package
```

**Package không update**
```bash
# Force update
npm cache clean --force
npm install -g gbu-accessibility-package@latest --force
```

**Kiểm tra cài đặt**
```bash
which gbu-a11y
npm list -g gbu-accessibility-package
gbu-a11y --version
```

**Duplicate attributes**
- Tool tự động tránh duplicate
- Nếu có, chạy lại tool sẽ tự clean up

**Performance chậm**
- Chạy từng thư mục nhỏ
- Exclude node_modules

## 📞 Cần trợ giúp?

1. Đọc [README.md](./README.md) đầy đủ
2. Xem [example.js](./example.js) 
3. Chạy `gbu-a11y --help`

---

**Chúc bạn coding vui vẻ! 🎉**