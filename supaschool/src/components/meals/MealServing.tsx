import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UtensilsCrossed, Loader2, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStudents } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import { useRecordMeal, useDeleteMealRecord, useDeleteMealRecordsByFilter, useMealRecords } from "@/hooks/useMeals";
import type { Tables } from "@/integrations/supabase/types";

type DbStudent = Tables<"students">;
type MealType = "breakfast" | "lunch" | "supper" | "snack";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  supper: "Supper",
  snack: "Snack",
};

interface MealServingProps {
  schoolId: string;
  selectedDate?: Date;
}

export const MealServing = ({ schoolId, selectedDate }: MealServingProps) => {
  const [classId, setClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const { data: students = [], isLoading } = useStudents({
    schoolId,
    classId: classId || undefined,
    search: searchTerm || undefined,
    isActive: true,
  });

  const { data: classes } = useClasses(schoolId);
  const recordMutation = useRecordMeal();
  const deleteMutation = useDeleteMealRecord();
  const bulkDeleteMutation = useDeleteMealRecordsByFilter();
  const { data: existingMeals = [] } = useMealRecords({
    schoolId,
    mealDate: dateStr,
  });

  const servedByStudentAndType = useMemo(() => {
    const map = new Map<string, Set<MealType>>();
    existingMeals.forEach((m: { student_id: string; meal_type: MealType }) => {
      if (!map.has(m.student_id)) map.set(m.student_id, new Set());
      map.get(m.student_id)!.add(m.meal_type);
    });
    return map;
  }, [existingMeals]);

  const isServed = (studentId: string, type: MealType) =>
    servedByStudentAndType.get(studentId)?.has(type) ?? false;

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const t = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.first_name.toLowerCase().includes(t) ||
        s.last_name.toLowerCase().includes(t) ||
        s.admission_number.toLowerCase().includes(t) ||
        (s.nemis_id?.toLowerCase().includes(t) ?? false)
    );
  }, [students, searchTerm]);

  const markServed = async (student: DbStudent, mealType: MealType) => {
    if (isServed(student.id, mealType)) return;
    try {
      await recordMutation.mutateAsync({
        studentId: student.id,
        schoolId: student.school_id,
        classId: student.class_id,
        mealDate: dateStr,
        mealType,
        served: true,
        source: "supaschool",
      });
      toast.success(`${MEAL_LABELS[mealType]} recorded for ${student.first_name} ${student.last_name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record meal");
    }
  };

  const uncheckMeal = async (student: DbStudent, mealType: MealType) => {
    if (!isServed(student.id, mealType)) return;
    try {
      await deleteMutation.mutateAsync({
        studentId: student.id,
        mealDate: dateStr,
        mealType,
      });
      toast.success(`${MEAL_LABELS[mealType]} removed for ${student.first_name} ${student.last_name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove meal");
    }
  };

  const clearAllForType = async (mealType: MealType) => {
    const count = existingMeals.filter((m: { meal_type: MealType }) => m.meal_type === mealType).length;
    if (count === 0) {
      toast.info(`No ${MEAL_LABELS[mealType].toLowerCase()} records to clear`);
      return;
    }
    if (!window.confirm(`Clear all ${MEAL_LABELS[mealType]} for this date? (${count} record${count === 1 ? "" : "s"})`)) return;
    try {
      await bulkDeleteMutation.mutateAsync({
        schoolId,
        mealDate: dateStr,
        mealType,
      });
      toast.success(`Cleared all ${MEAL_LABELS[mealType].toLowerCase()} for this date`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to clear");
    }
  };

  const markAllServedForType = async (mealType: MealType) => {
    const toServe = filteredStudents.filter((s) => !isServed(s.id, mealType));
    if (toServe.length === 0) {
      toast.info(`All students already marked for ${MEAL_LABELS[mealType].toLowerCase()}`);
      return;
    }
    let count = 0;
    for (const student of toServe) {
      try {
        await recordMutation.mutateAsync({
          studentId: student.id,
          schoolId: student.school_id,
          classId: student.class_id,
          mealDate: dateStr,
          mealType,
          served: true,
          source: "supaschool",
        });
        count++;
      } catch (err) {
        toast.error(`Failed for ${student.first_name} ${student.last_name}`);
        break;
      }
    }
    if (count > 0) toast.success(`${MEAL_LABELS[mealType]} recorded for ${count} students`);
  };

  if (!schoolId) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Record Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a school in the sidebar to record meals.</p>
        </CardContent>
      </Card>
    );
  }

  const mealTypes: MealType[] = ["breakfast", "lunch", "supper", "snack"];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Record Daily Meals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Class</label>
            <Select value={classId || "__all__"} onValueChange={(v) => setClassId(v === "__all__" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All classes</SelectItem>
                {classes?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Search className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search student..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No students found. Add students in Manage Students first.
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Admission #</th>
                  {mealTypes.map((type) => (
                    <th key={type} className="px-2 py-3 text-center text-sm font-medium text-gray-500">
                      <div className="flex flex-col items-center gap-1">
                        <span>{MEAL_LABELS[type]}</span>
                        <div className="flex gap-1 flex-wrap justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => markAllServedForType(type)}
                            disabled={recordMutation.isPending || filteredStudents.every((s) => isServed(s.id, type))}
                          >
                            Mark all
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => clearAllForType(type)}
                            disabled={bulkDeleteMutation.isPending || !filteredStudents.some((s) => isServed(s.id, type))}
                            title={`Clear all ${MEAL_LABELS[type]} for this date`}
                          >
                            Clear all
                          </Button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="bg-white">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.admission_number}</td>
                    {mealTypes.map((type) => {
                      const served = isServed(student.id, type);
                      return (
                        <td key={type} className="px-2 py-2 text-center">
                          {served ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 p-0"
                              onClick={() => uncheckMeal(student, type)}
                              disabled={deleteMutation.isPending}
                              title={`Remove ${MEAL_LABELS[type].toLowerCase()} (click to uncheck)`}
                            >
                              <Check className="h-5 w-5" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="min-w-[2.25rem] h-9"
                              onClick={() => markServed(student, type)}
                              disabled={recordMutation.isPending}
                              title={`Mark ${MEAL_LABELS[type].toLowerCase()} served`}
                            >
                              <UtensilsCrossed className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
