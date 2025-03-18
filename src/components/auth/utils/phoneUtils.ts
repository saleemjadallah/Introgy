
/**
 * Formats a phone number input to ensure it has a + prefix
 */
export const formatPhoneNumber = (input: string): string => {
  const cleaned = input.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
};
