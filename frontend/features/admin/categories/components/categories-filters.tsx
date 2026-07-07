"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type CategoriesFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function CategoriesFilters({
  search,
  onSearchChange,
}: CategoriesFiltersProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2" />
      <Input
        placeholder="جستجو در دسته بندی ها..."
        className="pr-9"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
