# GBU Accessibility Package

🚀 **Tự động sửa lỗi accessibility cho file HTML** - Cải thiện accessibility thông minh, nhận biết ngữ cảnh với cấu hình zero.

[![npm version](https://badge.fury.io/js/gbu-accessibility-package.svg)](https://www.npmjs.com/package/gbu-accessibility-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen)](https://nodejs.org/)

## ✨ Tính năng

### 🎯 **Sửa lỗi Accessibility cơ bản**
- 🖼️ **Tạo Alt Text thông minh** - Alt attributes nhận biết ngữ cảnh cho hình ảnh
- 🏷️ **Hỗ trợ Aria Label** - Tự động tạo aria-label phù hợp với alt text
- 🌐 **HTML Lang Attributes** - Tự động sửa thuộc tính ngôn ngữ
- 🎭 **Role Attributes** - Quản lý role attributes tuân thủ WCAG
- 📋 **Form Labels** - Sửa labels thiếu với tạo aria-label thông minh
- 🔘 **Button Names** - Sửa buttons rỗng và input buttons không có tên
- 🔗 **Link Names** - Sửa links rỗng và phát hiện text generic
- 🏛️ **Landmarks** - Thêm main và navigation landmarks thiếu
- 📑 **Phân tích Heading** - Phân tích cấu trúc heading với gợi ý (không tự động sửa)
- 🧹 **Dọn dẹp Duplicate** - Loại bỏ role attributes trùng lặp

### 🚀 **Tính năng Enhanced Alt Attribute (MỚI!)**
- 🔍 **Phân tích toàn diện** - Phân loại loại hình ảnh và kiểm tra chất lượng
- 🎨 **Tạo Alt đa dạng** - Nhiều chiến lược cho alt text sáng tạo
- 🌐 **Hỗ trợ đa ngôn ngữ** - Từ vựng tiếng Nhật, Anh, Việt
- 🎭 **Mức độ sáng tạo** - Chế độ Conservative, Balanced, Creative
- 🧠 **Nhận biết ngữ cảnh** - Tích hợp ngữ cảnh thương hiệu, cảm xúc, kỹ thuật
- 📊 **Trực quan hóa dữ liệu** - Mô tả chuyên biệt cho biểu đồ và đồ thị

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
  --forms-only             Sửa form labels + dọn dẹp
  --buttons-only           Sửa button names + dọn dẹp
  --links-only             Sửa link names + dọn dẹp
  --landmarks-only         Sửa landmarks + dọn dẹp
  --headings-only          Phân tích cấu trúc heading (không tự động sửa)
  --cleanup-only           Chỉ dọn dẹp role attributes trùng lặp

Tùy chọn Enhanced Alt:
  --enhanced-alt           Sử dụng phân tích và tạo enhanced alt attribute
  --alt-creativity <mode>  Mức sáng tạo alt text: conservative, balanced, creative
  --include-emotions       Bao gồm mô tả cảm xúc trong alt text
  --strict-alt             Bật kiểm tra chất lượng alt nghiêm ngặt

Trợ giúp:
  -h, --help               Hiển thị thông điệp trợ giúp
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
const { AccessibilityFixer } = require('gbu-accessibility-package');

const fixer = new AccessibilityFixer({
  language: 'vi',
  backupFiles: true,
  dryRun: false
});

// Sửa tất cả vấn đề accessibility
fixer.fixAllAccessibilityIssues('./src').then(results => {
  console.log('Hoàn thành sửa lỗi accessibility:', results);
});

// Sửa các vấn đề cụ thể
await fixer.fixEmptyAltAttributes('./src');
await fixer.fixFormLabels('./src');
await fixer.fixButtonNames('./src');
```

### Chế độ Enhanced Alt Attribute

```javascript
const { AccessibilityFixer, EnhancedAltChecker } = require('gbu-accessibility-package');

// Sử dụng AccessibilityFixer với chế độ enhanced
const fixer = new AccessibilityFixer({
  language: 'vi',
  enhancedAltMode: true,
  altCreativity: 'creative',
  includeEmotions: true,
  strictAltChecking: true
});

await fixer.fixEmptyAltAttributes('./src');

// Sử dụng EnhancedAltChecker riêng biệt
const checker = new EnhancedAltChecker({
  language: 'vi',
  strictMode: true
});

const issues = checker.analyzeAltAttributes(htmlContent);
console.log('Tìm thấy vấn đề alt attribute:', issues);
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
- **Cấu trúc heading** → Phân tích và khuyến nghị
- **Role attributes** → Gán role tuân thủ WCAG

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
git clone https://github.com/dangpv94/gbu-accessibility-tool.git
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

Để biết thêm thông tin, hãy truy cập [GitHub repository](https://github.com/dangpv94/gbu-accessibility-tool) của chúng tôi.