import { create } from "zustand"

interface DiscussionsState {
  discussions: Discussion[]
  replies: Record<string, Reply[]> // discussionId -> replies
  isLoading: boolean

  setLoading: (v: boolean) => void
  setDiscussions: (d: Discussion[]) => void
  setReplies: (discussionId: string, replies: Reply[]) => void

  addDiscussion: (d: Discussion) => void
  addReply: (discussionId: string, reply: Reply) => void

  incrementVote: (discussionId: string) => void
  decrementVote: (discussionId: string) => void
}

export const useDiscussionsStore = create<DiscussionsState>((set) => ({
  discussions: [],
  replies: {},
  isLoading: true,

  setLoading: (v) => set({ isLoading: v }),

  setDiscussions: (discussions) =>
    set({ discussions, isLoading: false }),

  setReplies: (discussionId, replies) =>
    set((state) => ({
      replies: {
        ...state.replies,
        [discussionId]: replies,
      },
    })),

  addDiscussion: (discussion) =>
    set((state) => ({
      discussions: [discussion, ...state.discussions],
    })),

  addReply: (discussionId, reply) =>
    set((state) => ({
      replies: {
        ...state.replies,
        [discussionId]: [
          ...(state.replies[discussionId] ?? []),
          reply,
        ],
      },
    })),

  incrementVote: (discussionId) =>
    set((state) => ({
      discussions: state.discussions.map((d) =>
        d.id === discussionId
          ? { ...d, upvotes: d.upvotes + 1 }
          : d
      ),
    })),

  decrementVote: (discussionId) =>
    set((state) => ({
      discussions: state.discussions.map((d) =>
        d.id === discussionId
          ? { ...d, upvotes: Math.max(0, d.upvotes - 1) }
          : d
      ),
    })),
}))
