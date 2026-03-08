import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}