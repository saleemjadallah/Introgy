
#!/bin/bash

echo "Setting executable permissions for RevenueCat scripts..."

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Make all shell scripts executable
chmod +x *.sh

echo "✅ All scripts are now executable"
