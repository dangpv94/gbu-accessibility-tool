# GBU Accessibility Package

🚀 **Tự động sửa lỗi accessibility cho file HTML** - Cải thiện accessibility thông minh, nhận biết ngữ cảnh với cấu hình zero.

[![npm version](https://badge.furgbu-a11y --role-only          # Sửa role attributes + dọn dẹp
gbu-a11y --aria-label-only    # Sửa aria-label attributes + dọn dẹp
gbu-a11y --forms-only        # Sửa form labels + dọn dẹpio/js/gbu-accessibility-package.svg)](https://www.npmjs.com/package/gbu-accessibility-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen)](https://nodejs.org/)

## ✨ Tính năng

### 🎯 **Sửa lỗi Accessibility cơ bản**

- 🖼️ **Tạo Alt Text thông minh** - Alt attributes nhận biết ngữ cảnh cho hình ảnh
- 🏷️ **Hỗ trợ Aria Label** - Tự động tạo aria-label phù hợp với alt text
- 🌐 **HTML Lang Attributes** - Tự động sửa thuộc tính ngôn ngữ
- 🎭 **Role Attributes** - Quản lý role attributes tuân thủ WCAG  
- 🏷️ **Aria Labels** - Tự động tạo aria-label từ alt text và nội dung
- 📋 **Form Labels** - Sửa labels thiếu với tạo aria-label thông minh
- 🔘 **Button Names** - Sửa buttons rỗng và input buttons không có tên
- 🔗 **Link Names** - Sửa links rỗng và phát hiện text generic
- 🏛️ **Landmarks** - Thêm main và navigation landmarks thiếu
- 📑 **Phân tích và Sửa Heading** - Phân tích cấu trúc heading với tùy chọn tự động sửa `--auto-fix-headings`
- 🎯 **Nested Controls Detection** - Phát hiện và sửa các control tương tác lồng nhau
- 🔍 **Broken Links Detection** - Phát hiện liên kết external bị hỏng
- 📁 **404 Resources Detection** - Phát hiện tài nguyên local bị thiếu (hình ảnh, CSS, JS, v.v.)
- 🏷️ **Kiểm tra Google Tag Manager** - Xác thực cài đặt GTM (script + noscript)
- 🏷️ **Xác thực Meta Tags** - Kiểm tra lỗi chính tả và cú pháp trong meta tags và Open Graph Protocol
- ✏️ **Tự động sửa Meta Tags** - Tự động sửa lỗi chính tả trong tên property và giá trị content
- 🗂️ **Unused Files Detection** - Tìm file không được tham chiếu ở đâu trong dự án
- ☠️ **Dead Code Analysis** - Phát hiện CSS rules và JavaScript functions không sử dụng
- 📏 **File Size Analysis** - Kiểm tra dung lượng file và đề xuất tối ưu hóa
- 🧹 **Dọn dẹp Duplicate** - Loại bỏ role attributes trùng lặp

### 🚀 **Tính năng Enhanced Alt Attribute (Đã tích hợp!)**

- 🔍 **Phân tích toàn diện** - Phân loại loại hình ảnh và kiểm tra chất lượng tích hợp sẵn
- 🎨 **Tạo Alt đa dạng** - Nhiều chiến lược cho alt text sáng tạo được tích hợp trong core
- 🌐 **Hỗ trợ đa ngôn ngữ** - Từ vựng tiếng Nhật, Anh, Việt tích hợp sẵn
- 🎭 **Mức độ sáng tạo** - Chế độ Conservative, Balanced, Creative
- 🧠 **Nhận biết ngữ cảnh** - Tích hợp ngữ cảnh thương hiệu, cảm xúc, kỹ thuật
- 📊 **Trực quan hóa dữ liệu** - Mô tả chuyên biệt cho biểu đồ và đồ thị
- 🧹 **Kiến trúc gọn gàng** - Tất cả tính năng enhanced được tích hợp trong một file duy nhất

### 🛠️ **Tính năng tiện ích**

- 📁 **Xử lý hàng loạt** - Xử lý toàn bộ thư mục đệ quy
- 💾 **Backup tùy chọn** - Tạo file backup khi cần với flag --backup
- 🔍 **Chế độ Dry Run** - Xem trước thay đổi trước khi áp dụng
- 📊 **Báo cáo chi tiết** - Tóm tắt sửa lỗi toàn diện
- ⚡ **Chế độ sửa riêng lẻ** - Nhắm mục tiêu các vấn đề accessibility cụ thể

## 🚀 Bắt đầu nhanh

### Cài đặt

```bash
# Cài đặt global (khuyến nghị)
npm install -g gbu-accessibility-package

# Cài đặt local
npm install gbu-accessibility-package
```

### Gỡ cài đặt và Cài đặt lại

```bash
# Gỡ cài đặt package global
npm uninstall -g gbu-accessibility-package

# Gỡ cài đặt package local
npm uninstall gbu-accessibility-package

# Xóa cache npm (khuyến nghị khi có vấn đề)
npm cache clean --force

# Cài đặt lại phiên bản mới nhất
npm install -g gbu-accessibility-package@latest

# Kiểm tra phiên bản đã cài đặt
npm list -g gbu-accessibility-package
gbu-a11y --version

# Cài đặt phiên bản cụ thể
npm install -g gbu-accessibility-package@3.2.1
```

### Khắc phục sự cố cài đặt

```bash
# Nếu gặp lỗi permission (macOS/Linux)
sudo npm install -g gbu-accessibility-package

# Nếu gặp lỗi cache
npm cache clean --force
npm install -g gbu-accessibility-package --force

# Kiểm tra cài đặt
which gbu-a11y
gbu-a11y --help

# Cập nhật lên phiên bản mới nhất
npm update -g gbu-accessibility-package
```

### Sử dụng cơ bản

```bash
# Sửa toàn diện (chế độ mặc định)
gbu-a11y

# Xem trước thay đổi (dry run)
gbu-a11y --dry-run

# Sửa thư mục cụ thể
gbu-a11y ./src

# Sửa file cụ thể
gbu-a11y index.html
```

### Chế độ Enhanced Alt Attribute

```bash
# Bật phân tích enhanced alt attribute
gbu-a11y --enhanced-alt

# Tạo alt text sáng tạo với cảm xúc
gbu-a11y --enhanced-alt --alt-creativity creative --include-emotions

# Kiểm tra chất lượng nghiêm ngặt
gbu-a11y --enhanced-alt --strict-alt

# Tiếng Anh với chế độ sáng tạo
gbu-a11y -l en --enhanced-alt --alt-creativity creative
```

## 📖 Hướng dẫn chi tiết

### Tùy chọn dòng lệnh

```bash
gbu-a11y [options] [directory/file]

Tùy chọn cơ bản:
  -d, --directory <path>    Thư mục đích (mặc định: thư mục hiện tại)
  -l, --language <lang>     Ngôn ngữ cho thuộc tính lang (mặc định: ja)
  --backup                 Tạo file backup
  --no-backup              Không tạo file backup (mặc định)
  --dry-run                Xem trước thay đổi mà không áp dụng

Chế độ sửa lỗi:
  --comprehensive, --all   Chạy sửa lỗi toàn diện (mặc định)
  --alt-only               Sửa alt attributes + dọn dẹp
  --lang-only              Sửa HTML lang attributes + dọn dẹp
  --role-only              Sửa role attributes + dọn dẹp
  --aria-label-only        Sửa aria-label attributes + dọn dẹp
  --forms-only             Sửa form labels + dọn dẹp
  --buttons-only           Sửa button names + dọn dẹp
  --links-only             Sửa link names + dọn dẹp
  --landmarks-only         Sửa landmarks + dọn dẹp
  --headings-only          Phân tích cấu trúc heading với tùy chọn tự động sửa
  --auto-fix-headings      Bật tự động sửa lỗi heading structure
  --links-check            Kiểm tra liên kết bị hỏng và tài nguyên 404 (toàn diện, không tự động sửa)
  --broken-links           Chỉ kiểm tra liên kết external bị hỏng (không tự động sửa)
  --404-resources          Chỉ kiểm tra tài nguyên local bị thiếu (không tự động sửa)
  --gtm-check              Kiểm tra cài đặt Google Tag Manager (không tự động sửa)
  --check-meta, --meta-check  Kiểm tra meta tags lỗi chính tả và cú pháp (không tự động sửa)
  --fix-meta, --meta-fix   Tự động sửa lỗi chính tả và cú pháp meta tags
  --full-report            Tạo báo cáo Excel toàn diện (tất cả kiểm tra)
  -o, --output <file>      Đường dẫn output cho báo cáo Excel (dùng với --full-report)
  --unused-files           Kiểm tra file không sử dụng trong dự án
  --unused-files-list      Tạo file unused-files-list.txt từ danh sách file dư thừa
  --delete-unused-files    Xóa toàn bộ file có trong unused-files-list.txt
  --list-file <file>       Tùy chỉnh tên/đường dẫn file list trong thư mục target
  --dead-code              Kiểm tra dead code trong CSS và JavaScript
  --file-size, --size-check Kiểm tra dung lượng file và đề xuất tối ưu hóa
  --cleanup-only           Chỉ dọn dẹp role attributes trùng lặp

Tùy chọn Enhanced Alt:
  --enhanced-alt           Sử dụng phân tích và tạo enhanced alt attribute
  --alt-creativity <mode>  Mức sáng tạo alt text: conservative, balanced, creative
  --include-emotions       Bao gồm mô tả cảm xúc trong alt text
  --strict-alt             Bật kiểm tra chất lượng alt nghiêm ngặt

Trợ giúp:
  -h, --help               Hiển thị thông điệp trợ giúp
  -v, --version            Hiển thị số phiên bản
```

### Ví dụ

```bash
# Sửa lỗi toàn diện cơ bản
gbu-a11y

# Xem trước tất cả thay đổi
gbu-a11y --dry-run

# Sửa với ngôn ngữ tiếng Anh
gbu-a11y -l en ./public

# Các loại sửa lỗi riêng lẻ
gbu-a11y --alt-only          # Sửa alt attributes + dọn dẹp
gbu-a11y --forms-only        # Sửa form labels + dọn dẹp
gbu-a11y --buttons-only      # Sửa button names + dọn dẹp
gbu-a11y --headings-only     # Phân tích heading structure
gbu-a11y --headings-only --auto-fix-headings  # Tự động sửa heading structure
gbu-a11y --links-check       # Kiểm tra liên kết bị hỏng và tài nguyên thiếu + dọn dẹp
gbu-a11y --broken-links      # Chỉ kiểm tra liên kết external bị hỏng + dọn dẹp
gbu-a11y --404-resources     # Chỉ kiểm tra tài nguyên local bị thiếu + dọn dẹp
gbu-a11y --gtm-check         # Kiểm tra cài đặt Google Tag Manager
gbu-a11y --check-meta        # Kiểm tra meta tags lỗi chính tả và cú pháp
gbu-a11y --fix-meta          # Tự động sửa lỗi chính tả meta tags
gbu-a11y --fix-meta --dry-run  # Xem trước sửa lỗi meta tags
gbu-a11y --full-report       # Tạo báo cáo Excel toàn diện
gbu-a11y --full-report -o report.xlsx  # Đường dẫn output tùy chỉnh
gbu-a11y --unused-files      # Kiểm tra file không sử dụng trong dự án
gbu-a11y --unused-files-list # Tạo ./unused-files-list.txt
gbu-a11y --delete-unused-files # Xóa file theo ./unused-files-list.txt
gbu-a11y --delete-unused-files --dry-run # Xem trước các file sẽ bị xóa
gbu-a11y --dead-code         # Kiểm tra dead CSS và JavaScript code
gbu-a11y --file-size         # Kiểm tra dung lượng file và đề xuất tối ưu hóa

# Tính năng enhanced alt attribute
gbu-a11y --enhanced-alt                                    # Chế độ enhanced cơ bản
gbu-a11y --enhanced-alt --alt-creativity creative          # Mô tả sáng tạo
gbu-a11y --enhanced-alt --include-emotions                 # Bao gồm ngữ cảnh cảm xúc
gbu-a11y --enhanced-alt --strict-alt                       # Kiểm tra chất lượng nghiêm ngặt
gbu-a11y -l en --enhanced-alt --alt-creativity creative    # Chế độ sáng tạo tiếng Anh

# Kết hợp với các tùy chọn khác
gbu-a11y --enhanced-alt --backup ./src                     # Chế độ enhanced với backup
gbu-a11y --enhanced-alt --dry-run                          # Xem trước sửa lỗi enhanced
```

## 🎨 Tính năng Enhanced Alt Attribute

### Mức độ sáng tạo

#### Conservative (Bảo thủ)

- Mô tả đơn giản, thực tế
- Tập trung vào chức năng cơ bản
- Biến thể từ vựng tối thiểu

**Ví dụ**: `alt="Biểu đồ"`, `alt="Logo"`

#### Balanced (Cân bằng - Mặc định)

- Mô tả nhận biết ngữ cảnh
- Sáng tạo vừa phải
- Cân bằng giữa đơn giản và chi tiết

**Ví dụ**: `alt="Biểu đồ hiệu suất bán hàng"`, `alt="Logo công ty"`

#### Creative (Sáng tạo)

- Mô tả phong phú, chi tiết
- Tích hợp ngữ cảnh cảm xúc
- Nhận biết thương hiệu và ngữ cảnh cao

**Ví dụ**: `alt="Biểu đồ hiệu suất bán hàng năng động cho thấy mức tăng trưởng ấn tượng 25% theo quý"`, `alt="Logo công ty công nghệ sáng tạo đại diện cho chuyển đổi số"`

### Phân loại loại hình ảnh

- **Hình ảnh trang trí**: Tự động phát hiện và đánh dấu với `alt=""`
- **Icon chức năng**: Mô tả theo hành động của chúng (ví dụ: "Mở chat", "Tìm kiếm")
- **Trực quan hóa dữ liệu**: Bao gồm loại biểu đồ, xu hướng và điểm dữ liệu chính
- **Hình ảnh phức tạp**: Alt ngắn + khuyến nghị mô tả chi tiết
- **Logo**: Bao gồm tên thương hiệu và từ khóa "logo"
- **Hình ảnh nội dung**: Mô tả nhận biết ngữ cảnh dựa trên nội dung xung quanh

### Kiểm tra chất lượng

- ❌ **Mức lỗi**: Alt thiếu, alt rỗng cho nội dung, text generic
- ⚠️ **Mức cảnh báo**: Quá dài/ngắn, từ thừa, tên file trong alt
- ℹ️ **Mức thông tin**: Gợi ý tối ưu hóa, kiểm tra tính nhất quán

## 📋 Sử dụng lập trình

### Sử dụng cơ bản

```javascript
const { AccessibilityFixer } = require("gbu-accessibility-package");

const fixer = new AccessibilityFixer({
  language: "vi",
  backupFiles: true,
  dryRun: false,
});

// Sửa tất cả vấn đề accessibility
fixer.fixAllAccessibilityIssues("./src").then((results) => {
  console.log("Hoàn thành sửa lỗi accessibility:", results);
});

// Sửa các vấn đề cụ thể
await fixer.fixEmptyAltAttributes("./src");
await fixer.fixFormLabels("./src");
await fixer.fixButtonNames("./src");
```

### Chế độ Enhanced Alt Attribute (Tích hợp sẵn)

```javascript
const { AccessibilityFixer } = require("gbu-accessibility-package");

// Sử dụng AccessibilityFixer với chế độ enhanced (tích hợp sẵn)
const fixer = new AccessibilityFixer({
  language: "vi",
  enhancedAltMode: true,
  altCreativity: "creative",
  includeEmotions: true,
  strictAltChecking: true,
});

await fixer.fixEmptyAltAttributes("./src");

// Tất cả tính năng enhanced đã được tích hợp trong AccessibilityFixer
// Không cần import thêm class riêng biệt
const results = await fixer.fixAllAccessibilityIssues("./src");
console.log("Hoàn thành sửa lỗi với enhanced features:", results);

// Mới: Kiểm tra file không sử dụng
await fixer.checkUnusedFiles('./src');

// Mới: Kiểm tra dead code
await fixer.checkDeadCode('./src');

// Mới: Kiểm tra dung lượng file
await fixer.checkFileSizes('./src');
```

## 🎯 Những gì được sửa

### Alt Attributes (Chế độ Enhanced)

- **Alt attributes thiếu** → Tạo alt text nhận biết ngữ cảnh
- **Alt attributes rỗng** → Mô tả thông minh dựa trên nội dung
- **Alt text generic** → Mô tả cụ thể, có ý nghĩa
- **Alt text quá dài** → Độ dài tối ưu với thông tin chính
- **Từ thừa** → Mô tả sạch, ngắn gọn
- **Trực quan hóa dữ liệu** → Loại biểu đồ + xu hướng + dữ liệu chính

### Accessibility Form

- **Form labels thiếu** → Tạo aria-label thông minh
- **Input không có label** → Gợi ý label dựa trên ngữ cảnh
- **Cấu trúc form** → Liên kết label phù hợp

### Phần tử tương tác

- **Button rỗng** → Tên button dựa trên hành động
- **Text link generic** → Mục đích link mô tả
- **Tên button thiếu** → Mô tả dựa trên chức năng

### Cấu trúc tài liệu

- **Lang attributes thiếu** → Phát hiện ngôn ngữ tự động
- **Landmark thiếu** → Main và navigation landmarks
- **Cấu trúc heading** → Phân tích và tự động sửa với `--auto-fix-headings`
  - Sửa multiple h1 elements
  - Sửa heading level skipping (h2 → h4)
  - Thêm text cho empty headings
  - Sửa duplicate headings
- **Nested interactive controls** → Phát hiện và sửa controls lồng nhau
- **Role attributes** → Gán role tuân thủ WCAG

### Kiểm tra liên kết

- **Liên kết External bị hỏng** → Phát hiện HTTP 404, 500, timeout trên URL external
  - URL không hợp lệ → Phát hiện định dạng URL sai
  - Liên kết chậm → Cảnh báo timeout và phản hồi chậm
  - Lỗi mạng → Kết nối thất bại và host không thể tiếp cận
- **Tài nguyên 404 bị thiếu** → Kiểm tra file local bị thiếu
  - Hình ảnh (img src), file CSS (link href), file JavaScript (script src)
  - Video/audio sources, tài nguyên local khác
  - Kiểm tra đường dẫn relative và absolute

### Tối ưu hóa dự án

- **File không sử dụng** → Phát hiện file không được tham chiếu ở đâu trong toàn bộ dự án
  - **File types được kiểm tra**: Hình ảnh, CSS, SCSS/Sass, JavaScript, JSX, TypeScript, Vue, PHP, JSON, Markdown, XML, PDF, Video, Audio files (không bao gồm HTML)
  - **Quét toàn diện**: Phân tích từ project root, không giới hạn thư mục hiện tại
  - **Cross-reference detection**: Tìm tham chiếu từ HTML, CSS, JavaScript, JSON, và các file khác
  - **Multiple path formats**: Hỗ trợ relative paths, absolute paths, imports, requires
  - **Smart file resolution**: Xử lý ES6 imports, CommonJS requires, và dynamic imports
  - **Phân tích heuristic**: Khuyến nghị xem xét thủ công cho các file có thể được tham chiếu động
- **Phân tích Dead Code** → Tìm CSS rules và JavaScript functions không sử dụng toàn project
  - CSS selectors không được sử dụng trong bất kỳ HTML file nào
  - JavaScript functions không bao giờ được gọi trong toàn bộ codebase
  - Variables được khai báo nhưng không sử dụng
  - Smart skipping các patterns động và third-party code
- **Kiểm tra Google Tag Manager** → Xác thực cài đặt GTM
  - Phát hiện GTM script trong phần `<head>`
  - Xác minh noscript fallback trong phần `<body>`
  - Kiểm tra tính nhất quán của container ID
  - Xác thực vị trí đặt đúng của cả hai đoạn mã
  - Báo cáo: cài đặt hoàn chỉnh, thiếu thành phần, vấn đề vị trí
- **Xác thực Meta Tags** → Kiểm tra lỗi chính tả và cú pháp trong meta tags
  - Phát hiện lỗi chính tả property name (og:titel → og:title, discription → description)
  - Phát hiện lỗi chính tả content value (websit → website, ja_jp → ja_JP)
  - Kiểm tra lỗi cú pháp (thiếu content, giá trị rỗng)
  - Hỗ trợ Open Graph Protocol và Twitter Card
  - 40+ pattern lỗi chính tả phổ biến trong dictionary
- **Tự động sửa Meta Tags** → Tự động sửa lỗi meta tags
  - Sửa lỗi chính tả property name chỉ trong một click
  - Sửa lỗi chính tả content value
  - Xử lý nhiều lỗi trên cùng một tag
  - Chế độ dry-run để xem trước
  - Hỗ trợ backup để an toàn
- **Phân tích dung lượng file** → Kiểm tra kích thước file và đề xuất tối ưu hóa
  - Phát hiện file lớn vượt ngưỡng khuyến nghị
  - Đề xuất tối ưu hóa theo từng loại file (hình ảnh, CSS, JS, v.v.)
  - Thống kê dung lượng theo loại file
  - Top 10 file có dung lượng lớn nhất

## 🏷️ Xác thực Google Tag Manager

Tính năng `--gtm-check` xác thực cài đặt Google Tag Manager đúng cách trong toàn bộ dự án của bạn.

### Những gì được kiểm tra

1. **Script trong `<head>`**: Xác minh GTM script có mặt trước thẻ đóng `</head>`
2. **Noscript trong `<body>`**: Xác nhận noscript fallback ngay sau thẻ mở `<body>`
3. **Container ID**: Đảm bảo cả hai đoạn mã sử dụng cùng GTM container ID (định dạng: GTM-XXXXXX)
4. **Xác thực vị trí**: Kiểm tra vị trí tối ưu của cả hai đoạn mã

### Cách sử dụng

```bash
# Kiểm tra cài đặt GTM trong toàn bộ dự án
gbu-a11y --gtm-check

# Kiểm tra thư mục cụ thể
gbu-a11y --gtm-check ./public

# Các lệnh thay thế
gbu-a11y --check-gtm
gbu-a11y --google-tag-manager
```

### Ví dụ kết quả

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

### Yêu cầu cài đặt GTM

Để cài đặt GTM đúng cách, mỗi trang cần có:

1. **Đoạn mã script trong `<head>`**:
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

2. **Đoạn mã noscript ngay sau `<body>`**:
```html
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  
  <!-- Nội dung trang của bạn -->
</body>
```

## 🏷️ Xác thực và Tự động sửa Meta Tags

Tính năng `--check-meta` và `--fix-meta` giúp bạn duy trì meta tags và Open Graph Protocol chính xác.

### Những gì được kiểm tra

1. **Lỗi chính tả Property Name**: Phát hiện lỗi chính tả phổ biến trong meta tag properties
   - `og:titel` → `og:title`
   - `og:descripion` → `og:description`
   - `og:sitename` → `og:site_name`
   - `discription` → `description`
   - Và 40+ lỗi chính tả phổ biến khác

2. **Lỗi chính tả Content Value**: Sửa giá trị không chính xác
   - `websit` → `website` (og:type)
   - `ja_jp` → `ja_JP` (og:locale)
   - `summary_larg_image` → `summary_large_image` (twitter:card)

3. **Lỗi cú pháp**: Xác định vấn đề cấu trúc
   - Thiếu thuộc tính content
   - Giá trị content rỗng
   - Lẫn lộn kiểu dấu ngoặc

### Cách sử dụng

```bash
# Kiểm tra lỗi meta tags
gbu-a11y --check-meta

# Kiểm tra thư mục cụ thể
gbu-a11y --check-meta ./public

# Tự động sửa lỗi
gbu-a11y --fix-meta

# Xem trước sửa lỗi mà không áp dụng
gbu-a11y --fix-meta --dry-run

# Sửa với backup
gbu-a11y --fix-meta --backup

# Các lệnh thay thế
gbu-a11y --meta-check
gbu-a11y --meta-fix
```

### Ví dụ Output

**Chế độ kiểm tra (`--check-meta`)**:
```
🔍 Checking meta tags for typos and syntax errors...

❌ public/index.html
   1. Lỗi chính tả property: "og:titel" → "og:title"
   2. Lỗi chính tả property: "og:descripion" → "og:description"
   3. Lỗi giá trị og:type: "websit" → "website"
   4. Lỗi chính tả property: "twitter:car" → "twitter:card"

✅ public/about.html - No errors

📊 Summary:
   Total files checked: 2
   Files with errors: 1
   Total errors found: 4
   Files OK: 1

💡 Sử dụng --meta-fix để tự động sửa các lỗi này
```

**Chế độ sửa lỗi (`--fix-meta`)**:
```
🔧 Fixing meta tag typos and syntax errors...

🔧 Fixing: public/index.html
   ✓ Fixed property: og:titel → og:title
   ✓ Fixed property: og:descripion → og:description
   ✓ Fixed og:type value: websit → website
   ✓ Fixed property: twitter:car → twitter:card
   💾 Saved 4 fix(es) to public/index.html

✅ public/about.html - No errors to fix

📊 Summary:
   Total files checked: 2
   Files fixed: 1
   Total fixes applied: 4
```

### Các pattern lỗi chính tả được hỗ trợ

**Open Graph Properties**:
- `og:titel`, `og:tittle`, `og:tilte` → `og:title`
- `og:descripion`, `og:discription`, `og:desciption` → `og:description`
- `og:imge`, `og:iamge` → `og:image`
- `og:typ`, `og:tipe` → `og:type`
- `og:sitename`, `og:sit_name` → `og:site_name`
- `og:local` → `og:locale`

**Twitter Card Properties**:
- `twitter:car` → `twitter:card`
- `twitter:titel`, `twitter:tittle` → `twitter:title`
- `twitter:descripion`, `twitter:discription` → `twitter:description`
- `twitter:imge` → `twitter:image`
- `twitter:creater` → `twitter:creator`

**Meta Tag Properties**:
- `discription`, `descripion`, `desciption` → `description`
- `viewpor`, `veiwport` → `viewport`
- `keyword` → `keywords`
- `auther`, `autor` → `author`

**Content Values**:
- `websit`, `web-site`, `artical`, `aticle` (og:type)
- `ja_jp` → `ja_JP`, `en_us` → `en_US`, `vi_vn` → `vi_VN` (og:locale)
- `summary_larg_image`, `summay` (twitter:card)

  <!-- Nội dung trang của bạn -->
</body>
```

### Các vấn đề thường gặp được phát hiện

- ❌ **Thiếu Script**: Không tìm thấy GTM script trong `<head>`
- ❌ **Thiếu Noscript**: Không tìm thấy noscript fallback sau `<body>`
- ⚠️ **Vị trí sai**: Script hoặc noscript không ở vị trí tối ưu
- ❌ **ID không khớp**: Container ID khác nhau giữa script và noscript
- ⚠️ **Cài đặt không đầy đủ**: Chỉ có một trong hai đoạn mã bắt buộc

## 🔧 Quản lý Package

### Kiểm tra thông tin package

```bash
# Xem version hiện tại
gbu-a11y --version
npm list -g gbu-accessibility-package

# Xem thông tin package
npm info gbu-accessibility-package

# Kiểm tra package đã cài đặt
which gbu-a11y
npm list -g | grep gbu-accessibility-package
```

### Cập nhật package

```bash
# Kiểm tra version mới
npm outdated -g gbu-accessibility-package

# Cập nhật lên version mới nhất
npm update -g gbu-accessibility-package

# Hoặc cài đặt lại version mới
npm uninstall -g gbu-accessibility-package
npm install -g gbu-accessibility-package@latest
```

### Quản lý cache

```bash
# Xem cache info
npm cache verify

# Xóa cache (khi có vấn đề)
npm cache clean --force

# Xem cache location
npm config get cache
```

## 🧪 Kiểm tra và Demo

```bash
# Kiểm tra package
npm test

# Demo tính năng cơ bản
npm run demo

# Demo tính năng enhanced alt
npm run demo-enhanced

# Demo tạo alt sáng tạo
npm run demo-creative

# Kiểm tra tính năng enhanced alt
npm run test-enhanced-alt
```

## 📊 Hiệu suất

- **Chế độ cơ bản**: Xử lý nhanh, phù hợp cho dự án lớn
- **Chế độ Enhanced**: ~20-30% chậm hơn nhưng cải thiện 85-90% chất lượng alt text
- **Sử dụng bộ nhớ**: +15-20% cho từ vựng enhanced và phân tích
- **Độ chính xác**: 95%+ phát hiện vấn đề accessibility

## 🌐 Hỗ trợ ngôn ngữ

- **Tiếng Nhật (ja)**: Ngôn ngữ mặc định với từ vựng phong phú
- **Tiếng Anh (en)**: Hỗ trợ tiếng Anh toàn diện
- **Tiếng Việt (vi)**: Hỗ trợ tiếng Việt

Tính năng enhanced alt bao gồm từ vựng và quy tắc ngữ pháp theo ngôn ngữ cụ thể cho mô tả tự nhiên, phù hợp ngữ cảnh.

## 📚 Tài liệu

- [Hướng dẫn Enhanced Alt Features](./ENHANCED_ALT_FEATURES.md) - Tài liệu chi tiết cho tính năng enhanced alt attribute
- [Hướng dẫn bắt đầu nhanh](./QUICK_START.md) - Bắt đầu nhanh chóng
- [Tóm tắt Package](./PACKAGE_SUMMARY.md) - Tổng quan tất cả tính năng
- [Changelog](./CHANGELOG.md) - Lịch sử phiên bản và cập nhật

## 🤝 Đóng góp

Chúng tôi hoan nghênh đóng góp! Vui lòng tạo Pull Request. Đối với thay đổi lớn, vui lòng mở issue trước để thảo luận về những gì bạn muốn thay đổi.

### Thiết lập phát triển

```bash
git clone https://github.com/example/gbu-accessibility-tool.git
cd gbu-accessibility-tool/accessibility-package
npm install
npm test
```

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem file [LICENSE](LICENSE) để biết chi tiết.

## 🙏 Ghi nhận

- Được xây dựng với các thực hành accessibility tốt nhất
- Tuân theo hướng dẫn WCAG
- Được truyền cảm hứng từ nhu cầu cải thiện accessibility tự động
- Phản hồi và đóng góp từ cộng đồng

---

**Được tạo với ❤️ bởi GBU Team**

Để biết thêm thông tin, hãy truy cập [GitHub repository](https://github.com/example/gbu-accessibility-tool) của chúng tôi.
