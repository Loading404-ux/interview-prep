import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface StreakCalendarProps {
  data: { date: string; contributionCount: number }[];
  className?: string;
}

export const StreakCalendar = ({ data, className }: StreakCalendarProps) => {
  // Generate last 30 days
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  });

  const getActivityLevel = (date: string): number => {
    const activity = data.find((d) => d.date === date);
    if (!activity || activity.contributionCount === 0) return 0;
    if (activity.contributionCount === 1) return 1;
    if (activity.contributionCount <= 3) return 2;
    if (activity.contributionCount <= 5) return 3;
    return 4;
  };

  const getActivityLabel = (date: string): string => {
    const activity = data.find((d) => d.date === date);
    const count = activity?.contributionCount || 0;
    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return count === 0
      ? `No activity on ${formatted}`
      : `${count} ${count === 1 ? "activity" : "activities"} on ${formatted}`;
  };

  // Calculate current streak
  const currentStreak = (() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const level = getActivityLevel(days[i]);
      if (level > 0) streak++;
      else break;
    }
    return streak;
  })();

  // Activity level colors using CSS variables
  const getActivityColor = (level: number): string => {
    switch (level) {
      case 0: return "bg-muted/40";
      case 1: return "bg-primary/25";
      case 2: return "bg-primary/45";
      case 3: return "bg-primary/65";
      case 4: return "bg-primary/85";
      default: return "bg-muted/40";
    }
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last 30 days</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{currentStreak}</span>
            <span className="text-sm text-muted-foreground">day streak</span>
          </div>
        </div>
        
        <div className="grid grid-cols-10 gap-1">
          {days.map((date) => (
            <Tooltip key={date} delayDuration={100}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "w-full aspect-square rounded-sm transition-colors duration-150 min-h-[12px]",
                    getActivityColor(getActivityLevel(date))
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {getActivityLabel(date)}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((level) => (
              <div 
                key={level} 
                className={cn("w-3 h-3 rounded-sm", getActivityColor(level))} 
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
};
