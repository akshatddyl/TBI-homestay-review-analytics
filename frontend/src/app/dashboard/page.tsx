"use client";

import { useEffect, useState } from "react";
import { BarChart3, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { toast } from "@/components/ui/Toast";

interface Review {
  id: number;
  guest_name: string;
  homestay_name: string;
  original_review: string;
  original_language: string;
  translated_review_en: string;
  ai_draft_response: string;
  status: string;
  rating: number;
  created_at: string;
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("http://localhost:8000/api/reviews");
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        toast.error("Failed to load reviews from the backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  const metrics = [
    { label: "Total Reviews", value: reviews.length.toString(), icon: MessageSquare },
    { label: "Pending Drafts", value: pendingCount.toString(), icon: Clock },
    { label: "Auto-replied (Cached)", value: "0", icon: CheckCircle2 },
    { label: "Avg Latency Saved", value: "0s", icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor pipeline performance and review pending drafts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <m.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold text-foreground">
                {loading ? <Loader size="sm" /> : m.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground mb-6">Recent Reviews & AI Drafts</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader size="lg" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground text-center">No reviews found.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-6 bg-background">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{review.guest_name}</h3>
                    <p className="text-sm text-muted-foreground">{review.homestay_name} &bull; Rating: {review.rating}/5</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                    {review.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Original ({review.original_language})</p>
                    <p className="text-sm text-foreground">{review.original_review}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-2 uppercase">AI Draft Response</p>
                    <p className="text-sm text-foreground">{review.ai_draft_response}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
