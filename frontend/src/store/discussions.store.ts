import { create } from "zustand";





interface DiscussionsState {
  discussions: Discussion[];
  isLoading: boolean;

  setDiscussions: (d: Discussion[]) => void;
  toggleLike: (id: number) => void;
  addDiscussion: (d: Discussion) => void;
  addReply: (discussionId: number, reply: Reply) => void;
  setLoading: (v: boolean) => void;

  toggleReplies: (id: number) => void;
  toggleReplyLike: (discussionId: number, replyId: number) => void;

}

export const useDiscussionsStore = create<DiscussionsState>((set) => ({
  discussions: [],
  isLoading: true,

  setLoading: (v) => set({ isLoading: v }),

  setDiscussions: (discussions) =>
    set({ discussions, isLoading: false }),

  toggleLike: (id) =>
    set((state) => ({
      discussions: state.discussions.map((d) =>
        d.id === id
          ? {
            ...d,
            isLiked: !d.isLiked,
            likes: d.isLiked ? d.likes - 1 : d.likes + 1,
          }
          : d
      ),
    })),

  addDiscussion: (discussion) =>
    set((state) => ({
      discussions: [discussion, ...state.discussions],
    })),

  addReply: (discussionId, reply) =>
    set((state) => ({
      discussions: state.discussions.map((d) =>
        d.id === discussionId
          ? { ...d, replies: [...d.replies, reply] }
          : d
      ),
    })),
  toggleReplies: (id) =>
    set((state) => ({
      discussions: state.discussions.map((d) =>
        d.id === id ? { ...d, showReplies: !d.showReplies } : d
      ),
    })),

  toggleReplyLike: (discussionId, replyId) =>
    set((state) => ({
      discussions: state.discussions.map((d) =>
        d.id === discussionId
          ? {
            ...d,
            replies: d.replies.map((r) =>
              r.id === replyId
                ? {
                  ...r,
                  isLiked: !r.isLiked,
                  likes: r.isLiked ? r.likes - 1 : r.likes + 1,
                }
                : r
            ),
          }
          : d
      ),
    })),

}));
