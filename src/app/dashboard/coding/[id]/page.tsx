"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
// import { problems } from "@/data/problems"; // Move your problems array to a separate file
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Bookmark, Clock } from "lucide-react";
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

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Find the problem based on the ID in the URL
  const problem = problems.find((p) => p.id === Number(params.id));

  if (!problem) return <div>Problem not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto py-8 px-4 space-y-4"
    >
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" /> Back to problems
      </Button>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-border/50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{problem.id}. {problem.title}</h1>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">{problem.difficulty}</Badge>
                {problem.topics.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            </div>
            <Button variant="outline" size="icon"><Bookmark className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="description">
          <TabsList className="px-6 border-b rounded-none w-full justify-start bg-transparent">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <p>Problem description for {problem.title} goes here...</p>
              {/* Add your problemDescription variable content here */}
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Complexity</p>
                <p className="text-xs text-muted-foreground">Time: O(n) | Space: O(1)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}