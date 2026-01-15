#!/bin/bash

# Update from Vibe Coders Starter Kit template
# This script helps pull the latest template changes into your project

set -e

TEMPLATE_REMOTE="template"
TEMPLATE_URL="https://github.com/kenrogers/vibe-coders-starter-kit.git"
TEMPLATE_BRANCH="main"

echo "🔄 Vibe Coders Starter Kit - Template Update"
echo "============================================="
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    echo ""
    git status --short
    exit 1
fi

# Add template remote if it doesn't exist
if ! git remote get-url "$TEMPLATE_REMOTE" >/dev/null 2>&1; then
    echo "📡 Adding template remote..."
    git remote add "$TEMPLATE_REMOTE" "$TEMPLATE_URL"
else
    echo "✓ Template remote already configured"
fi

# Fetch latest from template
echo "📥 Fetching latest template changes..."
git fetch "$TEMPLATE_REMOTE"

# Show what's new
echo ""
echo "📋 New commits from template:"
echo "-----------------------------"
COMMITS=$(git log HEAD.."$TEMPLATE_REMOTE/$TEMPLATE_BRANCH" --oneline 2>/dev/null || echo "")

if [ -z "$COMMITS" ]; then
    echo "✅ Your project is up to date with the template!"
    exit 0
fi

echo "$COMMITS"
echo ""

# Show changed files
echo "📁 Files that will be updated:"
echo "------------------------------"
git diff HEAD.."$TEMPLATE_REMOTE/$TEMPLATE_BRANCH" --stat
echo ""

# Prompt for action
echo "How would you like to proceed?"
echo "  [m] Merge all changes (recommended)"
echo "  [p] Cherry-pick specific commits"
echo "  [d] Show detailed diff"
echo "  [q] Quit without changes"
echo ""
read -p "Your choice: " choice

case $choice in
    m|M)
        echo ""
        echo "🔀 Merging template changes..."
        if git merge "$TEMPLATE_REMOTE/$TEMPLATE_BRANCH" --allow-unrelated-histories -m "chore: update from Vibe Coders Starter Kit template"; then
            echo ""
            echo "✅ Successfully merged template updates!"
        else
            echo ""
            echo "⚠️  Merge conflicts detected. Please resolve them manually:"
            echo "   1. Open conflicted files and resolve conflicts"
            echo "   2. Stage resolved files: git add <file>"
            echo "   3. Complete merge: git commit"
        fi
        ;;
    p|P)
        echo ""
        echo "Available commits to cherry-pick:"
        git log HEAD.."$TEMPLATE_REMOTE/$TEMPLATE_BRANCH" --oneline
        echo ""
        echo "Use: git cherry-pick <commit-hash>"
        echo "Example: git cherry-pick abc1234"
        ;;
    d|D)
        echo ""
        git diff HEAD.."$TEMPLATE_REMOTE/$TEMPLATE_BRANCH"
        echo ""
        echo "Run this script again to merge or cherry-pick."
        ;;
    q|Q)
        echo "👋 No changes made."
        exit 0
        ;;
    *)
        echo "Invalid choice. No changes made."
        exit 1
        ;;
esac
