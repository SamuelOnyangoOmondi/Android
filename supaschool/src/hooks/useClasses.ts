import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClass, getClassesBySchool, updateClass } from "@/services/classes";

export function useClasses(schoolId: string | undefined) {
  return useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => getClassesBySchool(schoolId!),
    enabled: !!schoolId,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClass,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["classes", variables.school_id] });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateClass>[1] }) =>
      updateClass(id, payload),
    onSuccess: (data) => {
      // data contains school_id; refresh that school's classes list
      if (data?.school_id) queryClient.invalidateQueries({ queryKey: ["classes", data.school_id] });
    },
  });
}
