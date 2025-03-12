
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PricingCardPremium from "../PricingCardPremium";

describe("PricingCardPremium Component", () => {
  const mockFeatures = [
    {
      name: "Feature 1",
      free: ["Free Option 1"],
      premium: ["Premium Option 1", "Premium Option 2"]
    },
    {
      name: "Feature 2",
      free: ["Free Option 2"],
      premium: ["Premium Option 3", "Premium Option 4"]
    }
  ];
  
  const mockOnSubscribe = vi.fn();

  beforeEach(() => {
    mockOnSubscribe.mockClear();
  });

  it("renders the premium plan title and description", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    expect(screen.getByText("Premium Plan")).toBeInTheDocument();
    expect(screen.getByText("Complete introvert toolkit")).toBeInTheDocument();
    expect(screen.getByText("$7.99")).toBeInTheDocument();
    expect(screen.getByText("/mo")).toBeInTheDocument();
    expect(screen.getByText("or $59.99/year (save 37%)")).toBeInTheDocument();
  });

  it("renders premium features correctly", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Premium Option 1")).toBeInTheDocument();
    expect(screen.getByText("Premium Option 2")).toBeInTheDocument();
    expect(screen.getByText("Premium Option 3")).toBeInTheDocument();
    expect(screen.getByText("Premium Option 4")).toBeInTheDocument();
  });

  it("applies different border color based on isPremium", () => {
    const { rerender } = render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={true} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // When premium, the card should have primary border
    expect(document.querySelector(".border-primary")).toBeInTheDocument();
    
    rerender(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // When not premium, the card should have regular border
    expect(document.querySelector(".border-border")).toBeInTheDocument();
  });

  it("shows 'Best Value' badge", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    expect(screen.getByText("Best Value")).toBeInTheDocument();
  });

  it("shows 'Best' badge when mobile", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={true}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    expect(screen.getByText("Best")).toBeInTheDocument();
  });

  it("disables buttons when premium or upgrading", () => {
    const { rerender } = render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={true} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // Buttons should be disabled when premium
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    rerender(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={true}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // Buttons should be disabled when upgrading
    const updatedButtons = screen.getAllByRole("button");
    updatedButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it("shows loading state when upgrading", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={true}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    expect(screen.getByText("Processing...")).toBeInTheDocument();
    // Check for spinner
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("calls onSubscribe with 'monthly' when monthly button is clicked", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    const monthlyButton = screen.getByText("Monthly");
    fireEvent.click(monthlyButton);
    
    expect(mockOnSubscribe).toHaveBeenCalledWith('monthly');
  });

  it("calls onSubscribe with 'yearly' when yearly button is clicked", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    const yearlyButton = screen.getByText("Yearly (Save 37%)");
    fireEvent.click(yearlyButton);
    
    expect(mockOnSubscribe).toHaveBeenCalledWith('yearly');
  });

  it("shows a single button in mobile view", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={true}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    expect(screen.getByText("Upgrade Now")).toBeInTheDocument();
    // Should only be one button in mobile
    expect(screen.getAllByRole("button").length).toBe(1);
  });

  it("shows 'Current Plan' when premium in mobile view", () => {
    render(
      <PricingCardPremium 
        features={mockFeatures} 
        isPremium={true} 
        isMobile={true}
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    expect(screen.getByText("Current Plan")).toBeInTheDocument();
  });
});
