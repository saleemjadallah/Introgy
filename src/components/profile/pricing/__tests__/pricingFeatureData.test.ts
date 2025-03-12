
import { expect, describe, it } from "vitest";
import { pricingFeatures } from "../pricingFeatureData";

describe("pricingFeatureData", () => {
  it("contains an array of pricing features", () => {
    expect(Array.isArray(pricingFeatures)).toBe(true);
    expect(pricingFeatures.length).toBeGreaterThan(0);
  });

  it("each feature has the correct structure", () => {
    pricingFeatures.forEach(feature => {
      expect(feature).toHaveProperty("name");
      expect(feature).toHaveProperty("free");
      expect(feature).toHaveProperty("premium");
      
      expect(Array.isArray(feature.free)).toBe(true);
      expect(Array.isArray(feature.premium)).toBe(true);
      
      expect(typeof feature.name).toBe("string");
      
      feature.free.forEach(item => {
        expect(typeof item).toBe("string");
      });
      
      feature.premium.forEach(item => {
        expect(typeof item).toBe("string");
      });
    });
  });

  it("premium features are more numerous than free features", () => {
    let totalFreeFeatures = 0;
    let totalPremiumFeatures = 0;
    
    pricingFeatures.forEach(feature => {
      totalFreeFeatures += feature.free.length;
      totalPremiumFeatures += feature.premium.length;
    });
    
    expect(totalPremiumFeatures).toBeGreaterThan(totalFreeFeatures);
  });

  it("contains expected feature categories", () => {
    const featureNames = pricingFeatures.map(feature => feature.name);
    
    // Check for core feature categories
    expect(featureNames).toContain("Social Battery");
    expect(featureNames).toContain("Social Navigation");
    expect(featureNames).toContain("Connection Builder");
    expect(featureNames).toContain("Wellbeing Center");
    expect(featureNames).toContain("Education Center");
  });
});
