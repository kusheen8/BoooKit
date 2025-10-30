import { Search } from "lucide-react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ onSearch, showSearch = true }: HeaderProps) {
  const [location] = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (onSearch && query) {
      onSearch(query);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 -ml-3"
            data-testid="link-home"
          >
            <img
              src="/images/experiences/Logo.png"
              alt="Experience Logo"
              className="h-10 w-auto md:h-12 object-contain"
            />
          </Link>
          {/* Search Bar - Desktop */}
          {showSearch && location === "/" && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  name="search"
                  placeholder="Search experiences"
                  className="w-full h-12 pl-4 pr-28 rounded-full border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                  data-testid="input-search"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 h-10 px-6 bg-primary text-primary-foreground rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform"
                  data-testid="button-search"
                >
                  Search
                </button>
              </div>
            </form>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {showSearch && location === "/" && (
              <button
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover-elevate"
                data-testid="button-mobile-search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
