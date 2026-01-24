"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { useProblemDetailStore } from "@/store/problem-detail.store";
import { notFound } from "next/navigation";
// const problemsData: CodingProblemDetail[] = [
//   {
//     id: "1",
//     title: "Two Sum",
//     difficulty: "Easy",
//     topics: ["Array", "Hash Table"],
//     company: "Google",
//     acceptance: 49,
//     solved: true,
//     description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

// You may assume that each input would have exactly one solution, and you may not use the same element twice.

// **Example 1:**
// \`\`\`
// Input: nums = [2,7,11,15], target = 9
// Output: [0,1]
// Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
// \`\`\`

// **Example 2:**
// \`\`\`
// Input: nums = [3,2,4], target = 6
// Output: [1,2]
// \`\`\`

// **Constraints:**
// - \`2 <= nums.length <= 10^4\`
// - \`-10^9 <= nums[i] <= 10^9\`
// - \`-10^9 <= target <= 10^9\`
// - Only one valid answer exists.`,
//     expectedComplexity: "Time: O(n) | Space: O(n)",
//   },
//   {
//     id: 2,
//     title: "Add Two Numbers",
//     difficulty: "Medium",
//     topics: ["Linked List", "Math"],
//     company: "Amazon",
//     acceptance: 40,
//     solved: true,
//     description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order.

// **Example 1:**
// \`\`\`
// Input: l1 = [2,4,3], l2 = [5,6,4]
// Output: [7,0,8]
// Explanation: 342 + 465 = 807.
// \`\`\`

// **Constraints:**
// - The number of nodes in each linked list is in the range [1, 100].
// - 0 <= Node.val <= 9`,
//     expectedComplexity: "Time: O(max(m,n)) | Space: O(max(m,n))",
//   },
//   {
//     id: 3,
//     title: "Longest Substring Without Repeating",
//     difficulty: "Medium",
//     topics: ["String", "Sliding Window"],
//     company: "Microsoft",
//     acceptance: 33,
//     solved: false,
//     description: `Given a string s, find the length of the longest substring without repeating characters.

// **Example 1:**
// \`\`\`
// Input: s = "abcabcbb"
// Output: 3
// Explanation: The answer is "abc", with the length of 3.
// \`\`\`

// **Example 2:**
// \`\`\`
// Input: s = "bbbbb"
// Output: 1
// Explanation: The answer is "b", with the length of 1.
// \`\`\`

// **Constraints:**
// - \`0 <= s.length <= 5 * 10^4\`
// - \`s\` consists of English letters, digits, symbols and spaces.`,
//     expectedComplexity: "Time: O(n) | Space: O(min(n, m)) where m is the charset size",
//   },
//   {
//     id: 4,
//     title: "Median of Two Sorted Arrays",
//     difficulty: "Hard",
//     topics: ["Array", "Binary Search"],
//     company: "Google",
//     acceptance: 35,
//     solved: false,
//     description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

// The overall run time complexity should be O(log (m+n)).

// **Example 1:**
// \`\`\`
// Input: nums1 = [1,3], nums2 = [2]
// Output: 2.00000
// Explanation: merged array = [1,2,3] and median is 2.
// \`\`\`

// **Constraints:**
// - nums1.length == m
// - nums2.length == n
// - 0 <= m <= 1000`,
//     expectedComplexity: "Time: O(log(min(m,n))) | Space: O(1)",
//   },
//   {
//     id: 5,
//     title: "Reverse Integer",
//     difficulty: "Medium",
//     topics: ["Math"],
//     company: "Apple",
//     acceptance: 27,
//     solved: false,
//     description: `Given a signed 32-bit integer x, return x with its digits reversed.

// **Example 1:**
// \`\`\`
// Input: x = 123
// Output: 321
// \`\`\`

// **Constraints:**
// - \`-2^31 <= x <= 2^31 - 1\``,
//     expectedComplexity: "Time: O(log x) | Space: O(1)",
//   },
//   {
//     id: 6,
//     title: "Valid Parentheses",
//     difficulty: "Easy",
//     topics: ["String", "Stack"],
//     company: "Meta",
//     acceptance: 40,
//     solved: true,
//     description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

// **Example 1:**
// \`\`\`
// Input: s = "()"
// Output: true
// \`\`\`

// **Constraints:**
// - 1 <= s.length <= 10^4`,
//     expectedComplexity: "Time: O(n) | Space: O(n)",
//   },
//   {
//     id: 7,
//     title: "Merge Two Sorted Lists",
//     difficulty: "Easy",
//     topics: ["Linked List"],
//     company: "Amazon",
//     acceptance: 62,
//     solved: false,
//     description: `You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.

// **Example 1:**
// \`\`\`
// Input: list1 = [1,2,4], list2 = [1,3,4]
// Output: [1,1,2,3,4,4]
// \`\`\`

// **Constraints:**
// - The number of nodes in both lists is in the range [0, 50].`,
//     expectedComplexity: "Time: O(n + m) | Space: O(1)",
//   },
//   {
//     id: 8,
//     title: "Maximum Subarray",
//     difficulty: "Medium",
//     topics: ["Array", "DP"],
//     company: "Microsoft",
//     acceptance: 50,
//     solved: false,
//     description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

// **Example 1:**
// \`\`\`
// Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
// Output: 6
// Explanation: The subarray [4,-1,2,1] has the largest sum 6.
// \`\`\`

// **Constraints:**
// - 1 <= nums.length <= 10^5`,
//     expectedComplexity: "Time: O(n) | Space: O(1)",
//   },
// ];
export function useProblemDetail(id: string) {
  const { getToken } = useAuth()
  const store = useProblemDetailStore()

  useEffect(() => {
    let mounted = true

    async function load() {
      store.setLoading(true)
      const token = await getToken()
      const data = await api<CodingProblemDetail>(
        `/coding/questions/${id}`,
        { token }
      )
      if (mounted) store.setProblem(data)
    }

    load()
    return () => { mounted = false }
  }, [id])

  return store
}
