import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

// Define MobileScrollArea that uses native scrolling for touch devices
const MobileScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, children, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-auto overscroll-contain webkit-overflow-scrolling-touch",
      orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
      orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
      className
    )}
    {...props}
  >
    <div className={cn(
      orientation === "horizontal" && "inline-flex",
      orientation === "vertical" && "flex flex-col",
    )}>
      {children}
    </div>
  </div>
))
MobileScrollArea.displayName = "MobileScrollArea"

// Define our extended type for the ScrollArea component
type RadixScrollAreaType = "auto" | "always" | "scroll" | "hover"
type ScrollAreaType = RadixScrollAreaType | "native"

// Enhanced ScrollArea component with better touch support
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { 
    orientation?: "horizontal" | "vertical",
    type?: ScrollAreaType
  }
>(({ className, children, orientation = "vertical", type = "auto", ...props }, ref) => {
  // Use type assertion to check for "native" type
  if (type === "native" as ScrollAreaType) {
    return (
      <MobileScrollArea 
        ref={ref as any} 
        className={className} 
        orientation={orientation}
        {...props as any}
      >
        {children}
      </MobileScrollArea>
    )
  }

  // For other types, use type assertion to pass only valid Radix ScrollArea types
  const validType = type as RadixScrollAreaType

  // Otherwise use the Radix UI ScrollArea with enhanced touch support
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative", className)}
      type={validType}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation={orientation} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar, MobileScrollArea }
