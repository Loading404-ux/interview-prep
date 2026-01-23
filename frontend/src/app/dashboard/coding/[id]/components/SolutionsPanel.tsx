"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSolutions } from "../../hooks/useSolutions";

export default function SolutionsPanel({ problemId }: { problemId: number }) {
  const {
    solutions,
    isLoading,
    toggleLike,
    addSolution,
  } = useSolutions(problemId);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading solutions...
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="p-6 space-y-4">
        {/* Submit Solution */}
        <Button
          className="w-full bg-coding hover:bg-coding/90"
          onClick={() => setIsSubmitOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Submit Solution
        </Button>

        {/* Empty State */}
        {solutions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No solutions yet. Be the first to submit one.
          </p>
        )}

        {/* Solutions List */}
        {solutions.map((solution) => (
          <div
            key={solution.id}
            className="p-4 rounded-xl bg-muted/30 border border-border/50"
          >
            <div className="flex justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">
                  {solution.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  by {solution.author} • {solution.createdAt}
                </p>
              </div>

              <button
                onClick={() => toggleLike(solution.id)}
                className={cn(
                  "flex items-center gap-1 text-sm",
                  solution.isLiked
                    ? "text-coding"
                    : "text-muted-foreground"
                )}
              >
                <ThumbsUp
                  className={cn(
                    "w-4 h-4",
                    solution.isLiked && "fill-current"
                  )}
                />
                {solution.likes}
              </button>
            </div>

            <pre className="bg-background/50 p-3 rounded-lg text-sm overflow-x-auto">
              <code>{solution.code}</code>
            </pre>

            {solution.explanation && (
              <p className="text-sm text-muted-foreground mt-2">
                {solution.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
