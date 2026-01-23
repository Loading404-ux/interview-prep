import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProblemDescription from "./ProblemDescription";
import SolutionsPanel from "./SolutionsPanel";
import DiscussionsPanel from "./DiscussionsPanel";

export default function ProblemTabs({ problem }: { problem: ProblemDetail }) {
  return (
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

      <TabsContent value="description" className="flex-1 m-0 h-full bg-card">
        <ProblemDescription problem={problem} />
      </TabsContent>

      <TabsContent value="solutions">
        <SolutionsPanel problemId={problem.id} />
      </TabsContent>

      <TabsContent value="discussions">
        <DiscussionsPanel problemId={problem.id} />
      </TabsContent>
    </Tabs>
  );
}
