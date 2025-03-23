
#!/bin/bash

# Script to ensure Google Sign-In credentials file is properly included in the build

# Set text colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to the App directory
cd "$(dirname "$0")/App"

# Define file paths
GOOGLE_CREDENTIALS_FILE="client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
BACKUP_FILE="client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "${YELLOW}Ensuring Google Sign-In credentials are properly set up...${NC}"

# Check if the credentials file exists
if [ -f "$GOOGLE_CREDENTIALS_FILE" ]; then
    log "${GREEN}✅ Google credentials file exists: $GOOGLE_CREDENTIALS_FILE${NC}"
else
    log "${YELLOW}⚠️ Main Google credentials file not found!${NC}"
    
    # Check if the backup file exists
    if [ -f "$BACKUP_FILE" ]; then
        log "${YELLOW}🔄 Found backup file, copying to the correct name...${NC}"
        cp "$BACKUP_FILE" "$GOOGLE_CREDENTIALS_FILE"
        log "${GREEN}✅ Created $GOOGLE_CREDENTIALS_FILE from backup${NC}"
    else
        log "${RED}❌ ERROR: No Google Sign-In credentials file found!${NC}"
        log "${RED}You must add the file: $GOOGLE_CREDENTIALS_FILE${NC}"
        exit 1
    fi
fi

# Verify the file is referenced in the Xcode project
PROJECT_FILE="../App.xcodeproj/project.pbxproj"
if grep -q "$GOOGLE_CREDENTIALS_FILE" "$PROJECT_FILE"; then
    log "${GREEN}✅ Google credentials file is referenced in the Xcode project${NC}"
else
    log "${YELLOW}⚠️ Google credentials file is not in the Xcode project!${NC}"
    log "${YELLOW}You should manually add the file to your Xcode project${NC}"
fi

log "${GREEN}Google Sign-In credentials setup complete!${NC}"
exit 0
