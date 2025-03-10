
import { toast } from "sonner";
import { type Myth } from "./mythsData";

export const shareMyth = (myth: Myth) => {
  const shareText = `Myth: "${myth.title}"\nReality: ${myth.reality}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Introvert Myth Debunked',
      text: shareText,
    }).catch(() => {
      // Fallback if sharing fails
      copyToClipboard(shareText);
    });
  } else {
    copyToClipboard(shareText);
  }
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied myth to clipboard");
  }).catch(() => {
    toast.error("Failed to copy. Try manually selecting the text.");
  });
};
