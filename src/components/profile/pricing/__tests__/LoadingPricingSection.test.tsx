
import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingPricingSection from "../LoadingPricingSection";

describe("LoadingPricingSection Component", () => {
  it("renders the loading title and subtitle", () => {
    render(<LoadingPricingSection />);
    
    expect(screen.getByText("Pricing Plans")).toBeInTheDocument();
    expect(screen.getByText("Choose the plan that's right for your introvert journey")).toBeInTheDocument();
  });

  it("displays a loading spinner", () => {
    render(<LoadingPricingSection />);
    
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders two skeleton cards", () => {
    render(<LoadingPricingSection />);
    
    // There should be two PricingSkeletonCard components
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(1);
  });
});
