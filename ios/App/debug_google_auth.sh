
#!/bin/bash

# Script to debug Google authentication issues on iOS

# Set text colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========== Google Auth Debugging Tool ===========${NC}"
echo -e "${BLUE}This script will check common issues with Google Auth setup${NC}"

# Check if we're in the right directory
if [ ! -d "App" ]; then
    echo -e "${RED}Error: This script must be run from the ios directory${NC}"
    echo -e "${YELLOW}Please navigate to the ios directory and run: ./debug_google_auth.sh${NC}"
    exit 1
fi

# Run the plist fix script first
echo -e "${BLUE}Running Google plist fix script...${NC}"
./fix_google_plist.sh

# Check Info.plist settings
echo -e "\n${BLUE}Checking Info.plist configuration...${NC}"
INFO_PLIST="App/App/Info.plist"

if [ ! -f "$INFO_PLIST" ]; then
    echo -e "${RED}Error: Info.plist not found at $INFO_PLIST${NC}"
    exit 1
fi

# Check GIDClientID exists
if grep -q "GIDClientID" "$INFO_PLIST"; then
    echo -e "${GREEN}✅ GIDClientID key found in Info.plist${NC}"
    CLIENT_ID=$(grep -A1 "GIDClientID" "$INFO_PLIST" | grep string | sed -E 's/.*>([^<]+)<.*/\1/')
    echo -e "${GREEN}   Client ID: $CLIENT_ID${NC}"
else
    echo -e "${RED}❌ GIDClientID key not found in Info.plist${NC}"
    echo -e "${YELLOW}   Add the following to your Info.plist:${NC}"
    echo -e "${YELLOW}   <key>GIDClientID</key>${NC}"
    echo -e "${YELLOW}   <string>YOUR_CLIENT_ID.apps.googleusercontent.com</string>${NC}"
fi

# Check URL schemes
if grep -q "CFBundleURLTypes" "$INFO_PLIST"; then
    echo -e "${GREEN}✅ CFBundleURLTypes found in Info.plist${NC}"
    
    # Look for Google URL scheme
    if grep -A20 "CFBundleURLTypes" "$INFO_PLIST" | grep -q "googleusercontent"; then
        echo -e "${GREEN}✅ Google URL scheme found${NC}"
        URL_SCHEME=$(grep -A20 "CFBundleURLTypes" "$INFO_PLIST" | grep -A5 "googleusercontent" | grep -A1 "CFBundleURLSchemes" | grep string | head -1 | sed -E 's/.*>([^<]+)<.*/\1/')
        echo -e "${GREEN}   URL Scheme: $URL_SCHEME${NC}"
    else
        echo -e "${RED}❌ Google URL scheme not found in CFBundleURLTypes${NC}"
        echo -e "${YELLOW}   Add a URL scheme with format: com.googleusercontent.apps.YOUR_CLIENT_ID${NC}"
    fi
else
    echo -e "${RED}❌ CFBundleURLTypes not found in Info.plist${NC}"
    echo -e "${YELLOW}   Add URL types configuration to support Google Sign-In${NC}"
fi

# Verify the credentials plist file exists
echo -e "\n${BLUE}Checking Google credentials file...${NC}"
CREDENTIALS_FILE="App/client_$CLIENT_ID.plist"
if [ -f "$CREDENTIALS_FILE" ]; then
    echo -e "${GREEN}✅ Credentials file found: $CREDENTIALS_FILE${NC}"
else
    echo -e "${RED}❌ Credentials file not found: $CREDENTIALS_FILE${NC}"
    echo -e "${YELLOW}   Download this file from Google Cloud Console${NC}"
fi

# Check if the GoogleAuthVerifier exists
echo -e "\n${BLUE}Checking GoogleAuthVerifier...${NC}"
VERIFIER_FILE="App/App/Utils/GoogleAuthVerifier.swift"
if [ -f "$VERIFIER_FILE" ]; then
    echo -e "${GREEN}✅ GoogleAuthVerifier found${NC}"
else
    echo -e "${YELLOW}⚠️ GoogleAuthVerifier not found at $VERIFIER_FILE${NC}"
    echo -e "${YELLOW}   This utility class helps diagnose Google Sign-In issues${NC}"
fi

echo -e "\n${BLUE}Debugging complete. For additional help:${NC}"
echo -e "${BLUE}1. Check logs from GoogleAuthVerifier.verifySetup() in console${NC}"
echo -e "${BLUE}2. Verify appDelegate handles URLs correctly${NC}"
echo -e "${BLUE}3. Ensure you've set up the OAuth client in Google Cloud Console${NC}"
echo -e "${BLUE}   with the correct bundle ID and URL schemes${NC}"
echo -e "${BLUE}=========================================${NC}"
