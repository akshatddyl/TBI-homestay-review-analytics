import Link from "next/link";
import { Globe, Mail, MessageCircle, Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl text-foreground">Trishul Eco</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Enterprise-grade SaaS pipeline for homestay review analytics, intelligent translations, and AI-assisted responses.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Analytics Dashboard</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About the Project</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Website</span>
              </a>
              <a href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <MessageCircle className="h-4 w-4" />
                <span className="sr-only">Community</span>
              </a>
              <a href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Contact</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Trishul Eco-Homestays Platform. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
