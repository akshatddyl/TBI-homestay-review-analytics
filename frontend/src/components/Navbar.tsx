"use client";
import Link from "next/link";
import { UserCircle, Menu, Leaf, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <Link href="/" className="font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors">
              Trishul Eco
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-foreground transition-all duration-300">
              <UserCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/dashboard" className="block px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link href="/about" className="block px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/login" className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" onClick={() => setIsOpen(false)}>
              <UserCircle className="h-5 w-5" />
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
