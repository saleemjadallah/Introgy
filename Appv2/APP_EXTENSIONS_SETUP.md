# Setting Up App Extensions with RevenueCat

This guide provides step-by-step instructions for setting up App Extensions with RevenueCat, enabling sharing of subscription data between your main app and any extensions.

## 1. Configure App Groups in Xcode

### Enable App Groups for Your Main App

1. Open your Xcode project
2. Select your app target
3. Go to the "Signing & Capabilities" tab
4. Click the "+" button and add "App Groups"
5. Create a new app group with the format: `group.com.yourcompany.yourapp`
   - This should match the `appGroupIdentifier` defined in `RevenueCatConfig.swift`
   - Example: `group.com.introgy.app`
6. Check the app group to enable it for your app

### Enable App Groups for Your Extensions

If you have app extensions (like a Share Extension, Today Widget, etc.):

1. Select the extension target
2. Go to the "Signing & Capabilities" tab
3. Add the "App Groups" capability
4. Select the SAME app group you created for the main app

## 2. Configure Your Apple Developer Portal

1. Log in to the [Apple Developer Portal](https://developer.apple.com/account/)
2. Go to "Certificates, Identifiers & Profiles"
3. Select "Identifiers" in the sidebar
4. Find and select your App ID
5. Enable "App Groups" in the list of capabilities
6. Configure the App Groups and select the group ID you created
7. Save your changes

Repeat these steps for each extension's App ID.

## 3. Using RevenueCat in Your App Extension

For Swift code in your app extension, you can initialize RevenueCat with the shared UserDefaults:

```swift
import RevenueCat

// In your app extension
RevenueCatConfig.configureForExtension(apiKey: "your_api_key")

// Now you can check subscription status
Purchases.shared.getCustomerInfo { (customerInfo, error) in
    if let entitlements = customerInfo?.entitlements.active {
        // Check if user has active entitlements
        if entitlements.count > 0 {
            // User has an active subscription
        } else {
            // User doesn't have an active subscription
        }
    }
}
```

## 4. Troubleshooting

### Common Issues

1. **Entitlements are not shared**: Verify that both your main app and extensions are using the same app group identifier.

2. **App Group not found**: Make sure you properly configured the app group in the Apple Developer Portal and in your project settings.

3. **RevenueCat initialization failure**: Confirm that you're using the same API key across your main app and extensions.

4. **Build errors**: If you get build errors, make sure all targets that use RevenueCat have the framework properly linked.

### Testing App Groups

To verify that your app group is working correctly:

```swift
// In your main app
let appGroupDefaults = UserDefaults(suiteName: "group.com.introgy.app")
appGroupDefaults?.set("test_value", forKey: "test_key")

// In your extension
let appGroupDefaults = UserDefaults(suiteName: "group.com.introgy.app")
let testValue = appGroupDefaults?.string(forKey: "test_key")
print("Shared value: \(testValue ?? "not found")")
```

If the value is correctly retrieved in the extension, your app group is working properly.

## 5. Additional Resources

- [Apple Documentation on App Groups](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_application-groups)
- [RevenueCat Documentation](https://docs.revenuecat.com/docs)
