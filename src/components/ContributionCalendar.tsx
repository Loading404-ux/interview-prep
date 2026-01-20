import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useMemo } from "react";

interface ContributionCalendarProps {
  data: { date: string; verified: boolean }[];
  className?: string;
}

export const ContributionCalendar = ({ data, className }: ContributionCalendarProps) => {
  // Generate a proper GitHub-style grid: 13 weeks (91 days) arranged by week columns
  const { weeks, months } = useMemo(() => {
    const today = new Date();
    const days: string[] = [];
    
    // Go back to find the start of the earliest week (Sunday)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 90);
    // Adjust to the previous Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Generate all days from start to today
    const current = new Date(startDate);
    while (current <= today) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    
    // Organize into weeks (columns)
    const weekColumns: string[][] = [];
    let currentWeek: string[] = [];
    
    for (let i = 0; i < days.length; i++) {
      const date = new Date(days[i]);
      if (date.getDay() === 0 && currentWeek.length > 0) {
        weekColumns.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(days[i]);
    }
    if (currentWeek.length > 0) {
      weekColumns.push(currentWeek);
    }
    
    // Get month labels
    const monthLabels: { label: string; column: number }[] = [];
    let lastMonth = -1;
    weekColumns.forEach((week, weekIndex) => {
      const firstDay = new Date(week[0]);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: firstDay.toLocaleDateString("en-US", { month: "short" }),
          column: weekIndex,
        });
        lastMonth = month;
      }
    });
    
    return { weeks: weekColumns, months: monthLabels };
  }, []);

  const hasContribution = (date: string): boolean => {
    return data.some((d) => d.date === date && d.verified);
  };

  const getLabel = (date: string): string => {
    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return hasContribution(date)
      ? `Verified submission on ${formatted}`
      : `No submission on ${formatted}`;
  };

  // Count total contributions
  const totalContributions = data.filter((d) => d.verified).length;

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Last 3 months</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-success">{totalContributions}</span>
            <span className="text-sm text-muted-foreground">contributions</span>
          </div>
        </div>

        {/* Month labels */}
        <div className="flex text-xs text-muted-foreground pl-8">
          {months.map((m, i) => (
            <div
              key={`${m.label}-${i}`}
              className="flex-shrink-0"
              style={{ 
                marginLeft: i === 0 ? `${m.column * 12}px` : undefined,
                width: i < months.length - 1 
                  ? `${(months[i + 1].column - m.column) * 12}px` 
                  : undefined 
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 text-xs text-muted-foreground pr-1">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-[11px] flex items-center justify-end w-6">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          <div className="flex gap-0.5 overflow-hidden">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const date = week[dayIndex];
                  if (!date) {
                    return <div key={dayIndex} className="w-[11px] h-[11px]" />;
                  }
                  const hasActivity = hasContribution(date);
                  return (
                    <Tooltip key={date} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-[11px] h-[11px] rounded-sm transition-colors duration-150",
                            hasActivity
                              ? "bg-success/70 hover:bg-success"
                              : "bg-muted/40 hover:bg-muted/60"
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {getLabel(date)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Earn 1 contribution per verified submission
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-0.5">
              <div className="w-[11px] h-[11px] rounded-sm bg-muted/40" />
              <div className="w-[11px] h-[11px] rounded-sm bg-success/30" />
              <div className="w-[11px] h-[11px] rounded-sm bg-success/50" />
              <div className="w-[11px] h-[11px] rounded-sm bg-success/70" />
              <div className="w-[11px] h-[11px] rounded-sm bg-success" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
