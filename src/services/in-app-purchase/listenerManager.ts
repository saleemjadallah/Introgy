
import { PurchaseListener } from './types';

/**
 * Manages purchase event listeners
 */
export class ListenerManager {
  private listeners: PurchaseListener[] = [];

  addListener(listener: PurchaseListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: PurchaseListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners(purchase: any): void {
    this.listeners.forEach(listener => listener(purchase));
  }
}
