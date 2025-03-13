
import React from "react";

export const Logo = () => {
  return (
    <div className="flex items-center">
      <img 
        src="/assets/logo.png" 
        alt="Logo" 
        className="h-12"
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};
