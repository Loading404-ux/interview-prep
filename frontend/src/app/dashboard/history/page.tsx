"use client";
import { useState, useEffect } from "react";
// import { MainLayout } from "@/components/MainLayout";
import { SkeletonCard } from "@/components/SkeletonCard";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Code2, Mic, Brain, Calendar, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActivityLog } from "@/hooks/useActivityLog";
// import { useNavigate } from "react-router-dom";

type ActivityType = "coding" | "hr" | "aptitude";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: Date;
  result?: string;
}

const activityIcons: Record<ActivityType, React.ReactNode> = {
  coding: <Code2 className="w-4 h-4" />,
  hr: <Mic className="w-4 h-4" />,
  aptitude: <Brain className="w-4 h-4" />,
};

const activityColors: Record<ActivityType, string> = {
  coding: "bg-coding/20 text-coding border-coding/30",
  hr: "bg-hr/20 text-hr border-hr/30",
  aptitude: "bg-aptitude/20 text-aptitude border-aptitude/30",
};

// const mockActivities: Activity[] = [
//   {
//     id: "1",
//     type: "coding",
//     title: "Two Sum",
//     description: "Solved using hash table approach",
//     date: new Date(),
//     result: "Accepted",
//   },
//   {
//     id: "2",
//     type: "hr",
//     title: "Tell me about yourself",
//     description: "Completed mock interview session",
//     date: new Date(),
//     result: "78% confidence",
//   },
//   {
//     id: "3",
//     type: "aptitude",
//     title: "Quantitative Quiz #12",
//     description: "Percentage and profit/loss problems",
//     date: new Date(),
//     result: "8/10 correct",
//   },
//   {
//     id: "4",
//     type: "coding",
//     title: "Valid Parentheses",
//     description: "Stack-based solution",
//     date: new Date(Date.now() - 86400000),
//     result: "Accepted",
//   },
//   {
//     id: "5",
//     type: "hr",
//     title: "Why this company?",
//     description: "Practice session with AI feedback",
//     date: new Date(Date.now() - 86400000),
//     result: "72% confidence",
//   },
//   {
//     id: "6",
//     type: "aptitude",
//     title: "Logical Reasoning Quiz #8",
//     description: "Syllogisms and blood relations",
//     date: new Date(Date.now() - 2 * 86400000),
//     result: "7/10 correct",
//   },
//   {
//     id: "7",
//     type: "coding",
//     title: "Merge Two Sorted Lists",
//     description: "Recursive approach attempted",
//     date: new Date(Date.now() - 3 * 86400000),
//     result: "Accepted",
//   },
//   {
//     id: "8",
//     type: "coding",
//     title: "Longest Common Prefix",
//     description: "Horizontal scanning method",
//     date: new Date(Date.now() - 5 * 86400000),
//     result: "Accepted",
//   },
// ];

const History = () => {
  const { activities, isLoading } = useActivityLog();
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityType | "all">("all");

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 800);
  //   return () => clearTimeout(timer);
  // }, []);

  const groupActivitiesByDate = (activities: ActivityDTO[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups: Record<string, ActivityDTO[]> = {
      Today: [],
      Yesterday: [],
      "Last 7 days": [],
      Earlier: [],
    };

    activities.forEach((activity) => {
      const activityDate = new Date(activity.createdAt);
      activityDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === today.getTime()) {
        groups.Today.push(activity);
      } else if (activityDate.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(activity);
      } else if (activityDate >= lastWeek) {
        groups["Last 7 days"].push(activity);
      } else {
        groups.Earlier.push(activity);
      }
    });

    return groups;
  };

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((a) => a.type === filter);

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  const handleActivityClick = (activity: ActivityDTO) => {
    switch (activity.type) {
      case "coding":
        router.push("/coding");
        break;
      case "hr":
        router.push("/hr-interview");
        break;
      case "aptitude":
        router.push("/aptitude");
        break;
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity History</h1>
            <p className="text-muted-foreground mt-1">
              Review your past practice sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredActivities.length} activities
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "coding", "hr", "aptitude"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {type === "all" ? "All" : type === "hr" ? "HR Interview" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Activity List */}
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard hasHeader={false} lines={2} />
            <SkeletonCard hasHeader={false} lines={2} />
            <SkeletonCard hasHeader={false} lines={2} />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-6 pr-4">
              {Object.entries(groupedActivities).map(
                ([group, activities]) =>
                  activities.length > 0 && (
                    <div key={group} className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background/60 backdrop-blur-md rounded-sm p-2">
                        {group}
                      </h3>
                      <div className="space-y-2">
                        {activities.map((activity: ActivityDTO) => (
                          <button
                            key={activity.id}
                            onClick={() => handleActivityClick(activity)}
                            className="w-full p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 text-left group"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "p-2 rounded-lg",
                                  activityColors[activity.type]
                                )}
                              >
                                {activityIcons[activity.type]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-foreground truncate">
                                    {activity.title}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs capitalize",
                                      activityColors[activity.type]
                                    )}
                                  >
                                    {activity.type === "hr" ? "HR" : activity.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 truncate">
                                  {activity.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(activity.createdAt)?.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {activity.result && (
                                    <span className="text-foreground/70">
                                      {activity.result}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default History;
