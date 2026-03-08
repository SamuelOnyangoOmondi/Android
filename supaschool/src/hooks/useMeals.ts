import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMealRecords,
  getMealSummary,
  recordMeal,
  deleteMealRecord,
  deleteMealRecordsByFilter,
  upsertMealBatch,
  type MealFilters,
  type MealRecordPayload,
} from "@/services/meals";

export function useMealRecords(filters: MealFilters) {
  return useQuery({
    queryKey: ["meals", filters],
    queryFn: () => getMealRecords(filters),
  });
}

export function useMealSummary(params: {
  schoolId?: string;
  classId?: string;
  mealDate: string;
  mealType?: "breakfast" | "lunch" | "supper" | "snack";
}) {
  return useQuery({
    queryKey: ["meal-summary", params],
    queryFn: () => getMealSummary(params),
    enabled: !!params.mealDate,
  });
}

export function useRecordMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["meal-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteMealRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { studentId: string; mealDate: string; mealType: "breakfast" | "lunch" | "supper" | "snack" }) =>
      deleteMealRecord(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["meal-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteMealRecordsByFilter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { schoolId: string; mealDate: string; mealType: "breakfast" | "lunch" | "supper" | "snack" }) =>
      deleteMealRecordsByFilter(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["meal-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpsertMealBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: MealRecordPayload[]) => upsertMealBatch(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["meal-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
