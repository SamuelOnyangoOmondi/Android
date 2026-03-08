import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  createStudent,
  createStudentsBulk,
  updateStudent,
  archiveStudent,
  type StudentFilters,
  type CreateStudentPayload,
} from "@/services/students";

export function useStudents(filters: StudentFilters) {
  return useQuery({
    queryKey: ["students", filters],
    queryFn: () => getStudents(filters),
    enabled: !!filters.schoolId,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useCreateStudentsBulk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudentsBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateStudentPayload> }) =>
      updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useArchiveStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
