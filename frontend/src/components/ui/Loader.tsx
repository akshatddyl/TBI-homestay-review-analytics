import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "spinner" | "skeleton";
}

export function Loader({ size = "md", className, variant = "spinner" }: LoaderProps) {
  if (variant === "skeleton") {
    return (
      <div 
        className={cn(
          "animate-pulse bg-muted rounded-md w-full",
          size === "sm" ? "h-4" : size === "md" ? "h-10" : "h-24",
          className
        )}
      />
    );
  }

  const spinnerSizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 
        className={cn("animate-spin text-primary", spinnerSizes[size], className)} 
      />
    </div>
  );
}
