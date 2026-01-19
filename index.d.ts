type Difficulty = "Easy" | "Medium" | "Hard";

interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  company: string;
  acceptance: number;
  solved: boolean;
}
