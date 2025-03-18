
import React from "react";
import { render, screen } from "@testing-library/react";
import PremiumPlanFeatures from "../../premium/PremiumPlanFeatures";

describe("PremiumPlanFeatures Component", () => {
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

  it("renders feature names correctly", () => {
    render(<PremiumPlanFeatures features={mockFeatures} isMobile={false} />);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
  });

  it("renders all premium features correctly", () => {
    render(<PremiumPlanFeatures features={mockFeatures} isMobile={false} />);
    expect(screen.getByText("Premium Option 1")).toBeInTheDocument();
    expect(screen.getByText("Premium Option 2")).toBeInTheDocument();
    expect(screen.getByText("Premium Option 3")).toBeInTheDocument();
    expect(screen.getByText("Premium Option 4")).toBeInTheDocument();
  });

  it("applies mobile styling when isMobile is true", () => {
    render(<PremiumPlanFeatures features={mockFeatures} isMobile={true} />);
    expect(screen.getByText("Feature 1").className).toContain("text-sm");
    const featureItems = document.querySelectorAll("li");
    featureItems.forEach(item => {
      expect(item.className).toContain("text-xs");
    });
  });
});
