import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search events..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  );
};

export default SearchBar;
