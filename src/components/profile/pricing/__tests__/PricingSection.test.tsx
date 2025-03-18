import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PricingSection from "../../PricingSection";
import { usePremium } from '@/contexts/premium';
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock the required hooks
vi.mock("@/contexts/premium/PremiumContext");
vi.mock("@/contexts/auth");
vi.mock("@/hooks/use-mobile");
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

describe("PricingSection Component", () => {
  beforeEach(() => {
    // Reset mock implementations with all required properties
    vi.mocked(usePremium).mockReturnValue({
      isPremium: false,
      isLoading: false,
      upgradeToPremium: vi.fn().mockResolvedValue(undefined),
      checkFeatureAccess: vi.fn(),
      // Add the new properties needed for in-app purchases
      products: [],
      loadingProducts: false,
      purchaseInProgress: false,
      handlePurchase: vi.fn().mockResolvedValue(undefined),
      restorePurchases: vi.fn().mockResolvedValue(undefined)
    });
    
    vi.mocked(useAuth).mockReturnValue({
      user: { 
        id: "user-123",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: "2023-01-01"
      },
      session: null,
      isLoading: false,
      isAuthenticated: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithOTP: vi.fn(),
      verifyOTP: vi.fn(),
      signOut: vi.fn()
    });
    
    vi.mocked(useIsMobile).mockReturnValue(false);
  });

  it("renders loading state when isLoading is true", () => {
    vi.mocked(usePremium).mockReturnValue({
      isPremium: false,
      isLoading: true,
      upgradeToPremium: vi.fn(),
      checkFeatureAccess: vi.fn(),
      // Add the new properties needed for in-app purchases
      products: [],
      loadingProducts: false,
      purchaseInProgress: false,
      handlePurchase: vi.fn(),
      restorePurchases: vi.fn()
    });
    
    render(<PricingSection />);
    
    // Should render loading component
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders desktop layout when not mobile", () => {
    vi.mocked(useIsMobile).mockReturnValue(false);
    
    render(<PricingSection />);
    
    // Should render desktop layout
    expect(document.querySelector(".grid.md\\:grid-cols-2")).toBeInTheDocument();
  });

  it("renders mobile layout when mobile", () => {
    vi.mocked(useIsMobile).mockReturnValue(true);
    
    render(<PricingSection />);
    
    // Should render mobile layout as stacked cards
    expect(document.querySelector(".space-y-6")).toBeInTheDocument();
    expect(document.querySelector(".grid.md\\:grid-cols-2")).toBeNull();
  });

  it("renders badge with correct status", () => {
    const { rerender } = render(<PricingSection />);
    
    // Badge should show Free Plan when not premium
    expect(screen.getByText("Free Plan")).toBeInTheDocument();
    
    // Change to premium
    vi.mocked(usePremium).mockReturnValue({
      isPremium: true,
      isLoading: false,
      upgradeToPremium: vi.fn(),
      checkFeatureAccess: vi.fn(),
      // Add the new properties needed for in-app purchases
      products: [],
      loadingProducts: false,
      purchaseInProgress: false,
      handlePurchase: vi.fn(),
      restorePurchases: vi.fn()
    });
    
    rerender(<PricingSection />);
    
    // Badge should show Premium when premium
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("calls upgradeToPremium when subscribing", async () => {
    const mockUpgradeToPremium = vi.fn().mockResolvedValue(undefined);
    
    vi.mocked(usePremium).mockReturnValue({
      isPremium: false,
      isLoading: false,
      upgradeToPremium: mockUpgradeToPremium,
      checkFeatureAccess: vi.fn(),
      // Add the new properties needed for in-app purchases
      products: [],
      loadingProducts: false,
      purchaseInProgress: false,
      handlePurchase: vi.fn(),
      restorePurchases: vi.fn()
    });
    
    render(<PricingSection />);
    
    // Get the Monthly button and click it
    const monthlyButton = screen.getByText("Monthly");
    fireEvent.click(monthlyButton);
    
    // Should call upgradeToPremium with 'monthly'
    expect(mockUpgradeToPremium).toHaveBeenCalledWith('monthly');
  });
});
