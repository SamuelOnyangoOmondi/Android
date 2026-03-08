import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { useClasses, useCreateClass, useUpdateClass } from "@/hooks/useClasses";
import { Loader2, Plus, Search, GraduationCap, Pencil } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DbClass = Tables<"classes">;

type ClassFormValues = {
  name: string;
  grade_level: string;
  stream: string;
  teacher_name: string;
  is_active: boolean;
};

function toFormValues(cls?: DbClass | null): ClassFormValues {
  return {
    name: cls?.name ?? "",
    grade_level: cls?.grade_level ?? "",
    stream: cls?.stream ?? "",
    teacher_name: cls?.teacher_name ?? "",
    is_active: cls?.is_active ?? true,
  };
}

export default function ClassesPage() {
  const [schoolId, setSchoolId] = useState("");
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DbClass | null>(null);
  const [form, setForm] = useState<ClassFormValues>(toFormValues(null));

  const { data: classes = [], isLoading } = useClasses(schoolId || undefined);
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) => c.name.toLowerCase().includes(q));
  }, [classes, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(toFormValues(null));
    setDialogOpen(true);
  };

  const openEdit = (cls: DbClass) => {
    setEditing(cls);
    setForm(toFormValues(cls));
    setDialogOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;

    try {
      if (!form.name.trim()) throw new Error("Class name is required");

      if (!editing) {
        await createMutation.mutateAsync({
          school_id: schoolId,
          name: form.name.trim(),
          grade_level: form.grade_level.trim() || null,
          stream: form.stream.trim() || null,
          teacher_name: form.teacher_name.trim() || null,
        });
      } else {
        await updateMutation.mutateAsync({
          id: editing.id,
          payload: {
            name: form.name.trim(),
            grade_level: form.grade_level.trim() || null,
            stream: form.stream.trim() || null,
            teacher_name: form.teacher_name.trim() || null,
            is_active: form.is_active,
          },
        });
      }

      setDialogOpen(false);
    } catch (err) {
      // keep UI lightweight; toast system exists elsewhere but not required
      console.error(err);
    }
  };

  const toggleActive = async (cls: DbClass, next: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id: cls.id,
        payload: { is_active: next },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-xl shadow-md border border-emerald-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Classes</h1>
          <p className="text-white/80 max-w-2xl">
            Create and manage class groupings for student rosters, attendance, and meals.
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
                <CardTitle className="text-lg font-medium">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search classes..."
                    className="pl-10"
                    disabled={!schoolId}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={openCreate} disabled={!schoolId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
                <p className="text-xs text-muted-foreground">
                  Tip: keep class names consistent (e.g. “Grade 5 - A”, “Class 1 Purple”).
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {!schoolId ? (
              <EmptyState
                icon={GraduationCap}
                title="Select a school"
                description="Choose a school to view and manage its classes."
              />
            ) : isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Class List</CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        New class
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{editing ? "Edit class" : "Create class"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Class name</Label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Grade 5 - A"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="grade_level">Grade level</Label>
                            <Input
                              id="grade_level"
                              value={form.grade_level}
                              onChange={(e) => setForm((p) => ({ ...p, grade_level: e.target.value }))}
                              placeholder="e.g. 5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stream">Stream</Label>
                            <Input
                              id="stream"
                              value={form.stream}
                              onChange={(e) => setForm((p) => ({ ...p, stream: e.target.value }))}
                              placeholder="e.g. A / Purple"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teacher_name">Teacher (optional)</Label>
                          <Input
                            id="teacher_name"
                            value={form.teacher_name}
                            onChange={(e) => setForm((p) => ({ ...p, teacher_name: e.target.value }))}
                            placeholder="e.g. Ms. Achieng"
                          />
                        </div>
                        {editing && (
                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <p className="text-sm font-medium">Active</p>
                              <p className="text-xs text-muted-foreground">
                                Inactive classes won’t show up in roster pickers.
                              </p>
                            </div>
                            <Switch
                              checked={form.is_active}
                              onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
                            />
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            type="submit"
                            disabled={createMutation.isPending || updateMutation.isPending}
                          >
                            {(createMutation.isPending || updateMutation.isPending) && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            {editing ? "Save changes" : "Create class"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {filtered.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      No classes found for this school. Create one to get started.
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Grade</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stream</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Teacher</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Active</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filtered.map((c) => (
                            <tr key={c.id} className="bg-white">
                              <td className="px-4 py-3 text-sm text-gray-900">{c.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{c.grade_level ?? "—"}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{c.stream ?? "—"}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{c.teacher_name ?? "—"}</td>
                              <td className="px-4 py-3 text-center">
                                <Switch
                                  checked={c.is_active}
                                  onCheckedChange={(v) => toggleActive(c, v)}
                                  disabled={updateMutation.isPending}
                                />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

