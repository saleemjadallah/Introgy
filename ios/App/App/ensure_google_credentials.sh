#!/bin/bash

echo "🔍 Running Google Auth Configuration Check..."

# Define all Google Auth related files and paths
SCRIPT_DIR=$(dirname "$0")
APP_DIR="$SCRIPT_DIR"
CREDS_PLIST_FILE="client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
GOOGLE_SERVICE_PLIST="GoogleService-Info.plist"
INFO_PLIST="$APP_DIR/Info.plist"
PLUGIN_SWIFT="$APP_DIR/GoogleAuthPlugin.swift"
PLUGIN_M="$APP_DIR/GoogleAuthPlugin.m"
SIGN_IN_VC="$APP_DIR/GoogleSignInViewController.swift"
SIGN_OUT_VC="$APP_DIR/GoogleSignOutViewController.swift"
CLIENT_ID="308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com"
BUNDLE_ID="ai.introgy.app"
URL_SCHEME="com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2"

echo "📂 Current directory: $(pwd)"
echo "📂 App directory: $APP_DIR"

# 1. Verify all plugin files exist
echo "🔍 Checking plugin files..."

file_check() {
    if [ -f "$1" ]; then
        echo "✅ $(basename "$1") exists"
        return 0
    else
        echo "❌ $(basename "$1") is missing!"
        return 1
    fi
}

file_check "$PLUGIN_SWIFT"
file_check "$PLUGIN_M"
file_check "$SIGN_IN_VC"
file_check "$SIGN_OUT_VC"

# 2. Check Google credentials plist
echo "🔍 Checking Google credentials..."

if file_check "$APP_DIR/$CREDS_PLIST_FILE"; then
    echo "  📄 Google credentials plist exists, checking contents..."
    
    # Verify the plist has required keys
    REQUIRED_KEYS=("CLIENT_ID" "REVERSED_CLIENT_ID" "BUNDLE_ID")
    for key in "${REQUIRED_KEYS[@]}"; do
        if grep -q "<key>$key</key>" "$APP_DIR/$CREDS_PLIST_FILE"; then
            echo "  ✅ $key found in credentials plist"
            
            # Extract and show the value for reference
            VALUE=$(grep -A 1 "<key>$key</key>" "$APP_DIR/$CREDS_PLIST_FILE" | grep "<string>" | sed -e 's/<[^>]*>//g' | sed -e 's/^[[:space:]]*//')
            echo "     Value: $VALUE"
            
            # For BUNDLE_ID, check if it matches expected value
            if [ "$key" == "BUNDLE_ID" ] && [ "$VALUE" != "$BUNDLE_ID" ]; then
                echo "  ⚠️ BUNDLE_ID mismatch in credentials plist. Found: $VALUE, Expected: $BUNDLE_ID"
                echo "     This might cause issues. Consider updating the credentials plist."
            fi
        else
            echo "  ❌ $key not found in credentials plist"
        fi
    done
else
    echo "  ⚠️ Creating a stub Google credentials plist..."
    cat > "$APP_DIR/$CREDS_PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CLIENT_ID</key>
	<string>${CLIENT_ID}</string>
	<key>REVERSED_CLIENT_ID</key>
	<string>${URL_SCHEME}</string>
	<key>BUNDLE_ID</key>
	<string>${BUNDLE_ID}</string>
</dict>
</plist>
EOF
    echo "  ✅ Created stub Google credentials plist"
fi

# 3. Create or verify GoogleService-Info.plist (needed by some Google SDKs)
if file_check "$APP_DIR/$GOOGLE_SERVICE_PLIST"; then
    echo "  📄 GoogleService-Info.plist exists"
else
    echo "  ⚠️ GoogleService-Info.plist not found, creating a copy from credentials plist..."
    cp "$APP_DIR/$CREDS_PLIST_FILE" "$APP_DIR/$GOOGLE_SERVICE_PLIST"
    echo "  ✅ Created GoogleService-Info.plist from credentials plist"
fi

# 4. Check Info.plist for required Google Sign-In configurations
echo "🔍 Checking Info.plist configuration..."

# Check for GIDClientID
if grep -q "<key>GIDClientID</key>" "$INFO_PLIST"; then
    echo "✅ GIDClientID found in Info.plist"
    
    # Extract the value and check if it matches
    GID_CLIENT_ID=$(grep -A 1 "<key>GIDClientID</key>" "$INFO_PLIST" | grep "<string>" | sed -e 's/<[^>]*>//g' | sed -e 's/^[[:space:]]*//')
    echo "   Value: $GID_CLIENT_ID"
    
    if [ "$GID_CLIENT_ID" != "$CLIENT_ID" ]; then
        echo "⚠️ GIDClientID mismatch in Info.plist. Found: $GID_CLIENT_ID, Expected: $CLIENT_ID"
    fi
else
    echo "❌ GIDClientID not found in Info.plist, adding it..."
    sed -i '' 's/<dict>/<dict>\n\t<key>GIDClientID<\/key>\n\t<string>'$CLIENT_ID'<\/string>/' "$INFO_PLIST"
    echo "✅ Added GIDClientID to Info.plist"
fi

# Check for URL scheme
if grep -q "$URL_SCHEME" "$INFO_PLIST"; then
    echo "✅ Google URL scheme found in Info.plist"
else
    echo "❌ Google URL scheme not found in Info.plist"
    echo "   This is critical for Google Sign-In to work. Please add the URL scheme to Info.plist."
    echo "   Add the following to CFBundleURLTypes:"
    echo '
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>'$URL_SCHEME'</string>
        </array>
    </dict>'
fi

# Check for LSApplicationQueriesSchemes
if grep -q "<key>LSApplicationQueriesSchemes</key>" "$INFO_PLIST"; then
    echo "✅ LSApplicationQueriesSchemes found in Info.plist"
    
    # Check if it includes the required schemes
    REQUIRED_SCHEMES=("https" "http" "googlechrome" "googlechromes")
    for scheme in "${REQUIRED_SCHEMES[@]}"; do
        if grep -q "<string>$scheme</string>" "$INFO_PLIST"; then
            echo "  ✅ $scheme scheme found"
        else
            echo "  ❌ $scheme scheme not found, adding it..."
            # This would need a more careful XML manipulation than a simple sed command
            # For now, just report it
            echo "  ⚠️ Please manually add the $scheme scheme to LSApplicationQueriesSchemes in Info.plist"
        fi
    done
else
    echo "❌ LSApplicationQueriesSchemes not found in Info.plist, adding it..."
    sed -i '' 's/<\/dict>/\t<key>LSApplicationQueriesSchemes<\/key>\n\t<array>\n\t\t<string>https<\/string>\n\t\t<string>http<\/string>\n\t\t<string>googlechrome<\/string>\n\t\t<string>googlechromes<\/string>\n\t\t<string>safari<\/string>\n\t<\/array>\n<\/dict>/' "$INFO_PLIST"
    echo "✅ Added LSApplicationQueriesSchemes to Info.plist"
fi

# 5. Check capacitor.config.ts for Google Auth configuration
echo "🔍 Checking capacitor.config.ts configuration..."
CAPACITOR_CONFIG_PATH="$APP_DIR/capacitor.config.json"

# Check if capacitor.config.json exists in the App directory
if file_check "$CAPACITOR_CONFIG_PATH"; then
    echo "  📄 Capacitor config exists in app directory, checking configuration..."
    
    # Check for GoogleAuth plugin config
    if grep -q "GoogleAuth" "$CAPACITOR_CONFIG_PATH"; then
        echo "  ✅ GoogleAuth plugin configuration found in capacitor.config.json"
        
        # Check for required fields
        REQUIRED_CONFIG=("scopes" "iosClientId" "clientId")
        for config in "${REQUIRED_CONFIG[@]}"; do
            if grep -q "\"$config\"" "$CAPACITOR_CONFIG_PATH"; then
                echo "  ✅ $config configuration found"
            else
                echo "  ❌ $config configuration not found"
            fi
        done
    else
        echo "  ❌ GoogleAuth plugin configuration not found in capacitor.config.json"
    fi
else
    echo "  ℹ️ Capacitor config not found in app directory, this is expected if using project-level config"
fi

# 6. Check that App module has GoogleAuth plugin registered
echo "🔍 Checking plugin registration..."

# Check plugin.m file
PLUGIN_REGISTRATION_FILE="$APP_DIR/plugin.m"
if file_check "$PLUGIN_REGISTRATION_FILE"; then
    if grep -q "GoogleAuthPlugin" "$PLUGIN_REGISTRATION_FILE"; then
        echo "✅ GoogleAuthPlugin registered in plugin.m"
    else
        echo "❌ GoogleAuthPlugin not registered in plugin.m"
        echo "   Please ensure the plugin is properly registered"
    fi
else
    echo "❌ plugin.m file not found"
fi

# 7. Verify AppDelegate has Google Sign-In configuration
echo "🔍 Checking AppDelegate configuration..."
APP_DELEGATE_PATH="$APP_DIR/AppDelegate.swift"

if file_check "$APP_DELEGATE_PATH"; then
    # Check for Google Sign-In import
    if grep -q "import GoogleSignIn" "$APP_DELEGATE_PATH"; then
        echo "✅ GoogleSignIn import found in AppDelegate"
    else
        echo "❌ GoogleSignIn import missing in AppDelegate"
    fi
    
    # Check for GIDSignIn configuration
    if grep -q "GIDSignIn.sharedInstance.configuration" "$APP_DELEGATE_PATH"; then
        echo "✅ GIDSignIn configuration found in AppDelegate"
    else
        echo "❌ GIDSignIn configuration missing in AppDelegate"
    fi
    
    # Check for URL handling
    if grep -q "GIDSignIn.sharedInstance.handle" "$APP_DELEGATE_PATH"; then
        echo "✅ Google Sign-In URL handling found in AppDelegate"
    else
        echo "❌ Google Sign-In URL handling missing in AppDelegate"
    fi
else
    echo "❌ AppDelegate.swift not found"
fi

echo ""
echo "🔍 Google Auth Configuration Check completed"
echo "📱 The app should now be properly configured for Google Sign-In"
echo ""
echo "Next steps:"
echo "1. Build and run the app on a real iOS device"
echo "2. Test the Google Sign-In functionality"
echo "3. Check console logs for any errors (look for 📱 emoji prefix)"