
import React from "react";
import { render, screen } from "@testing-library/react";
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

  it("renders the card with correct premium plan details", () => {
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
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly (Save 37%)")).toBeInTheDocument();
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
});
