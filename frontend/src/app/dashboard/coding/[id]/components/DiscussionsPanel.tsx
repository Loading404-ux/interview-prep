"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ThumbsUp,
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDiscussions } from "../../hooks/useDiscussions";

export default function DiscussionsPanel({ problemId }: { problemId: number }) {
  const {
    discussions,
    isLoading,
    addDiscussion,
    addReply,
    toggleLike,
    toggleReplies,
    toggleReplyLike,
  } = useDiscussions(problemId);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading discussions…</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="p-6 space-y-4">
        {/* New Comment */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">Y</span>
          </div>

          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!newComment.trim()) return;
                  addDiscussion({
                    id: Date.now(),
                    author: "You",
                    content: newComment,
                    likes: 0,
                    isLiked: false,
                    createdAt: "Just now",
                    replies: [],
                    showReplies: false,
                  });
                  setNewComment("");
                }
              }}
            />
            <Button
              size="icon"
              disabled={!newComment.trim()}
              onClick={() => {
                addDiscussion({
                  id: Date.now(),
                  author: "You",
                  content: newComment,
                  likes: 0,
                  isLiked: false,
                  createdAt: "Just now",
                  replies: [],
                  showReplies: false,
                });
                setNewComment("");
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Discussions */}
        {discussions.map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl bg-muted/30 border border-border/50"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {d.author[0]}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{d.author}</p>
                  <span className="text-xs text-muted-foreground">
                    {d.createdAt}
                  </span>
                </div>

                <p className="text-sm text-foreground/80 mt-1">{d.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => toggleLike(d.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-sm",
                      d.isLiked
                        ? "text-coding"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ThumbsUp
                      className={cn("w-4 h-4", d.isLiked && "fill-current")}
                    />
                    {d.likes}
                  </button>

                  <button
                    onClick={() =>
                      setReplyingTo(replyingTo === d.id ? null : d.id)
                    }
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>

                  {d.replies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(d.id)}
                      className="flex items-center gap-1.5 text-sm text-coding"
                    >
                      {d.showReplies ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {d.replies.length} replies
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                {replyingTo === d.id && (
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!replyText.trim()) return;
                          addReply(d.id, {
                            id: Date.now(),
                            author: "You",
                            content: replyText,
                            likes: 0,
                            isLiked: false,
                            createdAt: "Just now",
                          });
                          setReplyText("");
                          setReplyingTo(null);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      disabled={!replyText.trim()}
                      onClick={() => {
                        addReply(d.id, {
                          id: Date.now(),
                          author: "You",
                          content: replyText,
                          likes: 0,
                          isLiked: false,
                          createdAt: "Just now",
                        });
                        setReplyText("");
                        setReplyingTo(null);
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {/* Replies */}
                {d.showReplies && d.replies.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l border-border/50">
                    {d.replies.map((r) => (
                      <div key={r.id} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-semibold">
                            {r.author[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{r.author}</p>
                            <span className="text-xs text-muted-foreground">
                              {r.createdAt}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{r.content}</p>
                          <button
                            onClick={() =>
                              toggleReplyLike(d.id, r.id)
                            }
                            className={cn(
                              "flex items-center gap-1.5 text-sm mt-2",
                              r.isLiked
                                ? "text-coding"
                                : "text-muted-foreground"
                            )}
                          >
                            <ThumbsUp
                              className={cn(
                                "w-3.5 h-3.5",
                                r.isLiked && "fill-current"
                              )}
                            />
                            {r.likes}
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
  );
}
