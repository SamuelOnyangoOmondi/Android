import { useQuery } from "@tanstack/react-query";
import { getSchools } from "@/services/schools";

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });
}
