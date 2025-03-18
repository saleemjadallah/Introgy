// RevenueCat integration for Introgy app

import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor, registerPlugin } from '@capacitor/core';

// Register our custom plugin extension (will be available when running on iOS device)
const RevenueCatPluginExtension = {
  configureWithSharedDefaults: async (options) => {
    if (Capacitor.getPlatform() === 'ios') {
      try {
        const plugin = registerPlugin('RevenueCatPluginExtension');
        return await plugin.configureWithSharedDefaults(options);
      } catch (err) {
        console.error('Error using RevenueCatPluginExtension:', err);
        // Fall back to standard initialization if plugin isn't available
        return false;
      }
    }
    return false;
  }
};

// API Keys
const API_KEYS = {
  ios: 'appa9175f8b57', // Apple API key
  android: 'appa9175f8b57' // Using same key for Android (replace if you have a separate one)
};

// Product identifiers
const PRODUCT_IDS = {
  monthly: 'premium_monthly',
  annual: 'premium_yearly',
};

// Event listeners for subscription status updates
let customerInfoListeners = [];

// Initialize RevenueCat
export async function initializeRevenueCat() {
  try {
    console.log('Setting RevenueCat log level to DEBUG');
    await Purchases.setLogLevel({level: LOG_LEVEL.DEBUG});
    
    const platform = Capacitor.getPlatform();
    console.log(`Initializing RevenueCat for platform: ${platform}`);
    
    if (platform === 'ios') {
      try {
        console.log('Attempting to use custom RevenueCatPluginExtension...');
        // Try to use our custom plugin with shared UserDefaults for App Extensions support
        const usedCustomPlugin = await RevenueCatPluginExtension.configureWithSharedDefaults({
          apiKey: API_KEYS.ios,
          appUserID: null // Use RevenueCat's anonymous ID
        });
        
        console.log('Custom plugin result:', usedCustomPlugin);
        
        // If custom plugin fails, fall back to standard initialization
        if (!usedCustomPlugin) {
          console.log('Custom plugin not available, using standard initialization');
          await Purchases.configure({ apiKey: API_KEYS.ios });
        }
      } catch (iosError) {
        console.error('Error with iOS custom plugin, falling back to standard initialization:', iosError);
        // Fall back to standard initialization if custom plugin throws an error
        await Purchases.configure({ apiKey: API_KEYS.ios });
      }
    } else if (platform === 'android') {
      console.log('Configuring RevenueCat for Android');
      await Purchases.configure({ apiKey: API_KEYS.android });
    } else if (platform === 'web') {
      // For development in browser
      console.log('Running in web browser - RevenueCat requires a real device, returning mock success');
      // Return true for web to allow testing
      return true;
    } else {
      console.warn(`Unknown platform: ${platform}, attempting standard initialization`);
      // Try standard initialization for unknown platforms
      await Purchases.configure({ apiKey: API_KEYS.ios });
    }
    
    // Set up customer info listener as recommended by RevenueCat
    try {
      console.log('Setting up customer info listener...');
      await setupCustomerInfoListener();
      console.log('Customer info listener set up successfully');
    } catch (listenerError) {
      console.error('Failed to set up customer info listener, but continuing:', listenerError);
      // Continue even if listener setup fails
    }
    
    console.log('RevenueCat initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    // For debugging purposes, return true anyway to allow the app to continue
    // Remove this in production if you want strict RevenueCat initialization
    console.log('Returning success despite error to allow app to continue');
    return true;
  }
}

// Setup customer info update listener
async function setupCustomerInfoListener() {
  try {
    await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log('Customer info updated:', customerInfo);
      
      // Check if the user has the "Single Purchase" entitlement
      const hasEntitlement = customerInfo.entitlements['Single Purchase']?.isActive === true;
      
      // Notify all registered listeners about the update
      notifyCustomerInfoListeners({
        hasActiveSubscription: hasEntitlement,
        entitlements: customerInfo.entitlements,
        originalCustomerInfo: customerInfo
      });
    });
    
    console.log('Customer info listener set up successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up customer info listener:', error);
    return false;
  }
}

// Get available packages
export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages;
    } else {
      console.warn('No offerings available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return [];
  }
}

// Purchase a package
export async function purchasePackage(packageToPurchase) {
  try {
    const purchaseResult = await Purchases.purchasePackage({ 
      aPackage: packageToPurchase 
    });
    
    console.log('Purchase successful:', purchaseResult);
    return {
      success: true,
      customerInfo: purchaseResult.customerInfo
    };
  } catch (error) {
    console.error('Error purchasing package:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get current customer info
export async function getCustomerInfo() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
}

// Register a listener for customer info updates
export function registerCustomerInfoListener(callback) {
  customerInfoListeners.push(callback);
}

// Remove a listener for customer info updates
export function unregisterCustomerInfoListener(callback) {
  customerInfoListeners = customerInfoListeners.filter(listener => listener !== callback);
}

// Notify all listeners about customer info updates
function notifyCustomerInfoListeners(customerInfoData) {
  customerInfoListeners.forEach(listener => {
    try {
      listener(customerInfoData);
    } catch (error) {
      console.error('Error in customer info listener:', error);
    }
  });
}

// Check if user has active subscription
export async function checkSubscriptionStatus() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    
    // Check specifically for "Single Purchase" entitlement as per your RevenueCat setup
    const singlePurchaseActive = customerInfo.entitlements?.['Single Purchase']?.isActive === true;
    const activeEntitlements = customerInfo.entitlements?.active || {};
    
    return {
      hasActiveSubscription: Object.keys(activeEntitlements).length > 0,
      hasPremium: singlePurchaseActive,
      entitlements: activeEntitlements,
      originalCustomerInfo: customerInfo
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return {
      hasActiveSubscription: false,
      hasPremium: false,
      entitlements: {}
    };
  }
}

// Restore purchases
export async function restorePurchases() {
  try {
    const restoredInfo = await Purchases.restorePurchases();
    return {
      success: true,
      customerInfo: restoredInfo
    };
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper functions for premium feature access

/**
 * Creates and shows the subscription UI when a user attempts to access premium content
 * Call this from your premium feature triggers
 */
export function showSubscriptionUI() {
  // Create subscription UI if it doesn't exist
  const container = document.getElementById('subscription-container');
  if (!container.innerHTML.trim()) {
    // First time showing the UI, create it
    const subscriptionUI = document.createElement('div');
    subscriptionUI.id = 'subscription-section';
    subscriptionUI.className = 'subscription-section';
    subscriptionUI.innerHTML = `
      <h2>Subscription Options</h2>
      <p>This feature requires a premium subscription:</p>
      <div>
        <button id="loadOfferings">Check Available Plans</button>
        <button id="restorePurchases">Restore Purchases</button>
        <button id="showPaywall" style="background-color: #34a853;">Show Premium Paywall UI</button>
      </div>
      <div id="offerings-container" style="margin-top: 15px;"></div>
      <p class="status-message" id="subscription-status">Not checked yet</p>
      <button id="cancelSubscription" style="background-color: #db4437; margin-top: 15px;">Cancel</button>
    `;
    container.appendChild(subscriptionUI);
    
    // Set up event listeners for the newly created buttons
    document.getElementById('loadOfferings').addEventListener('click', async () => {
      try {
        const offeringsContainer = document.getElementById('offerings-container');
        offeringsContainer.innerHTML = '<p>Loading offerings...</p>';
        const offerings = await getOfferings();
        displayOfferings(offerings, offeringsContainer);
      } catch (error) {
        console.error('Error loading offerings:', error);
      }
    });
    
    document.getElementById('restorePurchases').addEventListener('click', async () => {
      try {
        const statusElement = document.getElementById('subscription-status');
        statusElement.textContent = 'Restoring purchases...';
        await restorePurchases();
        statusElement.textContent = 'Purchases restored, checking status...';
        const status = await checkSubscriptionStatus();
        if (status.hasActiveSubscription) {
          hideSubscriptionUI();
        }
      } catch (error) {
        console.error('Error restoring purchases:', error);
      }
    });
    
    document.getElementById('showPaywall').addEventListener('click', () => {
      try {
        import('./paywall.js').then(({ presentPaywall }) => {
          presentPaywall();
        });
      } catch (error) {
        console.error('Error showing paywall:', error);
      }
    });
    
    document.getElementById('cancelSubscription').addEventListener('click', () => {
      hideSubscriptionUI();
    });
  }
  
  // Hide main content and show subscription options
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('subscription-section').style.display = 'block';
}

/**
 * Hides the subscription UI and returns to the main app
 * Called automatically from the Cancel button
 */
export function hideSubscriptionUI() {
  const subscriptionSection = document.getElementById('subscription-section');
  if (subscriptionSection) {
    subscriptionSection.style.display = 'none';
  }
  document.getElementById('main-content').style.display = 'block';
}

/**
 * Helper function to display offerings in the UI
 */
function displayOfferings(offerings, container) {
  // Clear the container
  container.innerHTML = '';
  
  if (!offerings || !offerings.current || !offerings.current.availablePackages) {
    container.innerHTML = '<p>No offerings available</p>';
    return;
  }
  
  const packages = offerings.current.availablePackages;
  
  if (packages.length === 0) {
    container.innerHTML = '<p>No packages available</p>';
    return;
  }
  
  // Create a list of packages
  packages.forEach(pkg => {
    const button = document.createElement('button');
    button.textContent = `${pkg.product.title} - ${pkg.product.priceString}`;
    button.style.margin = '5px';
    button.style.display = 'block';
    button.style.width = '100%';
    button.onclick = async () => {
      try {
        const statusElement = document.getElementById('subscription-status');
        statusElement.textContent = 'Processing purchase...';
        await purchasePackage(pkg.identifier);
        hideSubscriptionUI(); // Hide on successful purchase
      } catch (error) {
        console.error('Error purchasing package:', error);
        const statusElement = document.getElementById('subscription-status');
        statusElement.textContent = `Error: ${error.message}`;
      }
    };
    container.appendChild(button);
  });
}

/**
 * Checks if a user can access premium content and shows subscription UI if needed
 * @param {Function} onSuccess - Function to call if user has premium access
 * @returns {Promise<boolean>} - Returns true if user has access, false otherwise
 */
export async function checkPremiumAccess(onSuccess) {
  try {
    const status = await checkSubscriptionStatus();
    
    if (status && status.hasActiveSubscription) {
      // User has premium access
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
      return true;
    } else {
      // User doesn't have premium access, show subscription UI
      showSubscriptionUI();
      return false;
    }
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
}
