# NPM Deployment Guide

Step-by-step guide to deploy GBU Accessibility Package to npm.

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All features working correctly
- [ ] Tests passing (`npm test`)
- [ ] No console errors or warnings
- [ ] Code properly formatted and linted

### ✅ Documentation
- [ ] README.md updated with latest features
- [ ] CHANGELOG.md updated with version changes
- [ ] Package.json description and keywords updated
- [ ] Examples and usage instructions current

### ✅ Version Management
- [ ] Version number updated in package.json
- [ ] Version follows semantic versioning (MAJOR.MINOR.PATCH)
- [ ] Git tags created for releases

### ✅ Package Configuration
- [ ] `files` array includes all necessary files
- [ ] `bin` commands properly configured
- [ ] Dependencies up to date
- [ ] No unnecessary files included

## 🚀 Deployment Steps

### 1. Final Testing
```bash
# Test the package locally
cd accessibility-package
npm test

# Test CLI commands
node cli.js --help
node cli.js --dry-run demo/

# Test comprehensive mode
node cli.js --comprehensive --dry-run demo/advanced-test.html
```

### 2. Version Check
```bash
# Check current version
npm version

# Update version if needed (choose one)
npm version patch  # 3.0.0 -> 3.0.1 (bug fixes)
npm version minor  # 3.0.0 -> 3.1.0 (new features)
npm version major  # 3.0.0 -> 4.0.0 (breaking changes)
```

### 3. Build and Package
```bash
# Clean up any build artifacts
npm run cleanup-backups

# Create package tarball for testing
npm pack

# This creates gbu-accessibility-package-3.0.0.tgz
# Test the packed version
npm install -g ./gbu-accessibility-package-3.0.0.tgz
gbu-a11y --version
gbu-a11y --help
```

### 4. Login to npm
```bash
# Login to npm (you need an npm account)
npm login

# Verify login
npm whoami
```

### 5. Publish to npm
```bash
# Dry run publish (recommended first)
npm publish --dry-run

# If dry run looks good, publish for real
npm publish

# For scoped packages (if needed)
npm publish --access public
```

### 6. Verify Publication
```bash
# Check package on npm
npm view gbu-accessibility-package

# Test installation from npm
npm install -g gbu-accessibility-package@latest
gbu-a11y --version
```

### 7. Post-Deployment
```bash
# Tag the release in git
git tag v3.0.0
git push origin v3.0.0

# Update GitHub release notes
# Go to: https://github.com/example/gbu-accessibility-tool/releases
# Create new release with tag v3.0.0
```

## 📊 Current Package Status

### Package Information
- **Name**: `gbu-accessibility-package`
- **Current Version**: `3.8.0`
- **License**: MIT
- **Node.js**: >=12.0.0

### Key Features for npm
- ✅ **Comprehensive accessibility fixes** (10+ different types)
- ✅ **Individual fix modes** for targeted improvements
- ✅ **Smart context-aware** alt text generation
- ✅ **axe DevTools compatibility** - fixes common issues
- ✅ **Separated link validation** - external links vs local resources
- ✅ **Project optimization** - unused files, dead code, file size analysis
- ✅ **Safe heading analysis** - suggestions only
- ✅ **Multi-language support** - Japanese, English, Vietnamese
- ✅ **Backup safety** - automatic backup creation
- ✅ **CLI and programmatic** usage
- ✅ **Zero configuration** - works out of the box

### npm Scripts Available
```json
{
  "scripts": {
    "start": "node cli.js",
    "fix": "node cli.js", 
    "preview": "node cli.js --dry-run",
    "comprehensive": "node cli.js --comprehensive",
    "alt-only": "node cli.js --alt-only",
    "lang-only": "node cli.js --lang-only",
    "role-only": "node cli.js --role-only",
    "forms-only": "node cli.js --forms-only",
    "buttons-only": "node cli.js --buttons-only",
    "links-only": "node cli.js --links-only",
    "landmarks-only": "node cli.js --landmarks-only",
    "headings-only": "node cli.js --headings-only",
    "links-check": "node cli.js --links-check",
    "broken-links": "node cli.js --broken-links",
    "404-resources": "node cli.js --404-resources",
    "unused-files": "node cli.js --unused-files",
    "dead-code": "node cli.js --dead-code",
    "file-size": "node cli.js --file-size",
    "cleanup-only": "node cli.js --cleanup-only",
    "no-backup": "node cli.js --no-backup",
    "cleanup-backups": "find . -name '*.backup' -type f -delete"
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Package name already exists
```bash
# Check if name is available
npm view gbu-accessibility-package

# If taken, consider:
# - @your-username/gbu-accessibility-package
# - gbu-accessibility-fixer
# - accessibility-package-gbu
```

#### Permission errors
```bash
# Use npm access tokens instead of password
npm token create

# Set registry if needed
npm config set registry https://registry.npmjs.org/
```

#### Version conflicts
```bash
# Check current published version
npm view gbu-accessibility-package version

# Ensure local version is higher
npm version patch --force
```

#### File size too large
```bash
# Check package size
npm pack --dry-run

# Optimize by updating .npmignore
echo "*.backup" >> .npmignore
echo "node_modules/" >> .npmignore
echo ".git/" >> .npmignore
```

## 📈 Post-Deployment Marketing

### npm Package Page
- Ensure README displays properly on npm
- Keywords help with discoverability
- Description is clear and compelling

### GitHub Integration
- Link npm package in GitHub README
- Create GitHub release with changelog
- Update repository topics/tags

### Community Engagement
- Share on social media
- Write blog post about features
- Submit to accessibility tool lists
- Engage with accessibility community

## 🎯 Success Metrics

After deployment, monitor:
- **Download statistics** on npm
- **GitHub stars and forks**
- **Issue reports and feedback**
- **Community adoption**
- **Feature requests**

## 📝 Deployment Checklist Summary

```bash
# Quick deployment checklist
cd accessibility-package

# 1. Test everything
npm test
node cli.js --comprehensive --dry-run demo/

# 2. Update version
npm version patch

# 3. Login and publish
npm login
npm publish --dry-run
npm publish

# 4. Verify
npm view gbu-accessibility-package
npm install -g gbu-accessibility-package@latest

# 5. Tag release
git tag v3.0.0
git push origin v3.0.0
```

## 🎉 Ready to Deploy!

Your package is now ready for npm deployment with:
- ✅ Comprehensive documentation
- ✅ Professional package.json
- ✅ Complete feature set
- ✅ Safety features
- ✅ Multi-language support
- ✅ Community support infrastructure

Good luck with your deployment! 🚀