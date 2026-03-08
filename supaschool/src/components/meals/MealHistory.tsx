import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMealRecords } from "@/hooks/useMeals";
import { Loader2, Download, Printer } from "lucide-react";
import { format } from "date-fns";

interface MealHistoryProps {
  schoolId?: string;
  mealDate?: string;
}

export const MealHistory = ({ schoolId, mealDate }: MealHistoryProps) => {
  const dateStr = mealDate ?? new Date().toISOString().split("T")[0];
  const { data: records = [], isLoading } = useMealRecords({
    schoolId,
    mealDate: dateStr,
  });

  const handleExportCSV = () => {
    const headers = ["Student", "Meal Type", "Date", "Time", "Source"];
    const rows = records.map((r) => {
      const student = r.students as { first_name?: string; last_name?: string } | null;
      const name = student ? `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() : "";
      const time = r.created_at ? format(new Date(r.created_at), "HH:mm") : "";
      return [name, r.meal_type, dateStr, time, r.source ?? ""];
    });
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meals-${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Meal History</CardTitle>
          <p className="text-sm text-muted-foreground">
            {mealDate ? `Records for ${format(new Date(mealDate), "PPP")}` : "Select a date"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={records.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} disabled={records.length === 0} title="Print or Save as PDF">
            <Printer className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No meal records for this date. Record meals in the Record Meals tab.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Meal Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((r) => {
                  const student = r.students as { first_name?: string; last_name?: string } | null;
                  const name = student
                    ? `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() || "—"
                    : "—";
                  return (
                  <tr key={r.id} className="bg-white">
                    <td className="px-4 py-3 text-sm text-gray-900">{name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{r.meal_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {r.created_at ? format(new Date(r.created_at), "HH:mm") : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.source}</td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
