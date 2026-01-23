import { create } from "zustand";

export type Difficulty = "Easy" | "Medium" | "Hard";



type Filters = {
    search: string;
    company: string;
    topic: string;
    difficulty: "All" | Difficulty;
};

interface ProblemsState {
    problems: Problem[];
    filtered: Problem[];
    filters: Filters;
    isLoading: boolean;

    setProblems: (p: Problem[]) => void;
    setFilters: (f: Partial<Filters>) => void;
    applyFilters: () => void;
    setLoading: (v: boolean) => void;
}

export const useProblemsStore = create<ProblemsState>((set, get) => ({
    problems: [],
    filtered: [],
    isLoading: true,

    filters: {
        search: "",
        company: "All",
        topic: "All",
        difficulty: "All",
    },

    setLoading: (v) => set({ isLoading: v }),

    setProblems: (problems) =>
        set({
            problems,
            filtered: problems,
            isLoading: false,
        }),

    setFilters: (patch) => {
        set({
            filters: { ...get().filters, ...patch },
        });
        get().applyFilters();
    },

    applyFilters: () => {
        const { problems, filters } = get();

        const filtered = problems.filter((p) => {
            if (
                filters.search &&
                !p.title.toLowerCase().includes(filters.search.toLowerCase())
            )
                return false;

            if (filters.company !== "All" && p.company !== filters.company)
                return false;

            if (filters.topic !== "All" && !p.topics.includes(filters.topic))
                return false;

            if (
                filters.difficulty !== "All" &&
                p.difficulty !== filters.difficulty
            )
                return false;

            return true;
        });

        set({ filtered });
    },
}));
