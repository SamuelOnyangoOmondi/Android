import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchools } from "@/hooks/useSchools";

interface SchoolFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SchoolFilter({
  value,
  onValueChange,
  placeholder = "Select school",
  className,
}: SchoolFilterProps) {
  const { data: schools, isLoading, isError, error } = useSchools();

  const placeholderLabel = isLoading
    ? "Loading..."
    : isError
      ? "Error loading schools"
      : placeholder;

  const errorMessage = (() => {
    if (!error) return "Unknown error";
    if (error instanceof Error) return error.message;
    const o = error as Record<string, unknown>;
    if (typeof o?.message === "string") return o.message;
    if (typeof o?.error_description === "string") return o.error_description;
    if (typeof o?.details === "string") return o.details;
    try {
      const s = JSON.stringify(error);
      return s.length > 120 ? s.slice(0, 120) + "…" : s;
    } catch {
      return "Unknown error";
    }
  })();

  return (
    <div className="space-y-1">
      <Select value={value || undefined} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholderLabel} />
        </SelectTrigger>
        <SelectContent>
          {schools?.map((school) => (
            <SelectItem key={school.id} value={school.id}>
              {school.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isError && (
        <p className="text-xs text-destructive" title={errorMessage}>
          {errorMessage.length > 60 ? `${errorMessage.slice(0, 60)}…` : errorMessage}
        </p>
      )}
    </div>
  );
}
