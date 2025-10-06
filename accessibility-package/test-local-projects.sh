#!/bin/bash

# Test script for local projects
echo "🧪 Testing gbu-accessibility-package on local projects..."

# Danh sách các dự án cần test
TEST_PROJECTS=(
    "/Users/phamdang/Works/daihatsu-brand/01-git/daihatsu-brand-html"
)

# Backup current directory
ORIGINAL_DIR=$(pwd)

# Link package globally
echo "📦 Linking package globally..."
npm link

echo ""

# Test on each project
for PROJECT in "${TEST_PROJECTS[@]}"; do
    if [ -d "$PROJECT" ]; then
        echo "🔍 Testing on: $PROJECT"
        cd "$PROJECT"
        
        # Link the package
        npm link gbu-accessibility-package
        
        # Run tests
        echo "  ✅ Running --unused-files..."
        gbu-a11y --unused-files --dry-run
        
        echo "  ✅ Running --dead-code..."
        gbu-a11y --dead-code --dry-run
        
        echo "  ✅ Running comprehensive check..."
        gbu-a11y --comprehensive --dry-run
        
        # Unlink
        npm unlink gbu-accessibility-package
        
        echo "  ✅ Test completed for $PROJECT"
        echo ""
    else
        echo "⚠️  Project not found: $PROJECT"
    fi
done

# Return to original directory and unlink
cd "$ORIGINAL_DIR"
npm unlink

echo "🎉 All tests completed!"