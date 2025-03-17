
# RevenueCat Integration

This application uses RevenueCat for in-app purchases and subscriptions. The integration uses Swift Package Manager (SPM) for the iOS native side.

## iOS Setup

The RevenueCat SDK is integrated via Swift Package Manager in our iOS app. We use a combination of approaches:

1. The Swift Package Manager dependency: `https://github.com/RevenueCat/purchases-ios-spm.git`
2. A stub `PurchasesHybridCommon` pod to satisfy the Capacitor plugin requirements
3. Helper scripts to fix common build issues

### How to Update RevenueCat

To update the RevenueCat SDK version:

1. Open the project in Xcode
2. Go to File > Packages > Update to Latest Package Versions
3. Or manually edit `Package.resolved` to specify a different version

### Troubleshooting

If you encounter build errors related to RevenueCat:

1. Run the fix scripts in the following order:
   ```
   cd ios/App
   chmod +x RevenueCatPhase.sh
   ./RevenueCatPhase.sh
   ```

2. Common errors and solutions:
   - "Framework not found 'RevenueCat'": This usually means the Swift Package was not properly linked. Run `RevenueCatPhase.sh`
   - "PurchasesHybridCommon.h not found": The stub podspec might need to be regenerated. Run `RevenueCatPhase.sh`

3. If issues persist, try cleaning the build folder (Product > Clean Build Folder) and rebuilding.

## Migration to RevenueCat 5.x

Note that RevenueCat 5.x has some API changes from 4.x:

- `observerMode` is replaced with `purchasesAreCompletedBy`
- There are new entitlements verification options
- Customer Info structure has some changes

Our implementation has been updated to work with RevenueCat 5.x.
