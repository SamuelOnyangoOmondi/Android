import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMealSummary } from "@/hooks/useMeals";
import { Loader2, Coffee, UtensilsCrossed, Moon, Cookie } from "lucide-react";

interface MealSummaryProps {
  schoolId?: string;
  mealDate: string;
  fullWidth?: boolean;
}

const icons = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  supper: Moon,
  snack: Cookie,
};

export const MealSummary = ({ schoolId, mealDate, fullWidth }: MealSummaryProps) => {
  const { data: summary, isLoading } = useMealSummary({
    schoolId,
    mealDate,
  });

  if (isLoading) {
    return (
      <Card className={fullWidth ? "" : ""}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Today&apos;s Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(["breakfast", "lunch", "supper", "snack"] as const).map((type) => {
          const Icon = icons[type];
          const count = summary?.byType?.[type] ?? 0;
          return (
            <div
              key={type}
              className="flex items-center justify-between p-2 bg-amber-50 rounded-md"
            >
              <div className="flex items-center">
                <Icon className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-amber-800 capitalize">{type}</span>
              </div>
              <span className="font-bold">{count}</span>
            </div>
          );
        })}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold">{summary?.total ?? 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
