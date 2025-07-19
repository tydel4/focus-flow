import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
    setIsExpanded(false);
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => setIsExpanded(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={handleBlur}
          className="h-9 w-[200px]"
          autoFocus
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 