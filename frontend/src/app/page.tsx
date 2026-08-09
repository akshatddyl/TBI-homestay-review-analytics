import { Hero } from "@/components/Hero";
import { Card } from "@/components/Card";

export default function Home() {
  const features = [
    {
      title: "Asynchronous Batch Processing",
      description: "Decouples bulk CSV/text uploads from the HTTP lifecycle to process thousands of reviews without UI timeouts or blocking the web server.",
      action: { label: "View Architecture", href: "/about" }
    },
    {
      title: "Semantic Vector Caching",
      description: "Uses vector embeddings to detect highly similar reviews, instantly serving cached AI responses to drastically reduce latency and API costs.",
      action: { label: "Learn More", href: "/about" }
    },
    {
      title: "Multilingual Analysis",
      description: "Automatically translates guest reviews into English for the staff dashboard while drafting responses in the guest's native language.",
    },
    {
      title: "Human-in-the-Loop Workflow",
      description: "Puts AI drafts in a pending state for staff to review, edit, and approve, ensuring high-quality responses.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Powerful Core Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your homestay reputation at scale, powered by advanced AI and asynchronous processing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card 
                key={idx}
                title={feature.title}
                description={feature.description}
                action={feature.action}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
