"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Mic, Square, ArrowRight, MessageSquare, Lightbulb, CheckCircle2 } from "lucide-react";
import { Microphone } from "@/utils/Microphone";
import { useHrInterview } from "@/hooks/useHrInterview";
import ShinyText from "@/components/ShinyText";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type InterviewState = "idle" | "recording" | "completed" | "waiting";

const HRInterview = () => {
  const {
    questions,
    currentIndex,
    feedback,
    start,
    submitAnswer,
    nextQuestion,
    complete,
    reset,
    isLoading,
  } = useHrInterview()

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const [state, setState] = useState<InterviewState>("idle");
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [waveformBars] = useState(Array.from({ length: 40 }, () => Math.random()));
  const [showFeedback, setShowFeedback] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [disabled, setDisabled] = useState(true)
  const mic = useRef<Microphone>(null)
  if (!mic.current) {
    mic.current = new Microphone()
  }
  useEffect(() => {
    const isSupported = mic.current?.isMicrophoneSupported()
    if (!isSupported) {
      setDisabled(true)
      toast("Microphone access denied.");
    } else {
      setDisabled(false)
    }
  }, [])
  const [pending, startTransition] = useTransition()
  const handleStartRecording = async () => {
    try {
      await mic.current?.startRecording();
      await Promise.resolve(() => setTimeout(() => { }, 1000))
      setState("recording");
      setCardKey(prev => prev + 1);
    } catch (error: any) {
      toast(error.message || "Something went wrong")
    }
  };

  const handleStopRecording = async () => {
    try {
      const blob = await mic.current?.stopRecording()
      console.log(blob)
      if (blob) {
        await submitAnswer(blob, currentQuestion.id)
        setShowFeedback(true)
      }
      setState("completed")
      if (isLastQuestion) {
        console.log("last question")
        await complete() // ✅ only here
      }
    } catch (error) {
      console.log(error)
      toast("Recording failed")
    } finally {
      //reset()
    }
  }

  const handleNextQuestion = () => {
    nextQuestion()
    setState("idle")
  };

  const handleRestart = () => {
    // setCurrentQuestionIndex(0);
    // complete()
    //reset()
    start()
    setState("idle");
    setShowFeedback(false);
    setCardKey(prev => prev + 1);
  };
  useEffect(() => {
    start()
  }, [])
  if (isLoading) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Please wait…
      </div>
    )
  }
  const router = useRouter()
  if (questions?.length === 0) {
    return (<>
      <Button variant={"secondary"} className="float-right" onClick={() => router.push("/dashboard/interview")}>
        <ShinyText text="✨HR Interview" speed={2}
          delay={0}
          color="#b5b5b5"
          shineColor="#3c83f6"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false} />
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        No Question Found
      </div>
    </>
    )
  }
  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress indicator */}
        <div className="flex w-full justify-end">
          <Button variant={"secondary"} onClick={() => router.push("/dashboard/interview")}>
            <ShinyText text="✨HR Interview" speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#3c83f6"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false} />
          </Button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-1 rounded-full transition-colors duration-200",
                  i <= currentIndex ? "bg-hr" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div
          key={`question-${currentQuestion?.id}`}
          className="animate-question-enter p-6 rounded-2xl bg-card border border-hr/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-hr/10">
              <MessageSquare className="w-5 h-5 text-hr" />
            </div>
            <p className="text-lg text-foreground leading-relaxed pt-1">
              {currentQuestion?.question}
            </p>
          </div>
        </div>

        {/* Recording Section */}
        <div className="bg-card rounded-2xl border border-border/50 p-8">
          <div
            key={`card-${cardKey}`}
            className="bg-card rounded-2xl border-none p-8 animate-recording-card-enter"
          >
            {state === "idle" && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-hr/10 flex items-center justify-center mx-auto">
                  <Mic className="w-10 h-10 text-hr" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Ready to Record
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Take a moment to think, then record your answer
                  </p>
                </div>
                <Button
                  onClick={() => startTransition(async () => await handleStartRecording())}
                  size="lg"
                  className="bg-hr hover:bg-hr/90 text-white rounded-xl px-8"
                  disabled={disabled || pending}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  {pending ? "Generating..." : "Start Recording"}
                </Button>
              </div>
            )}

            {state === "recording" && (
              <div className="text-center space-y-6">
                {/* Waveform Visualization */}
                <div className="flex items-center justify-center gap-1 h-20">
                  {waveformBars.map((height, i) => (
                    <div
                      key={i}
                      className="waveform-bar w-1 bg-hr"
                      style={{
                        height: `${16 + height * 48}px`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm text-destructive font-medium">Recording...</span>
                </div>

                <Button
                  onClick={() => startTransition(async () => await handleStopRecording())}
                  size="lg"
                  variant="destructive"
                  className="rounded-xl px-8"
                  disabled={disabled || pending}
                >
                  <Square className="w-4 h-4 mr-2" />
                  {pending ? "Wait..." : "Stop Recording"}
                </Button>
              </div>
            )}

            {state === "completed" && (
              <div className="space-y-6 ">
                {/* Success indicator */}

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="text-center animate-fade-up-stagger" style={{ animationDelay: "0ms" }}>
                    <div className="w-26 h-26 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-14 h-14 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Recording Complete
                    </h3>
                  </div>
                  <div className="space-y-4 animate-fade-up-stagger" style={{ animationDelay: "50ms" }}>
                    <h4 className="text-sm font-medium text-muted-foreground">Performance</h4>
                    <div className="space-y-3">
                      <div className="space-y-3">
                        {/* {feedbackScores.map((item) => ( */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground">Clarity</span>
                            <span className="font-semibold text-foreground">
                              {feedback?.clarity}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                "bg-coding"
                              )}
                              style={{ width: `${feedback?.clarity}%` }}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground">Structure</span>
                            <span className="font-semibold text-foreground">
                              {feedback?.structure}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                "bg-coding"
                              )}
                              style={{ width: `${feedback?.structure}%` }}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground">Confidence</span>
                            <span className="font-semibold text-foreground">
                              {feedback?.confidence}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                "bg-coding"
                              )}
                              style={{ width: `${feedback?.confidence}%` }}
                            />
                          </div>
                        </div>
                        {/* ))} */}
                      </div>

                    </div>
                  </div>
                </div>
                {/* Preferred Answer */}
                {showFeedback && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border animate-fade-up-stagger"
                    style={{ animationDelay: "100ms" }}>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-aptitude flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">
                          Preferred Answer Approach
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {currentQuestion.preferred_answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Improvement Tips */}
                {feedback?.improvementTips && (
                  <div className="rounded-2xl border border-border/50 p-6 bg-muted/30 animate-fade-up-stagger"
                    style={{ animationDelay: "400ms" }}>
                    <h3 className="font-semibold text-foreground mb-4">Improvement Tips</h3>
                    <ul className="space-y-3">
                      {feedback?.improvementTips.map((suggestion, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-foreground/80"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                            {i + 1}
                          </span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Question CTA */}
                <div className="flex justify-end gap-3 pt-2">
                  {isLastQuestion ? (
                    <Button onClick={handleRestart} variant="outline" className="rounded-xl">
                      Start Over
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="bg-hr hover:bg-hr/90 text-white rounded-xl px-6"
                      disabled={pending}
                    >
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
};

export default HRInterview;