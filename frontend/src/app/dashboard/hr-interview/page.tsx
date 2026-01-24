"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Mic, Square, ArrowRight, MessageSquare, Lightbulb, CheckCircle2 } from "lucide-react";
import { Microphone } from "@/utils/Microphone";
import { useHrInterview } from "@/hooks/useHrInterview";

type InterviewState = "idle" | "recording" | "completed" | "waiting";

interface Question {
  id: number;
  text: string;
  preferredAnswer: string;
}
// const suggestions = [
//   "Try to use the STAR method when answering behavioral questions",
//   "Practice pausing before answering to gather your thoughts",
//   "Include more specific examples from your experience",
//   "Maintain a consistent pace throughout your response",
// ];
// const questions: Question[] = [
//   {
//     id: 1,
//     text: "Tell me about yourself and your background. What motivated you to pursue a career in software development?",
//     preferredAnswer:
//       "Start with your current role and recent accomplishments. Briefly mention your educational background and how you got into software development. Focus on your passion for problem-solving and building impactful products. Keep it under 2 minutes and end with why you're excited about this opportunity.",
//   },
//   {
//     id: 2,
//     text: "Describe a challenging project you worked on. How did you overcome the obstacles?",
//     preferredAnswer:
//       "Use the STAR method: Situation, Task, Action, Result. Choose a project that demonstrates technical skills and soft skills like collaboration. Be specific about your contributions and quantify the impact if possible. End with what you learned.",
//   },
//   {
//     id: 3,
//     text: "Where do you see yourself in 5 years?",
//     preferredAnswer:
//       "Show ambition while being realistic. Mention growth in technical expertise and potential leadership roles. Connect your goals to the company's mission. Demonstrate that you're looking for a long-term opportunity to grow.",
//   },
// ];

interface FeedbackScore {
  label: string;
  score: number;
  color: string;
}

const HRInterview = () => {
  const {
    questions,
    currentIndex,
    feedback,
    start,
    submitAnswer,
    nextQuestion,

  } = useHrInterview()
  const [state, setState] = useState<InterviewState>("idle");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [waveformBars] = useState(Array.from({ length: 40 }, () => Math.random()));
  const [showFeedback, setShowFeedback] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const currentQuestion = questions[currentIndex]

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const mic = useRef<Microphone>(null)
  if (!mic.current) {
    mic.current = new Microphone()
  }
  // const feedbackScores: FeedbackScore[] = [
  //   { label: "Clarity", score: 78, color: "bg-coding" },
  //   { label: "Structure", score: 65, color: "bg-hr" },
  //   { label: "Confidence", score: 72, color: "bg-aptitude" },
  // ];

  const handleStartRecording = async () => {
    // setState("waiting");
    await Promise.resolve(() => setTimeout(() => { }, 1000))
    setState("recording");
    setCardKey(prev => prev + 1);
    mic.current?.startRecording();
  };

  const handleStopRecording = async () => {
    setState("completed")
    const blob = await mic.current?.stopRecording()

    if (blob) {
      await submitAnswer(blob, currentQuestion.id)
      setShowFeedback(true)
    }
  }

  const handleNextQuestion = () => {
    nextQuestion()
    setState("idle")
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setState("idle");
    setShowFeedback(false);
    setCardKey(prev => prev + 1);
  };
  useEffect(() => {
    start()
  }, [])

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-1 rounded-full transition-colors duration-200",
                  i <= currentQuestionIndex ? "bg-hr" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div
          key={`question-${currentQuestion.id}`}
          className="animate-question-enter p-6 rounded-2xl bg-card border border-hr/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-hr/10">
              <MessageSquare className="w-5 h-5 text-hr" />
            </div>
            <p className="text-lg text-foreground leading-relaxed pt-1">
              {currentQuestion.question}
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
                  onClick={handleStartRecording}
                  size="lg"
                  className="bg-hr hover:bg-hr/90 text-white rounded-xl px-8"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
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
                  onClick={handleStopRecording}
                  size="lg"
                  variant="destructive"
                  className="rounded-xl px-8"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
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