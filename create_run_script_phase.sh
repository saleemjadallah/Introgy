#!/bin/bash

# Script to add a Run Script build phase to the Xcode project
# This adds the revenuecat_build_phase.sh script as a build phase

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_PATH="ios/App/App.xcodeproj/project.pbxproj"

# Check if the project file exists
if [ ! -f "$PROJECT_PATH" ]; then
  echo "Error: Xcode project file not found at $PROJECT_PATH"
  exit 1
fi

# Define the build phase name and script path
BUILD_PHASE_NAME="Generate RevenueCat Files"
SCRIPT_PATH="${SCRIPT_DIR}/revenuecat_build_phase.sh"

# Find the main target section (App)
TARGET_UUID=$(grep -A 1 "targets = (" "$PROJECT_PATH" | grep -v "targets" | tr -d ' ' | tr -d ';')
if [ -z "$TARGET_UUID" ]; then
  echo "Error: Could not find main target in project file"
  exit 1
fi

# Check if the build phase already exists
if grep -q "$BUILD_PHASE_NAME" "$PROJECT_PATH"; then
  echo "Build phase '$BUILD_PHASE_NAME' already exists in the project"
else
  # Generate a unique UUID for the new build phase
  NEW_UUID=$(uuidgen | tr '[:upper:]' '[:lower:]')
  
  # Create a new Run Script build phase
  RUN_SCRIPT_PHASE="
		$NEW_UUID /* $BUILD_PHASE_NAME */ = {
			isa = PBXShellScriptBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			inputFilesList = (
			);
			inputPaths = (
			);
			name = \"$BUILD_PHASE_NAME\";
			outputFilesList = (
			);
			outputPaths = (
			);
			runOnlyForDeploymentPostprocessing = 0;
			shellPath = /bin/sh;
			shellScript = \"\\\"$SCRIPT_PATH\\\"\";
		};
"
  
  # Add the build phase to the project
  # First find the "/* Begin PBXShellScriptBuildPhase section */" line
  LINE_NUMBER=$(grep -n "Begin PBXShellScriptBuildPhase section" "$PROJECT_PATH" | cut -d: -f1)
  if [ -n "$LINE_NUMBER" ]; then
    # Insert the new build phase after this line
    sed -i.bak "${LINE_NUMBER}a\\
$RUN_SCRIPT_PHASE
" "$PROJECT_PATH"
    
    # Now add this build phase to the target's buildPhases array
    # Find the target's buildPhases line
    PHASES_LINE=$(grep -n "buildPhases = (" "$PROJECT_PATH" | head -1 | cut -d: -f1)
    if [ -n "$PHASES_LINE" ]; then
      # Insert the new build phase UUID as the first item in the array
      sed -i.bak "${PHASES_LINE}a\\
				$NEW_UUID /* $BUILD_PHASE_NAME */,
" "$PROJECT_PATH"
      
      echo "Added build phase '$BUILD_PHASE_NAME' to the project"
    else
      echo "Error: Could not find buildPhases in project file"
      exit 1
    fi
  else
    echo "Error: Could not find shell script section in project file"
    exit 1
  fi
  
  # Clean up the backup file
  rm -f "$PROJECT_PATH.bak"
fi

echo "✅ Build phase setup completed successfully"