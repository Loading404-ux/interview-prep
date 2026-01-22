"use client";
import { useState, useEffect } from "react";
// import { useParams, userouter.push } from "react-router-dom";
// import { MainLayout } from "@/components/MainLayout";
import { SkeletonCard } from "@/components/SkeletonCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  ThumbsUp,
  Bookmark,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Send,
  Plus,
  MessageCircle,
  CornerDownRight,
  ArrowLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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

interface Solution {
  id: number;
  title: string;
  author: string;
  code: string;
  explanation: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

interface Reply {
  id: number;
  author: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

interface Discussion {
  id: number;
  author: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies: Reply[];
  showReplies: boolean;
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

const initialSolutions: Solution[] = [
  {
    id: 1,
    title: "Hash Map - O(n) Solution",
    author: "AlgoMaster",
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    explanation: "Use a hash map to store complements. For each number, check if its complement exists in the map. This gives O(n) time complexity with O(n) space.",
    likes: 342,
    isLiked: false,
    createdAt: "2 days ago",
  },
  {
    id: 2,
    title: "Two Pointer Approach (Sorted)",
    author: "CodeNinja",
    code: `function twoSum(nums, target) {
  const sorted = nums.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  let left = 0, right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left][0] + sorted[right][0];
    if (sum === target) return [sorted[left][1], sorted[right][1]];
    sum < target ? left++ : right--;
  }
}`,
    explanation: "Sort the array with indices, then use two pointers from both ends. This approach is useful when you need O(1) space (without hash map).",
    likes: 189,
    isLiked: false,
    createdAt: "5 days ago",
  },
  {
    id: 3,
    title: "Brute Force - Simple O(n²)",
    author: "Beginner123",
    code: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}`,
    explanation: "Check every pair of numbers. Simple to understand but O(n²) time complexity. Good for small inputs or learning purposes.",
    likes: 56,
    isLiked: false,
    createdAt: "1 week ago",
  },
];

const initialDiscussions: Discussion[] = [
  {
    id: 1,
    author: "TechEnthusiast",
    content: "Great problem for learning hash maps! I was stuck on the brute force approach for a while before realizing the optimal solution.",
    likes: 45,
    isLiked: false,
    createdAt: "3 hours ago",
    replies: [
      {
        id: 101,
        author: "HashMapFan",
        content: "Same here! The key insight is storing complements instead of the numbers themselves.",
        likes: 12,
        isLiked: false,
        createdAt: "2 hours ago",
      },
      {
        id: 102,
        author: "AlgoLearner",
        content: "I recommend practicing similar problems like 3Sum and 4Sum after this one.",
        likes: 8,
        isLiked: false,
        createdAt: "1 hour ago",
      },
    ],
    showReplies: false,
  },
  {
    id: 2,
    author: "InterviewPrep",
    content: "This is one of the most frequently asked questions in FAANG interviews. Make sure you can explain the time-space tradeoff!",
    likes: 89,
    isLiked: false,
    createdAt: "1 day ago",
    replies: [
      {
        id: 201,
        author: "GoogleDreamer",
        content: "Thanks for the tip! What other variations have you seen in interviews?",
        likes: 5,
        isLiked: false,
        createdAt: "20 hours ago",
      },
    ],
    showReplies: false,
  },
  {
    id: 3,
    author: "NewbieCoder",
    content: "Can someone explain why the hash map approach works? I'm having trouble understanding the complement logic.",
    likes: 23,
    isLiked: false,
    createdAt: "2 days ago",
    replies: [],
    showReplies: false,
  },
];

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-success/20 text-success border-success/30",
  Medium: "bg-aptitude/20 text-aptitude border-aptitude/30",
  Hard: "bg-destructive/20 text-destructive border-destructive/30",
};

const ProblemDetail = () => {
  const params = useParams();
  const slug = params.id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [problem, setProblem] = useState<Problem | null>(null);
  console.log(params)
  // Solutions state
  const [solutions, setSolutions] = useState<Solution[]>(initialSolutions);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [newSolution, setNewSolution] = useState({ solutionText: "", explanation: "" });

  // Discussions state
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundProblem = problemsData.find((p) => p.id === Number(slug));
      setProblem(foundProblem || null);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  // Solution handlers
  const handleLikeSolution = (id: number) => {
    setSolutions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, isLiked: !s.isLiked, likes: s.isLiked ? s.likes - 1 : s.likes + 1 }
          : s
      )
    );
  };

  const handleSubmitSolution = () => {
    if (!newSolution.solutionText.trim() || !newSolution.explanation.trim()) return;

    const solution: Solution = {
      id: Date.now(),
      title: "My Solution",
      author: "You",
      code: newSolution.solutionText,
      explanation: newSolution.explanation,
      likes: 0,
      isLiked: false,
      createdAt: "Just now",
    };

    setSolutions((prev) => [solution, ...prev]);
    setNewSolution({ solutionText: "", explanation: "" });
    setIsSubmitDialogOpen(false);
  };

  // Discussion handlers
  const handleLikeDiscussion = (id: number) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, isLiked: !d.isLiked, likes: d.isLiked ? d.likes - 1 : d.likes + 1 }
          : d
      )
    );
  };

  const handleLikeReply = (discussionId: number, replyId: number) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId
          ? {
            ...d,
            replies: d.replies.map((r) =>
              r.id === replyId
                ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
                : r
            ),
          }
          : d
      )
    );
  };

  const toggleReplies = (id: number) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, showReplies: !d.showReplies } : d))
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const discussion: Discussion = {
      id: Date.now(),
      author: "You",
      content: newComment,
      likes: 0,
      isLiked: false,
      createdAt: "Just now",
      replies: [],
      showReplies: false,
    };

    setDiscussions((prev) => [discussion, ...prev]);
    setNewComment("");
  };

  const handleAddReply = (discussionId: number) => {
    if (!replyText.trim()) return;

    const reply: Reply = {
      id: Date.now(),
      author: "You",
      content: replyText,
      likes: 0,
      isLiked: false,
      createdAt: "Just now",
    };

    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId
          ? { ...d, replies: [...d.replies, reply], showReplies: true }
          : d
      )
    );
    setReplyingTo(null);
    setReplyText("");
  };

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
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in h-[calc(100%-2.8rem)]">
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

            <TabsContent value="description" className="flex-1 m-0 h-full">
              <ScrollArea className="h-[calc(100vh-20rem)]">
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
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="p-6 space-y-4">
                  {/* Submit Solution Button */}
                  <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-coding hover:bg-coding/90 text-white rounded-md">
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Solution
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Submit Your Solution</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Solution Code
                          </label>
                          <Textarea
                            placeholder="Paste your solution code here..."
                            value={newSolution.solutionText}
                            onChange={(e) =>
                              setNewSolution((prev) => ({ ...prev, solutionText: e.target.value }))
                            }
                            className="min-h-[200px] text-sm bg-muted/30 border-border/50 font-mono!"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Explanation
                          </label>
                          <Textarea
                            placeholder="Explain your approach, time/space complexity, and key insights..."
                            value={newSolution.explanation}
                            onChange={(e) =>
                              setNewSolution((prev) => ({ ...prev, explanation: e.target.value }))
                            }
                            className="min-h-[100px] bg-muted/30 border-border/50"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsSubmitDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmitSolution}
                            disabled={!newSolution.solutionText.trim() || !newSolution.explanation.trim()}
                            className="bg-coding hover:bg-coding/90"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Solutions List */}
                  {solutions.map((solution) => (
                    <div
                      key={solution.id}
                      className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-coding/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{solution.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            by {solution.author} • {solution.createdAt}
                          </p>
                        </div>
                        <button
                          onClick={() => handleLikeSolution(solution.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            solution.isLiked
                              ? "bg-coding/20 text-coding"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <ThumbsUp className={cn("w-4 h-4", solution.isLiked && "fill-current")} />
                          {solution.likes}
                        </button>
                      </div>

                      {/* Code block */}
                      <pre className="p-3 rounded-lg bg-background/50 text-sm font-mono text-foreground/80 overflow-x-auto mb-3">
                        <code>{solution.code}</code>
                      </pre>

                      {/* Explanation */}
                      <p className="text-sm text-muted-foreground">{solution.explanation}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="discussions" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="p-6 space-y-4">
                  {/* New Comment Input */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary">Y</span>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 bg-muted/30 border-border/50 rounded-xl"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        size="icon"
                        className="bg-coding hover:bg-coding/90 rounded-xl"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Discussions List */}
                  {discussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="p-4 rounded-xl bg-muted/30 border border-border/50"
                    >
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {discussion.author[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{discussion.author}</p>
                            <span className="text-xs text-muted-foreground">
                              {discussion.createdAt}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 mt-1">{discussion.content}</p>

                          {/* Actions */}
                          <div className="flex items-center gap-4 mt-3">
                            <button
                              onClick={() => handleLikeDiscussion(discussion.id)}
                              className={cn(
                                "flex items-center gap-1.5 text-sm transition-colors",
                                discussion.isLiked
                                  ? "text-coding"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <ThumbsUp
                                className={cn("w-4 h-4", discussion.isLiked && "fill-current")}
                              />
                              {discussion.likes}
                            </button>

                            <button
                              onClick={() =>
                                setReplyingTo(replyingTo === discussion.id ? null : discussion.id)
                              }
                              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Reply
                            </button>

                            {discussion.replies.length > 0 && (
                              <button
                                onClick={() => toggleReplies(discussion.id)}
                                className="flex items-center gap-1.5 text-sm text-coding hover:text-coding/80 transition-colors"
                              >
                                {discussion.showReplies ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                {discussion.replies.length}{" "}
                                {discussion.replies.length === 1 ? "reply" : "replies"}
                              </button>
                            )}
                          </div>

                          {/* Reply Input */}
                          {replyingTo === discussion.id && (
                            <div className="flex gap-2 mt-3">
                              <Input
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="flex-1 bg-background/50 border-border/50 rounded-xl text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddReply(discussion.id);
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                onClick={() => handleAddReply(discussion.id)}
                                disabled={!replyText.trim()}
                                size="sm"
                                className="bg-coding hover:bg-coding/90 rounded-xl"
                              >
                                Reply
                              </Button>
                            </div>
                          )}

                          {/* Replies */}
                          {discussion.showReplies && discussion.replies.length > 0 && (
                            <div className="mt-4 space-y-3 pl-4 border-l-2 border-border/50">
                              {discussion.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                      {reply.author[0]}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-foreground">
                                        {reply.author}
                                      </p>
                                      <span className="text-xs text-muted-foreground">
                                        {reply.createdAt}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground/80 mt-1">
                                      {reply.content}
                                    </p>
                                    <button
                                      onClick={() =>
                                        handleLikeReply(discussion.id, reply.id)
                                      }
                                      className={cn(
                                        "flex items-center gap-1.5 text-sm mt-2 transition-colors",
                                        reply.isLiked
                                          ? "text-coding"
                                          : "text-muted-foreground hover:text-foreground"
                                      )}
                                    >
                                      <ThumbsUp
                                        className={cn(
                                          "w-3.5 h-3.5",
                                          reply.isLiked && "fill-current"
                                        )}
                                      />
                                      {reply.likes}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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