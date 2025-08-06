# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.6.0] - 2025-01-08

### Added
- **Advanced Heading Structure Rules**: Enhanced heading structure validation with strict rules
  - Only one `<h1>` element per page (converts extra h1 to h2)
  - Proper heading hierarchy without level skipping (h2 → h3 → h4...)
  - No duplicate headings in the same section/block
  - Automatic empty heading text generation based on context
- **Section-Aware Duplicate Detection**: Detects duplicate headings within the same section context
- **Context-Based Text Generation**: Generates meaningful text for empty headings using surrounding content
- **Comprehensive Heading Analysis**: Detailed analysis of heading structure issues with specific suggestions

### Enhanced
- **Heading Auto-Fix Logic**: More intelligent heading level corrections
- **Section Context Detection**: Better detection of section boundaries for duplicate checking
- **Error Reporting**: More detailed heading issue descriptions and suggestions

### Fixed
- **Heading Level Skipping**: Automatic correction of improper heading hierarchies
- **Multiple H1 Elements**: Converts extra h1 elements to appropriate levels
- **Empty Headings**: Fills empty headings with contextually relevant text
- **Duplicate Headings**: Makes duplicate headings unique within sections

## [3.5.0] - 2025-01-08

### Added
- **Enhanced Heading Structure Auto-Fix**: Automatic fixing of heading hierarchy issues with `--auto-fix-headings` option
- **Improved Nested Controls Detection**: Better detection and fixing of nested interactive controls
- **Advanced Test Cases**: New comprehensive test files for heading structure and nested controls
- **Enhanced Alt Text Quality**: Improved context-aware alt text generation with better vocabulary support

### Enhanced
- **Heading Analysis**: More comprehensive detection of heading issues including empty headings, level skipping, and duplicates
- **Interactive Controls**: Better handling of complex nested control scenarios
- **Test Coverage**: Expanded demo files for better testing and validation
- **Performance**: Optimized processing for large files and complex HTML structures

### Fixed
- **Heading Level Corrections**: Automatic correction of improper heading hierarchies
- **Empty Heading Detection**: Better identification and handling of empty headings
- **Control Nesting Issues**: Improved resolution of nested interactive control conflicts

## [3.2.0] - 2024-07-28

### Added
- **Enhanced Alt Attribute Integration**: Tích hợp hoàn toàn EnhancedAltChecker và EnhancedAltGenerator vào AccessibilityFixer
- **Broken Links Detection**: Tính năng phát hiện liên kết bị hỏng và tài nguyên 404
- **Clean Architecture**: Tất cả tính năng enhanced được tích hợp trong một file duy nhất
- **Improved Performance**: Giảm overhead từ việc import nhiều module riêng biệt
- **Simplified API**: Không cần import các class enhanced riêng biệt

### Changed
- **BREAKING**: EnhancedAltChecker và EnhancedAltGenerator không còn là class riêng biệt
- **Integrated Features**: Tất cả tính năng enhanced alt đã được tích hợp vào AccessibilityFixer
- **Cleaner Codebase**: Loại bỏ các file enhanced riêng lẻ để có kiến trúc gọn gàng hơn
- **Updated Documentation**: README và README-vi được cập nhật để phản ánh kiến trúc mới

### Migration Guide
- **For most users**: Không cần thay đổi gì - tất cả tính năng vẫn hoạt động như cũ
- **For programmatic usage**: Chỉ cần import AccessibilityFixer, không cần import EnhancedAltChecker/Generator riêng
- **Enhanced features**: Vẫn có sẵn thông qua các config options trong AccessibilityFixer

## [3.1.0] - 2024-07-25

### Changed
- **BREAKING**: Default behavior now **no backup files** for faster processing
- **Backup is now optional**: Use `--backup` flag when you need backup files
- **Performance improvement**: Faster processing by default without backup creation
- **CLI help updated**: Reflects new default behavior
- **Documentation updated**: README and README-vi updated with new backup behavior

### Migration Guide
- **No action needed for most users** - you get faster processing by default
- **If you want backup files**: Add `--backup` flag to your commands
- **Old behavior**: `gbu-a11y` (created backups) → **New behavior**: `gbu-a11y --backup`
- **Scripts using --no-backup**: Can remove the flag (now default behavior)

## [3.0.0] - 2024-07-25

### Added
- **Form Labels**: Automatic fixing of missing form labels with intelligent aria-label generation
- **Button Names**: Fix empty buttons and input buttons without names
- **Link Names**: Fix empty links and detect generic link text
- **Landmarks**: Add missing main and navigation landmarks
- **Heading Analysis**: Analyze heading structure with suggestions (no auto-fix for safety)
- **Individual Fix Modes**: New CLI options for targeted fixes:
  - `--forms-only` - Fix form labels + cleanup
  - `--buttons-only` - Fix button names + cleanup
  - `--links-only` - Fix link names + cleanup
  - `--landmarks-only` - Fix landmarks + cleanup
  - `--headings-only` - Analyze heading structure only
- **Comprehensive Mode**: Now includes 9 steps of accessibility fixes
- **Language Support**: Japanese labels for form inputs and buttons
- **axe DevTools Coverage**: Addresses major axe accessibility issues
- **Advanced Demo**: New `advanced-test.html` showcasing all features

### Changed
- **BREAKING**: Comprehensive fixes now default mode (was basic fixes)
- **All individual modes** now include cleanup step for consistency
- **Enhanced CLI**: Better help messages and examples
- **Improved Reporting**: More detailed issue analysis and suggestions

### Enhanced
- **Alt Text Generation**: Now also adds matching aria-label attributes
- **Role Attributes**: Enhanced picture/img handling
- **Context Analysis**: Improved smart text generation
- **Error Handling**: Better error messages and recovery

## [2.1.0] - 2024-07-24

### Added
- **Backup Management**: Improved backup options with `--backup` and `--no-backup`
- **Consistent Messaging**: Unified completion messages across all modes
- **Cleanup Scripts**: npm script for removing backup files

### Changed
- **Default Behavior**: Comprehensive fixes as default mode
- **Backup Notifications**: Clear messaging about backup status

## [2.0.0] - 2024-07-24

### Added
- **Comprehensive Mode**: All fixes including cleanup as default
- **Basic Mode**: `--basic` flag for fixes without cleanup

### Changed
- **BREAKING**: Default mode now runs comprehensive fixes
- **CLI Behavior**: Simplified command structure

## [1.6.0] - 2024-07-24

### Added
- **Backup Options**: Explicit `--backup` and `--no-backup` flags
- **Helper Functions**: Consistent completion messaging
- **Safety Features**: Enhanced backup management

## [1.5.0] - 2024-07-24

### Added
- **Aria Label Support**: Automatic aria-label generation matching alt text
- **Picture Handling**: Move role from `<picture>` to `<img>` elements
- **Enhanced Reporting**: Comprehensive issue analysis

## [1.4.0] - 2024-07-24

### Added
- **Individual Fix Options**: Separate modes for different fix types
- **Enhanced CLI**: More granular control over fixes

## [1.3.0] - 2024-07-24

### Added
- **Individual Fix Modes**: `--alt-only`, `--lang-only`, `--role-only`
- **Enhanced Documentation**: Updated README with new features

## [1.2.0] - 2024-07-24

### Added
- **Role Attributes**: Comprehensive role attribute management
- **Duplicate Cleanup**: Remove duplicate role attributes
- **Context-Aware Alt Text**: Intelligent alt text generation

## [1.1.0] - 2024-07-24

### Added
- **HTML Lang Attributes**: Automatic language attribute fixes
- **Backup System**: Automatic backup file creation

## [1.0.0] - 2024-07-24

### Added
- **Initial Release**: Basic alt attribute fixes
- **CLI Interface**: Command-line tool
- **Dry Run Mode**: Preview changes before applying
- **Batch Processing**: Process multiple files and directories

---

## Migration Guides

### Upgrading to 3.0.0
- **No breaking changes for most users** - you get better default behavior
- **New features available** - try `--forms-only`, `--buttons-only`, etc.
- **Comprehensive mode is now default** - includes all fixes + cleanup
- **Heading analysis is safe** - only provides suggestions, no auto-fixes

### Upgrading to 2.0.0
- **Default behavior changed** - now runs comprehensive fixes by default
- **Use `--basic` flag** if you want the old default behavior
- **All modes now include cleanup** for better consistency

---

For more details about any release, see the [GitHub Releases](https://github.com/dangpv94/gbu-accessibility-tool/releases) page.