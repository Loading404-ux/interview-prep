"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, Send, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useDiscussions } from "../../hooks/useDiscussions"
import { API_ROUTES } from "@/routes"

export default function DiscussionsPanel({ problemId }: { problemId: string }) {
  const { getToken } = useAuth()
  const {
    discussions,
    replies,
    isLoading,
    addDiscussion,
    addReply,
    setReplies,
    incrementVote,
    decrementVote,
  } = useDiscussions(problemId)

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
    console.log(problemId, newComment)
    const res = await api<{
      id: string,
      questionId: string,
      parentId: string,
      content: string,
      upvotes: number,
      replyCount: number,
      createdAt: string
    }>(API_ROUTES.CODING.ADD_DISCUSSIONS, {
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
      content: res.content,
      upvotes: res.upvotes,
      replyCount: res.replyCount,
      createdAt: res.createdAt,
    })
    setNewComment("")
  }

  // ------------------------
  // CREATE REPLY
  // ------------------------
  const submitReply = async (discussionId: string) => {
    if (!replyText.trim()) return
    console.log(replyText)
    const token = await getToken()

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
  const loadReplies = async (discussionId: string) => {
    if (replies[discussionId]) return

    const token = await getToken()
    const res = await api<any>(
      API_ROUTES.CODING.TOGGLE_DISCUSSION_VOTE(discussionId),
      { token }
    )

    setReplies(discussionId, res)
  }

  // ------------------------
  // VOTE (OPTIMISTIC)
  // ------------------------
  const vote = async (discussionId: string) => {
    console.log(discussionId)
    incrementVote(discussionId)

    try {
      const token = await getToken()
      const res = await api<{ value: number }>(API_ROUTES.CODING.TOGGLE_DISCUSSION_VOTE(discussionId), {
        method: "PATCH",
        token,
        body: { discussionId },
      })
      if (res.value == -1) {
        decrementVote(discussionId)
      }
    } catch {
      decrementVote(discussionId)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="p-6 space-y-4">
        {/* New Comment Input */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">Y</span>
          </div>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-muted/30 border-border/50 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitDiscussion();
                }
              }}
            />
            <Button
              onClick={submitDiscussion}
              disabled={!newComment.trim()}
              size="icon"
              className="bg-coding hover:bg-coding/90 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Discussions List */}
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="p-4 rounded-xl bg-muted/30 border border-border/50"
          >
            {/* Main Comment */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">
                  {discussion.author[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{discussion.author}</p>
                  <span className="text-xs text-muted-foreground">
                    {discussion.createdAt}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 mt-1">{discussion.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => handleLikeDiscussion(discussion.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-sm transition-colors",
                      discussion.isLiked
                        ? "text-coding"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ThumbsUp
                      className={cn("w-4 h-4", discussion.isLiked && "fill-current")}
                    />
                    {discussion.likes}
                  </button>

                  <button
                    onClick={() =>
                      setReplyingTo(replyingTo === discussion.id ? null : discussion.id)
                    }
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>

                  {discussion.replies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(discussion.id)}
                      className="flex items-center gap-1.5 text-sm text-coding hover:text-coding/80 transition-colors"
                    >
                      {discussion.showReplies ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {discussion.replies.length}{" "}
                      {discussion.replies.length === 1 ? "reply" : "replies"}
                    </button>
                  )}
                </div>

                {/* Reply Input */}
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
                          handleAddReply(discussion.id);
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      onClick={() => handleAddReply(discussion.id)}
                      disabled={!replyText.trim()}
                      size="sm"
                      className="bg-coding hover:bg-coding/90 rounded-xl"
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {/* Replies */}
                {discussion.showReplies && discussion.replies.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-border/50">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {reply.author[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {reply.author}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {reply.createdAt}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 mt-1">
                            {reply.content}
                          </p>
                          <button
                            onClick={() =>
                              handleLikeReply(discussion.id, reply.id)
                            }
                            className={cn(
                              "flex items-center gap-1.5 text-sm mt-2 transition-colors",
                              reply.isLiked
                                ? "text-coding"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <ThumbsUp
                              className={cn(
                                "w-3.5 h-3.5",
                                reply.isLiked && "fill-current"
                              )}
                            />
                            {reply.likes}
                          </button>
                        </div>
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
