#!/bin/bash

# Exit on error
set -e

# Create build directory if it doesn't exist
mkdir -p build

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Building the app for production...${NC}"
npm run build

echo -e "${YELLOW}Step 2: Syncing the built web assets to the iOS project...${NC}"
npx cap sync ios

echo -e "${YELLOW}Step 3: Checking for team ID in ExportOptions.plist...${NC}"
TEAM_ID=$(grep -A1 "teamID" ExportOptions.plist | grep string | sed -E 's/.*<string>(.*)<\/string>.*/\1/')

if [ "$TEAM_ID" == "YOUR_TEAM_ID" ]; then
  echo -e "${RED}ERROR: You need to update the teamID in ExportOptions.plist with your actual team ID.${NC}"
  echo -e "${YELLOW}You can find your team ID in Xcode:${NC}"
  echo "1. Open Xcode and select your project"
  echo "2. Go to Signing & Capabilities tab"
  echo "3. Your Team ID is shown in the Team dropdown (or look at the provisioning profile details)"
  exit 1
fi

echo -e "${YELLOW}Step 4: Building the archive...${NC}"
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -destination 'generic/platform=iOS' -archivePath build/App.xcarchive archive

echo -e "${YELLOW}Step 5: Exporting the archive to an .ipa file...${NC}"
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/

echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "Your .ipa file is located in the build directory."
echo -e "You can upload it to App Store Connect using the Transporter app or the Application Loader in Xcode."
