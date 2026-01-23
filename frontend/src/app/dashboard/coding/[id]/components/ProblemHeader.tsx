import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProblemHeader({ problem }:{problem: ProblemDetail}) {
  return (
    <div className="bg-card rounded-xl border p-6">
      <h1 className="text-2xl font-bold">
        {problem.id}. {problem.title}
      </h1>

      <div className="flex gap-2 mt-3">
        <Badge className={cn("border", problem.difficulty)}>
          {problem.difficulty}
        </Badge>
        {problem.topics.map((t) => (
          <Badge key={t} variant="secondary">{t}</Badge>
        ))}
        <span className="text-sm text-muted-foreground">
          • {problem.company}
        </span>
      </div>
    </div>
  );
}
