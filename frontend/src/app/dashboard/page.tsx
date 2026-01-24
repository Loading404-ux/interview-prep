"use client"
import { Code2, Mic, Brain } from "lucide-react";
const stats = {
  coding: { accuracy: 72, solved: 45, total: 150 },
  hr: { confidence: 68, sessions: 12 },
  aptitude: { accuracy: 85, completed: 28 },
  streak: 7,
};
import { StreakCalendar } from "@/components/StreakCalendar";
import { Progress } from "@/components/ui/progress";
import { GradientCard } from "@/components/GradientCard";
import QuickStart from "@/components/QuickStart";
import { useDashboard } from "@/hooks/useDashboard";

export default function Page() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading dashboard…
      </div>
    )
  }

  const { profile, progress, contributions } = data

  return (
    <div className="w-full space-y-4 lg:space-y-8">

      {/* Welcome Section */}
      <div className="space-y-2 mb-6!">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back,{" "}
          <span className="text-primary">{profile.name}</span> 👋
        </h1>
        <p className="text-muted-foreground">
          Let's continue your interview preparation journey.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">

          {/* CODING */}
          <GradientCard
            variant="coding"
            title="Coding Practice"
            subtitle={`${progress.coding.acceptedSubmissions}/${progress.coding.totalSubmissions} problems`}
            icon={<Code2 className="w-5 h-5 text-white" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-semibold text-coding">
                  {progress.coding.accuracy}%
                </span>
              </div>
              <Progress
                value={progress.coding.accuracy}
                className="h-2 bg-muted"
              />
            </div>
          </GradientCard>

          {/* HR */}
          <GradientCard
            variant="hr"
            title="HR Interview"
            subtitle={`${progress.hr.totalSessions} sessions completed`}
            icon={<Mic className="w-5 h-5 text-white" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-semibold text-hr">
                  {progress.hr.avgConfidence}%
                </span>
              </div>
              <Progress
                value={progress.hr.avgConfidence}
                className="h-2 bg-muted"
              />
            </div>
          </GradientCard>

          {/* APTITUDE */}
          <GradientCard
            variant="aptitude"
            title="Aptitude & Quant"
            subtitle={`${progress.aptitude.totalAttempts} quizzes done`}
            icon={<Brain className="w-5 h-5 text-white" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-semibold text-aptitude">
                  {progress.aptitude.accuracy}%
                </span>
              </div>
              <Progress
                value={progress.aptitude.accuracy}
                className="h-2 bg-muted"
              />
            </div>
          </GradientCard>

        </div>
      </div>

      <QuickStart />

      {/* STREAK */}
      <StreakCalendar data={contributions} />
    </div>
  )
}
