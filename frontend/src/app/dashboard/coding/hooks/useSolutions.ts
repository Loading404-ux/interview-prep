"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { useSolutionsStore } from "@/store/solutions.store";
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
export function useSolutions(problemId: number) {
    const { getToken } = useAuth();
    const store = useSolutionsStore();

    useEffect(() => {
        let mounted = true;

        async function load() {
            store.setLoading(true);
            // const token = await getToken();
            // const data = await api<Solution[]>(`/coding/problems/${problemId}/solutions`, {
            //     token,
            // });

            if (mounted) store.setSolutions(initialSolutions);
            // store.setLoading(false);
        }

        load();
        return () => {
            mounted = false;
        };
    }, [problemId]);

    return store;
}
