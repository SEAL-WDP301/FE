import { AlertCircle, Database } from "lucide-react";

export function MentorLoadingState() {
  return <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">Loading data...</div>;
}

export function MentorErrorState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
      <AlertCircle className="h-7 w-7 text-red-500" />
      <p className="font-semibold text-foreground">Unable to load mentor data</p>
      <p className="text-sm text-muted-foreground">Check your session or backend connection and try again.</p>
    </div>
  );
}

export function MentorEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <Database className="h-7 w-7 text-muted-foreground" />
      <p className="font-semibold text-foreground">{title}</p>
      <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
