
#!/bin/bash

echo "Running post-clone script..."

# Navigate to the repository root
cd "$CI_WORKSPACE"

# Install dependencies
echo "Installing dependencies..."
npm install

# Run RevenueCat pre-build script
echo "Running RevenueCat pre-build script..."
chmod +x ios/App/revenuecat_build_phase.sh
./ios/App/revenuecat_build_phase.sh

# Install pods
echo "Installing pods..."
cd ios/App
pod install

echo "✅ Post-clone setup completed successfully"
exit 0 
