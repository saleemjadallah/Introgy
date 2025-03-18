
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PricingFeature from "../PricingFeature";

describe("PricingFeature Component", () => {
  const mockProps = {
    name: "Test Feature",
    features: ["Feature 1", "Feature 2", "Feature 3"],
  };

  it("renders the feature name correctly", () => {
    render(<PricingFeature name={mockProps.name} features={mockProps.features} />);
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
  });

  it("renders all feature items with check icons", () => {
    render(<PricingFeature name={mockProps.name} features={mockProps.features} />);
    
    mockProps.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
    
    // Check that we have the same number of check icons as features
    const checkIcons = document.querySelectorAll(".text-green-500");
    expect(checkIcons.length).toBe(mockProps.features.length);
  });

  it("applies mobile styling when isMobile is true", () => {
    render(
      <PricingFeature 
        name={mockProps.name} 
        features={mockProps.features} 
        isMobile={true} 
      />
    );
    
    expect(screen.getByText(mockProps.name).className).toContain("text-sm");
    
    // Check that feature items have mobile styling
    const featureItems = document.querySelectorAll("li");
    featureItems.forEach(item => {
      expect(item.className).toContain("text-xs");
    });
  });
});
