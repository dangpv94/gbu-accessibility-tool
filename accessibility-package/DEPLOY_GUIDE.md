# 🚀 Deploy Guide - NPM Publishing

Hướng dẫn deploy `gbu-accessibility-package` lên NPM.

## 📋 Pre-deployment Checklist

### 1. Kiểm tra package
```bash
cd accessibility-package

# Kiểm tra package structure
npm pack --dry-run

# Test package locally
npm test
npm run demo
```

### 2. Kiểm tra dependencies
```bash
# Cài đặt dependencies
npm install

# Kiểm tra vulnerabilities
npm audit
npm audit fix
```

### 3. Test CLI
```bash
# Test CLI commands
node cli.js --help
node cli.js --dry-run demo
```

## 🔐 NPM Setup

### 1. Tạo NPM account
- Đăng ký tại: https://www.npmjs.com/signup
- Verify email

### 2. Login NPM CLI
```bash
npm login
# Nhập username, password, email
```

### 3. Kiểm tra login
```bash
npm whoami
```

## 📦 Publishing Process

### 1. Kiểm tra package name availability
```bash
npm view gbu-accessibility-package
# Nếu trả về 404 = tên available
```

### 2. Version management
```bash
# Bump version (nếu cần)
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0  
npm version major   # 1.0.0 -> 2.0.0
```

### 3. Publish to NPM
```bash
# Dry run first
npm publish --dry-run

# Actual publish
npm publish
```

### 4. Verify publication
```bash
# Check on NPM
npm view gbu-accessibility-package

# Test installation
npm install -g gbu-accessibility-package
gbu-a11y --help
```

## 🔄 Update Process

### 1. Make changes
- Update code
- Update documentation
- Test thoroughly

### 2. Update version
```bash
npm version patch
```

### 3. Publish update
```bash
npm publish
```

## 📊 Post-deployment

### 1. Test installation
```bash
# Test global install
npm install -g gbu-accessibility-package
gbu-a11y --version

# Test local install
mkdir test-project
cd test-project
npm init -y
npm install gbu-accessibility-package
```

### 2. Test usage
```bash
# Create test HTML
echo '<html><img src="test.jpg"></html>' > test.html

# Run tool
gbu-a11y --dry-run .
```

### 3. Update documentation
- Update README with NPM install instructions
- Add badges
- Update examples

## 🛠️ Maintenance

### Regular updates
```bash
# Check outdated dependencies
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
```

### Version strategy
- **Patch** (1.0.x): Bug fixes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

## 🚨 Troubleshooting

### "Package name already exists"
- Choose different name
- Or contact current owner

### "Permission denied"
- Check npm login: `npm whoami`
- Re-login: `npm login`

### "Validation failed"
- Check package.json syntax
- Ensure all required fields present

### "Files not included"
- Check .npmignore
- Update "files" array in package.json

## 📝 Example Commands

```bash
# Complete deployment flow
cd accessibility-package
npm install
npm test
npm run demo
npm version patch
npm publish

# Verify
npm view gbu-accessibility-package
npm install -g gbu-accessibility-package
gbu-a11y --help
```

## 🎯 Success Criteria

✅ Package published successfully  
✅ Can install globally: `npm install -g gbu-accessibility-package`  
✅ Can install locally: `npm install gbu-accessibility-package`  
✅ CLI works: `gbu-a11y --help`  
✅ Module works: `require('gbu-accessibility-package')`  
✅ Documentation accessible on npmjs.com  

## 🔗 Useful Links

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [NPM CLI Documentation](https://docs.npmjs.com/cli/v8)

---

**Ready to publish! 🚀**