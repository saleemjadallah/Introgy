
import { Product, PRODUCT_IDS } from './types';

export function getMockProducts(): Product[] {
  return [
    {
      id: PRODUCT_IDS.PREMIUM_MONTHLY,
      title: 'Premium Monthly',
      description: 'Monthly premium subscription',
      price: '$7.99',
      priceAsNumber: 7.99,
      currency: 'USD',
      type: 'monthly'
    },
    {
      id: PRODUCT_IDS.PREMIUM_YEARLY,
      title: 'Premium Yearly',
      description: 'Yearly premium subscription (save 37%)',
      price: '$59.99',
      priceAsNumber: 59.99,
      currency: 'USD',
      type: 'yearly'
    }
  ];
}

