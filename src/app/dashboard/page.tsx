
import { Code2, Mic, Brain } from "lucide-react";
const stats = {
  coding: { accuracy: 72, solved: 45, total: 150 },
  hr: { confidence: 68, sessions: 12 },
  aptitude: { accuracy: 85, completed: 28 },
  streak: 7,
};

import { Progress } from "@/components/ui/progress";
import { GradientCard } from "@/components/GradientCard";
import QuickStart from "@/components/QuickStart";

export default function Page() {

  return (
    <>
      <div className="w-full space-y-4 lg:space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2 mb-6!">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="text-primary">John</span> 👋
          </h1>
          <p className="text-muted-foreground">
            Let's continue your interview preparation journey.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <GradientCard
              variant="coding"
              title="Coding Practice"
              subtitle={`${stats.coding.solved}/${stats.coding.total} problems`}
              icon={<Code2 className="w-5 h-5 text-white" />}
            >
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-semibold text-coding">{stats.coding.accuracy}%</span>
                </div>
                <Progress value={stats.coding.accuracy} className="h-2 bg-muted" />
              </div>
            </GradientCard>
            <GradientCard
              variant="hr"
              title="HR Interview"
              subtitle={`${stats.hr.sessions} sessions completed`}
              icon={<Mic className="w-5 h-5 text-white" />}
            >
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold text-hr">{stats.hr.confidence}%</span>
                </div>
                <Progress value={stats.hr.confidence} className="h-2 bg-muted" />
              </div>
            </GradientCard>

            <GradientCard
              variant="aptitude"
              title="Aptitude & Quant"
              subtitle={`${stats.aptitude.completed} quizzes done`}
              icon={<Brain className="w-5 h-5 text-white" />}
            >
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-semibold text-aptitude">{stats.aptitude.accuracy}%</span>
                </div>
                <Progress value={stats.aptitude.accuracy} className="h-2 bg-muted" />
              </div>
            </GradientCard>
          </div>
          {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" ></div> */}
        </div>

        <QuickStart />

      </div>
    </>

  )
}
