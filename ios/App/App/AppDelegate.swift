    import UIKit
    import Capacitor
    import RevenueCat
    import WebKit
    import ObjectiveC
    import GoogleSignIn
    import os.signpost
    import SafariServices
    import AuthenticationServices
    import Foundation
    import MobileCoreServices
    
    // No need to import BrowserPluginPatch as we'll implement directly
    import class App.WebViewAssetHandlerPatch

    // Network monitoring for debugging first launch issues
class NetworkMonitor {
    static let shared = NetworkMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")
    private var activeRequests = 0
    
    func registerRequest(url: URL?) {
        queue.sync {
            activeRequests += 1
            print("🌐 Network request started: \(url?.absoluteString ?? "unknown"). Active: \(activeRequests)")
        }
    }
    
    func unregisterRequest(url: URL?) {
        queue.sync {
            activeRequests -= 1
            print("🌐 Network request completed: \(url?.absoluteString ?? "unknown"). Active: \(activeRequests)")
        }
    }
    
    func activeRequestCount() -> Int {
        var count = 0
        queue.sync {
            count = activeRequests
        }
        return count
    }
}

class NetworkInterceptor: URLProtocol {
    static var isEnabled = true
    
    override class func canInit(with request: URLRequest) -> Bool {
        return isEnabled && URLProtocol.property(forKey: "NetworkInterceptorHandled", in: request) == nil
    }
    
    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }
    
    override func startLoading() {
        let newRequest = (request as NSURLRequest).mutableCopy() as! NSMutableURLRequest
        URLProtocol.setProperty(true, forKey: "NetworkInterceptorHandled", in: newRequest)
        
        NetworkMonitor.shared.registerRequest(url: request.url)
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        dataTask = session.dataTask(with: newRequest as URLRequest) { [weak self] data, response, error in
            guard let self = self else { return }
            
            if let error = error {
                self.client?.urlProtocol(self, didFailWithError: error)
                NetworkMonitor.shared.unregisterRequest(url: self.request.url)
                return
            }
            
            if let response = response {
                self.client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .allowed)
            }
            
            if let data = data {
                self.client?.urlProtocol(self, didLoad: data)
            }
            
            self.client?.urlProtocolDidFinishLoading(self)
            NetworkMonitor.shared.unregisterRequest(url: self.request.url)
        }
        dataTask?.resume()
    }
    
    override func stopLoading() {
        dataTask?.cancel()
    }
    
    private var dataTask: URLSessionDataTask?
}

extension NetworkInterceptor: URLSessionDataDelegate {
    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        client?.urlProtocol(self, didLoad: data)
    }
    
    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        if let error = error {
            client?.urlProtocol(self, didFailWithError: error)
        } else {
            client?.urlProtocolDidFinishLoading(self)
        }
    }
}

@UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate, AuthEventLogger {
        // Track if we're handling auth
        private var isHandlingAuth = false
        var window: UIWindow?
        
        // Store a reference to the Capacitor bridge for WebView access
        private var capacitorBridge: CAPBridgeProtocol?
        
        // Supabase Auth Handler
        private var supabaseAuthHandler: SupabaseAuthHandler?
        
        // Performance logging
        let log = OSLog(subsystem: "ai.introgy.app", category: "Performance")
        let initialLaunchKey = "initialLaunchCompleted"
        let googleAuthTimeoutKey = "googleAuthTimeout"
        
        // Timeout handling
        var googleAuthTimeout: DispatchWorkItem?

        @objc func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Start performance tracing
        let signpostID = OSSignpostID(log: log)
        os_signpost(.begin, log: log, name: "AppStartup", signpostID: signpostID, "App launch started")
            print("📱 App starting - didFinishLaunchingWithOptions")
            
            // First launch detection
            let isFirstLaunch = !UserDefaults.standard.bool(forKey: "app_previously_launched")
            if isFirstLaunch {
                print("📱 First launch detected - will use special initialization sequence")
                UserDefaults.standard.set(true, forKey: "app_previously_launched")
                os_signpost(.event, log: log, name: "AppStartup", signpostID: signpostID, "First launch detected")
            }
            
            // Enable network monitoring for debugging
            URLProtocol.registerClass(NetworkInterceptor.self)
            
            // Safe registration of our custom URL protocol
            // Use a user default to track if we've already registered
            let isExternalBrowserBlockerRegistered = UserDefaults.standard.bool(forKey: "BlockExternalBrowserProtocolRegistered")
            
            if !isExternalBrowserBlockerRegistered {
                URLProtocol.registerClass(BlockExternalBrowserProtocol.self)
                // Mark as registered
                UserDefaults.standard.set(true, forKey: "BlockExternalBrowserProtocolRegistered")
                print("🔒 Registered BlockExternalBrowserProtocol to prevent external browser for auth URLs")
            } else {
                print("🔒 BlockExternalBrowserProtocol already registered")
            }
            
            // Update session config with our protocols
            let sessionConfig = URLSessionConfiguration.default
            sessionConfig.protocolClasses = [BlockExternalBrowserProtocol.self, NetworkInterceptor.self] + (sessionConfig.protocolClasses ?? [])
            // Create a custom session instead of replacing shared
            _ = URLSession(configuration: sessionConfig)
            
            // Enable URL swizzling to intercept external browser requests
            Swizzler.swizzleURLOpening()
            print("🔒 URL swizzling enabled to intercept external browser requests")
            logEvent("URL swizzling enabled for in-app authentication")
            
            // Apply direct patch to Browser plugin
            self.patchBrowserPlugin()
            print("🔒 Applied direct patch to force in-app browser")
            logEvent("Applied direct patch to force in-app browser")
            
            // Apply patch to WebViewAssetHandler to fix deprecated API warnings
            WebViewAssetHandlerPatch.apply()
            print("🔧 Applied patch to WebViewAssetHandler for modern UTType APIs")
            logEvent("Applied patch to WebViewAssetHandler for modern UTType APIs")
            
            // Add observer for Capacitor Browser plugin's open method
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(interceptBrowserOpen),
                name: Notification.Name("CAPNotificationOpenURL"),
                object: nil
            )
            
            // Add observer specifically for Browser plugin
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(interceptBrowserPlugin),
                name: Notification.Name("capacitor://browser.open"),
                object: nil
            )
            
            // Also add observer for external URL opening
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(interceptExternalURLOpening),
                name: Notification.Name("CAPNotificationOpenExternalURL"),
                object: nil
            )
            
            // Set up timeout for Google Auth initialization
            setupGoogleAuthTimeout(isFirstLaunch: isFirstLaunch)
            
            // Initialize components with proper timing for first launch
            if isFirstLaunch {
                print("⏳ First launch detected - deferring Google Auth initialization")
                os_signpost(.event, log: log, name: "AppStartup", signpostID: signpostID, "Deferring Google Auth initialization")
                
                // Initialize components with a delay on first launch to prevent freezing
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
                    guard let self = self else { return }
                    
                    // Use a dispatch group to ensure initialization completes before proceeding
                    let initGroup = DispatchGroup()
                    
                    // Initialize RevenueCat
                    initGroup.enter()
                    DispatchQueue.main.async {
                        if UserDefaults.standard.bool(forKey: "revenueCatInitialized") == false {
                            print("📱 Initializing RevenueCat...")
                            Purchases.logLevel = .debug
                            let apiKey = "appl_wHXBFRFAOUUpWRqauPXyZEUElmq"
                            Purchases.configure(withAPIKey: apiKey)
                            UserDefaults.standard.set(true, forKey: "revenueCatInitialized")
                            print("📱 RevenueCat initialized with API key")
                        } else {
                            print("📱 RevenueCat already initialized, skipping configuration")
                        }
                        initGroup.leave()
                    }
                    
                    // Configure Google Sign-In
                    initGroup.enter()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        print("📱 Configuring Google Sign-In...")
                        os_signpost(.event, log: self.log, name: "GoogleAuth", "Google Sign-In configuration started")
                        GoogleAuthHandler.shared.configure()
                        print("📱 Google Sign-In configured")
                        
                        // Cancel timeout since initialization completed
                        self.googleAuthTimeout?.cancel()
                        
                        os_signpost(.event, log: self.log, name: "GoogleAuth", "Google Sign-In configuration completed")
                        initGroup.leave()
                    }
                }
            } else {
                // Normal initialization for subsequent launches
                // Initialize RevenueCat
                if UserDefaults.standard.bool(forKey: "revenueCatInitialized") == false {
                    Purchases.logLevel = .debug
                    let apiKey = "appl_wHXBFRFAOUUpWRqauPXyZEUElmq"
                    Purchases.configure(withAPIKey: apiKey)
                    UserDefaults.standard.set(true, forKey: "revenueCatInitialized")
                    print("📱 RevenueCat initialized with API key")
                } else {
                    print("📱 RevenueCat already initialized, skipping configuration")
                }
                
                // Configure Google Sign-In
                os_signpost(.event, log: log, name: "GoogleAuth", "Google Sign-In configuration started")
                GoogleAuthHandler.shared.configure()
                
                // Cancel timeout since initialization completed
                self.googleAuthTimeout?.cancel()
                
                os_signpost(.event, log: log, name: "GoogleAuth", "Google Sign-In configuration completed")
            }
            
            // Create window with standard Capacitor setup first
            window = UIWindow(frame: UIScreen.main.bounds)
            
            // Create the Capacitor view controller
            let viewController = CAPBridgeViewController()
            
            // Create a navigation controller with the view controller
            let navController = UINavigationController(rootViewController: viewController)
            navController.navigationBar.isHidden = true
            
            // Set the root view controller
            window?.rootViewController = navController
            window?.makeKeyAndVisible()
            
            // Store a reference to the bridge for later use
            self.capacitorBridge = viewController.bridge
            
            // On first launch, use a sequential initialization approach
            if isFirstLaunch {
                // Use a dispatch group to ensure initialization completes before proceeding
                let initGroup = DispatchGroup()
                
                // Step 1: Initialize RevenueCat
                initGroup.enter()
                DispatchQueue.main.async {
                    if UserDefaults.standard.bool(forKey: "revenueCatInitialized") == false {
                        print("📱 Initializing RevenueCat...")
                        Purchases.logLevel = .debug
                        let apiKey = "appl_wHXBFRFAOUUpWRqauPXyZEUElmq"
                        Purchases.configure(withAPIKey: apiKey)
                        UserDefaults.standard.set(true, forKey: "revenueCatInitialized")
                        print("📱 RevenueCat initialized with API key")
                    } else {
                        print("📱 RevenueCat already initialized, skipping configuration")
                    }
                    initGroup.leave()
                }
                
                // Step 2: Set up URL interception after a delay
                initGroup.enter()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    self.setupURLInterception()
                    print("📱 URL interception set up")
                    initGroup.leave()
                }
                
                // Step 3: Configure Google Sign-In after a delay
                initGroup.enter()
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    print("📱 Configuring Google Sign-In...")
                    os_signpost(.event, log: self.log, name: "GoogleAuth", "Google Sign-In configuration started")
                    GoogleAuthHandler.shared.configure()
                    print("📱 Google Sign-In configured")
                    
                    // Cancel timeout since initialization completed
                    self.googleAuthTimeout?.cancel()
                    
                    os_signpost(.event, log: self.log, name: "GoogleAuth", "Google Sign-In configuration completed")
                    initGroup.leave()
                }
                
                // Notify when all initialization is complete
                initGroup.notify(queue: .main) {
                    print("📱 All initialization complete")
                }
            } else {
                // For subsequent launches, use the regular initialization
                // Initialize RevenueCat
                if UserDefaults.standard.bool(forKey: "revenueCatInitialized") == false {
                    Purchases.logLevel = .debug
                    let apiKey = "appl_wHXBFRFAOUUpWRqauPXyZEUElmq"
                    Purchases.configure(withAPIKey: apiKey)
                    UserDefaults.standard.set(true, forKey: "revenueCatInitialized")
                    print("📱 RevenueCat initialized with API key")
                } else {
                    print("📱 RevenueCat already initialized, skipping configuration")
                }
                
                // Set up URL interception
                setupURLInterception()
                
                // Configure Google Sign-In
                os_signpost(.event, log: self.log, name: "GoogleAuth", "Google Sign-In configuration started")
                GoogleAuthHandler.shared.configure()
                
                // Cancel timeout since initialization completed
                self.googleAuthTimeout?.cancel()
                
                os_signpost(.event, log: self.log, name: "GoogleAuth", "Google Sign-In configuration completed")
            }
            
            // Register plugins - this should happen regardless of first launch
            _ = GoogleAuthPlugin()
            // The plugin will be registered automatically by Capacitor
            
            // Don't attempt to restore Google Sign-In during app launch
            // We'll do it later in applicationDidBecomeActive to prevent crashes
            
            return true
        }
        
        @objc func applicationDidBecomeActive(_ application: UIApplication) {
        // Performance tracing for app activation
        let signpostID = OSSignpostID(log: log)
        os_signpost(.begin, log: log, name: "AppActivation", signpostID: signpostID, "App became active")
            print("📱 Application became active")
            
            // Check if this is first launch
            let isFirstLaunch = UserDefaults.standard.bool(forKey: "app_previously_launched") && 
                                !UserDefaults.standard.bool(forKey: "first_become_active_completed")
                                
            // Check if we had a Google Auth timeout on previous launch
            let hadTimeout = UserDefaults.standard.bool(forKey: googleAuthTimeoutKey)
            if hadTimeout {
                print("⚠️ Previous Google Auth timeout detected - attempting recovery")
                UserDefaults.standard.set(false, forKey: googleAuthTimeoutKey)
                
                // Try to initialize Google Auth again if it timed out previously
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    GoogleAuthHandler.shared.configure()
                }
            }
            
            // On first launch, use a longer delay and more careful approach
            let delay = isFirstLaunch ? 5.0 : 3.0
            
            if isFirstLaunch {
                print("📱 First applicationDidBecomeActive - using extended delay (\(delay)s)")
                // Mark that we've completed the first become active cycle
                UserDefaults.standard.set(true, forKey: "first_become_active_completed")
            }
            
            // Safely restore Google Sign-In state after app is fully active
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                // Wrap in a try-catch to prevent any crashes
                do {
                    // Check if Google Sign-In is properly configured before attempting to restore
                    if GIDSignIn.sharedInstance.hasPreviousSignIn() {
                        print("📱 Previous Google Sign-In detected, attempting to restore")
                        
                        GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
                            if let error = error {
                                print("❌ Error restoring Google Sign-In: \(error.localizedDescription)")
                                self.logEvent("Error restoring Google Sign-In: \(error.localizedDescription)")
                                
                                // Notify about the error
                                NotificationCenter.default.post(
                                    name: Notification.Name("googleSignInError"),
                                    object: nil,
                                    userInfo: ["error": error.localizedDescription]
                                )
                            } else if let user = user {
                                print("✅ Successfully restored Google Sign-In")
                                self.logEvent("Successfully restored Google Sign-In for user: \(user.profile?.email ?? "unknown")")
                                
                                // Get the ID token
                                if let idToken = user.idToken?.tokenString {
                                    self.logEvent("Retrieved ID token from restored session")
                                    
                                    // Store token data for JavaScript layer to use
                                    let tokenData: [String: Any] = [
                                        "idToken": idToken,
                                        "accessToken": user.accessToken.tokenString,
                                        "user": [
                                            "email": user.profile?.email ?? "",
                                            "name": user.profile?.name ?? "",
                                            "id": user.userID ?? ""
                                        ]
                                    ]
                                    
                                    // Store in UserDefaults for debugging and potential recovery
                                    UserDefaults.standard.set(idToken, forKey: "google_id_token")
                                    UserDefaults.standard.set(user.accessToken.tokenString, forKey: "google_access_token")
                                    UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "google_auth_timestamp")
                                    
                                    // Notify JavaScript about the restored session with a slightly longer delay
                                    // Use an even longer delay on first launch
                                    let notifyDelay = isFirstLaunch ? 3.5 : 2.5
                                    DispatchQueue.main.asyncAfter(deadline: .now() + notifyDelay) {
                                        // Find the plugin to notify JavaScript
                                        // Since we can't directly access the plugin through the bridge protocol,
                                        // we'll use NotificationCenter to notify all plugins
                                        NotificationCenter.default.post(name: Notification.Name("googleSignInComplete"), object: nil, userInfo: ["tokens": tokenData])
                                        self.logEvent("Notifying JavaScript about restored Google session via NotificationCenter")
                                    }
                                } else {
                                    self.logEvent("No ID token available in restored session")
                                }
                            } else {
                                print("ℹ️ No previous Google Sign-In session to restore")
                                self.logEvent("No previous Google Sign-In session to restore")
                            }
                        }
                    } else {
                        print("ℹ️ No previous Google Sign-In detected")
                    }
                } catch {
                    print("⚠️ Exception during Google Sign-In restoration: \(error)")
                    self.logEvent("Exception during Google Sign-In restoration: \(error)")
                }
            }
            
            // Set up notification observers for Google Sign-In events
            
                // URL interception observers removed for rebuild
            
            // Configure WebView with a delay to ensure it's fully loaded
            // This is critical for preventing freezes on first launch
            let webViewDelay = isFirstLaunch ? 2.0 : 0.5
            DispatchQueue.main.asyncAfter(deadline: .now() + webViewDelay) {
                let webViewSignpostID = OSSignpostID(log: self.log)
                os_signpost(.begin, log: self.log, name: "WebViewConfig", signpostID: webViewSignpostID, "WebView configuration started")
                self.configureWebView(isFirstLaunch: isFirstLaunch)
                os_signpost(.end, log: self.log, name: "WebViewConfig", signpostID: webViewSignpostID, "WebView configuration completed")
                
                // Add JavaScript event listener for custom forceInAppBrowsing event
                if let webView = self.findWebView() {
                    // First remove any existing handler to prevent duplicates
                    webView.configuration.userContentController.removeScriptMessageHandler(forName: "forceInAppBrowsing")
                    
                    let script = """
                    document.addEventListener('forceInAppBrowsing', function(event) {
                        if (event.detail && event.detail.url) {
                            console.log('Received forceInAppBrowsing event with URL:', event.detail.url);
                            window.webkit.messageHandlers.forceInAppBrowsing.postMessage({url: event.detail.url});
                        }
                    });
                    console.log('Added forceInAppBrowsing event listener');
                    """
                    
                    let userScript = WKUserScript(source: script, injectionTime: .atDocumentStart, forMainFrameOnly: false)
                    webView.configuration.userContentController.addUserScript(userScript)
                    
                    // Add message handler for the event
                    webView.configuration.userContentController.add(self, name: "forceInAppBrowsing")
                    print("🔒 Added JavaScript event listener for forceInAppBrowsing")
                    self.logEvent("Added JavaScript event listener for forceInAppBrowsing")
                }
            }
            
                // Plugin registration verification removed for rebuild
                
                // End performance tracing for app activation
                os_signpost(.end, log: log, name: "AppActivation", signpostID: signpostID, "App activation completed")
            
            // Navigation controller is already set up above
        }

        @objc func applicationWillResignActive(_ application: UIApplication) {
            // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
            // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
        }

        @objc func applicationDidEnterBackground(_ application: UIApplication) {
            // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
            // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
        }

        @objc func applicationWillEnterForeground(_ application: UIApplication) {
            // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
        }

        // This method is already implemented above

        @objc func applicationWillTerminate(_ application: UIApplication) {
            // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
        }
        
        // MARK: - WebView Configuration
        
        private func setupGoogleAuthTimeout(isFirstLaunch: Bool) {
        // Create a timeout handler for Google Auth initialization
        googleAuthTimeout = DispatchWorkItem { [weak self] in
            guard let self = self else { return }
            print("⚠️ Google Auth initialization timed out")
            os_signpost(.event, log: self.log, name: "GoogleAuth", "Initialization timed out")
            
            // Record the timeout for debugging
            UserDefaults.standard.set(true, forKey: self.googleAuthTimeoutKey)
            
            // Force proceed with limited functionality
            self.proceedWithLimitedFunctionality()
        }
        
        // Set timeout (longer for first launch)
        let timeoutInterval = isFirstLaunch ? 10.0 : 5.0
        if let timeout = googleAuthTimeout {
            DispatchQueue.main.asyncAfter(deadline: .now() + timeoutInterval, execute: timeout)
        }
    }
    
    private func proceedWithLimitedFunctionality() {
        // Proceed with app launch even if Google Auth fails
        print("⚠️ Proceeding with limited functionality due to Google Auth timeout")
        
        // Ensure the app becomes responsive even if auth fails
        DispatchQueue.main.async {
            // Notify the webview that auth initialization had issues
            if let webView = self.findWebView() {
                let js = "window.dispatchEvent(new CustomEvent('googleAuthTimeout', { detail: { message: 'Google Auth initialization timed out' } }));"
                webView.evaluateJavaScript(js, completionHandler: nil)
            }
        }
    }
    
    private func configureWebView(isFirstLaunch: Bool) {
            print("📱 Configuring WebView - isFirstLaunch: \(isFirstLaunch)")
            
            // Find the WebView in the view hierarchy
            guard let viewController = window?.rootViewController?.children.first as? CAPBridgeViewController,
                  let webView = viewController.webView else {
                print("❌ Failed to find WebView for configuration")
                return
            }
            
            // Clear existing user scripts to prevent duplicates
            webView.configuration.userContentController.removeAllUserScripts()
            
            // Initialize Supabase Auth Handler
            supabaseAuthHandler = SupabaseAuthHandler(webView: webView, logger: self)
            
            // Enable JavaScript (using updated API for iOS 14+)
            if #available(iOS 14.0, *) {
                webView.configuration.defaultWebpagePreferences.allowsContentJavaScript = true
            } else {
                // Fallback on earlier versions
                webView.configuration.preferences.javaScriptEnabled = true
            }
            
            // Configure additional WebView settings
            webView.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
            webView.configuration.allowsInlineMediaPlayback = true
            webView.configuration.mediaTypesRequiringUserActionForPlayback = []
            
            // Set process pool to ensure cookies are shared properly
            let processPool = WKProcessPool()
            webView.configuration.processPool = processPool
            
            // Add console logging
            webView.configuration.userContentController.addUserScript(
                WKUserScript(
                    source: """
                    console.log = (function(originalLog) {
                        return function(...args) {
                            window.webkit.messageHandlers.console.postMessage(args.map(String).join(' '));
                            originalLog.apply(console, args);
                        };
                    })(console.log);
                    """,
                    injectionTime: .atDocumentStart,
                    forMainFrameOnly: false
                )
            )
            
            // Add additional script to detect WebView readiness
            webView.configuration.userContentController.addUserScript(
                WKUserScript(
                    source: """
                    document.addEventListener('DOMContentLoaded', function() {
                        window.webkit.messageHandlers.console.postMessage('WebView DOM ready');
                    });
                    """,
                    injectionTime: .atDocumentStart,
                    forMainFrameOnly: false
                )
            )
            
            // For first launch, add a special handler to detect potential issues
            if isFirstLaunch {
                webView.configuration.userContentController.addUserScript(
                    WKUserScript(
                        source: """
                        window.onerror = function(message, source, lineno, colno, error) {
                            window.webkit.messageHandlers.console.postMessage('WebView ERROR: ' + message + ' at ' + source + ':' + lineno);
                            return false;
                        };
                        """,
                        injectionTime: .atDocumentStart,
                        forMainFrameOnly: false
                    )
                )
            }
            
            print("✅ WebView configuration complete")
        }
        
        // MARK: - Notification Handlers
        
        // Google Sign-In notification handlers removed for rebuild
        
        @objc func handleCloseBrowser() {
            print("📱 Received notification to close browser")
            DispatchQueue.main.async {
                // Notify Capacitor to close any open browsers
                NotificationCenter.default.post(
                    name: Notification.Name("CAPNotificationCloseBrowser"),
                    object: nil
                )
                
                // Also notify JavaScript about browser closure using our improved WebView finder
                if let webView = self.findWebView() {
                    print("📱 Dispatching browserClosed event to JavaScript")
                    let script = "document.dispatchEvent(new CustomEvent('browserClosed', { detail: { success: true } }));"
                    webView.evaluateJavaScript(script) { (result, error) in
                        if let error = error {
                            print("❌ Error dispatching browserClosed event: \(error)")
                        } else {
                            print("✅ Successfully dispatched browserClosed event to JavaScript")
                        }
                    }
                } else {
                    print("❌ Could not find WebView to dispatch browserClosed event")
                }
            }
        }
        
        // Google Sign-In related code removed for rebuild
        
        @objc func interceptURLOpening(_ notification: Notification) {
            guard let userInfo = notification.userInfo,
                  let urlString = userInfo["url"] as? String else {
                return
            }
            
            print("🔍 Intercepted URL opening: \(urlString)")
            
            // URL interception code simplified for rebuild
            // Close any open browsers first
            self.handleCloseBrowser()
            
            // Check if this is a Google auth URL
            let isGoogleAuthURL = urlString.contains("google") || 
                                 urlString.contains("oauth") || 
                                 urlString.contains("auth/v1") || 
                                 urlString.contains("googleusercontent") ||
                                 urlString.contains("supabase")
            
            if isGoogleAuthURL {
                print("🔍 Detected Google auth URL, handling in-app")
                
                // Parse the URL to extract components for debugging
                if let url = URL(string: urlString),
                   let components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
                    print("🔍 URL scheme: \(components.scheme ?? "none")")
                    print("🔍 URL host: \(components.host ?? "none")")
                    print("🔍 URL path: \(components.path)")
                    
                    // Check which client ID type is being used
                    let clientIDType = UserDefaults.standard.string(forKey: "google_client_id_type") ?? "ios"
                    print("🔍 Auth flow using client ID type: \(clientIDType)")
                    
                    // Check for "requested path is invalid" error
                    if urlString.contains("requested path is invalid") {
                        print("❌ Detected 'requested path is invalid' error - handling specially")
                        
                        // This error often occurs when the redirect URL doesn't match what's configured in Google Console
                        // Log the expected redirect URL for debugging
                        let expectedRedirectURL = clientIDType == "web" ?
                            UserDefaults.standard.string(forKey: "google_redirect_url_supabase") :
                            UserDefaults.standard.string(forKey: "google_redirect_url")
                        
                        print("🔍 Expected redirect URL: \(expectedRedirectURL ?? "none")")
                        print("🔍 Actual URL received: \(urlString)")
                        
                        // Notify about the error
                        NotificationCenter.default.post(
                            name: NSNotification.Name("GoogleAuthError"),
                            object: nil,
                            userInfo: ["error": "requested path is invalid", "url": urlString]
                        )
                    }
                    
                    // Check for error in URL
                    if components.path.contains("error") || urlString.contains("error") {
                        print("❌ Error detected in URL: \(urlString)")
                    }
                    
                    // Try to handle with GoogleAuthHandler first
                    if GoogleAuthHandler.shared.handleURL(url: url) {
                        print("✅ URL handled by GoogleAuthHandler")
                        NotificationCenter.default.post(
                            name: NSNotification.Name("CAPNotificationOpenURLResult"),
                            object: nil,
                            userInfo: ["handled": true]
                        )
                        return
                    }
                }
                
                // If we get here, let Capacitor try to handle it
                print("🔍 Letting Capacitor handle the URL")
            }
            
            // Let Capacitor handle the URL
            NotificationCenter.default.post(
                name: NSNotification.Name("CAPNotificationOpenURLResult"),
                object: nil,
                userInfo: ["handled": false]
            )
        }
        
        @objc func interceptAllURLs(_ notification: Notification) {
            guard let userInfo = notification.userInfo,
                  let urlString = userInfo["url"] as? String else {
                return
            }
            
            print("🔍 Intercepting ALL URL openings: \(urlString)")
            
            // If this is a Google Auth URL, handle it specifically to avoid race conditions
            if urlString.contains("accounts.google.com") || 
               urlString.contains("oauth") || 
               urlString.contains("auth") || 
               urlString.contains("google") || 
               urlString.contains("googleusercontent") {
                
                print("🔒 Handling Google auth URL: \(urlString)")
                
                // Close any open browsers first
                self.handleCloseBrowser()
                
                // Try to handle with Google Sign-In directly if it's a URL
                if let url = URL(string: urlString), GIDSignIn.sharedInstance.handle(url) {
                    print("✅ URL handled directly by Google Sign-In SDK")
                    
                    // Mark as handled to prevent default behavior
                    NotificationCenter.default.post(
                        name: NSNotification.Name("CAPNotificationOpenURLResult"),
                        object: nil,
                        userInfo: ["handled": true]
                    )
                    return
                }
                
                // If not handled by Google Sign-In directly, use our custom handler
                self.handleGoogleAuthURLs(notification)
                return
            }
        }
        
        @objc func handleForceInAppBrowser(_ notification: Notification) {
            guard let userInfo = notification.userInfo,
                  let urlString = userInfo["url"] as? String else {
                return
            }
            
            print("🔒 Force handling URL in in-app browser: \(urlString)")
            
            // Close any existing browsers first
            self.handleCloseBrowser()
            
            // Find the WebView to communicate with JavaScript
            if let webView = self.findWebView() {
                // Execute JavaScript to open the URL in the in-app browser
                let script = "if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) { window.Capacitor.Plugins.Browser.open({ url: '\(urlString)', presentationStyle: 'fullscreen', toolbarColor: '#121212', windowName: '_self' }).then(function() { console.log('Successfully opened URL in in-app browser'); }).catch(function(error) { console.error('Error opening URL in in-app browser:', error); }); } else { console.error('Browser plugin not available'); }"
                
                webView.evaluateJavaScript(script) { (result, error) in
                    if let error = error {
                        print("❌ Error executing JavaScript to open in-app browser: \(error)")
                    } else {
                        print("✅ Successfully executed JavaScript to open in-app browser")
                    }
                }
            } else {
                print("❌ Could not find WebView to execute JavaScript")
            }
        }
        
        // Instead of using method swizzling, we'll use notification observers to intercept URLs
        func setupURLInterception() {
            // Remove existing observers first to prevent duplicates
            NotificationCenter.default.removeObserver(self, name: Notification.Name("CAPNotificationOpenURL"), object: nil)
            NotificationCenter.default.removeObserver(self, name: Notification.Name("CloseBrowser"), object: nil)
            
            // Set up notification observers for URL interception
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(interceptAllURLs),
                name: Notification.Name("CAPNotificationOpenURL"),
                object: nil
            )
            
            // Add notification observer for browser closure
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(handleCloseBrowser),
                name: Notification.Name("CloseBrowser"),
                object: nil
            )
            
            print("🔒 Set up URL interception via notification observers - with duplicate prevention")
        }
        
        // Handle Google auth URLs in-app
        @objc func handleGoogleAuthURLs(_ notification: Notification) {
            guard let userInfo = notification.userInfo,
                  let urlString = userInfo["url"] as? String else {
                return
            }
            
            print("🔍 Intercepting ALL URL openings: \(urlString)")
            
            // Get client IDs for reference
            let iosClientID = UserDefaults.standard.string(forKey: "google_ios_client_id") ?? 
                              "308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com"
            let webClientID = UserDefaults.standard.string(forKey: "google_web_client_id") ?? 
                              "308656966304-ouvq7u7q9sms8rujjtqpevaqr120vdge.apps.googleusercontent.com"
            
            // Check if this is an auth-related URL that should be handled in-app
            let isAuthRelatedURL = urlString.contains("google") || 
                                 urlString.contains("oauth") || 
                                 urlString.contains("auth") || 
                                 urlString.contains("login") || 
                                 urlString.contains("signin") || 
                                 urlString.contains("callback") || 
                                 urlString.contains("redirect") || 
                                 urlString.contains("googleusercontent") ||
                                 urlString.contains("supabase") ||
                                 urlString.contains("gnvlzzqtmxrfvkdydxet") ||
                                 urlString.contains(iosClientID.replacingOccurrences(of: ".apps.googleusercontent.com", with: "")) ||
                                 urlString.contains(webClientID.replacingOccurrences(of: ".apps.googleusercontent.com", with: ""))
            logEvent("Intercepting URL: \(urlString)")
            
            // Prevent external browser for all auth-related URLs
            if isAuthRelatedURL {
                
                print("🔒 Handling auth URL in-app: \(urlString)")
                logEvent("Handling auth URL in-app")
                
                // Close any open browsers first
                self.handleCloseBrowser()
                
                // Handle the URL with our custom WebView instead of opening Safari
                if let url = URL(string: urlString), let webView = self.findWebView() {
                    // Load the URL in our WebView
                    let request = URLRequest(url: url)
                    webView.load(request)
                    
                    // Mark as handled to prevent default behavior
                    NotificationCenter.default.post(
                        name: NSNotification.Name("CAPNotificationOpenURLResult"),
                        object: nil,
                        userInfo: ["handled": true]
                    )
                } else {
                    print("❌ Could not find WebView or create URL to load auth URL")
                    logEvent("Could not find WebView or create URL to load auth URL")
                    
                    // Let Capacitor handle it as fallback
                    NotificationCenter.default.post(
                        name: NSNotification.Name("CAPNotificationOpenURLResult"),
                        object: nil,
                        userInfo: ["handled": false]
                    )
                }
            } else {
                // For non-Google URLs, let Capacitor handle it
                NotificationCenter.default.post(
                    name: NSNotification.Name("CAPNotificationOpenURLResult"),
                    object: nil,
                    userInfo: ["handled": false]
                )
            }
        }
        
        // Helper method to extract parameters from URL strings
        private func extractParameter(from urlString: String, param: String) -> String? {
            // Check for parameter in query string format
            if let queryRegex = try? NSRegularExpression(pattern: "[?&]\(param)=([^&]+)", options: []) {
                let nsString = urlString as NSString
                if let match = queryRegex.firstMatch(in: urlString, options: [], range: NSRange(location: 0, length: nsString.length)) {
                    let paramValue = nsString.substring(with: match.range(at: 1))
                    return paramValue.removingPercentEncoding
                }
            }
            
            // Check for parameter in fragment format
            if let fragmentRegex = try? NSRegularExpression(pattern: "#.*\(param)=([^&]+)", options: []) {
                let nsString = urlString as NSString
                if let match = fragmentRegex.firstMatch(in: urlString, options: [], range: NSRange(location: 0, length: nsString.length)) {
                    let paramValue = nsString.substring(with: match.range(at: 1))
                    return paramValue.removingPercentEncoding
                }
            }
            
            return nil
        }

        @objc func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
            // Log the URL for debugging with basic information
            print("📱 AppDelegate: Received URL: \(url.absoluteString)")
            logEvent("Received URL: \(url.absoluteString)")
            
            // Special handling for our auth callback URL scheme
            if url.scheme == "introgy" && (url.host == "auth.supabase.co" || (url.host == "auth" && url.path == "/callback")) {
                print("🔑 Handling auth callback with our custom scheme")
                logEvent("Processing auth callback URL with scheme: introgy://auth.supabase.co/callback")
                
                isHandlingAuth = false
                
                // Extract tokens from URL fragment if present
                if let fragment = url.fragment {
                    // Parse fragment parameters manually
                    var fragmentParams = [String: String]()
                    for param in fragment.components(separatedBy: "&") {
                        let parts = param.components(separatedBy: "=")
                        if parts.count == 2 {
                            let key = parts[0]
                            let value = parts[1].removingPercentEncoding ?? parts[1]
                            fragmentParams[key] = value
                        }
                    }
                    
                    // Check for tokens
                    if let accessToken = fragmentParams["access_token"],
                       let refreshToken = fragmentParams["refresh_token"] {
                        print("✅ Successfully extracted tokens from URL fragment")
                        logEvent("Found tokens in OAuth callback fragment")
                        
                        // Forward to SupabaseAuthHandler to handle the session setup
                        if let handler = supabaseAuthHandler {
                            handler.handleCallback(url: url)
                        }
                        return true
                    }
                }
                
                // Parse query parameters if fragment doesn't have tokens
                if let query = url.query {
                    // Parse query parameters manually
                    var queryParams = [String: String]()
                    for param in query.components(separatedBy: "&") {
                        let parts = param.components(separatedBy: "=")
                        if parts.count == 2 {
                            let key = parts[0]
                            let value = parts[1].removingPercentEncoding ?? parts[1]
                            queryParams[key] = value
                        }
                    }
                    
                    // Check for code parameter (authorization code flow)
                    if let code = queryParams["code"] {
                        print("✅ Found authorization code in OAuth callback")
                        logEvent("Found authorization code in OAuth callback")
                        
                        // Forward to the WebView to handle the code exchange
                        if let webView = findWebView() {
                            let js = """
                            try {
                                console.log('Found authorization code in URL, exchanging for session');
                                if (window.supabase && window.supabase.auth) {
                                    window.supabase.auth.exchangeCodeForSession('\(code)')
                                    .then(data => {
                                        console.log('Successfully exchanged code for session');
                                        window.dispatchEvent(new CustomEvent('supabase.auth.signIn', { 
                                            detail: { session: data.session } 
                                        }));
                                    })
                                    .catch(error => {
                                        console.error('Error exchanging code for session:', error);
                                    });
                                } else {
                                    console.error('Supabase auth not available');
                                    localStorage.setItem('pending_auth_code', '\(code)');
                                }
                            } catch (e) {
                                console.error('Error handling auth code:', e);
                            }
                            """
                            
                            webView.evaluateJavaScript(js) { result, error in
                                if let error = error {
                                    print("❌ Error exchanging code for session: \(error.localizedDescription)")
                                } else {
                                    print("✅ Code exchange initiated")
                                }
                            }
                        }
                        return true
                    }
                }
            }
            
            // Check for Supabase auth callback paths
            if url.absoluteString.contains("auth/v1/callback") {
                print("🔑 Detected standard Supabase auth callback URL")
                logEvent("Processing standard Supabase auth callback")
                
                // Let Supabase handler process it
                if let handler = supabaseAuthHandler, handler.handleCallback(url: url) {
                    return true
                }
            }
            
            // Check if this is a Google auth URL trying to open Safari
            if url.absoluteString.contains("accounts.google.com") && !isHandlingAuth {
                logEvent("Intercepting Google auth URL to use in-app browser")
                presentInAppBrowser(for: url)
                return false // Don't allow external browser
            }
            
            // Parse URL components for debugging
            if let components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
                print("🔍 URL scheme: \(components.scheme ?? "none")")
                print("🔍 URL host: \(components.host ?? "none")")
                print("🔍 URL path: \(components.path)")
                if let fragment = components.fragment {
                    print("🔍 URL fragment: \(fragment)")
                }
                if let query = components.query {
                    print("🔍 URL query: \(query)")
                }
            }
            
            // First try to handle with Google Sign-In
            let handled = GIDSignIn.sharedInstance.handle(url)
            if handled {
                print("✅ URL handled by Google Sign-In SDK")
                logEvent("URL handled by Google Sign-In")
                return true
            }
            
            // If not handled by Google Sign-In, try our custom handler
            if url.scheme == "com.googleusercontent.apps.308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2" ||
               url.scheme == "introgy" {
                logEvent("Handling Google Sign-In URL with custom handler")
                let customHandled = GoogleAuthHandler.shared.handleURL(url: url)
                if customHandled {
                    return true
                }
            }
            
            // Let Capacitor handle all other URLs
            logEvent("Delegating URL handling to Capacitor")
            return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
        }
        

        
        // Helper function to log auth events - implements AuthEventLogger protocol
        func logEvent(_ message: String) {
            let timestamp = Date().timeIntervalSince1970
            print("🔐 [\(timestamp)] AUTH: \(message)")
            
            // Store in UserDefaults for debugging
            var authLogs = UserDefaults.standard.array(forKey: "auth_event_logs") as? [String] ?? []
            authLogs.append("[\(timestamp)] \(message)")
            
            // Keep only the last 50 logs
            if authLogs.count > 50 {
                authLogs = Array(authLogs.suffix(50))
            }
            
            UserDefaults.standard.set(authLogs, forKey: "auth_event_logs")
        }
        
        // Helper function to find the WebView safely
        private func findWebView() -> WKWebView? {
            logEvent("Attempting to find WebView")
            
            // Try to get WebView from Capacitor bridge (preferred method)
            if let navController = window?.rootViewController as? UINavigationController {
                logEvent("Found navigation controller")
                
                if let viewController = navController.viewControllers.first as? CAPBridgeViewController {
                    logEvent("Found CAPBridgeViewController")
                    if let webView = viewController.webView {
                        logEvent("Successfully found WebView via bridge")
                        return webView
                    } else {
                        logEvent("CAPBridgeViewController exists but webView is nil")
                    }
                } else if let viewController = navController.viewControllers.first {
                    logEvent("Found view controller of type: \(type(of: viewController))")
                }
            } else if let rootVC = window?.rootViewController {
                logEvent("Root view controller is of type: \(type(of: rootVC))")
            }
            
            // If bridge method fails, try to get the root view controller safely
            guard let rootViewController = window?.rootViewController else {
                logEvent("Could not find root view controller")
                return nil
            }
            
            // Try to find WebView recursively starting from the root view
            logEvent("Falling back to recursive WebView search")
            let webView = findWebViewRecursively(in: rootViewController.view)
            
            if webView != nil {
                logEvent("Successfully found WebView via recursive search")
            } else {
                logEvent("Failed to find WebView via any method")
            }
            
            return webView
        }
        
        private func findWebViewRecursively(in view: UIView?) -> WKWebView? {
            guard let view = view else { return nil }
            
            // Check if this view is a WKWebView
            if let webView = view as? WKWebView {
                return webView
            }
            
            // Check all subviews recursively
            for subview in view.subviews {
                // Skip hidden views to optimize search
                if subview.isHidden { continue }
                
                if let webView = findWebViewRecursively(in: subview) {
                    return webView
                }
            }
            
            return nil
        }
        
        // Token data handling method removed for rebuild
        
        // Direct patch for Browser plugin
        func patchBrowserPlugin() {
            // Find the Browser plugin class
            guard let pluginClass = NSClassFromString("CAPBrowserPlugin") as? NSObject.Type else {
                print("⚠️ Could not find CAPBrowserPlugin class")
                return
            }
            
            // Get the original method
            let originalSelector = NSSelectorFromString("open:")
            let originalMethod = class_getInstanceMethod(pluginClass, originalSelector)
            
            // Store the original implementation
            if let originalMethod = originalMethod {
                let originalImplementation = method_getImplementation(originalMethod)
                _ = method_getTypeEncoding(originalMethod)
                
                // Create a new implementation
                let newImplementation: @convention(block) (NSObject, AnyObject) -> Void = { [weak self] (_, call) in
                    guard let self = self else { return }
                    
                    // Get the URL from the call
                    guard let call = call as? CAPPluginCall,
                          let urlString = call.getString("url"),
                          let url = URL(string: urlString) else {
                        // Call the original implementation if we can't get the URL
                        let originalFunction = unsafeBitCast(originalImplementation, to: (@convention(c) (NSObject, Selector, AnyObject) -> Void).self)
                        originalFunction(pluginClass as! NSObject, originalSelector, call)
                        return
                    }
                    
                    print("🔒 Intercepted Browser.open call for URL: \(urlString)")
                    self.logEvent("Intercepted Browser.open call")
                    
                    // Check if this is an auth-related URL
                    if urlString.contains("accounts.google.com") || 
                       urlString.contains("oauth") || 
                       urlString.contains("auth") || 
                       urlString.contains("login") || 
                       urlString.contains("signin") || 
                       urlString.contains("callback") || 
                       urlString.contains("supabase") {
                        
                        print("🔒 Using in-app browser for auth URL")
                        self.logEvent("Using in-app browser for auth URL")
                        
                        // Use our in-app browser instead
                        self.presentInAppBrowser(for: url)
                        
                        // Resolve the call
                        call.resolve()
                    } else {
                        // Call the original implementation for non-auth URLs
                        let originalFunction = unsafeBitCast(originalImplementation, to: (@convention(c) (NSObject, Selector, AnyObject) -> Void).self)
                        originalFunction(pluginClass as! NSObject, originalSelector, call)
                    }
                }
                
                // Replace the implementation
                let newIMP = imp_implementationWithBlock(newImplementation)
                method_setImplementation(originalMethod, newIMP)
                
                print("🔒 Successfully patched Browser plugin's open method")
            } else {
                print("⚠️ Failed to find Browser plugin's open method")
            }
        }
        
        // Intercept Browser plugin specifically
        @objc func interceptBrowserPlugin(_ notification: Notification) {
            print("🔒 Intercepted Browser plugin call")
            logEvent("Intercepted Browser plugin call")
            
            // Get the call data
            guard let userInfo = notification.userInfo,
                  let callData = userInfo["pluginCall"] as? [String: Any],
                  let options = callData["options"] as? [String: Any],
                  let urlString = options["url"] as? String,
                  let url = URL(string: urlString) else {
                return
            }
            
            print("🔒 Browser plugin attempting to open URL: \(urlString)")
            
            // Check if this is an auth-related URL
            if urlString.contains("accounts.google.com") || 
               urlString.contains("oauth") || 
               urlString.contains("auth") || 
               urlString.contains("login") || 
               urlString.contains("signin") || 
               urlString.contains("callback") || 
               urlString.contains("supabase") {
                
                print("🔒 Intercepting Browser plugin call for auth URL")
                logEvent("Intercepting Browser plugin call for auth URL")
                
                // Use our in-app browser instead
                presentInAppBrowser(for: url)
                
                // Prevent the default Browser plugin behavior
                if let callbackId = callData["callbackId"] as? String {
                    // Send success response to the plugin call
                    NotificationCenter.default.post(
                        name: Notification.Name("capacitor://browser.openResult"),
                        object: nil,
                        userInfo: [
                            "callbackId": callbackId,
                            "success": true,
                            "data": ["browserOpened": true]
                        ]
                    )
                }
            }
        }
        
        // Intercept Browser.open calls from Capacitor
        @objc func interceptBrowserOpen(_ notification: Notification) {
            guard let userInfo = notification.userInfo,
                  let urlString = userInfo["url"] as? String,
                  let url = URL(string: urlString) else {
                return
            }
            
            print("🔒 Intercepted Browser.open call for URL: \(urlString)")
            logEvent("Intercepted Browser.open call")
            
            // Check if this is an auth-related URL
            if urlString.contains("accounts.google.com") || 
               urlString.contains("oauth") || 
               urlString.contains("auth") || 
               urlString.contains("login") || 
               urlString.contains("signin") || 
               urlString.contains("callback") || 
               urlString.contains("supabase") {
                
                print("🔒 Using in-app browser for auth URL from Browser.open")
                logEvent("Using in-app browser for auth URL from Browser.open")
                
                // Use our in-app browser instead
                presentInAppBrowser(for: url)
                
                // Mark as handled
                NotificationCenter.default.post(
                    name: Notification.Name("capacitorOpenUrlResult"),
                    object: nil,
                    userInfo: ["completed": true]
                )
            }
        }
        
        // Intercept external URL opening
        @objc func interceptExternalURLOpening(_ notification: Notification) {
            guard let userInfo = notification.userInfo,
                  let url = userInfo["url"] as? URL else {
                return
            }
            
            print("🔒 Intercepted external URL opening: \(url.absoluteString)")
            logEvent("Intercepted external URL opening")
            
            // Check if this is an auth-related URL
            if url.absoluteString.contains("accounts.google.com") || 
               url.absoluteString.contains("oauth") || 
               url.absoluteString.contains("auth") || 
               url.absoluteString.contains("login") || 
               url.absoluteString.contains("signin") || 
               url.absoluteString.contains("callback") || 
               url.absoluteString.contains("supabase") {
                
                print("🔒 Using in-app browser for auth URL from external URL opening")
                logEvent("Using in-app browser for auth URL from external URL opening")
                
                // Use our in-app browser instead
                presentInAppBrowser(for: url)
                
                // Mark as handled
                NotificationCenter.default.post(
                    name: Notification.Name("CAPNotificationOpenExternalURLResult"),
                    object: nil,
                    userInfo: ["handled": true]
                )
            }
        }
        
        // Present in-app browser for authentication
        func presentInAppBrowser(for url: URL) {
            print("🔐 [\(Date().timeIntervalSince1970)] AUTH: Presenting in-app browser for URL: \(url.absoluteString)")
            logEvent("Presenting in-app browser for URL: \(url.absoluteString)")
            isHandlingAuth = true
            
            // FORCE use SFSafariViewController to prevent external browser
            // Intercept all Google Auth URLs forcefully
            if url.absoluteString.contains("accounts.google.com") || 
               url.absoluteString.contains("oauth") ||
               url.absoluteString.contains("auth") || 
               url.absoluteString.contains("supabase") {
                
                // Block any potential Safari opening by force handling here
                // We don't need to check if it's registered - URLProtocol.registerClass is safe to call
                // multiple times for the same class
                URLProtocol.registerClass(BlockExternalBrowserProtocol.self)
                logEvent("Registered URL protocol blocker for external Safari")
            }
            
            // Create and configure the in-app browser
            let safariVC = SFSafariViewController(url: url)
            safariVC.delegate = self
            safariVC.preferredBarTintColor = UIColor(red: 0.07, green: 0.07, blue: 0.07, alpha: 1.0) // Dark background
            safariVC.preferredControlTintColor = UIColor.white
            
            // Critical: Force fullscreen presentation to prevent system from opening Safari
            safariVC.modalPresentationStyle = .fullScreen
            
            print("🔐 Using SFSafariViewController for in-app browser to prevent external browser")
            logEvent("Using SFSafariViewController for in-app browser to prevent external browser")
            
            // Ensure we're on the main thread when accessing UI properties
            DispatchQueue.main.async {
                // Make sure any existing browser is closed first
                if let rootVC = UIApplication.shared.windows.first?.rootViewController,
                   let presentedVC = rootVC.presentedViewController,
                   presentedVC is SFSafariViewController {
                    presentedVC.dismiss(animated: false) {
                        // Present new browser immediately after dismissing
                        rootVC.present(safariVC, animated: true)
                    }
                } else {
                    // No existing browser, present directly
                    UIApplication.shared.windows.first?.rootViewController?.present(safariVC, animated: true)
                }
            }
            
            // Add a timer to check if the browser is still presented after a short delay
            // This helps detect if the system is trying to redirect to Safari
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
                guard let self = self else { return }
                if !self.isHandlingAuth {
                    print("⚠️ Auth session may have been redirected to external browser")
                    self.logEvent("Auth session may have been redirected to external browser")
                    
                    // Try to force back to in-app browser if we've lost control
                    DispatchQueue.main.async {
                        self.presentInAppBrowser(for: url)
                    }
                }
            }
        }

    } // End of AppDelegate class
    
// MARK: - Safari View Controller Delegate
extension AppDelegate: SFSafariViewControllerDelegate {
    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        print("🔐 Safari view controller did finish - user closed the in-app browser")
        logEvent("User closed the in-app browser")
        isHandlingAuth = false
        
        // Notify JavaScript that the browser was closed
        NotificationCenter.default.post(
            name: Notification.Name("capacitor://browser.finished"),
            object: nil
        )
    }
    
    func safariViewController(_ controller: SFSafariViewController, didCompleteInitialLoad didLoadSuccessfully: Bool) {
        if didLoadSuccessfully {
            print("🔐 Safari view controller successfully loaded the page")
            logEvent("In-app browser successfully loaded the page")
        } else {
            print("⚠️ Safari view controller failed to load the page")
            logEvent("In-app browser failed to load the page")
        }
    }
}

// MARK: - ASWebAuthenticationPresentationContextProviding
@available(iOS 13.0, *)
extension AppDelegate: ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        // Ensure we're on the main thread when accessing UI properties
        if Thread.isMainThread {
            return UIApplication.shared.windows.first!
        } else {
            // If not on main thread, create a semaphore to wait for main thread execution
            let semaphore = DispatchSemaphore(value: 0)
            var window: UIWindow!
            
            DispatchQueue.main.async {
                window = UIApplication.shared.windows.first
                semaphore.signal()
            }
            
            // Wait for main thread to provide the window
            semaphore.wait()
            return window
        }
    }
}

// MARK: - WKScriptMessageHandler
extension AppDelegate: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        // Handle forceInAppBrowsing messages
        if message.name == "forceInAppBrowsing" {
            print("🔒 Received forceInAppBrowsing message from JavaScript")
            logEvent("Received forceInAppBrowsing message from JavaScript")
            
            // Extract URL from message
            guard let body = message.body as? [String: Any],
                  let urlString = body["url"] as? String,
                  let url = URL(string: urlString) else {
                print("❌ Invalid message format for forceInAppBrowsing")
                return
            }
            
            print("🔒 Forcing in-app browser for URL from JavaScript: \(urlString)")
            logEvent("Forcing in-app browser for URL from JavaScript")
            
            // Present in-app browser
            DispatchQueue.main.async {
                self.presentInAppBrowser(for: url)
            }
        }
    }
}

// MARK: - URL Opening Swizzling
class Swizzler {
    static func swizzleURLOpening() {
        // Swizzle UIApplication.open
        let originalSelector = #selector(UIApplication.open(_:options:completionHandler:))
        let swizzledSelector = #selector(UIApplication.swizzled_open(_:options:completionHandler:))
        
        let originalMethod = class_getInstanceMethod(UIApplication.self, originalSelector)
        let swizzledMethod = class_getInstanceMethod(UIApplication.self, swizzledSelector)
        
        if let originalMethod = originalMethod, let swizzledMethod = swizzledMethod {
            method_exchangeImplementations(originalMethod, swizzledMethod)
        }
        
        // Also swizzle the Browser plugin
        swizzleBrowserPlugin()
    }
    
    static func swizzleBrowserPlugin() {
        // Find the Browser plugin class
        guard let pluginClass = NSClassFromString("CAPBrowserPlugin") as? NSObject.Type else {
            print("⚠️ Could not find CAPBrowserPlugin class")
            return
        }
        
        // Get the original and swizzled methods
        let originalSelector = NSSelectorFromString("open:")
        let swizzledSelector = NSSelectorFromString("swizzled_open:")
        
        let originalMethod = class_getInstanceMethod(pluginClass, originalSelector)
        let swizzledMethod = class_getInstanceMethod(pluginClass, swizzledSelector)
        
        if let originalMethod = originalMethod, let swizzledMethod = swizzledMethod {
            method_exchangeImplementations(originalMethod, swizzledMethod)
            print("🔒 Successfully swizzled Browser plugin's open method")
        } else {
            print("⚠️ Failed to swizzle Browser plugin's open method")
        }
    }
}

// MARK: - URL Protocol to block external browser openings
class BlockExternalBrowserProtocol: URLProtocol {
    static var blockedDomains = [
        "accounts.google.com",
        "supabase.co",
        "oauth",
        "auth"
    ]
    
    override class func canInit(with request: URLRequest) -> Bool {
        guard let url = request.url else { return false }
        
        // Check if this URL is one we want to force into in-app browser
        for domain in blockedDomains {
            if url.absoluteString.contains(domain) {
                // Only intercept if it seems like an attempt to open in external browser
                if url.absoluteString.contains("_blank") || 
                   url.absoluteString.contains("target=_blank") ||
                   url.absoluteString.contains("external=true") {
                    print("🚫 Blocking external browser attempt for: \(url.absoluteString)")
                    return true
                }
            }
        }
        
        return false
    }
    
    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }
    
    override func startLoading() {
        // Get the AppDelegate to handle this with in-app browser
        if let appDelegate = UIApplication.shared.delegate as? AppDelegate,
           let url = request.url {
            
            DispatchQueue.main.async {
                appDelegate.presentInAppBrowser(for: url)
                
                // Complete the loading with a redirect to the in-app version
                let response = HTTPURLResponse(
                    url: url,
                    statusCode: 302,
                    httpVersion: "HTTP/1.1",
                    headerFields: ["Location": "introgy://handled-in-app"]
                )!
                
                self.client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
                self.client?.urlProtocolDidFinishLoading(self)
            }
        } else {
            // If we can't get the AppDelegate, just cancel the request
            let error = NSError(domain: "ai.introgy.app", code: 0, userInfo: [NSLocalizedDescriptionKey: "Blocked external browser opening"])
            self.client?.urlProtocol(self, didFailWithError: error)
        }
    }
    
    override func stopLoading() {
        // Nothing to do here
    }
}

extension UIApplication {
    @objc func swizzled_open(_ url: URL, options: [UIApplication.OpenURLOptionsKey: Any], completionHandler: ((Bool) -> Void)?) {
        // Check if this is a Google auth URL
        if url.absoluteString.contains("accounts.google.com") ||
           url.absoluteString.contains("oauth") ||
           url.absoluteString.contains("auth") ||
           url.absoluteString.contains("supabase") {
            
            print("🔒 Intercepting external browser opening attempt: \(url)")
            
            // Get the AppDelegate
            if let appDelegate = self.delegate as? AppDelegate {
                appDelegate.presentInAppBrowser(for: url)
                completionHandler?(true)
                return
            }
        }
        
        // Call original implementation for all other URLs
        self.swizzled_open(url, options: options, completionHandler: completionHandler)
    }
}
