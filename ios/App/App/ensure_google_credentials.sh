#!/bin/bash

# Script to ensure Google Sign-In credentials file is properly included in the build

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Define file paths
GOOGLE_CREDENTIALS_FILE="client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
BACKUP_FILE="client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Ensuring Google Sign-In credentials are properly set up..."

# Check if the credentials file exists
if [ -f "$GOOGLE_CREDENTIALS_FILE" ]; then
    log "✅ Google credentials file exists: $GOOGLE_CREDENTIALS_FILE"
else
    log "⚠️ Main Google credentials file not found!"
    
    # Check if the backup file exists
    if [ -f "$BACKUP_FILE" ]; then
        log "🔄 Found backup file, copying to the correct name..."
        cp "$BACKUP_FILE" "$GOOGLE_CREDENTIALS_FILE"
        log "✅ Created $GOOGLE_CREDENTIALS_FILE from backup"
    else
        log "❌ ERROR: No Google Sign-In credentials file found!"
        log "You must add the file: $GOOGLE_CREDENTIALS_FILE"
        exit 1
    fi
fi

# Make sure the file is included in the build
log "Adding Google credentials file to project if needed..."

# Verify the file is referenced in the Xcode project
PROJECT_FILE="../App.xcodeproj/project.pbxproj"
if grep -q "$GOOGLE_CREDENTIALS_FILE" "$PROJECT_FILE"; then
    log "✅ Google credentials file is referenced in the Xcode project"
else
    log "⚠️ Google credentials file is not in the Xcode project!"
    log "You should manually add the file to your Xcode project"
fi

log "Google Sign-In credentials setup complete!"
exit 0