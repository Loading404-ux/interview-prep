import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  hasHeader?: boolean;
  lines?: number;
  className?: string;
  border?: boolean;
}

export const SkeletonCard = ({
  hasHeader = true,
  lines = 3,
  className,
  border = true,
}: SkeletonCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden bg-card ",
        className,
        border && "border border-border/50"
      )}
    >
      {hasHeader && (
        <div className="p-5 bg-muted/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 rounded skeleton-shimmer" />
              <div className="h-4 w-24 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
      )}
      <div className="p-5 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 rounded skeleton-shimmer",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  );
};
