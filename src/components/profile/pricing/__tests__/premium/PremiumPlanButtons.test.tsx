
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PremiumPlanButtons from "../../premium/PremiumPlanButtons";

describe("PremiumPlanButtons Component", () => {
  const mockSubscribe = vi.fn();

  beforeEach(() => {
    mockSubscribe.mockClear();
  });

  it("renders a single button in mobile view", () => {
    render(
      <PremiumPlanButtons 
        isMobile={true} 
        isPremium={false} 
        isUpgrading={false} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(1);
    expect(screen.getByText("Upgrade Now")).toBeInTheDocument();
  });

  it("renders two buttons in desktop view", () => {
    render(
      <PremiumPlanButtons 
        isMobile={false} 
        isPremium={false} 
        isUpgrading={false} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly (Save 37%)")).toBeInTheDocument();
  });

  it("shows 'Current Plan' when premium in mobile view", () => {
    render(
      <PremiumPlanButtons 
        isMobile={true} 
        isPremium={true} 
        isUpgrading={false} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    expect(screen.getByText("Current Plan")).toBeInTheDocument();
  });

  it("disables buttons when isPremium is true", () => {
    render(
      <PremiumPlanButtons 
        isMobile={false} 
        isPremium={true} 
        isUpgrading={false} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it("disables buttons when isUpgrading is true", () => {
    render(
      <PremiumPlanButtons 
        isMobile={false} 
        isPremium={false} 
        isUpgrading={true} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it("shows loading state when upgrading", () => {
    render(
      <PremiumPlanButtons 
        isMobile={false} 
        isPremium={false} 
        isUpgrading={true} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    expect(screen.getAllByText("Processing...").length).toBe(2);
    // Check for spinner
    expect(document.querySelectorAll(".animate-spin").length).toBe(2);
  });

  it("calls onSubscribe with 'monthly' when monthly button is clicked", () => {
    render(
      <PremiumPlanButtons 
        isMobile={false} 
        isPremium={false} 
        isUpgrading={false} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    const monthlyButton = screen.getByText("Monthly").closest("button");
    if (monthlyButton) fireEvent.click(monthlyButton);
    
    expect(mockSubscribe).toHaveBeenCalledWith('monthly');
  });

  it("calls onSubscribe with 'yearly' when yearly button is clicked", () => {
    render(
      <PremiumPlanButtons 
        isMobile={false} 
        isPremium={false} 
        isUpgrading={false} 
        onSubscribe={mockSubscribe} 
      />
    );
    
    const yearlyButton = screen.getByText("Yearly (Save 37%)").closest("button");
    if (yearlyButton) fireEvent.click(yearlyButton);
    
    expect(mockSubscribe).toHaveBeenCalledWith('yearly');
  });
});
