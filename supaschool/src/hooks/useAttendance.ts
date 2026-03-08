import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceRecords,
  getAttendanceSummary,
  upsertAttendanceBatch,
  type AttendanceFilters,
  type AttendanceBatchItem,
} from "@/services/attendance";

export function useAttendanceRecords(filters: AttendanceFilters) {
  return useQuery({
    queryKey: ["attendance", filters],
    queryFn: () => getAttendanceRecords(filters),
  });
}

export function useAttendanceSummary(params: {
  schoolId?: string;
  classId?: string;
  attendanceDate: string;
}) {
  return useQuery({
    queryKey: ["attendance-summary", params],
    queryFn: () => getAttendanceSummary(params),
    enabled: !!params.attendanceDate,
  });
}

export function useUpsertAttendanceBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: AttendanceBatchItem[]) => upsertAttendanceBatch(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
