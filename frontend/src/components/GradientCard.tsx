import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CardVariant = "coding" | "hr" | "aptitude" | "progress" | "default";

interface GradientCardProps {
  variant?: CardVariant;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  onClick?: () => void;
}

const gradientClasses: Record<CardVariant, string> = {
  coding: "gradient-card-coding",
  hr: "gradient-card-hr",
  aptitude: "gradient-card-aptitude",
  progress: "gradient-card-progress",
  default: "bg-muted/50",
};

export const GradientCard = ({
  variant = "default",
  title,
  subtitle,
  icon,
  children,
  className,
  headerClassName,
  onClick,
}: GradientCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden bg-card border border-border/50 card-glow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {(title || icon) && (
        <div
          className={cn(
            "relative p-5 accent-bars",
            gradientClasses[variant],
            headerClassName
          )}
        >
          <div className="flex items-start gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                {icon}
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="font-semibold text-lg text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {/* Decorative dots */}
          <div className="absolute bottom-2 right-4 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
