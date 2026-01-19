"use client"
import { useState, useEffect } from "react";
// import { MainLayout } from "@/components/MainLayout";
import { SkeletonCard } from "@/components/SkeletonCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Clock,
    ThumbsUp,
    MessageSquare,
    Bookmark,
    Check,
    X,
    ChevronRight,
    Building2,
    Tag,
    Filter,
} from "lucide-react";



const problems: Problem[] = [
    { id: 1, title: "Two Sum", difficulty: "Easy", topics: ["Array", "Hash Table"], company: "Google", acceptance: 49, solved: true },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", topics: ["Linked List", "Math"], company: "Amazon", acceptance: 40, solved: true },
    { id: 3, title: "Longest Substring Without Repeating", difficulty: "Medium", topics: ["String", "Sliding Window"], company: "Microsoft", acceptance: 33, solved: false },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", topics: ["Array", "Binary Search"], company: "Google", acceptance: 35, solved: false },
    { id: 5, title: "Reverse Integer", difficulty: "Medium", topics: ["Math"], company: "Apple", acceptance: 27, solved: false },
    { id: 6, title: "Valid Parentheses", difficulty: "Easy", topics: ["String", "Stack"], company: "Meta", acceptance: 40, solved: true },
    { id: 7, title: "Merge Two Sorted Lists", difficulty: "Easy", topics: ["Linked List"], company: "Amazon", acceptance: 62, solved: false },
    { id: 8, title: "Maximum Subarray", difficulty: "Medium", topics: ["Array", "DP"], company: "Microsoft", acceptance: 50, solved: false },
];

const difficultyColors: Record<Difficulty, string> = {
    Easy: "bg-success/20 text-success border-success/30",
    Medium: "bg-aptitude/20 text-aptitude border-aptitude/30",
    Hard: "bg-destructive/20 text-destructive border-destructive/30",
};

const companies = ["All", "Google", "Amazon", "Microsoft", "Meta", "Apple"];
const topics = ["All", "Array", "String", "Linked List", "Math", "DP", "Hash Table", "Stack", "Sliding Window", "Binary Search"];
const difficulties: ("All" | Difficulty)[] = ["All", "Easy", "Medium", "Hard"];

const CodingPractice = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
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

    const problemDescription = `Given a string s, find the length of the longest substring without repeating characters.

**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

**Example 2:**
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

**Constraints:**
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.`;

    if (isLoading) {
        return (
            <>
                <div className="max-w-7xl mx-auto space-y-4">
                    <SkeletonCard hasHeader={false} lines={1} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </>
        );
    }

    // Full-width list view when no problem is selected
    if (!selectedProblem) {
        return (
            <>
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search problems..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-card border-border/50 rounded-xl"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={companyFilter} onValueChange={setCompanyFilter}>
                                <SelectTrigger className="w-[140px] bg-card border-border/50 rounded-xl">
                                    <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={topicFilter} onValueChange={setTopicFilter}>
                                <SelectTrigger className="w-[140px] bg-card border-border/50 rounded-xl">
                                    <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topics.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as "All" | Difficulty)}>
                                <SelectTrigger className="w-[130px] bg-card border-border/50 rounded-xl">
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
                    </div>

                    {/* Problem List */}
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                        <div className="grid grid-cols-[1fr_100px_140px_100px_60px] gap-4 px-5 py-3 border-b border-border/50 text-sm font-medium text-muted-foreground">
                            <span>Problem</span>
                            <span>Difficulty</span>
                            <span>Company</span>
                            <span>Acceptance</span>
                            <span>Status</span>
                        </div>
                        <ScrollArea className="h-[calc(100vh-16rem)]">
                            {filteredProblems.map((problem) => (
                                <button
                                    key={problem.id}
                                    onClick={() => setSelectedProblem(problem)}
                                    className="w-full grid grid-cols-[1fr_100px_140px_100px_60px] gap-4 px-5 py-4 border-b border-border/30 hover:bg-muted/30 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                            {problem.id}. {problem.title}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <Badge variant="outline" className={cn("text-xs", difficultyColors[problem.difficulty as Difficulty])}>
                                            {problem.difficulty}
                                        </Badge>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{problem.company}</span>
                                    <span className="text-sm text-muted-foreground">{problem.acceptance}%</span>
                                    <div className="flex justify-center">
                                        {problem.solved ? (
                                            <Check className="w-5 h-5 text-success" />
                                        ) : (
                                            <span className="w-5 h-5" />
                                        )}
                                    </div>
                                </button>
                            ))}
                            {filteredProblems.length === 0 && (
                                <div className="py-12 text-center text-muted-foreground">
                                    No problems match your filters
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Showing {filteredProblems.length} of {problems.length} problems • {problems.filter((p) => p.solved).length} solved
                    </div>
                </div>
            </>
        );
    }

    // Problem detail view
    return (
        <>
            <div className="max-w-5xl mx-auto space-y-4">
                {/* Back button */}
                <button
                    onClick={() => setSelectedProblem(null)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                    Back to problems
                </button>

                {/* Problem Detail Card */}
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in">
                    {/* Problem Header */}
                    <div className="p-6 border-b border-border/50">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    {selectedProblem.id}. {selectedProblem.title}
                                </h1>
                                <div className="flex items-center gap-3 mt-3">
                                    <Badge variant="outline" className={cn(difficultyColors[selectedProblem.difficulty])}>
                                        {selectedProblem.difficulty}
                                    </Badge>
                                    {selectedProblem.topics.map((topic) => (
                                        <Badge key={topic} variant="secondary" className="bg-muted text-muted-foreground">
                                            {topic}
                                        </Badge>
                                    ))}
                                    <span className="text-sm text-muted-foreground">
                                        • {selectedProblem.company}
                                    </span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <Bookmark className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="description" className="flex-1 flex flex-col">
                        <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent p-0 h-auto">
                            <TabsTrigger
                                value="description"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="solutions"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                            >
                                Solutions
                            </TabsTrigger>
                            <TabsTrigger
                                value="discussions"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                            >
                                Discussions
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-22rem)]">
                                <div className="p-6">
                                    <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                                        {problemDescription}
                                    </div>

                                    {/* Hints */}
                                    <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50">
                                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            Expected Complexity
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Time: O(n) | Space: O(min(n, m)) where m is the charset size
                                        </p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="solutions" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-22rem)]">
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-foreground">
                                                    Sliding Window Approach
                                                </h4>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Using a set to track characters in the current window...
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <ThumbsUp className="w-4 h-4" /> 1.2k
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-4 h-4" /> 45
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="discussions" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-22rem)]">
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">U</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">User{i}23</p>
                                                    <p className="text-xs text-muted-foreground">2 days ago</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/80 mt-3">
                                                Can someone explain why we need to use a sliding window here?
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <ThumbsUp className="w-4 h-4" /> 24
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-4 h-4" /> 8
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default CodingPractice;