export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'app.introgy.premium.monthly',
  PREMIUM_YEARLY: 'app.introgy.premium.yearly',
};

export const ENTITLEMENTS = {
  PREMIUM: 'premium'
};

export type ProductType = 'monthly' | 'yearly';

export interface Purchase {
  productId: string;
  transactionId: string;
  timestamp: number;
  receipt?: string;
  platform?: 'ios' | 'android';
}

export interface VerificationResult {
  success: boolean;
  planType: ProductType;
  expiresAt: string;
  error?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  priceAsNumber: number;
  currency: string;
  type: ProductType;
}

export type PurchaseListener = (purchase: Purchase) => void;

// Types aligned with the actual RevenueCat Capacitor plugin
export interface CustomerInfo {
  entitlements: {
    all: Record<string, Entitlement>;
    active: Record<string, Entitlement>;
  };
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  latestExpirationDate: string | null;
  firstSeen: string;
  originalAppUserId: string;
}

export interface Entitlement {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  periodType: string;
  expirationDate: string | null;
  latestPurchaseDate: string;
  originalPurchaseDate: string;
}

// Response type from RevenueCat API calls
export interface PurchaseResult {
  customerInfo: CustomerInfo;
  productIdentifier: string;
}

// RevenueCat actual offering types
export interface RevenueCatOfferings {
  current: RevenueCatOffering | null;
  all: Record<string, RevenueCatOffering>;
}

export interface RevenueCatOffering {
  identifier: string;
  serverDescription: string;
  metadata: Record<string, string>;
  availablePackages: RevenueCatPackage[];
}

// Enum to match RevenueCat's expected package types
export enum PACKAGE_TYPE {
  UNKNOWN = "UNKNOWN",
  CUSTOM = "CUSTOM",
  LIFETIME = "LIFETIME",
  ANNUAL = "ANNUAL",
  SIX_MONTH = "SIX_MONTH",
  THREE_MONTH = "THREE_MONTH",
  TWO_MONTH = "TWO_MONTH",
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY"
}

// Add enum for product category to match RevenueCat expectations
export enum PRODUCT_CATEGORY {
  SUBSCRIPTION = "SUBSCRIPTION",
  NON_SUBSCRIPTION = "NON_SUBSCRIPTION"
}

export interface RevenueCatPackage {
  identifier: string;
  packageType: PACKAGE_TYPE;
  product: RevenueCatProduct;
  offeringIdentifier?: string;
}

// Define the PurchasesIntroPrice interface to match RevenueCat's expectations
export interface PurchasesIntroPrice {
  price: number;
  priceString: string;
  period: string;
  cycles: number;
  periodUnit: string; 
  periodNumberOfUnits: number;
}

// Updated to match RevenueCat's PurchasesStoreProduct
export interface RevenueCatProduct {
  identifier: string;
  description: string;
  title: string;
  price: number;
  priceString: string;
  currencyCode: string;
  introPrice?: PurchasesIntroPrice;
  introPriceString?: string;
  introPricePeriod?: string;
  introPriceCycles?: number;
  discounts: any[];
  productCategory: PRODUCT_CATEGORY;
  productType: string;
  subscriptionPeriod: string;
  defaultOption: boolean;
  presentedOfferingIdentifier?: string;
  subscriptionOptions?: any[];
}

// Make this match the RevenueCat plugin's expected format
export interface PurchasePackageOptions {
  aPackage: RevenueCatPackage;
  presentedOfferingIdentifier?: string;
}
