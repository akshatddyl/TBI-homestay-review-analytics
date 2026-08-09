import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CardProps {
  title: string;
  description: string;
  image?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function Card({ title, description, image, action }: CardProps) {
  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col h-full">
      {image && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-card-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed flex-grow">{description}</p>
        
        {action && (
          <div className="mt-6 pt-6 border-t border-border">
            <Link 
              href={action.href} 
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {action.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
