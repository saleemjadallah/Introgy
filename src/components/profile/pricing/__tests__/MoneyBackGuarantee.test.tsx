
import React from "react";
import { render, screen } from "@testing-library/react";
import MoneyBackGuarantee from "../MoneyBackGuarantee";

describe("MoneyBackGuarantee Component", () => {
  it("renders the guarantee title and description", () => {
    render(<MoneyBackGuarantee isMobile={false} />);
    
    expect(screen.getByText("30-Day Money-Back Guarantee")).toBeInTheDocument();
    expect(screen.getByText("Try Premium risk-free. If you're not satisfied, get a full refund within 30 days.")).toBeInTheDocument();
  });

  it("displays dollar sign icon", () => {
    render(<MoneyBackGuarantee isMobile={false} />);
    
    expect(document.querySelector(".text-primary")).toBeInTheDocument();
  });

  it("applies mobile styling when isMobile is true", () => {
    const { rerender } = render(<MoneyBackGuarantee isMobile={true} />);
    
    // Check for mobile-specific classes
    expect(document.querySelector(".p-4")).toBeInTheDocument();
    expect(document.querySelector(".h-6.w-6")).toBeInTheDocument();
    expect(screen.getByText("30-Day Money-Back Guarantee").className).toContain("text-sm");
    expect(screen.getByText("Try Premium risk-free. If you're not satisfied, get a full refund within 30 days.").className).toContain("text-xs");
    
    rerender(<MoneyBackGuarantee isMobile={false} />);
    
    // Check for desktop-specific classes
    expect(document.querySelector(".pt-6")).toBeInTheDocument();
    expect(document.querySelector(".h-8.w-8")).toBeInTheDocument();
    expect(screen.getByText("30-Day Money-Back Guarantee").className).not.toContain("text-sm");
    expect(screen.getByText("Try Premium risk-free. If you're not satisfied, get a full refund within 30 days.").className).toContain("text-sm");
  });
});
