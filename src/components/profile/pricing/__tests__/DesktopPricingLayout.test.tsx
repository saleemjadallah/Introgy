
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DesktopPricingLayout from "../DesktopPricingLayout";

describe("DesktopPricingLayout Component", () => {
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

  it("renders both pricing cards in a grid layout", () => {
    render(
      <DesktopPricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // Check for grid layout
    expect(document.querySelector(".grid")?.className).toContain("md:grid-cols-2");
    
    // Check for both plan cards
    expect(screen.getByText("Free Plan")).toBeInTheDocument();
    expect(screen.getByText("Premium Plan")).toBeInTheDocument();
  });

  it("passes isMobile=false to both cards", () => {
    render(
      <DesktopPricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // Check that mobile styling is not applied
    expect(screen.getByText("Free Plan").className).not.toContain("text-xl");
    expect(screen.getByText("Premium Plan").className).not.toContain("text-xl");
  });

  it("passes isPremium status to both cards", () => {
    const { rerender } = render(
      <DesktopPricingLayout 
        features={mockFeatures} 
        isPremium={true} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // When premium, premium card should have primary border and free card should not
    const primaryBorders = document.querySelectorAll(".border-primary");
    expect(primaryBorders.length).toBe(1);
    
    rerender(
      <DesktopPricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // When not premium, free card should have primary border
    const updatedPrimaryBorders = document.querySelectorAll(".border-primary");
    expect(updatedPrimaryBorders.length).toBe(1);
  });

  it("passes subscription handler to premium card", () => {
    render(
      <DesktopPricingLayout 
        features={mockFeatures} 
        isPremium={false} 
        isUpgrading={false}
        onSubscribe={mockOnSubscribe}
      />
    );
    
    // The monthly and yearly buttons should be available
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly (Save 37%)")).toBeInTheDocument();
  });
});
