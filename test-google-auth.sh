#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======== Google Sign-In Test Script ========${NC}"
echo -e "${YELLOW}This script will check your Google Sign-In configuration${NC}"

# Check iOS configuration
echo -e "\n${BLUE}Testing iOS Configuration...${NC}"

# Check if Google client plist file exists
PLIST_FILE="ios/App/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
BACKUP_PLIST_FILE="ios/App/App/client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist"

if [ -f "$PLIST_FILE" ]; then
  echo -e "${GREEN}✓ Google credentials file exists${NC}"
  # Count the number of lines in the plist file to confirm it's not empty
  LINE_COUNT=$(wc -l < "$PLIST_FILE")
  if [ "$LINE_COUNT" -gt 5 ]; then
    echo -e "${GREEN}✓ Credentials file appears to be valid (contains $LINE_COUNT lines)${NC}"
  else
    echo -e "${RED}✗ Credentials file may be incomplete (only $LINE_COUNT lines)${NC}"
  fi
elif [ -f "$BACKUP_PLIST_FILE" ]; then
  echo -e "${YELLOW}⚠ Main credentials file not found, but backup exists${NC}"
  echo -e "${YELLOW}ℹ Run ensure_google_credentials.sh to fix this${NC}"
else
  echo -e "${RED}✗ Google credentials file not found!${NC}"
  echo -e "${YELLOW}ℹ You need to add the Google credentials file to your project${NC}"
fi

# Check URL Schemes in Info.plist
INFO_PLIST="ios/App/App/Info.plist"
if [ -f "$INFO_PLIST" ]; then
  # Check for Google URL scheme
  if grep -q "com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2" "$INFO_PLIST"; then
    echo -e "${GREEN}✓ Google URL scheme found in Info.plist${NC}"
  else
    echo -e "${RED}✗ Google URL scheme not found in Info.plist${NC}"
  fi
  
  # Check for GIDClientID
  if grep -q "GIDClientID" "$INFO_PLIST"; then
    echo -e "${GREEN}✓ GIDClientID entry found in Info.plist${NC}"
    
    # Extract GIDClientID value
    CLIENT_ID=$(grep -A1 "GIDClientID" "$INFO_PLIST" | grep string | sed -E 's/.*<string>(.*)<\/string>.*/\1/')
    echo -e "${BLUE}ℹ GIDClientID: $CLIENT_ID${NC}"
    
    if [[ "$CLIENT_ID" == *"308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2"* ]]; then
      echo -e "${GREEN}✓ GIDClientID matches expected iOS client ID${NC}"
    else
      echo -e "${RED}✗ GIDClientID does not match expected iOS client ID${NC}"
    fi
  else
    echo -e "${RED}✗ GIDClientID entry not found in Info.plist${NC}"
  fi
else
  echo -e "${RED}✗ Info.plist not found at $INFO_PLIST${NC}"
fi

# Check Capacitor config
CAP_CONFIG="capacitor.config.ts"
if [ -f "$CAP_CONFIG" ]; then
  # Check for GoogleAuth configuration
  if grep -q "GoogleAuth" "$CAP_CONFIG"; then
    echo -e "${GREEN}✓ GoogleAuth configuration found in capacitor.config.ts${NC}"
    
    # Check iOS client ID
    if grep -q "iosClientId.*308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2" "$CAP_CONFIG"; then
      echo -e "${GREEN}✓ iOS client ID is correctly configured${NC}"
    else
      echo -e "${RED}✗ iOS client ID is missing or incorrect${NC}"
    fi
    
    # Check web client ID
    if grep -q "webClientId.*308656966304-ouvq7u7q9sms8rujjtqpevaqr120vdge" "$CAP_CONFIG"; then
      echo -e "${GREEN}✓ Web client ID is correctly configured${NC}"
    else
      echo -e "${RED}✗ Web client ID is missing or incorrect${NC}"
    fi
  else
    echo -e "${RED}✗ GoogleAuth configuration not found in capacitor.config.ts${NC}"
  fi
else
  echo -e "${RED}✗ capacitor.config.ts not found${NC}"
fi

# Check for plugin registration
PLUGIN_M_FILE="ios/App/App/GoogleSignInPlugin.m"
if [ -f "$PLUGIN_M_FILE" ]; then
  # Check plugin registration
  if grep -q "CAP_PLUGIN.*GoogleSignIn" "$PLUGIN_M_FILE"; then
    echo -e "${GREEN}✓ GoogleSignIn plugin is registered${NC}"
    
    # Check methods
    if grep -q "signIn.*CAPPluginReturnPromise" "$PLUGIN_M_FILE"; then
      echo -e "${GREEN}✓ signIn method is correctly registered${NC}"
    else
      echo -e "${RED}✗ signIn method is missing or incorrectly registered${NC}"
    fi
    
    if grep -q "checkSignInState.*CAPPluginReturnPromise" "$PLUGIN_M_FILE"; then
      echo -e "${GREEN}✓ checkSignInState method is correctly registered${NC}"
    else
      echo -e "${RED}✗ checkSignInState method is missing or incorrectly registered${NC}"
    fi
  else
    echo -e "${RED}✗ GoogleSignIn plugin is not registered correctly${NC}"
  fi
else
  echo -e "${RED}✗ GoogleSignInPlugin.m not found at $PLUGIN_M_FILE${NC}"
fi

# Check for AppDelegate implementation
APP_DELEGATE="ios/App/App/AppDelegate.swift"
if [ -f "$APP_DELEGATE" ]; then
  # Check for Google Sign-In import
  if grep -q "import GoogleSignIn" "$APP_DELEGATE"; then
    echo -e "${GREEN}✓ GoogleSignIn is imported in AppDelegate${NC}"
  else
    echo -e "${RED}✗ GoogleSignIn is not imported in AppDelegate${NC}"
  fi
  
  # Check URL handling
  if grep -q "GIDSignIn.sharedInstance.handle(url)" "$APP_DELEGATE"; then
    echo -e "${GREEN}✓ URL handling for GoogleSignIn is implemented${NC}"
  else
    echo -e "${RED}✗ URL handling for GoogleSignIn is missing${NC}"
  fi
  
  # Check for restorePreviousSignIn
  if grep -q "restorePreviousSignIn" "$APP_DELEGATE"; then
    echo -e "${GREEN}✓ restorePreviousSignIn is called in AppDelegate${NC}"
  else
    echo -e "${RED}✗ restorePreviousSignIn is not called in AppDelegate${NC}"
  fi
else
  echo -e "${RED}✗ AppDelegate.swift not found at $APP_DELEGATE${NC}"
fi

echo -e "\n${BLUE}======== Test Summary ========${NC}"
echo -e "${YELLOW}ℹ If any issues were found, refer to ios/App/GOOGLE_AUTH_README.md${NC}"
echo -e "${YELLOW}ℹ To fix Google credential file issues, run ios/App/App/ensure_google_credentials.sh${NC}"
echo -e "${BLUE}================================${NC}"