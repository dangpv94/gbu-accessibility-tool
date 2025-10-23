#!/bin/bash

# Test script for unused files only
echo "🗂️ Testing unused files detection..."

# Danh sách các dự án cần test
TEST_PROJECTS=(
    "/Users/phamdang/Works/zukkyun/01-git/zukkyun-2025-html"
    # "/Users/phamdang/Works/fe-base"
    # "/path/to/project2"
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
        echo "🔍 Testing unused files on: $PROJECT"
        cd "$PROJECT"
        
        # Link the package
        npm link gbu-accessibility-package
        
        # Run only unused files check
        echo "  🗂️ Running --unused-files..."
        gbu-a11y --unused-files --dry-run
        
        # Unlink
        npm unlink gbu-accessibility-package
        
        echo "  ✅ Unused files check completed for $PROJECT"
        echo ""
    else
        echo "⚠️  Project not found: $PROJECT"
    fi
done

# Return to original directory and unlink
cd "$ORIGINAL_DIR"
npm unlink

echo "🎉 Unused files check completed!"