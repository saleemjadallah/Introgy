#!/bin/bash

echo "🔍 Google Sign-In Implementation Test"
echo "===================================="

# 1. Check configuration
echo "📋 Step 1: Checking Configuration"
./ensure_google_credentials.sh

# 2. Check plugin files
echo ""
echo "📋 Step 2: Checking Plugin Files"
PLUGIN_FILES=("GoogleAuthPlugin.swift" "GoogleAuthPlugin.m" "GoogleSignInViewController.swift" "GoogleSignOutViewController.swift")
for file in "${PLUGIN_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
    # Count lines of code as a basic verification
    LINES=$(wc -l < "$file")
    echo "   - $LINES lines of code"
  else
    echo "❌ $file is missing!"
  fi
done

# 3. Check plugin.m for registration
echo ""
echo "📋 Step 3: Checking Plugin Registration"
if grep -q "CAP_PLUGIN(GoogleAuthPlugin" "plugin.m"; then
  echo "✅ GoogleAuthPlugin properly registered in plugin.m"
  # Show the registration line
  grep -A 10 "CAP_PLUGIN(GoogleAuthPlugin" "plugin.m"
else
  echo "❌ GoogleAuthPlugin not properly registered in plugin.m"
  echo "Should find:"
  echo 'CAP_PLUGIN(GoogleAuthPlugin, "GoogleAuth",'
  echo "Actual plugin.m content:"
  cat plugin.m
fi

# 4. Check the AppDelegate configuration
echo ""
echo "📋 Step 4: Checking AppDelegate Configuration"
if grep -q "GIDSignIn.sharedInstance.configuration" "AppDelegate.swift"; then
  echo "✅ Google Sign-In configured in AppDelegate"
else
  echo "❌ Google Sign-In not configured in AppDelegate"
fi

if grep -q "GIDSignIn.sharedInstance.handle(url)" "AppDelegate.swift"; then
  echo "✅ URL handling configured in AppDelegate"
else
  echo "❌ URL handling not configured in AppDelegate"
fi

# 5. Check Info.plist settings
echo ""
echo "📋 Step 5: Checking Info.plist Settings"
if grep -q "<key>GIDClientID</key>" "Info.plist"; then
  echo "✅ GIDClientID configured in Info.plist"
  CLIENT_ID=$(grep -A 1 "<key>GIDClientID</key>" "Info.plist" | grep string | sed -e 's/<[^>]*>//g' | sed -e 's/^[[:space:]]*//')
  echo "   - Client ID: $CLIENT_ID"
else
  echo "❌ GIDClientID not configured in Info.plist"
fi

if grep -q "<key>CFBundleURLTypes</key>" "Info.plist"; then
  echo "✅ URL Types section found in Info.plist"
  if grep -q "com.googleusercontent.apps" "Info.plist"; then
    echo "✅ Google URL scheme found in Info.plist"
    URL_SCHEME=$(grep -A 5 "com.googleusercontent.apps" "Info.plist" | grep string | head -1 | sed -e 's/<[^>]*>//g' | sed -e 's/^[[:space:]]*//')
    echo "   - URL Scheme: $URL_SCHEME"
  else
    echo "❌ Google URL scheme missing in Info.plist"
  fi
else
  echo "❌ CFBundleURLTypes section missing in Info.plist"
fi

# 6. Verify implementation logic
echo ""
echo "📋 Step 6: Verifying Implementation Logic"

# Check GoogleAuthPlugin.swift implementation
if grep -q "signInWithSupabase" "GoogleAuthPlugin.swift"; then
  echo "✅ signInWithSupabase method found in GoogleAuthPlugin.swift"
else
  echo "❌ signInWithSupabase method missing in GoogleAuthPlugin.swift"
fi

# Verify the integration between native and JS
if grep -q "import GoogleSignIn" "GoogleAuthPlugin.swift" && grep -q "GIDSignIn.sharedInstance" "GoogleAuthPlugin.swift"; then
  echo "✅ GoogleAuthPlugin properly uses GoogleSignIn SDK"
else
  echo "❌ GoogleAuthPlugin does not properly use GoogleSignIn SDK"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Build and run the app on a real iOS device (not simulator)"
echo "2. Navigate to the sign-in screen"
echo "3. Tap the Google Sign-In button"
echo "4. If successful, you should see the native Google Sign-In UI (not a browser)"
echo "5. After signing in, you should be authenticated in the app"
echo ""
echo "If issues persist, check the Xcode console for logs with the 📱 emoji"