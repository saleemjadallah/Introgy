
import React from "react";
import { render, screen } from "@testing-library/react";
import PremiumPlanHeader from "../../premium/PremiumPlanHeader";

describe("PremiumPlanHeader Component", () => {
  it("renders the title correctly", () => {
    render(<PremiumPlanHeader isMobile={false} />);
    expect(screen.getByText("Premium Plan")).toBeInTheDocument();
  });

  it("renders 'Best Value' badge when not mobile", () => {
    render(<PremiumPlanHeader isMobile={false} />);
    expect(screen.getByText("Best Value")).toBeInTheDocument();
  });

  it("renders 'Best' badge when mobile", () => {
    render(<PremiumPlanHeader isMobile={true} />);
    expect(screen.getByText("Best")).toBeInTheDocument();
  });

  it("applies mobile styling when mobile prop is true", () => {
    render(<PremiumPlanHeader isMobile={true} />);
    expect(screen.getByText("Premium Plan").className).toContain("text-xl");
  });
});
