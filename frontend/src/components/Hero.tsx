import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background pt-[120px] pb-[80px] sm:pt-[160px] sm:pb-[100px] lg:pt-[200px] lg:pb-[140px] flex items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground mb-8 animate-fade-in-up">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mb-6">
          Automate Your Homestay{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
            Reputation
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The enterprise-grade pipeline that asynchronously analyzes, translates, and drafts multilingual AI responses to bulk guest reviews without manual bottlenecks.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25">
            Go to Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/about" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-muted text-foreground font-semibold border border-border hover:bg-muted/80 transition-all duration-300">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
