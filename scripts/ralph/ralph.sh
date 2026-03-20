#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop (TDD Mode)
# Usage: ./scripts/ralph/ralph.sh [--tool amp|claude] [max_iterations]
# Default: claude with TDD-enforced CLAUDE.md

set -e

# Parse arguments
TOOL="claude"  # Default to claude for our setup
MAX_ITERATIONS=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

if [[ "$TOOL" != "amp" && "$TOOL" != "claude" ]]; then
  echo "Error: Invalid tool '$TOOL'. Must be 'amp' or 'claude'."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")
  
  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"
    
    echo "📦 Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"
    
    echo "# Ralph Progress Log (TDD Mode)" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Track current branch
if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log (TDD Mode)" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

# Pre-flight: verify test infrastructure exists
echo ""
echo "🔍 Pre-flight checks..."
if [ -f "package.json" ]; then
  # Check for test script
  TEST_SCRIPT=$(jq -r '.scripts.test // empty' package.json 2>/dev/null)
  if [ -z "$TEST_SCRIPT" ] || [ "$TEST_SCRIPT" = "echo \"Error: no test specified\" && exit 1" ]; then
    echo "⚠️  WARNING: No test script configured in package.json"
    echo "   TDD requires a working test runner. Add a 'test' script before running Ralph."
    echo "   Example: \"test\": \"vitest run\" or \"test\": \"jest\""
    read -p "   Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  else
    echo "   ✅ Test script found: $TEST_SCRIPT"
  fi
fi

echo ""
echo "🚀 Starting Ralph (TDD Mode) - Tool: $TOOL - Max iterations: $MAX_ITERATIONS"
echo "   PRD: $PRD_FILE"
echo "   Progress: $PROGRESS_FILE"
echo ""

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  🔴🟢🔵 Ralph TDD Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "==============================================================="

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
  else
    OUTPUT=$(claude --dangerously-skip-permissions --print < "$SCRIPT_DIR/CLAUDE.md" 2>&1 | tee /dev/stderr) || true
  fi
  
  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "✅ Ralph completed all tasks! (TDD Mode)"
    echo "   Completed at iteration $i of $MAX_ITERATIONS"
    
    # Summary
    if [ -f "$PRD_FILE" ]; then
      TOTAL=$(jq '.userStories | length' "$PRD_FILE")
      PASSED=$(jq '[.userStories[] | select(.passes == true)] | length' "$PRD_FILE")
      echo "   Stories: $PASSED/$TOTAL passing"
    fi
    exit 0
  fi
  
  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "⚠️  Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."

if [ -f "$PRD_FILE" ]; then
  TOTAL=$(jq '.userStories | length' "$PRD_FILE")
  PASSED=$(jq '[.userStories[] | select(.passes == true)] | length' "$PRD_FILE")
  echo "Stories: $PASSED/$TOTAL passing"
fi
exit 1
