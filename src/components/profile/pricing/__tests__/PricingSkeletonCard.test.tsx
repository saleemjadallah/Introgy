
import React from "react";
import { render } from "@testing-library/react";
import PricingSkeletonCard from "../PricingSkeletonCard";

describe("PricingSkeletonCard Component", () => {
  it("renders with animate-pulse class", () => {
    render(<PricingSkeletonCard />);
    
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("has the correct structure with header, content and footer", () => {
    render(<PricingSkeletonCard />);
    
    // Check that card has header, content and footer sections
    expect(document.querySelector(".CardHeader")).not.toBeNull();
    expect(document.querySelector(".CardContent")).not.toBeNull();
    expect(document.querySelector(".CardFooter")).not.toBeNull();
  });

  it("renders placeholder elements for feature groups", () => {
    render(<PricingSkeletonCard />);
    
    // Check for placeholder elements in content
    const contentPlaceholders = document.querySelectorAll(".CardContent .bg-muted");
    expect(contentPlaceholders.length).toBeGreaterThan(5);
  });
});
