import { useQuery } from "@tanstack/react-query";
import { getDashboardSnapshot, type DashboardFilters } from "@/services/dashboard";

export function useDashboardSnapshot(filters: DashboardFilters) {
  const date = filters.date ?? new Date().toISOString().split("T")[0];
  return useQuery({
    queryKey: ["dashboard", { ...filters, date }],
    queryFn: () => getDashboardSnapshot({ ...filters, date }),
  });
}
