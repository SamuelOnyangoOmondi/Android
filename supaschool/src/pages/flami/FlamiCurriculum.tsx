import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  ClipboardList,
  Upload,
  Sparkles,
} from "lucide-react";

type Subject = {
  id: string;
  name: string;
  topics: { id: string; name: string; lessons: { id: string; name: string }[] }[];
};

const DEMO_SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    topics: [
      { id: "fractions", name: "Fractions", lessons: [{ id: "1", name: "Adding fractions" }, { id: "2", name: "Subtracting fractions" }] },
      { id: "decimals", name: "Decimals", lessons: [{ id: "3", name: "Place value" }, { id: "4", name: "Operations" }] },
    ],
  },
  {
    id: "eng",
    name: "English",
    topics: [
      { id: "grammar", name: "Grammar", lessons: [{ id: "5", name: "Nouns and verbs" }, { id: "6", name: "Sentence structure" }] },
    ],
  },
  {
    id: "sci",
    name: "Science",
    topics: [
      { id: "plants", name: "Plants", lessons: [{ id: "7", name: "Parts of a plant" }, { id: "8", name: "Photosynthesis" }] },
    ],
  },
];

export default function FlamiCurriculumPage() {
  const [schoolId, setSchoolId] = useState("");
  const [expandedSubject, setExpandedSubject] = useState<string | null>("math");
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-violet-600 to-purple-800 p-6 rounded-xl shadow-md border border-violet-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Curriculum Data</h1>
          <p className="text-white/80 max-w-2xl">
            Academic learning content and curriculum structures. Connects nutrition, attendance, and academic performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">School</CardTitle>
              </CardHeader>
              <CardContent>
                <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Teacher support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled={!schoolId}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload lesson plan
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={!schoolId}>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Track coverage
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Teachers can upload plans, track coverage, and record learning outcomes.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Curriculum structure</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Grade → Subject → Topic → Lesson. Each lesson may include PDFs, videos, assignments, quizzes.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {DEMO_SUBJECTS.map((subj) => (
                    <div key={subj.id} className="rounded-lg border">
                      <button
                        onClick={() => setExpandedSubject(expandedSubject === subj.id ? null : subj.id)}
                        className="w-full flex items-center gap-2 p-3 text-left hover:bg-muted/50"
                      >
                        {expandedSubject === subj.id ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{subj.name}</span>
                      </button>
                      {expandedSubject === subj.id && (
                        <div className="border-t pl-4">
                          {subj.topics.map((topic) => (
                            <div key={topic.id}>
                              <button
                                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                                className="w-full flex items-center gap-2 p-2.5 text-left text-sm hover:bg-muted/50"
                              >
                                {expandedTopic === topic.id ? (
                                  <ChevronDown className="h-3 w-3 shrink-0 ml-4" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 shrink-0 ml-4" />
                                )}
                                {topic.name}
                              </button>
                              {expandedTopic === topic.id && (
                                <div className="pl-8 pb-2 space-y-1">
                                  {topic.lessons.map((lesson) => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center gap-2 py-1.5 px-2 rounded text-sm"
                                    >
                                      <FileText className="h-3 w-3 text-muted-foreground" />
                                      {lesson.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  AI integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  FLAMI can recommend interventions based on curriculum and attendance data:
                </p>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                  <p className="font-medium text-amber-900">Example insight</p>
                  <p className="text-muted-foreground mt-1">
                    Students with low attendance show weaker math performance. Recommendation: Provide catch-up sessions for
                    Fractions and Decimals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
