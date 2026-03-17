"use client";

import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
  search: string;
  setSearch: (val: string) => void;
}

export function SearchHeader({ search, setSearch }: SearchHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-primary">
          <Package className="size-6" />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="хайх..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
