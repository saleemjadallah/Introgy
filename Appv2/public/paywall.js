// RevenueCatUI Paywall integration for Introgy app

import { registerPlugin } from '@capacitor/core';

// Register our custom plugin
const PaywallPlugin = registerPlugin('PaywallPlugin');

/**
 * Present the RevenueCatUI paywall
 * @returns {Promise<void>}
 */
export async function presentPaywall() {
  try {
    return await PaywallPlugin.presentPaywall();
  } catch (error) {
    console.error('Error presenting paywall:', error);
    throw error;
  }
}

/**
 * Dismiss the RevenueCatUI paywall
 * @returns {Promise<void>}
 */
export async function dismissPaywall() {
  try {
    return await PaywallPlugin.dismissPaywall();
  } catch (error) {
    console.error('Error dismissing paywall:', error);
    throw error;
  }
}

/**
 * Check if the user has the "Single Purchase" entitlement
 * @returns {Promise<{hasPremium: boolean, entitlements: string[]}>}
 */
export async function checkEntitlements() {
  try {
    return await PaywallPlugin.checkEntitlements();
  } catch (error) {
    console.error('Error checking entitlements:', error);
    return { hasPro: false, entitlements: [] };
  }
}
