import { create } from "zustand"

interface DiscussionsState {
  discussions: Discussion[]
  isLoading: boolean

  setLoading: (v: boolean) => void
  setDiscussions: (d: Discussion[]) => void

  addDiscussion: (d: Discussion) => void
  addReply: (discussionId: string, reply: Reply) => void

  setReplies: (discussionId: string, replies: Reply[]) => void
  toggleReplies: (discussionId: string) => void

  toggleVote: (discussionId: string) => void
}

export const useDiscussionsStore = create<DiscussionsState>((set) => ({
  discussions: [],
  isLoading: true,

  setLoading: (v) => set({ isLoading: v }),

  setDiscussions: (discussions) =>
    set({
      discussions: discussions.map(d => ({
        ...d,
        replies: null,
        showReplies: false,
      })),
      isLoading: false,
    }),

  addDiscussion: (discussion) =>
    set((state) => ({
      discussions: [
        {
          ...discussion,
          replies: null,
          showReplies: false,
        },
        ...state.discussions,
      ],
    })),

  addReply: (discussionId, reply) =>
    set((state) => ({
      discussions: state.discussions.map(d =>
        d.id === discussionId
          ? {
              ...d,
              replies: [...(d.replies ?? []), reply],
              replyCount: d.replyCount + 1,
            }
          : d
      ),
    })),

  setReplies: (discussionId, replies) =>
    set((state) => ({
      discussions: state.discussions.map(d =>
        d.id === discussionId
          ? {
              ...d,
              replies,
              showReplies: true,
            }
          : d
      ),
    })),

  toggleReplies: (discussionId) =>
    set((state) => ({
      discussions: state.discussions.map(d =>
        d.id === discussionId
          ? { ...d, showReplies: !d.showReplies }
          : d
      ),
    })),

  toggleVote: (discussionId) =>
    set((state) => ({
      discussions: state.discussions.map(d =>
        d.id === discussionId
          ? {
              ...d,
              isLiked: !d.isLiked,
              upvotes: d.isLiked ? d.upvotes - 1 : d.upvotes + 1,
            }
          : d
      ),
    })),
}))
