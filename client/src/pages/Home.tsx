import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import ExperienceCard from "@/components/ExperienceCard";
import type { Experience } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

const API_BASE_URL = 
  window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "";
  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences", searchQuery],
    queryFn: async () => {
      const url = searchQuery
        ? `${API_BASE_URL}/api/experiences?search=${encodeURIComponent(searchQuery)}`
        : `${API_BASE_URL}/api/experiences`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch experiences");
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} showSearch={true} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Curated small-group experiences with certified guides. From kayaking through mangroves to sunrise treks, find your perfect getaway.
          </p>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = formData.get("search") as string;
            if (query) handleSearch(query);
          }}
          className="md:hidden mb-8"
        >
          <div className="relative">
            <input
              type="search"
              name="search"
              placeholder="Search experiences"
              className="w-full h-14 pl-4 pr-28 rounded-full border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
              data-testid="input-mobile-search"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 h-10 px-6 bg-primary text-primary-foreground rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform"
              data-testid="button-mobile-search-submit"
            >
              Search
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border-2 border-card-border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-12 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience Grid */}
        {!isLoading && experiences && experiences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && experiences && experiences.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">No experiences found</h3>
            <p className="text-muted-foreground">Try adjusting your search to find what you're looking for</p>
          </div>
        )}
      </main>
    </div>
  );
}
