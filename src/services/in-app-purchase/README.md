
# RevenueCat Integration Notes

This document contains important information about the RevenueCat integration in our application.

## RevenueCat 5.x Migration Information

RevenueCat 5.x has made several breaking changes compared to 4.x:

1. **StoreKit 2 Support**: Version 5.0 enables full StoreKit 2 flow by default.

2. **Observer Mode Renamed**: The term "Observer Mode" has been deprecated and replaced with `purchasesAreCompletedBy` (either RevenueCat or your app).

3. **Trusted Entitlements**: Version 5.0 enables Informational mode for Trusted Entitlements by default.

4. **Deployment Target Changes**: The minimum targets have been raised:
   - iOS 13.0
   - tvOS 13.0
   - watchOS 6.2
   - macOS 10.15

5. **Required In-App Purchase Key**: When upgrading to v5, you must configure your In-App Purchase Key in the RevenueCat dashboard. Purchases will fail if the key is not configured.

For further details, refer to the [official RevenueCat 5.x migration guide](https://docs.revenuecat.com/docs/ios-native-5-0-migration).
