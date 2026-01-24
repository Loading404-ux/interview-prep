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

    const res = await api<{
      id: string,
      questionId: string,
      parentId: string,
      content: string,
      upvotes: number,
      replyCount: number,
      createdAt: string
    }>("/coding/discussions", {
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

    const res = await api<any>("/coding/discussions", {
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
      `/coding/discussions/${discussionId}/replies`,
      { token }
    )

    setReplies(discussionId, res)
  }

  // ------------------------
  // VOTE (OPTIMISTIC)
  // ------------------------
  const vote = async (discussionId: string) => {
    incrementVote(discussionId)

    try {
      const token = await getToken()
      await api("/coding/discussions/vote", {
        method: "POST",
        token,
        body: { discussionId },
      })
    } catch {
      decrementVote(discussionId)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="p-6 space-y-4">

        {/* New Comment */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitDiscussion()
            }}
          />
          <Button size="icon" onClick={submitDiscussion}>
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Discussions */}
        {discussions.map((d: Discussion, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-muted/30 border border-border/50"
          >
            <p className="text-sm">{d.content}</p>
            <div className="flex items-center gap-4 mt-3">

              <button
                onClick={() => vote(d.id)}
                className="flex items-center gap-1 text-sm text-muted-foreground"
              >
                <ThumbsUp className="w-4 h-4" />
                {d.upvotes}
              </button>

              <button
                onClick={() => {
                  loadReplies(d.id)
                  setReplyingTo(replyingTo === d.id ? null : d.id)
                }}
                className="flex items-center gap-1 text-sm text-muted-foreground"
              >
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
            </div>

            {/* Reply Input */}
            {replyingTo === d.id && (
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button size="sm" onClick={() => submitReply(d.id)}>
                  Reply
                </Button>
              </div>
            )}

            {/* Replies */}
            {replies[d.id]?.length > 0 && (
              <div className="mt-4 space-y-2 pl-4 border-l">
                {replies[d.id].map((r) => (
                  <p key={r.id} className="text-sm text-muted-foreground">
                    {r.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
