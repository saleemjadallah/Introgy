
import React, { useState } from "react";
import Badge, { BadgeProps } from "./Badge";
import BadgeDetail from "./BadgeDetail";

interface BadgeGridProps {
  badges: BadgeProps[];
  title?: string;
  emptyMessage?: string;
}

const BadgeGrid = ({ 
  badges, 
  title, 
  emptyMessage = "No badges found in this category."
}: BadgeGridProps) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeProps | null>(null);
  
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      {badges.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-2">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center gap-2">
              <Badge
                {...badge}
                onClick={() => setSelectedBadge(badge)}
              />
              <span className="text-xs text-center line-clamp-1">{badge.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-4 text-center">{emptyMessage}</p>
      )}
      
      {selectedBadge && (
        <BadgeDetail
          badge={selectedBadge}
          isOpen={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
};

export default BadgeGrid;
