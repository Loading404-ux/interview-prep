"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

export default function ProblemDescription({ problem }:{problem: ProblemDetail}) {
  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="p-6">
        <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
          {problem.description}
        </div>

        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <h4 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Expected Complexity
          </h4>
          <p className="text-sm text-muted-foreground mt-2">
            {problem.expectedComplexity}
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}
