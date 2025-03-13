#!/bin/bash

# This script should be added as a Run Script build phase in Xcode
# It declares the RevenueCat source files as outputs of a script phase

# Check if we're in Xcode Cloud environment
if [ -d "/Volumes/workspace/repository" ]; then
  echo "Running in Xcode Cloud environment"
  
  # Declare outputs by creating them in a special directory
  OUTPUT_DIR="${BUILT_PRODUCTS_DIR}/RevenueCatFileOutputs"
  mkdir -p "${OUTPUT_DIR}/Sources"
  
  # Create a timestamp file to mark these files as processed
  echo "Processed at $(date)" > "${OUTPUT_DIR}/processed.txt"
  
  # Find all RevenueCat Swift files and declare them as outputs
  find "/Volumes/workspace/repository/revenuecat_sources/Sources" -name "*.swift" | while read -r file; do
    # Get the relative path within Sources
    rel_path="${file#/Volumes/workspace/repository/revenuecat_sources/Sources/}"
    # Create the output file
    output_file="${OUTPUT_DIR}/Sources/${rel_path}"
    # Create directory if needed
    mkdir -p "$(dirname "${output_file}")"
    # Touch the file to create it
    touch "${output_file}"
  done
  
  echo "Created output declarations for RevenueCat files"
else
  echo "Not running in Xcode Cloud, skipping output declarations"
fi

# Exit with success
exit 0