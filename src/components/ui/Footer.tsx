
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-auto py-4 text-sm text-muted-foreground hidden md:block", className)}>
      <div className="container flex justify-center items-center gap-4">
        <Link to="/terms" className="hover:text-foreground transition-colors">
          Terms & Conditions
        </Link>
        <span className="text-muted-foreground/50">•</span>
        <Link to="/privacy" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
