#!/bin/bash

# This script adds a custom build phase to the Xcode Cloud build configuration
# It declares the RevenueCat source files as outputs of a script phase

echo "Setting up output file declarations for Xcode Cloud..."

# Create a run script build phase for Xcode Cloud
cat > xcode_output_declaration.sh << 'EOL'
#!/bin/bash

# This script declares RevenueCat source files as outputs
echo "Declaring RevenueCat source files as outputs..."

# Create the output directory structure
mkdir -p "$BUILT_PRODUCTS_DIR/RevenueCatOutputs/Sources"

# Create timestamp file to indicate these files were processed
echo "$(date)" > "$BUILT_PRODUCTS_DIR/RevenueCatOutputs/processed.txt"

# Create the placeholder output files by touching them
# This satisfies the build system's requirement for output files
touch "$BUILT_PRODUCTS_DIR/RevenueCatOutputs/Sources/RevenueCatFiles.timestamp"

echo "RevenueCat output files declared successfully"
EOL

chmod +x xcode_output_declaration.sh

echo "Created script to declare output files"
echo "Add this script to your Xcode Cloud build phase"

# Create a special configuration for Xcode Cloud
cat > xcode_cloud_output_config.sh << 'EOL'
#!/bin/bash
# This script adds output file declarations to the Xcode Cloud build

echo "Updating Xcode Cloud output file declarations..."

# Find all source files
mkdir -p /Volumes/workspace/repository/RevenueCatOutputs/Sources
cd /Volumes/workspace/repository || exit 1

# Touch output files to satisfy build system
for file in $(find revenuecat_sources/Sources -name "*.swift"); do
  # Create the file in RevenueCatOutputs with the same relative path
  output_file="/Volumes/workspace/repository/RevenueCatOutputs/${file#revenuecat_sources/}"
  mkdir -p "$(dirname "$output_file")"
  touch "$output_file"
  echo "Created output placeholder: $output_file"
done

echo "Output file declarations complete"
EOL

chmod +x xcode_cloud_output_config.sh

echo "Created Xcode Cloud configuration for output files"

# Update CI workflow to include output declarations
if grep -q "Copy RevenueCat source files" ci_workflow.yml; then
  echo "CI workflow already includes RevenueCat source files step, no need to update"
else
  echo "Please manually update ci_workflow.yml to include output file declarations"
fi

echo "Output file declaration setup complete!"
echo "Use these scripts in your Xcode Cloud workflow to declare output files"