#!/bin/bash

# Navigate to the App directory
cd "$(dirname "$0")/App"

# Check if the plist with "2" exists and is being used
if [ -f "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" ]; then
  echo "Found Google Sign-In plist with '2' suffix."
  
  # Check if the plist without "2" exists
  if [ -f "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist" ]; then
    echo "Found the correct plist file as well."
  else
    # Copy the file if the proper one doesn't exist
    echo "Creating the properly named plist file."
    cp "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
  fi
  
  # Check the content of both files to ensure they match
  if cmp -s "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"; then
    echo "Both plist files have the same content."
  else
    echo "Files have different content. Updating the correct plist."
    cp "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist" "client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
  fi
fi

echo "Google Sign-In plist check completed."