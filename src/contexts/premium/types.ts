
export type PremiumFeature = 
  // Social Battery features
  | "advanced-tracking"
  | "custom-activities"
  | "predictive-analytics"
  | "calendar-integration"
  // Social Navigation features
  | "complete-templates"
  | "unlimited-conversation-practice"
  | "full-strategies-access"
  | "real-time-social-support"
  // Connection Builder features
  | "up-to-10-relationships"
  | "basic-communication-tools"
  | "unlimited-relationships"
  | "ai-interaction-tools"
  | "advanced-nurturing"
  | "boundary-management"
  | "relationship-analytics"
  // Wellbeing Center features
  | "extended-mindfulness"
  | "personalized-recommendations"
  | "custom-ritual-creation"
  | "full-community-participation"
  // Education Center features
  | "complete-galleries"
  | "advanced-content"
  | "expert-resources"
  | "premium-educational-materials";

export interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  checkFeatureAccess: (feature: PremiumFeature) => boolean;
  upgradeToPremium: (planType?: 'monthly' | 'yearly') => Promise<void>;
  products: Product[];
  loadingProducts: boolean;
  purchaseInProgress: boolean;
  handlePurchase: (productId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
}

export type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  priceAsNumber: number;
  currency: string;
  type: 'monthly' | 'yearly';
};

export type Purchase = {
  productId: string;
  transactionId: string;
  timestamp: number;
  receipt?: string;
  platform?: 'ios' | 'android';
};

export type VerificationResult = {
  success: boolean;
  planType: 'monthly' | 'yearly';
  expiresAt: string;
  error?: string;
};
