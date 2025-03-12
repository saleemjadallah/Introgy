
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PricingCardFree from "../PricingCardFree";

describe("PricingCardFree Component", () => {
  const mockFeatures = [
    {
      name: "Feature 1",
      free: ["Free Option 1", "Free Option 2"],
      premium: ["Premium Option 1", "Premium Option 2"]
    },
    {
      name: "Feature 2",
      free: ["Free Option 3"],
      premium: ["Premium Option 3", "Premium Option 4"]
    }
  ];

  it("renders the free plan title and description", () => {
    render(
      <PricingCardFree 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false} 
      />
    );
    
    expect(screen.getByText("Free Plan")).toBeInTheDocument();
    expect(screen.getByText("Essential tools for introverts")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("shows 'Current' badge when not premium", () => {
    render(
      <PricingCardFree 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false} 
      />
    );
    
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("does not show 'Current' badge when premium", () => {
    render(
      <PricingCardFree 
        features={mockFeatures} 
        isPremium={true} 
        isMobile={false} 
      />
    );
    
    // Badge should still exist in the footer button
    expect(screen.getByText("Current Plan")).toBeInTheDocument();
    
    // But not as a separate badge at the top
    const badges = screen.getAllByText("Current");
    expect(badges.length).toBe(1); // Only the one in the button
  });

  it("applies different border color based on isPremium", () => {
    const { rerender } = render(
      <PricingCardFree 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false} 
      />
    );
    
    // When not premium, the card should have primary border
    expect(document.querySelector(".border-primary")).toBeInTheDocument();
    
    rerender(
      <PricingCardFree 
        features={mockFeatures} 
        isPremium={true} 
        isMobile={false} 
      />
    );
    
    // When premium, the card should have regular border
    expect(document.querySelector(".border-border")).toBeInTheDocument();
  });

  it("renders free features correctly", () => {
    render(
      <PricingCardFree 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={false} 
      />
    );
    
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Free Option 1")).toBeInTheDocument();
    expect(screen.getByText("Free Option 2")).toBeInTheDocument();
    expect(screen.getByText("Free Option 3")).toBeInTheDocument();
  });

  it("applies mobile styling when isMobile is true", () => {
    render(
      <PricingCardFree 
        features={mockFeatures} 
        isPremium={false} 
        isMobile={true} 
      />
    );
    
    expect(screen.getByText("Free Plan").className).toContain("text-xl");
  });
});
