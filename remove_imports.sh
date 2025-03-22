#!/bin/bash

# Find all Swift files in the App directory
find ./ios/App/App -name "*.swift" -type f | while read file; do
  # Check if the file contains 'import App'
  if grep -q "import App" "$file"; then
    echo "Removing 'import App' from $file"
    # Remove the line containing 'import App'
    sed -i '' '/import App/d' "$file"
  fi
done
