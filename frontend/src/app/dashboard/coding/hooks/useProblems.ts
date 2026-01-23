"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { useProblemsStore } from "@/store/problems.store";
const problems: Problem[] = [
    { id: 1, title: "Two Sum", difficulty: "Easy", topics: ["Array", "Hash Table"], company: "Google", acceptance: 49, solved: true },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", topics: ["Linked List", "Math"], company: "Amazon", acceptance: 40, solved: true },
    { id: 3, title: "Longest Substring Without Repeating", difficulty: "Medium", topics: ["String", "Sliding Window"], company: "Microsoft", acceptance: 33, solved: false },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", topics: ["Array", "Binary Search"], company: "Google", acceptance: 35, solved: false },
    { id: 5, title: "Reverse Integer", difficulty: "Medium", topics: ["Math"], company: "Apple", acceptance: 27, solved: false },
    { id: 6, title: "Valid Parentheses", difficulty: "Easy", topics: ["String", "Stack"], company: "Meta", acceptance: 40, solved: true },
    { id: 7, title: "Merge Two Sorted Lists", difficulty: "Easy", topics: ["Linked List"], company: "Amazon", acceptance: 62, solved: false },
    { id: 8, title: "Maximum Subarray", difficulty: "Medium", topics: ["Array", "DP"], company: "Microsoft", acceptance: 50, solved: false },
    { id: 9, title: "Container With Most Water", difficulty: "Medium", topics: ["Array", "Two Pointers"], company: "Google", acceptance: 54, solved: false },
    { id: 10, title: "3Sum", difficulty: "Medium", topics: ["Array", "Two Pointers"], company: "Amazon", acceptance: 32, solved: false },
    { id: 11, title: "Letter Combinations", difficulty: "Medium", topics: ["String", "Backtracking"], company: "Meta", acceptance: 56, solved: false },
    { id: 12, title: "Remove Nth Node", difficulty: "Medium", topics: ["Linked List", "Two Pointers"], company: "Apple", acceptance: 40, solved: true },
    { id: 13, title: "Generate Parentheses", difficulty: "Medium", topics: ["String", "Backtracking"], company: "Microsoft", acceptance: 72, solved: false },
    { id: 14, title: "Merge k Sorted Lists", difficulty: "Hard", topics: ["Linked List", "Heap"], company: "Google", acceptance: 49, solved: false },
    { id: 15, title: "Search in Rotated Array", difficulty: "Medium", topics: ["Array", "Binary Search"], company: "Amazon", acceptance: 39, solved: false },
];
export function useProblems() {
    const { getToken } = useAuth();
    const store = useProblemsStore();

    useEffect(() => {
        let mounted = true;
        store.setLoading(false);
        async function load() {
            //   store.setLoading(true);
            //   const token = await getToken();
            //   const data = await api<Problem[]>("/coding/problems", { token });

              if (mounted) store.setProblems(problems);
        }

        if (store.problems.length === 0) {
            load();
        }

        return () => {
            mounted = false;
        };
    }, [getToken]);

    return {
        problems: store.filtered,
        isLoading: store.isLoading,
        filters: store.filters,
        setFilters: store.setFilters,
    };
}
