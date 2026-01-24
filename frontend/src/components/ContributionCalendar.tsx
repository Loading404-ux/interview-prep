import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useMemo } from "react";

interface ContributionCalendarProps {
  data: { date: string; count: number }[];
  className?: string;
}

export const ContributionCalendar = ({ data, className }: ContributionCalendarProps) => {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const days: string[] = [];
    
    // We'll show 15 weeks to better fill a standard card width
    const numWeeks = 15;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (numWeeks * 7));
    
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const current = new Date(startDate);
    while (current <= today) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    
    const weekColumns: string[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekColumns.push(days.slice(i, i + 7));
    }

    const months: { label: string; index: number }[] = [];
    weekColumns.forEach((week, i) => {
      const firstDayOfWeek = new Date(week[0]);
      const monthName = firstDayOfWeek.toLocaleString("default", { month: "short" });
      if (months.length === 0 || months[months.length - 1].label !== monthName) {
        months.push({ label: monthName, index: i });
      }
    });

    return { weeks: weekColumns, monthLabels: months };
  }, []);

  const hasContribution = (date: string) => data.some((d) => d.date === date && d.count>0);

  const dayLabels = [
    { label: "Mon", index: 1 },
    { label: "Wed", index: 3 },
    { label: "Fri", index: 5 },
  ];

  return (
    <TooltipProvider>
      {/* Container now uses w-full to fill the parent card */}
      <div className={cn("", className)}>
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold tracking-tight">Last 3 months</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-500">
              {data.filter(d => d.count > 0).length}
            </span>
            <span className="text-xs text-muted-foreground uppercase font-medium">Contributions</span>
          </div>
        </div>

        <div className="flex flex-col w-full overflow-hidden">
          {/* Month Labels - Positioned relative to the grid columns */}
          <div className="flex mb-2 ml-8 h-5 relative">
            {monthLabels.map((m, i) => (
              <span 
                key={i} 
                className="text-[11px] text-muted-foreground absolute transform -translate-x-1/2"
                style={{ 
                  left: `${(m.index / weeks.length) * 100}%`,
                  marginLeft: '8px' 
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-4 w-full">
            {/* Day Labels Column */}
            <div className="grid grid-rows-7 gap-[4px] h-full pt-[2px]">
              {dayLabels.map((day) => (
                <span
                  key={day.label}
                  className="text-[11px] text-muted-foreground flex items-center justify-end pr-2 h-full"
                  style={{ gridRowStart: day.index + 1 }}
                >
                  {day.label}
                </span>
              ))}
            </div>

            {/* Flexible Grid - Uses flex-1 to stretch across the card */}
            <div className="flex flex-1 gap-[4px]">
              {weeks.map((week, wkIdx) => (
                <div key={wkIdx} className="flex flex-col flex-1 gap-[4px]">
                  {week.map((date) => {
                    const active = hasContribution(date);
                    return (
                      <Tooltip key={date}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-full aspect-square rounded-[6px] transition-all hover:ring-2 hover:ring-primary/20 cursor-pointer",
                              active 
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                                : "bg-zinc-800/50"
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs font-medium">
                            {active ? "1 contribution" : "No contributions"}
                          </p>
                          <p className="text-[10px] opacity-70">{date}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend Section */}
        <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-border/50 gap-4">
          <p className="text-xs text-muted-foreground">
            Earn 1 contribution per verified submission
          </p>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-[3px]">
              {[0, 1, 2, 3, 4].map((v) => (
                <div 
                  key={v} 
                  className={cn(
                    "w-3 h-3 rounded-[2px]",
                    v === 0 ? "bg-zinc-800" : 
                    v === 1 ? "bg-emerald-900" :
                    v === 2 ? "bg-emerald-700" :
                    v === 3 ? "bg-emerald-500" : "bg-emerald-300"
                  )} 
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};