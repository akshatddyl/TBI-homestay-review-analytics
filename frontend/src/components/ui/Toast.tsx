"use client";

import { Toaster as HotToaster, toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Toaster() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className: "",
        style: {
          background: theme === "dark" ? "#0f172a" : "#ffffff", // slate-900 or white
          color: theme === "dark" ? "#f8fafc" : "#022c22", // slate-50 or emerald-950
          border: theme === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: theme === "dark" ? "#0f172a" : "#ffffff",
          },
        },
      }}
    />
  );
}

// Re-export the toast function so it can be imported from our ui folder
export { toast };
