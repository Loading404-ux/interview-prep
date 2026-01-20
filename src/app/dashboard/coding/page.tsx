"use client";
import { useState, useEffect, useCallback } from "react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getScrollbarSize, List, type RowComponentProps } from "react-window";

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

type Difficulty = "Easy" | "Medium" | "Hard";

interface Problem {
    id: number;
    title: string;
    slug: string;
    difficulty: Difficulty;
    topics: string[];
    company: string;
    acceptance: number;
    solved: boolean;
}

const problems: Problem[] = [
    { id: 1, title: "Two Sum", slug: "two-sum", difficulty: "Easy", topics: ["Array", "Hash Table"], company: "Google", acceptance: 49, solved: true },


    { id: 2, title: "Add Two Numbers", slug: "add-two-numbers", difficulty: "Medium", topics: ["Linked List", "Math"], company: "Amazon", acceptance: 40, solved: true },
    { id: 3, title: "Longest Substring Without Repeating", slug: "longest-substring-without-repeating", difficulty: "Medium", topics: ["String", "Sliding Window"], company: "Microsoft", acceptance: 33, solved: false },
    { id: 4, title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", topics: ["Array", "Binary Search"], company: "Google", acceptance: 35, solved: false },
    { id: 5, title: "Reverse Integer", slug: "reverse-integer", difficulty: "Medium", topics: ["Math"], company: "Apple", acceptance: 27, solved: false },
    { id: 6, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", topics: ["String", "Stack"], company: "Meta", acceptance: 40, solved: true },
    { id: 7, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", topics: ["Linked List"], company: "Amazon", acceptance: 62, solved: false },
    { id: 8, title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "Medium", topics: ["Array", "DP"], company: "Microsoft", acceptance: 50, solved: false },
    { id: 9, title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", topics: ["Array", "Two Pointers"], company: "Google", acceptance: 54, solved: false },
    { id: 10, title: "3Sum", slug: "3sum", difficulty: "Medium", topics: ["Array", "Two Pointers"], company: "Amazon", acceptance: 32, solved: false },
    { id: 11, title: "Letter Combinations", slug: "letter-combinations", difficulty: "Medium", topics: ["String", "Backtracking"], company: "Meta", acceptance: 56, solved: false },
    { id: 12, title: "Remove Nth Node", slug: "remove-nth-node", difficulty: "Medium", topics: ["Linked List", "Two Pointers"], company: "Apple", acceptance: 40, solved: true },
    { id: 13, title: "Generate Parentheses", slug: "generate-parentheses", difficulty: "Medium", topics: ["String", "Backtracking"], company: "Microsoft", acceptance: 72, solved: false },
    { id: 14, title: "Merge k Sorted Lists", slug: "merge-k-sorted-lists", difficulty: "Hard", topics: ["Linked List", "Heap"], company: "Google", acceptance: 49, solved: false },
    { id: 15, title: "Search in Rotated Array", slug: "search-in-rotated-array", difficulty: "Medium", topics: ["Array", "Binary Search"], company: "Amazon", acceptance: 39, solved: false },
];

function RowComponent({
    index,
    items,
    style
}: RowComponentProps<{
    items: Problem[];
}>) {
    const router = useRouter()
    const problem = items[index];
    const handleProblemClick = useCallback((slug: number) => {
        router.push(`/dashboard/coding/${slug}`);
    }, []);
    return (
        <button
            key={problem.id}
            onClick={() => handleProblemClick(problem.id)}
            className="w-full grid grid-cols-[1fr_100px_140px_100px_60px] gap-4 px-5 py-4 border-b border-border/30 hover:bg-muted/30 transition-colors text-left group items-center"
        >
            <div className="flex items-center gap-3">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {problem.id}. {problem.title}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <div>
                <Badge variant="outline" className={cn("text-xs", difficultyColors[problem.difficulty])}>
                    {problem.difficulty}
                </Badge>
            </div>
            <span className="text-sm text-muted-foreground truncate">{problem.company}</span>
            <span className="text-sm text-muted-foreground">{problem.acceptance}%</span>
            <div className="flex justify-center">
                {problem.solved ? (
                    <Check className="w-5 h-5 text-success" />
                ) : (
                    <span className="w-5 h-5" />
                )}
            </div>
        </button>
    );
}

const difficultyColors: Record<Difficulty, string> = {
    Easy: "bg-success/20 text-success border-success/30",
    Medium: "bg-aptitude/20 text-aptitude border-aptitude/30",
    Hard: "bg-destructive/20 text-destructive border-destructive/30",
};

const companies = ["All", "Google", "Amazon", "Microsoft", "Meta", "Apple"];
const topics = ["All", "Array", "String", "Linked List", "Math", "DP", "Hash Table", "Stack", "Sliding Window", "Binary Search", "Two Pointers", "Backtracking", "Heap"];
const difficulties: ("All" | Difficulty)[] = ["All", "Easy", "Medium", "Hard"];

const CodingPractice = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [companyFilter, setCompanyFilter] = useState("All");
    const [topicFilter, setTopicFilter] = useState("All");
    const [difficultyFilter, setDifficultyFilter] = useState<"All" | Difficulty>("All");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredProblems = problems.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCompany = companyFilter === "All" || p.company === companyFilter;
        const matchesTopic = topicFilter === "All" || p.topics.includes(topicFilter);
        const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
        return matchesSearch && matchesCompany && matchesTopic && matchesDifficulty;
    });


    return (
        <>
            <div className="max-w-7xl mx-auto space-y-6 rounded-xl">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 sticky top-0 bg-card rounded-b-xl p-4 border z-10 pb-6 ">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            disabled={isLoading}
                            placeholder="Search problems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-card border-border/50 rounded-md"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={companyFilter} onValueChange={setCompanyFilter} disabled={isLoading}>
                            <SelectTrigger className="w-35 bg-card border-border/50 rounded-md">
                                <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Company" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={topicFilter} onValueChange={setTopicFilter} disabled={isLoading}>
                            <SelectTrigger className="w-35 bg-card border-border/50 rounded-md">
                                <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Topic" />
                            </SelectTrigger>
                            <SelectContent>
                                {topics.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as "All" | Difficulty)} disabled={isLoading}>
                            <SelectTrigger className="w-32 bg-card border-border/50 rounded-md">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                {difficulties.map((d) => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-xs text-muted-foreground absolute bottom-1 left-6">
                        Showing {filteredProblems.length} of {problems.length} problems • {problems.filter((p) => p.solved).length} solved
                    </div>
                </div>

                {/* Problem List */}
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden" data-problems>
                    <div className="grid grid-cols-[1fr_100px_140px_100px_60px] gap-4 px-5 py-3 border-b border-border/50 text-sm font-medium text-muted-foreground">
                        <span>Problem</span>
                        <span>Difficulty</span>
                        <span>Company</span>
                        <span>Acceptance</span>
                        <span>Status</span>
                    </div>
                    {
                        isLoading ?
                            <>
                                {Array.from({ length: 20 }, (_, i) =>
                                    <SkeletonCard hasHeader={false} lines={1} key={i} border={false} />
                                )}
                            </>
                            :
                            <>
                                {filteredProblems.length > 0 ? (
                                    <List
                                        rowComponent={RowComponent}
                                        rowCount={filteredProblems.length}
                                        rowHeight={25}
                                        rowProps={{ items: filteredProblems }}
                                    />
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        No problems match your filters
                                    </div>
                                )}
                            </>
                    }

                </div>


            </div>
        </>
    );
};

export default CodingPractice;
