
import React from "react";
import { toast } from "sonner";
import { BadgeProps } from "./Badge";
import { Award } from "lucide-react";

export const showBadgeNotification = (badge: BadgeProps) => {
  toast("New Badge Earned", {
    description: `You've earned the "${badge.name}" badge!`,
    action: {
      label: "View",
      onClick: () => {
        console.log("View badge", badge);
        // In a real app, this would navigate to the badge detail view
      },
    },
    icon: <Award className="h-5 w-5 text-primary" />,
    duration: 5000,
  });
};
