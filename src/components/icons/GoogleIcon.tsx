
import React from 'react';

const GoogleIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      <path d="M15.5 8.5L14 12l-2 1-2-1-1.5-3.5" />
      <path d="M7 17l2.5-5" />
      <path d="M14.5 12l2.5 5" />
      <path d="M9.5 8.5L12 10l2.5-1.5" />
    </svg>
  );
};

export default GoogleIcon;
