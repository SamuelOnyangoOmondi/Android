import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchools } from "@/hooks/useSchools";
import { Search, Building2, Users, MapPin } from "lucide-react";

export default function FlamiSearchPage() {
  const [query, setQuery] = useState("");
  const [county, setCounty] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const { data: schools = [], isLoading } = useSchools();

  const filteredSchools = schools.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      (s.name?.toLowerCase().includes(q) ?? false) ||
      (s.location?.toLowerCase().includes(q) ?? false) ||
      (s.county?.toLowerCase().includes(q) ?? false) ||
      (s.constituency?.toLowerCase().includes(q) ?? false);
    const matchCounty = !county || county === "__all__" || s.county === county;
    const matchType = !schoolType || schoolType === "__all__" || s.institution_type_1 === schoolType;
    return matchQuery && matchCounty && matchType;
  });

  const counties = Array.from(new Set(schools.map((s) => s.county).filter(Boolean))) as string[];
  const sortedCounties = [...counties].sort();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-violet-600 to-purple-800 p-6 rounded-xl shadow-md border border-violet-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">School Search</h1>
          <p className="text-white/80 max-w-2xl">
            Fast search across all schools, students, and data. The global lookup engine.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Search</CardTitle>
            <p className="text-sm text-muted-foreground">
              Search by school name, student name, admission number, NEMIS ID, teacher, or location.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Kilimani Primary, Amina Hassan, NEMIS..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={county || "__all__"} onValueChange={(v) => setCounty(v === "__all__" ? "" : v)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All counties</SelectItem>
                  {sortedCounties.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={schoolType || "__all__"} onValueChange={(v) => setSchoolType(v === "__all__" ? "" : v)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="School type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All types</SelectItem>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Results</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredSchools.length} school{filteredSchools.length !== 1 ? "s" : ""} found
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No schools match your search.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {filteredSchools.slice(0, 50).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Building2 className="h-12 w-12 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                          {s.county && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {s.county}
                              {s.constituency && ` · ${s.constituency}`}
                            </span>
                          )}
                          {s.total_enrollment != null && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {s.total_enrollment} students
                            </span>
                          )}
                        </div>
                        {s.level_of_education && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {s.level_of_education}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View details
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {filteredSchools.length > 50 && (
              <p className="text-sm text-muted-foreground mt-2">Showing first 50 of {filteredSchools.length} results.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
