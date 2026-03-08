import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, GraduationCap, BookOpen, Building2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchGlobal, type SearchResult, type SearchFilters } from "@/services/search";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, React.ElementType> = {
  student: Users,
  teacher: GraduationCap,
  class: BookOpen,
  school: Building2,
  page: FileText,
};

const RECENT_KEY = "search-recent";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  try {
    const s = localStorage.getItem(RECENT_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  if (!query.trim()) return;
  const recent = getRecentSearches().filter((r) => r.toLowerCase() !== query.toLowerCase());
  recent.unshift(query.trim());
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export function GlobalSearchBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    students: SearchResult[];
    teachers: SearchResult[];
    classes: SearchResult[];
    schools: SearchResult[];
    pages: SearchResult[];
  } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const allResults = results
    ? [
        ...results.students.map((r) => ({ ...r, group: "students" })),
        ...results.teachers.map((r) => ({ ...r, group: "teachers" })),
        ...results.classes.map((r) => ({ ...r, group: "classes" })),
        ...results.schools.map((r) => ({ ...r, group: "schools" })),
        ...results.pages.map((r) => ({ ...r, group: "pages" })),
      ].filter((r) => r.title)
    : [];
  const totalCount = allResults.length;

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const r = await searchGlobal(q);
      setResults(r);
      setSelectedIndex(0);
    } catch (err) {
      console.error("Search error:", err);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults(null);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  const handleSelect = (item: SearchResult) => {
    addRecentSearch(query);
    setOpen(false);
    setQuery("");
    navigate(item.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(1, totalCount));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + totalCount) % Math.max(1, totalCount));
      return;
    }
    if (e.key === "Enter" && totalCount > 0) {
      e.preventDefault();
      handleSelect(allResults[selectedIndex]);
    }
  };

  const recentSearches = getRecentSearches();
  const showRecent = !query.trim() && recentSearches.length > 0 && open;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full max-w-md relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search: Class, Course, Teacher, Student etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[400px] overflow-y-auto">
          {showRecent && (
            <div className="p-2 border-b">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Recent searches</p>
              {recentSearches.map((r) => (
                <button
                  key={r}
                  className="w-full text-left px-2 py-2 rounded-md text-sm hover:bg-accent"
                  onClick={() => {
                    setQuery(r);
                    inputRef.current?.focus();
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
          {query.trim().length >= 2 && (
            <>
              {loading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Searching...</div>
              ) : totalCount === 0 ? (
                <div className="py-8 px-4 text-center text-sm text-muted-foreground">
                  <p>No results found for &quot;{query}&quot;</p>
                  <p className="mt-1 text-xs">Try another keyword or check spelling.</p>
                </div>
              ) : (
                <div className="py-2">
                  {results!.students.length > 0 && (
                    <div className="px-2 py-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Students</p>
                      {results!.students.map((r, i) => {
                        const idx = allResults.findIndex((x) => x.id === r.id && x.type === r.type);
                        const Icon = TYPE_ICONS[r.type];
                        return (
                          <button
                            key={r.id}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left",
                              selectedIndex === idx && "bg-accent"
                            )}
                            onClick={() => handleSelect(r)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{r.title}</p>
                              {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {results!.teachers.length > 0 && (
                    <div className="px-2 py-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Teachers</p>
                      {results!.teachers.map((r) => {
                        const idx = allResults.findIndex((x) => x.id === r.id && x.type === r.type);
                        const Icon = TYPE_ICONS[r.type];
                        return (
                          <button
                            key={r.id}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left",
                              selectedIndex === idx && "bg-accent"
                            )}
                            onClick={() => handleSelect(r)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{r.title}</p>
                              {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {results!.classes.length > 0 && (
                    <div className="px-2 py-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Classes</p>
                      {results!.classes.map((r) => {
                        const idx = allResults.findIndex((x) => x.id === r.id && x.type === r.type);
                        const Icon = TYPE_ICONS[r.type];
                        return (
                          <button
                            key={r.id}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left",
                              selectedIndex === idx && "bg-accent"
                            )}
                            onClick={() => handleSelect(r)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{r.title}</p>
                              {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {results!.schools.length > 0 && (
                    <div className="px-2 py-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Schools</p>
                      {results!.schools.map((r) => {
                        const idx = allResults.findIndex((x) => x.id === r.id && x.type === r.type);
                        const Icon = TYPE_ICONS[r.type];
                        return (
                          <button
                            key={r.id}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left",
                              selectedIndex === idx && "bg-accent"
                            )}
                            onClick={() => handleSelect(r)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{r.title}</p>
                              {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {results!.pages.length > 0 && (
                    <div className="px-2 py-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Pages / Modules</p>
                      {results!.pages.map((r) => {
                        const idx = allResults.findIndex((x) => x.id === r.id && x.type === r.type);
                        const Icon = TYPE_ICONS[r.type];
                        return (
                          <button
                            key={r.id}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left",
                              selectedIndex === idx && "bg-accent"
                            )}
                            onClick={() => handleSelect(r)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{r.title}</p>
                              {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="border-t px-2 py-2">
                    <p className="text-xs text-muted-foreground">
                      Press <kbd className="rounded bg-muted px-1">Enter</kbd> to open top result · <kbd className="rounded bg-muted px-1">Esc</kbd> to close
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {query.trim().length > 0 && query.trim().length < 2 && (
            <div className="py-6 text-center text-sm text-muted-foreground">Type at least 2 characters to search</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
