import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Search,
  FolderOpen,
  BookOpen,
  GraduationCap,
  Building2,
  Heart,
  Shield,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  { id: "nutrition", label: "Nutrition", icon: Heart },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "policies", label: "School policies", icon: Shield },
  { id: "program", label: "Program management", icon: Building2 },
  { id: "training", label: "Teacher training", icon: BookOpen },
  { id: "health", label: "Health guidelines", icon: Heart },
];

const DEMO_DOCS = [
  { id: "1", title: "School Feeding Policy 2024", category: "policies", format: "PDF", updated: "2024-01-15" },
  { id: "2", title: "Nutrition Guidelines for Students", category: "nutrition", format: "PDF", updated: "2024-02-20" },
  { id: "3", title: "Food Storage & Safety SOP", category: "health", format: "Word", updated: "2024-03-01" },
  { id: "4", title: "Teacher Training Manual", category: "training", format: "PDF", updated: "2024-02-10" },
  { id: "5", title: "Operational Procedures", category: "program", format: "PDF", updated: "2024-01-28" },
];

export default function FlamiKnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDocs = DEMO_DOCS.filter((d) => {
    const matchSearch = !searchQuery.trim() || d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = !selectedCategory || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-violet-600 to-purple-800 p-6 rounded-xl shadow-md border border-violet-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Knowledge Base</h1>
          <p className="text-white/80 max-w-2xl">
            Central repository for institutional knowledge, policies, guides, and training materials. AI-indexed for semantic search.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                      className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === c.id ? "bg-violet-100 text-violet-900" : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {c.label}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upload document</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  PDF, Word, Excel, images, videos. AI will extract and index content.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Smart search</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Keyword, semantic, or AI summary. Try: &quot;food storage&quot; or &quot;recommended daily calorie intake&quot;
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  <Badge variant="secondary" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                    AI-indexed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredDocs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No documents match your search.</p>
                    </div>
                  ) : (
                    filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {CATEGORIES.find((c) => c.id === doc.category)?.label} · {doc.format} · {doc.updated}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {doc.format}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  AI-indexed knowledge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  When documents are uploaded, the AI extracts text, embeds content, and stores vectors. The FLAMI
                  assistant can then answer questions like &quot;What is the recommended daily calorie intake for students?&quot; using
                  this knowledge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
