"use client"
import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { MainLayout } from "@/components/MainLayout";
import { SkeletonCard } from "@/components/SkeletonCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useParams } from "next/navigation";
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
  description: string;
  expectedComplexity: string;
}

const problemsData: Problem[] = [
  { 
    id: 1, 
    title: "Two Sum", 
    slug: "two-sum",
    difficulty: "Easy", 
    topics: ["Array", "Hash Table"], 
    company: "Google", 
    acceptance: 49, 
    solved: true,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Constraints:**
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.`,
    expectedComplexity: "Time: O(n) | Space: O(n)",
  },
  { 
    id: 2, 
    title: "Add Two Numbers", 
    slug: "add-two-numbers",
    difficulty: "Medium", 
    topics: ["Linked List", "Math"], 
    company: "Amazon", 
    acceptance: 40, 
    solved: true,
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order.

**Example 1:**
\`\`\`
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
\`\`\`

**Constraints:**
- The number of nodes in each linked list is in the range [1, 100].
- 0 <= Node.val <= 9`,
    expectedComplexity: "Time: O(max(m,n)) | Space: O(max(m,n))",
  },
  { 
    id: 3, 
    title: "Longest Substring Without Repeating", 
    slug: "longest-substring-without-repeating",
    difficulty: "Medium", 
    topics: ["String", "Sliding Window"], 
    company: "Microsoft", 
    acceptance: 33, 
    solved: false,
    description: `Given a string s, find the length of the longest substring without repeating characters.

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
- \`s\` consists of English letters, digits, symbols and spaces.`,
    expectedComplexity: "Time: O(n) | Space: O(min(n, m)) where m is the charset size",
  },
  { 
    id: 4, 
    title: "Median of Two Sorted Arrays", 
    slug: "median-of-two-sorted-arrays",
    difficulty: "Hard", 
    topics: ["Array", "Binary Search"], 
    company: "Google", 
    acceptance: 35, 
    solved: false,
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

**Example 1:**
\`\`\`
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
\`\`\`

**Constraints:**
- nums1.length == m
- nums2.length == n
- 0 <= m <= 1000`,
    expectedComplexity: "Time: O(log(min(m,n))) | Space: O(1)",
  },
  { 
    id: 5, 
    title: "Reverse Integer", 
    slug: "reverse-integer",
    difficulty: "Medium", 
    topics: ["Math"], 
    company: "Apple", 
    acceptance: 27, 
    solved: false,
    description: `Given a signed 32-bit integer x, return x with its digits reversed.

**Example 1:**
\`\`\`
Input: x = 123
Output: 321
\`\`\`

**Constraints:**
- \`-2^31 <= x <= 2^31 - 1\``,
    expectedComplexity: "Time: O(log x) | Space: O(1)",
  },
  { 
    id: 6, 
    title: "Valid Parentheses", 
    slug: "valid-parentheses",
    difficulty: "Easy", 
    topics: ["String", "Stack"], 
    company: "Meta", 
    acceptance: 40, 
    solved: true,
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Constraints:**
- 1 <= s.length <= 10^4`,
    expectedComplexity: "Time: O(n) | Space: O(n)",
  },
  { 
    id: 7, 
    title: "Merge Two Sorted Lists", 
    slug: "merge-two-sorted-lists",
    difficulty: "Easy", 
    topics: ["Linked List"], 
    company: "Amazon", 
    acceptance: 62, 
    solved: false,
    description: `You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.

**Example 1:**
\`\`\`
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
\`\`\`

**Constraints:**
- The number of nodes in both lists is in the range [0, 50].`,
    expectedComplexity: "Time: O(n + m) | Space: O(1)",
  },
  { 
    id: 8, 
    title: "Maximum Subarray", 
    slug: "maximum-subarray",
    difficulty: "Medium", 
    topics: ["Array", "DP"], 
    company: "Microsoft", 
    acceptance: 50, 
    solved: false,
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

**Example 1:**
\`\`\`
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\`

**Constraints:**
- 1 <= nums.length <= 10^5`,
    expectedComplexity: "Time: O(n) | Space: O(1)",
  },
];

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-success/20 text-success border-success/30",
  Medium: "bg-aptitude/20 text-aptitude border-aptitude/30",
  Hard: "bg-destructive/20 text-destructive border-destructive/30",
};

const ProblemDetail = () => {
    const params = useParams();
  const router = useRouter();
  
  // Find the problem based on the ID in the URL
  // const problem = problems.find((p) => p.id === Number(params.id));

  // if (!problem) return <div>Problem not found</div>;
  const { slug } = useParams<{ slug: string }>();
  // const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching problem data
    const timer = setTimeout(() => {
      const foundProblem = problemsData.find((p) => p.id === Number(params.id));
      setProblem(foundProblem || null);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <div className="max-w-5xl mx-auto space-y-4">
          <SkeletonCard hasHeader={false} lines={1} />
          <SkeletonCard lines={8} />
        </div>
      </>
    );
  }

  if (!problem) {
    return (
      <>
        <div className="max-w-5xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Problem Not Found</h1>
          <p className="text-muted-foreground mb-6">The problem you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/coding")} variant="outline" className="rounded-xl">
            Back to Problems
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-4 h-full">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard/coding")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to problems
        </button>

        {/* Problem Detail Card */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in grow">
          {/* Problem Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {problem.id}. {problem.title}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant="outline" className={cn(difficultyColors[problem.difficulty])}>
                    {problem.difficulty}
                  </Badge>
                  {problem.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="bg-muted text-muted-foreground">
                      {topic}
                    </Badge>
                  ))}
                  <span className="text-sm text-muted-foreground">
                    • {problem.company}
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
                className="rounded-none border-0 border-b-2! border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
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
                    {problem.description}
                  </div>

                  {/* Hints */}
                  <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Expected Complexity
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      {problem.expectedComplexity}
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
                          Optimal Approach #{i}
                        </h4>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Clean implementation with detailed explanation...
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" /> {Math.floor(Math.random() * 1000) + 100}
                        </span>
                        {/* <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" /> {Math.floor(Math.random() * 50) + 5}
                        </span> */}
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
                          <p className="text-xs text-muted-foreground">{i} days ago</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 mt-3">
                        Great problem! Here's a tip for solving it efficiently...
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" /> {Math.floor(Math.random() * 30) + 5}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" /> {Math.floor(Math.random() * 10) + 1}
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

export default ProblemDetail;
