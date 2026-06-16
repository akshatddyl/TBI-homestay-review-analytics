export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">About the Project</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The Trishul Eco-Homestays Review Analytics Platform is an enterprise-grade SaaS pipeline designed to automate reputation management. By leveraging asynchronous processing and the power of the Gemini 2.5 Flash API alongside local embedding models, we provide scalable, high-quality, and cost-effective multilingual review responses.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Our mission is to eliminate manual bottlenecks, allowing homestay managers to focus on what they do best: providing exceptional eco-friendly hospitality.
        </p>
      </div>
    </div>
  );
}
