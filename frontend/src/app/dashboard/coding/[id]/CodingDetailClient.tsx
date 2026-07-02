"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { useProblemDetail } from "../hooks/useProblemDetail";
import ProblemHeader from "./components/ProblemHeader";
import ProblemTabs from "./components/ProblemTabs";

export default function CodingDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { problem, isLoading } = useProblemDetail(slug);
  console.log(isLoading, problem, slug)
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <SkeletonCard hasHeader={false} lines={1} />
        <SkeletonCard lines={8} />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">Problem Not Found</h1>
        <p className="text-muted-foreground mb-6">The problem you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/coding")} className="rounded-xl" variant={"outline"}>
          Back to Problems
        </Button>
      </div>

    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <button
        onClick={() => router.push("/dashboard/coding")}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to problems
      </button>
      <ProblemHeader problem={problem} />
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in h-[calc(100%-2.8rem)]">
        <ProblemTabs problem={problem} />
      </div>
    </div>
  );
}
