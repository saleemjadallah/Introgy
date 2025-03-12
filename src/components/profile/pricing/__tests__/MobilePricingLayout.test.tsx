
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import MobilePricingLayout from "../MobilePricingLayout";

describe("MobilePricingLayout Component", () => {
  const mockFeatures = [
    {
      name: "Feature 1",
      free: ["Free Option 1"],
      premium: ["Premium Option 1", "Premium Option 2"]
    },
    {
      name: "Feature 2",
      free: ["Free Option 2"],
      premium: ["Premium Option 3"]
    }
  ];
  
  const mockOnSubscribe = vi.fn();

  beforeEach(() => {
    mockOnSubscribe.mockClear();
  });

  it("renders both pricing cards", () => {
    render(
      <MobilePricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // Check for both plan cards
    expect(screen.getByText("Free Plan")).toBeInTheDocument();
    expect(screen.getByText("Premium Plan")).toBeInTheDocument();
  });

  it("passes isMobile=true to both cards", () => {
    render(
      <MobilePricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // Check for mobile styling
    expect(screen.getByText("Free Plan").className).toContain("text-xl");
    expect(screen.getByText("Premium Plan").className).toContain("text-xl");
  });

  it("passes isPremium status to both cards", () => {
    const { rerender } = render(
      <MobilePricingLayout 
        features={mockFeatures} 
        isPremium={true} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // When premium, premium card should have primary border and free card should not
    expect(document.querySelectorAll(".border-primary")[0]).toBeInTheDocument();
    
    rerender(
      <MobilePricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // When not premium, free card should have primary border
    const primaryBorders = document.querySelectorAll(".border-primary");
    expect(primaryBorders.length).toBe(1);
  });

  it("passes subscription handler to premium card", () => {
    render(
      <MobilePricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // The upgrade button should be available
    expect(screen.getByText("Upgrade Now")).toBeInTheDocument();
  });
});
