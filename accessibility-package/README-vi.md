# GBU Accessibility Package

🚀 **Công cụ tự động sửa lỗi accessibility cho file HTML** - Cải thiện khả năng tiếp cận thông minh, nhận biết ngữ cảnh mà không cần cấu hình.

[![npm version](https://badge.fury.io/js/gbu-accessibility-package.svg)](https://www.npmjs.com/package/gbu-accessibility-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen)](https://nodejs.org/)

## ✨ Tính năng

- 🖼️ **Tạo Alt Text thông minh** - Tự động tạo alt attributes dựa trên ngữ cảnh
- 🏷️ **Hỗ trợ Aria Label** - Tự động thêm aria-label khớp với alt text
- 🌐 **HTML Lang Attributes** - Tự động sửa thuộc tính ngôn ngữ
- 🎭 **Role Attributes** - Quản lý role attributes tuân thủ WCAG
- 📋 **Form Labels** - Sửa lỗi label thiếu cho form inputs
- 🔘 **Button Names** - Sửa button rỗng và input button thiếu tên
- 🔗 **Link Names** - Sửa link rỗng và text link chung chung
- 🏛️ **Landmarks** - Thêm main và navigation landmarks
- 📑 **Phân tích Headings** - Phân tích cấu trúc heading với đề xuất
- 🧹 **Dọn dẹp trùng lặp** - Xóa role attributes trùng lặp
- 📁 **Xử lý hàng loạt** - Xử lý toàn bộ thư mục đệ quy
- 💾 **Backup tùy chọn** - Tạo file backup khi cần với flag --backup
- 🔍 **Chế độ xem trước** - Xem trước thay đổi trước khi áp dụng
- 📊 **Báo cáo chi tiết** - Tóm tắt sửa chữa toàn diện

## 🚀 Bắt đầu nhanh

### Cài đặt

```bash
# Cài đặt toàn cục (khuyến nghị)
npm install -g gbu-accessibility-package

# Cài đặt cục bộ
npm install gbu-accessibility-package
```

### Sử dụng cơ bản

```bash
# Sửa toàn diện (mặc định)
gbu-a11y

# Xem trước thay đổi
gbu-a11y --dry-run

# Sửa thư mục cụ thể
gbu-a11y ./src

# Sửa file cụ thể
gbu-a11y index.html
```

## 📖 Hướng dẫn chi tiết

### Tùy chọn dòng lệnh

```bash
gbu-a11y [options] [directory/file]

Tùy chọn:
  -d, --directory <path>    Thư mục đích (mặc định: thư mục hiện tại)
  -l, --language <lang>     Ngôn ngữ cho thuộc tính lang (mặc định: ja)
  --backup                 Tạo file backup
  --no-backup              Không tạo file backup (mặc định)
  --dry-run                Xem trước thay đổi mà không áp dụng
  --comprehensive, --all   Chạy sửa toàn diện (giống mặc định)
  --cleanup-only           Chỉ dọn dẹp role attributes trùng lặp
  --alt-only               Sửa alt attributes + dọn dẹp
  --lang-only              Sửa HTML lang attributes + dọn dẹp
  --role-only              Sửa role attributes + dọn dẹp
  --forms-only             Sửa form labels + dọn dẹp
  --buttons-only           Sửa button names + dọn dẹp
  --links-only             Sửa link names + dọn dẹp
  --landmarks-only         Sửa landmarks + dọn dẹp
  --headings-only          Phân tích cấu trúc heading (không tự động sửa)
  -h, --help               Hiển thị thông báo trợ giúp
```

### Ví dụ

```bash
# Sửa toàn diện (mặc định - bao gồm dọn dẹp)
gbu-a11y

# Xem trước tất cả thay đổi
gbu-a11y --dry-run

# Sửa với ngôn ngữ tiếng Anh
gbu-a11y -l en ./public

# Các loại sửa riêng lẻ (tất cả đều bao gồm dọn dẹp)
gbu-a11y --alt-only          # Sửa alt attributes + dọn dẹp
gbu-a11y --forms-only        # Sửa form labels + dọn dẹp
gbu-a11y --buttons-only      # Sửa button names + dọn dẹp
gbu-a11y --links-only        # Sửa link names + dọn dẹp
gbu-a11y --landmarks-only    # Sửa landmarks + dọn dẹp
gbu-a11y --headings-only     # Phân tích heading structure
gbu-a11y --cleanup-only      # Chỉ dọn dẹp trùng lặp

# Kết hợp với các tùy chọn khác
gbu-a11y --alt-only --dry-run ./src    # Xem trước sửa alt
gbu-a11y --forms-only -l en ./public   # Sửa form với tiếng Anh

# Tùy chọn backup
gbu-a11y --backup ./dist             # Bật backup để an toàn
gbu-a11y --no-backup ./dist          # Tắt backup (mặc định - xử lý nhanh hơn)
```

## 🔧 Sử dụng lập trình

```javascript
const AccessibilityFixer = require("gbu-accessibility-package");

const fixer = new AccessibilityFixer({
  language: "vi",
  backupFiles: true,
  dryRun: false,
});

// Sửa tất cả vấn đề accessibility
async function fixAccessibility() {
  try {
    const results = await fixer.fixAllAccessibilityIssues("./src");
    console.log("File đã sửa:", results);
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

fixAccessibility();
```

## 🎯 Chế độ sửa

### Chế độ toàn diện (Mặc định)

Chạy tất cả các bước sửa bao gồm dọn dẹp:

1. **HTML lang attributes** - Thêm thuộc tính ngôn ngữ
2. **Alt attributes** - Tạo alt text thông minh + aria-label
3. **Role attributes** - Thêm role phù hợp + xử lý picture/img
4. **Form labels** - Sửa input thiếu label
5. **Button names** - Sửa button rỗng
6. **Link names** - Sửa link rỗng và generic text
7. **Landmarks** - Thêm main và navigation landmarks
8. **Heading analysis** - Phân tích cấu trúc (chỉ đề xuất)
9. **Cleanup** - Dọn dẹp role attributes trùng lặp

### Chế độ riêng lẻ

Mỗi chế độ riêng lẻ đều bao gồm bước dọn dẹp:

- `--alt-only` - Chỉ sửa alt attributes + dọn dẹp
- `--forms-only` - Chỉ sửa form labels + dọn dẹp
- `--buttons-only` - Chỉ sửa button names + dọn dẹp
- `--links-only` - Chỉ sửa link names + dọn dẹp
- `--landmarks-only` - Chỉ sửa landmarks + dọn dẹp
- `--headings-only` - Chỉ phân tích headings (không dọn dẹp)

## 🔧 Những gì được sửa

### 1. Alt Attributes

- **Alt attributes thiếu** → Thêm alt text theo ngữ cảnh
- **Alt attributes rỗng** → Tạo mô tả có ý nghĩa
- **Tạo theo ngữ cảnh** → Sử dụng text xung quanh, tiêu đề, chú thích

```html
<!-- Trước -->
<img src="logo.png" />
<img src="chart.jpg" alt="" />

<!-- Sau -->
<img src="logo.png" alt="ロゴ" role="img" aria-label="ロゴ" />
<img src="chart.jpg" alt="グラフ" role="img" aria-label="グラフ" />
```

### 2. HTML Lang Attributes

- **Lang attributes thiếu** → Thêm ngôn ngữ được chỉ định
- **Lang attributes rỗng** → Đặt mã ngôn ngữ phù hợp

```html
<!-- Trước -->
<html>
  <html lang="">
    <!-- Sau -->
    <html lang="ja">
      <html lang="ja"></html>
    </html>
  </html>
</html>
```

### 3. Role Attributes & Aria Labels

- **Images** → `role="img"` + `aria-label` (khớp với alt text)
- **Picture elements** → Di chuyển `role="img"` từ `<picture>` vào `<img>` bên trong
- **Links** → `role="link"`
- **Clickable elements** → `role="button"`
- **Navigation lists** → `role="menubar"`
- **Menu items** → `role="menuitem"`

```html
<!-- Trước -->
<img src="icon.png" alt="Icon" />
<picture role="img">
  <img src="photo.jpg" alt="Photo" />
</picture>
<a href="/home">Home</a>
<div class="btn-click">Click me</div>

<!-- Sau -->
<img src="icon.png" alt="Icon" role="img" aria-label="Icon" />
<picture>
  <img src="photo.jpg" alt="Photo" role="img" aria-label="Photo" />
</picture>
<a href="/home" role="link">Home</a>
<div class="btn-click" role="button">Click me</div>
```

### 4. Form Labels

- **Input thiếu label** → Thêm `aria-label` phù hợp
- **Hỗ trợ nhiều loại input** → text, email, password, tel, etc.

```html
<!-- Trước -->
<input type="text" placeholder="Name" />
<input type="email" />
<input type="password" />

<!-- Sau -->
<input type="text" placeholder="Name" aria-label="テキスト入力" />
<input type="email" aria-label="メールアドレス" />
<input type="password" aria-label="パスワード" />
```

### 5. Button Names

- **Button rỗng** → Thêm text và aria-label
- **Input button thiếu value** → Thêm value phù hợp

```html
<!-- Trước -->
<button></button>
<input type="submit" />
<input type="button" />

<!-- Sau -->
<button aria-label="ボタン">ボタン</button>
<input type="submit" value="送信" />
<input type="button" value="ボタン" />
```

### 6. Link Names

- **Link rỗng** → Thêm aria-label
- **Generic text** → Phát hiện "Click here", "Read more"
- **Image links** → Xử lý link chỉ chứa hình ảnh

```html
<!-- Trước -->
<a href="/home"></a>
<a href="/more">Click here</a>
<a href="/image"><img src="icon.png" /></a>

<!-- Sau -->
<a href="/home" aria-label="リンク">リンク</a>
<a href="/more">Click here</a>
<!-- Được phát hiện nhưng không tự động sửa -->
<a href="/image" aria-label="画像リンク"><img src="icon.png" /></a>
```

### 7. Landmarks

- **Main landmark thiếu** → Thêm `role="main"`
- **Navigation landmark thiếu** → Thêm `role="navigation"`

```html
<!-- Trước -->
<div class="content">
  <p>Main content</p>
</div>
<ul class="navigation">
  <li><a href="/home">Home</a></li>
</ul>

<!-- Sau -->
<div class="content" role="main">
  <p>Main content</p>
</div>
<ul class="navigation" role="navigation">
  <li><a href="/home">Home</a></li>
</ul>
```

### 8. Heading Analysis

- **Multiple h1** → Phát hiện và đề xuất
- **Heading level skip** → Phát hiện nhảy cấp (h1 → h3)
- **Empty headings** → Phát hiện heading rỗng
- **Chỉ phân tích, không tự động sửa** → An toàn cho cấu trúc nội dung

### 9. Aria Label Enhancement

- **Tự động aria-label** → Thêm `aria-label` khớp với `alt` text cho images
- **Bảo tồn hiện có** → Không ghi đè `aria-label` đã có
- **Phát hiện thông minh** → Chỉ thêm khi `alt` text tồn tại và không rỗng

### 10. Dọn dẹp trùng lặp

- **Xóa role attributes trùng lặp** → Giữ lại occurrence đầu tiên
- **Xử lý mixed quotes** → role="button" role='button'

```html
<!-- Trước -->
<img src="test.jpg" role="img" role="img" alt="Test" />

<!-- Sau -->
<img src="test.jpg" role="img" alt="Test" />
```

## 🌟 Tạo Alt Text thông minh

Package sử dụng phân tích ngữ cảnh thông minh để tạo alt text có ý nghĩa:

### Nguồn ngữ cảnh

1. **Title attributes**
2. **Aria-label attributes**
3. **Definition terms (dt elements)**
4. **Parent link text**
5. **Nearby headings**
6. **Figure captions**
7. **Surrounding text content**

### Mẫu dự phòng

- `logo.png` → "ロゴ" (Logo)
- `icon.svg` → "アイコン" (Icon)
- `banner.jpg` → "バナー" (Banner)
- `chart.png` → "グラフ" (Chart)
- Hình ảnh chung → "画像" (Image)

## 📊 Ví dụ đầu ra

### Chế độ toàn diện

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

### Chế độ riêng lẻ

```
🚀 Starting Accessibility Fixer...
📋 Running form label fixes + cleanup...

📁 contact.html:
  📋 Missing label/id: Input 1 (type: text) needs an id and label, or aria-label
  📋 Missing label: Input 2 (type: email) needs a label or aria-label
  📋 Added aria-label="テキスト入力" to text input
  📋 Added aria-label="メールアドレス" to email input

✅ Fixed form labels in 1 files (2 issues)

🧹 Running cleanup for duplicate role attributes...
✅ Cleaned duplicate roles in 0 files

🎉 Form label fixes + cleanup completed successfully!
   📁 Backup files created with .backup extension
   💡 Use --no-backup to disable backups in future runs
```

## 🔒 Tính năng an toàn

### Tùy chọn Backup

- **Hành vi mặc định**: Không tạo backup files để xử lý nhanh hơn
- **Bật backup**: Sử dụng `--backup` để an toàn khi cần
- **Tắt rõ ràng**: Sử dụng `--no-backup` để rõ ràng (giống mặc định)

```bash
# Chế độ nhanh (mặc định) - không backup
gbu-a11y --comprehensive

# Chế độ an toàn - tạo backup
gbu-a11y --backup --comprehensive

# Chế độ không backup rõ ràng (giống mặc định)
gbu-a11y --no-backup --comprehensive
```

### Các tính năng an toàn khác

- **Chế độ xem trước** để xem trước an toàn với `--dry-run`
- **Không phá hoại** - chỉ thêm attributes thiếu
- **Ngăn chặn trùng lặp** - không thêm attributes đã có
- **Xử lý lỗi** - tiếp tục xử lý khi có lỗi file riêng lẻ

## 🔧 Quản lý Package

### Gỡ cài đặt và Cài đặt lại

Nếu bạn gặp vấn đề hoặc muốn cập nhật lên phiên bản mới nhất:

```bash
# Gỡ cài đặt package global
npm uninstall -g gbu-accessibility-package

# Xóa npm cache
npm cache clean --force

# Cài đặt lại phiên bản mới nhất
npm install -g gbu-accessibility-package@latest

# Kiểm tra cài đặt
gbu-a11y --version
gbu-a11y --help
```

### Quản lý dự án cục bộ

```bash
# Xóa khỏi dự án cục bộ
npm uninstall gbu-accessibility-package

# Xóa package-lock và node_modules
rm -rf node_modules package-lock.json

# Cài đặt lại dependencies
npm install

# Thêm phiên bản mới nhất
npm install gbu-accessibility-package@latest
```

### Xóa file Backup

```bash
# Xóa tất cả file backup trong thư mục hiện tại
find . -name "*.backup" -type f -delete

# Xóa file backup trong thư mục cụ thể
find ./src -name "*.backup" -type f -delete

# Sử dụng npm script (nếu đã cấu hình)
npm run cleanup-backups
```

### Khắc phục sự cố cài đặt

```bash
# Kiểm tra cấu hình npm
npm config list

# Reset npm registry (nếu cần)
npm config set registry https://registry.npmjs.org/

# Kiểm tra global packages
npm list -g --depth=0

# Sửa quyền (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Thay thế: Sử dụng npx mà không cài global
npx gbu-accessibility-package --help
```

### Quản lý phiên bản

```bash
# Kiểm tra phiên bản hiện tại
gbu-a11y --version

# Kiểm tra các phiên bản có sẵn
npm view gbu-accessibility-package versions --json

# Cài đặt phiên bản cụ thể
npm install -g gbu-accessibility-package@2.0.0

# Cập nhật lên mới nhất
npm update -g gbu-accessibility-package
```

## 🛠️ Cấu hình

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

### Tích hợp CI/CD

```yaml
# Ví dụ GitHub Actions
- name: Check Accessibility
  run: npx gbu-accessibility-package --dry-run

- name: Fix Accessibility Issues
  run: npx gbu-accessibility-package --comprehensive
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## 📝 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem file [LICENSE](LICENSE) để biết chi tiết.

## 🔧 Khắc phục sự cố

### Các vấn đề thường gặp và giải pháp

#### Package không tìm thấy hoặc lệnh không hoạt động

```bash
# Kiểm tra package đã cài global chưa
npm list -g gbu-accessibility-package

# Nếu không tìm thấy, cài đặt global
npm install -g gbu-accessibility-package

# Kiểm tra PATH có chứa npm global bin không
echo $PATH | grep npm

# Thêm npm global bin vào PATH (nếu cần)
export PATH=$PATH:$(npm config get prefix)/bin
```

#### Lỗi quyền truy cập

```bash
# macOS/Linux: Sửa quyền npm
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) $(npm config get prefix)

# Thay thế: Sử dụng npx
npx gbu-accessibility-package --help

# Windows: Chạy với quyền Administrator hoặc dùng npx
```

#### Package không hoạt động sau khi cập nhật

```bash
# Cài đặt lại hoàn toàn
npm uninstall -g gbu-accessibility-package
npm cache clean --force
npm install -g gbu-accessibility-package@latest

# Kiểm tra cài đặt
gbu-a11y --version
which gbu-a11y
```

#### File không được xử lý

```bash
# Kiểm tra phần mở rộng file (chỉ hỗ trợ .html)
ls -la *.html

# Kiểm tra quyền file
ls -la your-file.html

# Chạy với output chi tiết
gbu-a11y --dry-run your-file.html
```

#### File backup tích tụ quá nhiều

```bash
# Xóa tất cả file backup
find . -name "*.backup" -type f -delete

# Ngăn tạo backup
gbu-a11y --no-backup

# Cấu hình script cleanup
echo 'alias cleanup-backups="find . -name \"*.backup\" -type f -delete"' >> ~/.bashrc
```

#### Vấn đề hiệu suất

```bash
# Sử dụng --no-backup để xử lý nhanh hơn
gbu-a11y --no-backup

# Xử lý thư mục cụ thể thay vì toàn bộ dự án
gbu-a11y ./src

# Sử dụng individual modes cho sửa chữa có mục tiêu
gbu-a11y --alt-only ./images
```

#### Vấn đề phiên bản Node.js

```bash
# Kiểm tra phiên bản Node.js (yêu cầu >=12.0.0)
node --version

# Cập nhật Node.js nếu cần
# Truy cập: https://nodejs.org/

# Sử dụng nvm để quản lý phiên bản Node.js
nvm install 18
nvm use 18
```

### Nhận trợ giúp

Nếu bạn vẫn gặp vấn đề:

1. **Kiểm tra phiên bản**: `gbu-a11y --version`
2. **Thử dry run trước**: `gbu-a11y --dry-run`
3. **Kiểm tra quyền file**: `ls -la your-files.html`
4. **Xóa cache và cài lại**: Xem phần quản lý package ở trên
5. **Sử dụng npx thay thế**: `npx gbu-accessibility-package --help`

## 🆘 Hỗ trợ

- 📧 **Issues**: [GitHub Issues](https://github.com/dangpv94/gbu-accessibility-tool/issues)
- 📖 **Tài liệu**: [GitHub Wiki](https://github.com/dangpv94/gbu-accessibility-tool/wiki)
- 💬 **Thảo luận**: [GitHub Discussions](https://github.com/dangpv94/gbu-accessibility-tool/discussions)

## 🏆 Tại sao chọn GBU Accessibility Package?

- ✅ **Không cần cấu hình** - Hoạt động ngay lập tức
- ✅ **Thông minh & nhận biết ngữ cảnh** - Không chỉ sửa chung chung
- ✅ **An toàn & đáng tin cậy** - Backup tự động và xem trước
- ✅ **Toàn diện** - Bao gồm tất cả vấn đề accessibility chính
- ✅ **Nhanh & hiệu quả** - Xử lý hàng loạt với báo cáo chi tiết
- ✅ **Tuân thủ WCAG** - Theo tiêu chuẩn accessibility
- ✅ **Hỗ trợ axe DevTools** - Sửa các lỗi phổ biến từ axe
- ✅ **Phân tích heading an toàn** - Đề xuất thay vì tự động sửa
- ✅ **Hỗ trợ đa ngôn ngữ** - Tiếng Nhật, tiếng Anh và có thể mở rộng

## 📋 Danh sách kiểm tra Accessibility

Package này giải quyết các vấn đề accessibility phổ biến từ axe DevTools:

### ✅ Đã hỗ trợ

- `image-alt` - Images must have alternate text
- `html-has-lang` - HTML element must have lang attribute
- `label` - Form elements must have labels (cơ bản)
- `button-name` - Buttons must have discernible text
- `link-name` - Links must have discernible text (cơ bản)
- `landmark-one-main` - Document should have one main landmark
- `region` - Page content should be contained by landmarks
- `heading-order` - Heading levels analysis (chỉ phân tích)
- Duplicate role attributes cleanup

### 🔄 Đang phát triển

- `color-contrast` - Color contrast checking
- `focus-order-semantics` - Focus order validation
- `aria-*` attributes validation
- Table accessibility features
- List structure validation

---

Được tạo với ❤️ bởi GBU Team
