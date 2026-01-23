"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { useDiscussionsStore } from "@/store/discussions.store";
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
        // showReplies: false,
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
        // showReplies: false,
    },
    {
        id: 3,
        author: "NewbieCoder",
        content: "Can someone explain why the hash map approach works? I'm having trouble understanding the complement logic.",
        likes: 23,
        isLiked: false,
        createdAt: "2 days ago",
        replies: [],
        // showReplies: false,
    },
];
export function useDiscussions(problemId: number) {
    const { getToken } = useAuth();
    const store = useDiscussionsStore();

    useEffect(() => {
        let mounted = true;

        async function load() {
            store.setLoading(true);
            // const token = await getToken();
            // const data = await api<Discussion[]>(`/coding/problems/${problemId}/discussions`, {
            //     token,
            // });

            if (mounted) store.setDiscussions(initialDiscussions);
        }

        load();
        return () => {
            mounted = false;
        };
    }, [problemId]);

    return store;
}
