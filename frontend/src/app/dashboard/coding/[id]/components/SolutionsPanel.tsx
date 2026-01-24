"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSolutions } from "../../hooks/useSolutions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { toast } from "sonner"

export default function SolutionsPanel({ problemId }: { problemId: string }) {
  console.log(problemId)
  const {
    solutions,
    isLoading,
    toggleLike,
    addSolution,
  } = useSolutions(problemId);
  const [newSolution, setNewSolution] = useState({
    solutionText: "",
    explanation: "",
  })
  const { getToken } = useAuth()
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading solutions...
      </div>
    );
  }
  const handleSubmitSolution = async () => {
    if (!newSolution.solutionText.trim()) return

    try {
      const token = await getToken()

      const res = await api<{
        id: string
        questionId: string
        solution: string
        explanation?: string
        verdict: "accepted" | "rejected" | "needs_improvement"
        upvotes: number
        createdAt: string
      }>("/coding/submissions", {
        method: "POST",
        token,
        body: {
          questionId: problemId,
          solutionText: newSolution.solutionText,
          explanation: newSolution.explanation,
        },
      })
      if (res.verdict === "accepted") {
        addSolution({
          id: res.id,
          solution: res.solution,
          explanation: res.explanation,
          upvotes: res.upvotes,
          createdAt: res.createdAt,
        })

        toast.success("Solution accepted 🎉")
      } else {
        toast.message("Solution submitted for review")
      }
      setNewSolution({ solutionText: "", explanation: "" })
      setIsSubmitOpen(false)

    } catch (err: any) {
      toast.error(err.message ?? "Failed to submit solution")
    }
  }
  return (


    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="p-6 space-y-4">
        {/* Submit Solution */}
        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-coding hover:bg-coding/90 text-white rounded-md">
              <Plus className="w-4 h-4 mr-2" />
              Submit Solution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Your Solution</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Solution Code
                </label>
                <Textarea
                  placeholder="Paste your solution code here..."
                  value={newSolution.solutionText}
                  onChange={(e) =>
                    setNewSolution((prev) => ({ ...prev, solutionText: e.target.value }))
                  }
                  className="min-h-[200px] text-sm bg-muted/30 border-border/50 font-mono!"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Explanation
                </label>
                <Textarea
                  placeholder="Explain your approach, time/space complexity, and key insights..."
                  value={newSolution.explanation}
                  onChange={(e) =>
                    setNewSolution((prev) => ({ ...prev, explanation: e.target.value }))
                  }
                  className="min-h-[100px] bg-muted/30 border-border/50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitSolution}
                  disabled={!newSolution.solutionText.trim() || !newSolution.explanation.trim()}
                  className="bg-coding hover:bg-coding/90"
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
