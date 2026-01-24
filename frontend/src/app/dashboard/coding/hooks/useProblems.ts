"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { useProblemsStore } from "@/store/problems.store";
const problems: CodingProblem[] = [
    { id: " 1", title: "Two Sum", difficulty: "Easy", topics: ["Array", "Hash Table"], company: "Google" },
    { id: " 2", title: "Add Two Numbers", difficulty: "Medium", topics: ["Linked List", "Math"], company: "Amazon" },
    { id: " 3", title: "Longest Substring Without Repeating", difficulty: "Medium", topics: ["String", "Sliding Window"], company: "Microsoft", },
    { id: " 4", title: "Median of Two Sorted Arrays", difficulty: "Hard", topics: ["Array", "Binary Search"], company: "Google" },
    { id: " 5", title: "Reverse Integer", difficulty: "Medium", topics: ["Math"], company: "Apple" },
    { id: " 6", title: "Valid Parentheses", difficulty: "Easy", topics: ["String", "Stack"], company: "Meta" },
    { id: " 7", title: "Merge Two Sorted Lists", difficulty: "Easy", topics: ["Linked List"], company: "Amazon" },
    { id: " 8", title: "Maximum Subarray", difficulty: "Medium", topics: ["Array", "DP"], company: "Microsoft" },
    { id: " 9", title: "Container With Most Water", difficulty: "Medium", topics: ["Array", "Two Pointers"], company: "Google" },
    { id: "10", title: "3Sum", difficulty: "Medium", topics: ["Array", "Two Pointers"], company: "Amazon" },
    { id: "11", title: "Letter Combinations", difficulty: "Medium", topics: ["String", "Backtracking"], company: "Meta" },
    { id: "12", title: "Remove Nth Node", difficulty: "Medium", topics: ["Linked List", "Two Pointers"], company: "Apple" },
    { id: "13", title: "Generate Parentheses", difficulty: "Medium", topics: ["String", "Backtracking"], company: "Microsoft" },
    { id: "14", title: "Merge k Sorted Lists", difficulty: "Hard", topics: ["Linked List", "Heap"], company: "Google" },
    { id: "15", title: "Search in Rotated Array", difficulty: "Medium", topics: ["Array", "Binary Search"], company: "Amazon" },
];
export function useProblems() {
    const { getToken } = useAuth()
    const store = useProblemsStore()

    useEffect(() => {
        let mounted = true

        async function load() {
            store.setLoading(true)
            const token = await getToken()
            const data = await api<CodingProblem[]>("/coding/questions", { token })

            if (mounted) store.setProblems(data?.length > 0 ? data : problems)
        }

        if (store.problems.length === 0) load()

        return () => {
            mounted = false
        }
    }, [])

    return {
        problems: store.filtered,
        isLoading: store.isLoading,
        filters: store.filters,
        setFilters: store.setFilters,
    }
}

