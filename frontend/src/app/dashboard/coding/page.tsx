"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { List, type RowComponentProps } from "react-window";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Check,
    ChevronRight,
    Building2,
    Tag,
    Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useProblems } from "./hooks/useProblems";

/* ================= TYPES ================= */

type Difficulty = "Easy" | "Medium" | "Hard";


/* ================= ROW (PURE + MEMOIZED) ================= */

function RowComponent({
    index,
    items,
    style
}: RowComponentProps<{
    items: CodingProblem[];
}>) {
    const router = useRouter();
    const problem = items[index];
    const handleClick = useCallback(() => {
        router.push(`/dashboard/coding/${problem.id}`);
    }, [router, problem.id]);

    return (
        <button
            key={problem.id}
            onClick={handleClick}
            className="w-full grid grid-cols-[1fr_100px_140px_100px_60px] gap-4 px-5 py-4 border-b border-border/30 hover:bg-muted/30 transition-colors text-left group items-center"
        >
            <div className="flex items-center gap-3">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {index+1}. {problem.title}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <div>
                <Badge variant="outline" className={cn("text-xs", difficultyColors[problem.difficulty])}>
                    {problem.difficulty}
                </Badge>
            </div>
            <span className="text-sm text-muted-foreground truncate">{problem.company}</span>
            {/* <span className="text-sm text-muted-foreground">{problem.acceptance}%</span>
            <div className="flex justify-center">
                {problem.solved ? (
                    <Check className="w-5 h-5 text-success" />
                ) : (
                    <span className="w-5 h-5" />
                )}
            </div> */}
        </button>
    );
}


RowComponent.displayName = "RowComponent";

/* ================= CONSTANTS ================= */

const difficultyColors: Record<Difficulty, string> = {
    Easy: "bg-success/20 text-success border-success/30",
    Medium: "bg-aptitude/20 text-aptitude border-aptitude/30",
    Hard: "bg-destructive/20 text-destructive border-destructive/30",
};

const companies = ["All", "Google", "Amazon", "Microsoft", "Meta", "Apple"];
const topics = ["All", "Array", "String", "Linked List", "Math"];
const difficulties: ("All" | Difficulty)[] = ["All", "Easy", "Medium", "Hard"];

/* ================= MAIN ================= */

export default function CodingPractice() {
    const { problems, isLoading, filters, setFilters } = useProblems();
    // const [searchQuery, setSearchQuery] = useState("");
    // const [companyFilter, setCompanyFilter] = useState("All");
    // const [topicFilter, setTopicFilter] = useState("All");
    // const [difficultyFilter, setDifficultyFilter] =
    //     useState<"All" | Difficulty>("All");

    /* REAL loading simulation replacement (until API) */
    // useEffect(() => {
    //     setIsLoading(false);
    // }, []);

    /* 🔥 MEMOIZED FILTERING */
    // const filteredProblems = useMemo(() => {
    //     return problems.filter((p) => {
    //         if (
    //             searchQuery &&
    //             !p.title.toLowerCase().includes(searchQuery.toLowerCase())
    //         )
    //             return false;
    //         if (companyFilter !== "All" && p.company !== companyFilter)
    //             return false;
    //         if (topicFilter !== "All" && !p.topics.includes(topicFilter))
    //             return false;
    //         if (difficultyFilter !== "All" && p.difficulty !== difficultyFilter)
    //             return false;
    //         return true;
    //     });
    // }, [searchQuery, companyFilter, topicFilter, difficultyFilter]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 rounded-xl">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 sticky top-0 bg-card rounded-b-xl p-4 border z-10 pb-6 ">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <Input
                        placeholder="Search problems..."
                        value={filters.search}
                        onChange={(e) =>
                            setFilters({ search: e.target.value })
                        }
                        className="pl-10"
                    />
                </div>

                <Select value={filters.company}
                    onValueChange={(v) =>
                        setFilters({ company: v })
                    }>
                    <SelectTrigger className="w-32">
                        <Building2 className="w-4 h-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {companies.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filters.topic}
                    onValueChange={(v) =>
                        setFilters({ topic: v })
                    }>
                    <SelectTrigger className="w-32">
                        <Tag className="w-4 h-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {topics.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.difficulty}
                    onValueChange={(v) =>
                        setFilters({ difficulty: v as any })
                    }
                >
                    <SelectTrigger className="w-32">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {difficulties.map((d) => (
                            <SelectItem key={d} value={d}>
                                {d}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden h-full" data-problems>
                <div className="grid grid-cols-[1fr_100px_1fr] gap-4 px-5 py-3 border-b border-border/50 text-sm font-medium text-muted-foreground">
                    <span>Problem</span>
                    <span>Difficulty</span>
                    <span>Company</span>
                    {/* <span>Acceptance</span>
                    <span>Status</span> */}
                </div>
                {isLoading ? (
                    <>
                        {Array.from({ length: 20 }, (_, i) =>
                            <SkeletonCard hasHeader={false} lines={1} key={i} border={false} />
                        )}
                    </>
                ) : (
                    <>
                        {problems.length > 0 ? (
                            <List
                                rowComponent={RowComponent}
                                rowCount={problems.length}
                                rowHeight={25}
                                rowProps={{ items: problems }}
                            />
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                No problems match your filters
                            </div>
                        )}
                    </>

                )}
            </div>
        </div >
    );
}
