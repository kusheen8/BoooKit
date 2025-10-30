import { MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Experience } from "@shared/schema";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="group bg-card border-2 border-card-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={experience.imageUrl}
          alt={experience.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full">
          <span className="font-mono text-sm font-bold">From ₹{experience.price}</span>
        </div>
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {experience.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors" data-testid={`text-experience-name-${experience.id}`}>
            {experience.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{experience.location}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {experience.description}
        </p>

        <Link href={`/experience/${experience.id}`}>
          <button
            className="w-full h-12 bg-primary text-primary-foreground rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform"
            data-testid={`button-view-details-${experience.id}`}
          >
            View Details
          </button>
        </Link>

      </div>
    </div>
  );
}
