
import React from "react";
import { render, screen } from "@testing-library/react";
import PremiumPlanPricing from "../../premium/PremiumPlanPricing";

describe("PremiumPlanPricing Component", () => {
  it("renders the price correctly", () => {
    render(<PremiumPlanPricing isMobile={false} />);
    expect(screen.getByText("$7.99")).toBeInTheDocument();
    expect(screen.getByText("/mo")).toBeInTheDocument();
    expect(screen.getByText("or $59.99/year (save 37%)")).toBeInTheDocument();
  });

  it("applies desktop styling when not mobile", () => {
    render(<PremiumPlanPricing isMobile={false} />);
    const priceElement = screen.getByText("$7.99");
    expect(priceElement.parentElement?.className).toContain("text-3xl");
  });

  it("applies mobile styling when mobile", () => {
    render(<PremiumPlanPricing isMobile={true} />);
    const priceElement = screen.getByText("$7.99");
    expect(priceElement.parentElement?.className).toContain("text-2xl");
    
    const yearlyText = screen.getByText("or $59.99/year (save 37%)");
    expect(yearlyText.className).toContain("text-xs");
  });
});
