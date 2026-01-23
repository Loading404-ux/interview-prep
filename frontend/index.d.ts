type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  token?: string | null
  isMultipart?: boolean
}

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

interface ProblemDetail {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
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

 interface Discussion {
  id: number;
  author: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies: Reply[];
  showReplies?: boolean;
}
interface Reply {
  id: number;
  author: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}
