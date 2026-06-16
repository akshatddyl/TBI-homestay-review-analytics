import { BarChart3, Clock, CheckCircle2, MessageSquare } from "lucide-react";

export default function Dashboard() {
  const metrics = [
    { label: "Total Reviews", value: "0", icon: MessageSquare },
    { label: "Pending Drafts", value: "0", icon: Clock },
    { label: "Auto-replied (Cached)", value: "0", icon: CheckCircle2 },
    { label: "Avg Latency Saved", value: "0", icon: BarChart3 },
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
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Review Data Grid Placeholder</h2>
        <p className="text-muted-foreground">TanStack Table integration will be rendered here to show the pending human-in-the-loop workflows.</p>
      </div>
    </div>
  );
}
