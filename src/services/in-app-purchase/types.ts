
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

// Types for interfacing with RevenueCat Capacitor plugin
// Based on the actual plugin types
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

export interface PurchasesOfferings {
  current: PurchasesOffering | null;
  all: Record<string, PurchasesOffering>;
}

export interface PurchasesOffering {
  identifier: string;
  serverDescription: string;
  metadata: Record<string, string>;
  availablePackages: PurchasesPackage[];
}

export interface PurchasesPackage {
  identifier: string;
  packageType: string;
  product: PurchasesStoreProduct;
  offering: string;
}

export interface PurchasesStoreProduct {
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

export interface PurchasePackageOptions {
  identifier: string;
  offeringIdentifier?: string;
}

export interface PurchaseResult {
  customerInfo: CustomerInfo;
  productIdentifier: string;
}
