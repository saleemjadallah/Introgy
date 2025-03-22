#!/bin/bash

echo "Fixing Google Auth Configuration..."

# 1. Check if the correct Google client plist file exists
PLIST_FILE="client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com.plist"
BACKUP_PLIST_FILE="client_308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com 2.plist"

if [ ! -f "$PLIST_FILE" ] && [ -f "$BACKUP_PLIST_FILE" ]; then
    echo "Copying backup Google plist file to correct name..."
    cp "$BACKUP_PLIST_FILE" "$PLIST_FILE"
elif [ ! -f "$PLIST_FILE" ] && [ ! -f "$BACKUP_PLIST_FILE" ]; then
    echo "ERROR: Google Sign-In credentials file not found!"
    echo "Please add the file: $PLIST_FILE"
    exit 1
fi

echo "Google Auth configuration fixed successfully!"