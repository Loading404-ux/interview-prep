"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight, Brain, Code2, Mic } from 'lucide-react';
const quickActions = [
  {
    title: "Start Coding Practice",
    description: "Solve problems from top companies",
    icon: Code2,
    color: "coding",
    route: "/coding",
  },
  {
    title: "Start HR Interview",
    description: "Practice behavioral questions",
    icon: Mic,
    color: "hr",
    route: "/hr-interview",
  },
  {
    title: "Practice Aptitude",
    description: "Sharpen your quantitative skills",
    icon: Brain,
    color: "aptitude",
    route: "/aptitude",
  },
];
function QuickStart() {
     const route = useRouter()
  return (
    
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => route.push(action.route)}
                className={cn(
                  "action-card p-5 text-left group",
                  `border-${action.color}/30 hover:border-${action.color}/60`
                )}
                style={{
                  borderColor: `hsl(var(--${action.color}) / 0.3)`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      `bg-${action.color}/10 text-${action.color}`
                    )}
                    style={{
                      backgroundColor: `hsl(var(--${action.color}) / 0.1)`,
                      color: `hsl(var(--${action.color}))`,
                    }}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <ArrowRight
                    className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
  )
}

export default QuickStart