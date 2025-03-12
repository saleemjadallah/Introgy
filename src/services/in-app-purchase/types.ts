
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'app.introgy.premium.monthly',
  PREMIUM_YEARLY: 'app.introgy.premium.yearly',
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

export interface PurchaseListener {
  (purchase: Purchase): void;
}

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

// RevenueCat Capacitor plugin uses a different structure for offerings
export interface PurchaseResult {
  customerInfo: CustomerInfo;
  productIdentifier: string;
}

// These are updated types to match the actual RevenueCat types
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

export interface RevenueCatPackage {
  identifier: string;
  packageType: string;
  product: RevenueCatProduct;
}

export interface RevenueCatProduct {
  identifier: string;
  description: string;
  title: string;
  price: number;
  priceString: string;
  currencyCode: string;
  introPrice?: number;
  introPriceString?: string;
  introPricePeriod?: string;
  introPriceCycles?: number;
}

// For purchasing packages
export interface RevenueCatPurchaseOptions {
  packageIdentifier: string;
  upgradeInfo?: {
    oldSKU?: string;
    prorationMode?: number;
  };
}
