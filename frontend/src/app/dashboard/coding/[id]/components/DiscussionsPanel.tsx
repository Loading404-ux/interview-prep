"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, Send, MessageCircle, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { loadDiscussions, useDiscussions } from "../../hooks/useDiscussions"
import { API_ROUTES } from "@/routes"
import { useUserStore } from "@/store/user.store"

export default function DiscussionsPanel({ problemId }: { problemId: string }) {
  const { getToken } = useAuth()
  const {
    discussions,
    isLoading,
    addDiscussion,
    addReply,
    setReplies,
    toggleVote,
    toggleReplies,
  } = useDiscussions(problemId)

  const user = useUserStore().user

  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading discussions…</div>
  }

  // ------------------------
  // CREATE DISCUSSION
  // ------------------------
  const submitDiscussion = async () => {
    if (!newComment.trim()) return

    const token = await getToken()

    const res = await api<any>(API_ROUTES.CODING.ADD_DISCUSSIONS, {
      method: "POST",
      token,
      body: {
        questionId: problemId,
        content: newComment,
      },
    })

    addDiscussion({
      id: res.id,
      questionId: res.questionId,
      parentId: null,
      content: res.content,
      upvotes: res.upvotes,
      replyCount: res.replyCount,
      createdAt: res.createdAt,
      author: user?.name ?? "You",
      isLiked: false,
      replies: null,
      showReplies: false,
    })

    setNewComment("")
  }

  // ------------------------
  // CREATE REPLY
  // ------------------------
  const submitReply = async (discussionId: string) => {
    if (!replyText.trim()) return

    const token = await getToken()
    // const form = new FormData()
    // form.append("questionId", problemId)
    // form.append("parentId", discussionId)
    // form.append("content", replyText)
    const res = await api<any>(API_ROUTES.CODING.ADD_DISCUSSIONS, {
      method: "POST",
      token,
      body: {
        questionId: problemId,
        parentId: discussionId,
        content: replyText,
      },
    })

    addReply(discussionId, res)
    setReplyText("")
    setReplyingTo(null)
  }

  // ------------------------
  // LOAD REPLIES (ON DEMAND)
  // ------------------------
  const loadRepliesHandler = async (discussionId: string) => {
    const discussion = discussions.find(d => d.id === discussionId)

    if (discussion?.replies) {
      toggleReplies(discussionId)
      return
    }

    const token = await getToken()
    const res = await loadDiscussions({
      problemId,
      parentId: discussionId,
      token,
    })

    setReplies(discussionId, res)
  }

  // ------------------------
  // VOTE (OPTIMISTIC)
  // ------------------------
  const vote = async (discussionId: string) => {
    toggleVote(discussionId)

    try {
      const token = await getToken()
      await api(API_ROUTES.CODING.TOGGLE_DISCUSSION_VOTE(discussionId), {
        method: "PATCH",
        token,
        body: { discussionId },
      })
    } catch {
      // rollback
      toggleVote(discussionId)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="p-6 space-y-4">

        {/* New Comment */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.[0] ?? "U"}
            </span>
          </div>

          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  submitDiscussion()
                }
              }}
            />
            <Button onClick={submitDiscussion}
              disabled={!newComment.trim()}
              size="icon"
              className="bg-coding hover:bg-coding/90 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Discussions */}
        {discussions?.map(discussion => (
          <div key={discussion.id} className="p-4 rounded-xl bg-muted/30 border">

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                {discussion.author[0]}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{discussion.author}</p>
                  <span className="text-xs text-muted-foreground">
                    {
                      Intl.DateTimeFormat('en-US',
                        { year: 'numeric', month: "2-digit", day: 'numeric' })
                        .format(new Date(discussion.createdAt))
                    }
                  </span>
                </div>

                <p className="mt-1">{discussion.content}</p>

                {/* Actions */}
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => vote(discussion.id)}
                    className={cn("flex items-center gap-1.5 text-sm transition-colors",
                      discussion.isLiked ? "text-coding" : "text-muted-foreground"
                    )}
                  >
                    <ThumbsUp size={18} className={discussion.isLiked ? "fill-current" : ""} />
                    <span>
                      {discussion.upvotes}
                    </span>
                  </button>

                  <button onClick={() =>
                    setReplyingTo(replyingTo === discussion.id ? null : discussion.id)
                  } className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="w-4 h-4" /> Reply
                  </button>

                  {discussion.replyCount > 0 && (
                    <button onClick={() => loadRepliesHandler(discussion.id)} className="flex items-center gap-1.5 text-sm text-coding hover:text-coding/80 transition-colors"
                    >
                      {discussion.showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {discussion.replyCount} replies
                    </button>
                  )}
                </div>
                {replyingTo === discussion.id && (
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-background/50 border-border/50 rounded-xl text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submitReply(discussion.id);
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      onClick={() => submitReply(discussion.id)}
                      disabled={!replyText.trim()}
                      size="sm"
                      className="bg-coding hover:bg-coding/90 rounded-xl"
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {/* Replies */}
                {discussion.showReplies && discussion.replies && (
                  <div className="mt-4 space-y-3 pl-4 border-l">
                    {discussion.replies.map(reply => (
                      <div key={reply.id}>
                        <p className="text-sm font-medium">{reply.author}</p>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
