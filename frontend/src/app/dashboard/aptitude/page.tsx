"use client";
import { useState, useEffect } from "react";
// import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, ArrowRight, Brain, RotateCcw, Zap, BookOpen, AlertCircle, ArrowLeft } from "lucide-react";
import { useAptitude } from "@/hooks/useAptitude"

// interface Question {
//   id: number;
//   text: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
// }

// const questions: Question[] = [
//   {
//     id: 1,
//     text: "A train travels 360 km in 4 hours. What is its speed in km/hr?",
//     options: ["80 km/hr", "90 km/hr", "100 km/hr", "85 km/hr"],
//     correctAnswer: 1,
//     explanation: "Speed = Distance / Time = 360 km / 4 hr = 90 km/hr",
//   },
//   {
//     id: 2,
//     text: "If 15% of a number is 45, what is the number?",
//     options: ["300", "450", "200", "350"],
//     correctAnswer: 0,
//     explanation: "Let the number be x. 15% of x = 45 → 0.15x = 45 → x = 45/0.15 = 300",
//   },
//   {
//     id: 3,
//     text: "A shopkeeper sells an article at 20% profit. If the cost price is ₹500, what is the selling price?",
//     options: ["₹550", "₹600", "₹650", "₹580"],
//     correctAnswer: 1,
//     explanation: "Selling Price = Cost Price × (1 + Profit%) = 500 × 1.20 = ₹600",
//   },
//   {
//     id: 4,
//     text: "The ratio of ages of A and B is 3:5. If B is 25 years old, how old is A?",
//     options: ["12 years", "15 years", "18 years", "20 years"],
//     correctAnswer: 1,
//     explanation: "If B = 25 years and ratio is 3:5, then A = (3/5) × 25 = 15 years",
//   },
//   {
//     id: 5,
//     text: "A car travels at 60 km/hr for 2 hours and 40 km/hr for 3 hours. What is the average speed?",
//     options: ["48 km/hr", "50 km/hr", "52 km/hr", "45 km/hr"],
//     correctAnswer: 0,
//     explanation: "Total distance = (60×2) + (40×3) = 120 + 120 = 240 km. Total time = 5 hours. Average = 240/5 = 48 km/hr",
//   },
//   {
//     id: 6,
//     text: "What is the compound interest on ₹10,000 at 10% per annum for 2 years?",
//     options: ["₹2,000", "₹2,100", "₹2,200", "₹1,900"],
//     correctAnswer: 1,
//     explanation: "CI = P(1 + r/100)^n - P = 10000(1.1)^2 - 10000 = 12100 - 10000 = ₹2,100",
//   },
//   {
//     id: 7,
//     text: "If A can complete a work in 12 days and B can complete it in 18 days, in how many days can they complete it together?",
//     options: ["6.5 days", "7.2 days", "8 days", "9 days"],
//     correctAnswer: 1,
//     explanation: "Combined rate = 1/12 + 1/18 = 5/36. Time = 36/5 = 7.2 days",
//   },
//   {
//     id: 8,
//     text: "A mixture contains milk and water in the ratio 5:3. If 16 liters of the mixture is replaced by water, the ratio becomes 3:5. Find the initial quantity of milk.",
//     options: ["35 liters", "40 liters", "45 liters", "50 liters"],
//     correctAnswer: 1,
//     explanation: "Let total = 8x. Initial milk = 5x. After replacement: (5x - 10)/(3x + 10) = 3/5. Solving: x = 8. Milk = 40 liters",
//   },
//   {
//     id: 9,
//     text: "The average of 5 numbers is 42. If one number is excluded, the average becomes 40. What is the excluded number?",
//     options: ["48", "50", "52", "54"],
//     correctAnswer: 1,
//     explanation: "Sum of 5 numbers = 5 × 42 = 210. Sum of 4 numbers = 4 × 40 = 160. Excluded number = 210 - 160 = 50",
//   },
//   {
//     id: 10,
//     text: "A boat can travel 20 km upstream in 4 hours and 20 km downstream in 2 hours. What is the speed of the current?",
//     options: ["2.5 km/hr", "3 km/hr", "3.5 km/hr", "4 km/hr"],
//     correctAnswer: 0,
//     explanation: "Upstream speed = 20/4 = 5 km/hr. Downstream speed = 20/2 = 10 km/hr. Current speed = (10-5)/2 = 2.5 km/hr",
//   },
// ];
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
type Mode = "select" | "rapid" | "standard" | "standard-setup" | "rapid-result";

const AptitudeQuiz = () => {
  const {
    questions,
    currentIndex,
    answers,
    accuracy,
    start,
    submitAnswer,
    next,
    complete,
    reset,
    results
  } = useAptitude()
  console.log(questions)
  const [mode, setMode] = useState<Mode>("select")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(180)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [questionCount, setQuestionCount] = useState(5)
  const [showResult, setShowResult] = useState(false)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  // ---------------- TIMER (RAPID) ----------------
  useEffect(() => {
    if (mode === "rapid" && isTimerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((t) => t - 1)
      }, 1000)
      return () => clearInterval(timer)
    }

    if (mode === "rapid" && timeRemaining === 0) {
      finishRapid()
    }
  }, [mode, isTimerActive, timeRemaining])

  // ---------------- MODE SELECT ----------------
  const handleModeSelect = async (m: "rapid" | "standard-setup") => {
    if (m === "rapid") {
      await start("RAPID")
      setMode("rapid")
      setIsTimerActive(true)
      setTimeRemaining(180)
    } else {
      await start("STANDARD")
      setMode("standard-setup")
    }
  }

  const startStandardPractice = () => {
    setMode("standard")
  }

  // ---------------- ANSWER SUBMIT ----------------
  const submit = async () => {
    if (selectedOption === null || !currentQuestion) return

    await submitAnswer(currentQuestion.id, selectedOption)
    setShowResult(true)
  }

  const nextStandard = () => {
    setSelectedOption(null)
    setShowResult(false)
    next()
  }

  const nextRapid = async () => {
    if (selectedOption !== null && currentQuestion) {
      await submitAnswer(currentQuestion.id, selectedOption)
    }

    setSelectedOption(null)

    if (isLastQuestion) {
      finishRapid()
    } else {
      next()
    }
  }

  const finishRapid = async () => {
    setIsTimerActive(false)
    await complete()
    setMode("rapid-result")
  }

  const restart = () => {
    reset()
    setMode("select")
    setSelectedOption(null)
    setShowResult(false)
    setTimeRemaining(180)
  }
  const handleOptionSelect = (index: number) => {
    if (showResult) return
    setSelectedOption(index)
  }
  // ---------------- GUARDS ----------------
  if (!currentQuestion && mode !== "select" && mode !== "standard-setup") {
    return null
  }

  // const getScore = () => {
  //   return answers.reduce((score: number, answer, index) => {
  //     if (answer === questions[index]?.correctAnswer) {
  //       return score + 1;
  //     }
  //     return score;
  //   }, 0);
  // };

  // Mode selection screen
  if (mode === "select") {
    return (
      <>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-xl bg-aptitude/10 mb-4">
              <Brain className="w-8 h-8 text-aptitude" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Aptitude Practice</h1>
            <p className="text-muted-foreground">Choose your practice mode</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleModeSelect("rapid")}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-aptitude/50 transition-colors text-left group"
            >
              <div className="p-3 rounded-xl bg-aptitude/10 w-fit mb-4 group-hover:bg-aptitude/20 transition-colors">
                <Zap className="w-6 h-6 text-aptitude" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Rapid Fire</h3>
              <p className="text-sm text-muted-foreground">
                5 questions in 3 minutes. Results shown only after time's up or all questions answered.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-aptitude">
                <Clock className="w-4 h-4" />
                <span>Timed • 3:00</span>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect("standard-setup")}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors text-left group"
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Standard Practice</h3>
              <p className="text-sm text-muted-foreground">
                Choose how many questions you want. See results after each question.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                <span>No time limit</span>
              </div>
            </button>
          </div>
        </div>
      </>
    );
  }

  // Standard mode setup screen
  if (mode === "standard-setup") {
    return (
      <>
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Standard Practice</h1>
            <p className="text-muted-foreground">How many questions would you like?</p>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Number of Questions</label>
              <Input
                type="number"
                min={1}
                max={questions.length}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                className="text-center text-lg font-semibold bg-muted/30 border-border/50"
              />
              <p className="text-xs text-muted-foreground text-center">
                Available: 1 to {questions.length} questions
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setMode("select")}
                className="flex-1 rounded-xl"
              >
                Back
              </Button>
              <Button
                onClick={startStandardPractice}
                className="flex-1 bg-primary hover:bg-primary/90 rounded-xl"
              >
                Start Practice
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Rapid fire result screen
  if (mode === "rapid-result") {
    const score = accuracy || 0;
    const percentage = accuracy ?? 0

    return (
      <>
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Results Header */}
          <div className="bg-card rounded-2xl border border-border/50 p-8 text-center relative">
            <Button onClick={restart} className="absolute bottom-4 right-4" variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <div className="inline-flex p-4 rounded-2xl bg-aptitude/10 mb-4">
              {percentage >= 60 ? (
                <CheckCircle2 className="w-12 h-12 text-success" />
              ) : (
                <AlertCircle className="w-12 h-12 text-aptitude" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {timeRemaining === 0 ? "Time's Up!" : "Quiz Complete!"}
            </h1>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-aptitude">{score}/{questions.length}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{percentage}%</p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Review Your Answers</h2>
            {questions.map((question, index) => {
              const userAnswer = answers[index]
              const correctIndex = question.correctAnswerIndex

              const isCorrect = userAnswer === correctIndex
              const result = results[index]
              return (
                <div
                  key={question.id}
                  className={cn(
                    "p-4 rounded-xl border transition-colors",
                    isCorrect
                      ? "bg-success/5 border-success/30"
                      : "bg-destructive/5 border-destructive/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                        isCorrect ? "bg-success text-white" : "bg-destructive text-white"
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{question.text}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          Your answer:{" "}
                          <span className={isCorrect ? "text-success" : "text-destructive"}>
                            {userAnswer !== null
                              ? question.options[userAnswer]
                              : "Not answered"}
                          </span>
                        </p>
                        {result?.correctAnswer !== undefined && (
                          <p className="text-success">
                            Correct: {question.options[correctIndex]}
                          </p>
                        )}
                        <p className="text-muted-foreground mt-2 text-xs">
                          {result?.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={restart} className="w-full rounded-xl" variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </>
    );
  }

  // Rapid Fire Mode - No immediate results
  if (mode === "rapid") {
    return (
      <>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header with Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-aptitude/10">
                <Zap className="w-5 h-5 text-aptitude" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Rapid Fire</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl",
                timeRemaining <= 30 ? "bg-destructive/20" : "bg-muted/50"
              )}
            >
              <Clock className={cn("w-5 h-5", timeRemaining <= 30 ? "text-destructive" : "text-aptitude")} />
              <span
                className={cn(
                  "font-mono font-semibold",
                  timeRemaining <= 30 ? "text-destructive" : "text-foreground"
                )}
              >
                {formatTime(timeRemaining || 0)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-aptitude transition-all duration-300"
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div
            key={currentQuestion.id}
            className="question-enter bg-card rounded-2xl border border-border/50 overflow-hidden"
          >
            <div className="p-6 border-b border-border/50 bg-aptitude/5">
              <p className="text-lg font-medium text-foreground">{currentQuestion.text}</p>
            </div>

            <div className="p-6 space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all duration-150 flex items-center gap-4",
                      isSelected
                        ? "border-aptitude bg-aptitude/10"
                        : "border-border/50 hover:border-aptitude/50 hover:bg-muted/30"
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm",
                        isSelected ? "bg-aptitude text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-foreground">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="px-6 pb-6 flex justify-end">
              <Button
                onClick={nextRapid}
                disabled={selectedOption === null}
                className="bg-aptitude hover:bg-aptitude/90 text-white rounded-xl px-6"
              >
                {isLastQuestion ? "Finish" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Standard Mode - Show result after each question
  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Standard Practice</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Score: <span className="font-semibold text-foreground">{accuracy}/{currentIndex + (showResult ? 1 : 0)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div
          key={currentQuestion.id}
          className="question-enter bg-card rounded-2xl border border-border/50 overflow-hidden"
        >
          <div className="p-6 border-b border-border/50 bg-primary/5">
            <p className="text-lg font-medium text-foreground">{currentQuestion.text}</p>
          </div>

          <div className="p-6 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const result = results[currentIndex]
              const isCorrectOption =
                showResult &&
                result?.correctAnswer === index

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-150 flex items-center gap-4",
                    !showResult && [
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-primary/50 hover:bg-muted/30",
                    ],
                    showResult && [
                      isCorrectOption && "border-success bg-success/10",
                      isSelected && !isCorrectOption && "border-destructive bg-destructive/10",
                      !isSelected && !isCorrectOption && "border-border/50 opacity-50",
                    ]
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm",
                      !showResult && [
                        isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                      ],
                      showResult && [
                        isCorrectOption && "bg-success text-white",
                        isSelected && !isCorrectOption && "bg-destructive text-white",
                        !isSelected && !isCorrectOption && "bg-muted text-muted-foreground",
                      ]
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-foreground">{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after submit) */}
          {showResult && results[currentIndex] && (
            <div className="mx-6 mb-6 p-4 rounded-xl bg-muted/30 border border-border/50 animate-fade-in">
              <p className="text-sm font-medium text-foreground mb-1">
                {results[currentIndex].correct ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-sm text-muted-foreground">
                {results[currentIndex].explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 pb-6 flex justify-end gap-3">
            {!showResult ? (
              <Button
                onClick={submit}
                disabled={selectedOption === null}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
              >
                Submit Answer
              </Button>
            ) : isLastQuestion ? (
              <div className="flex items-center gap-4">
                <div className="text-foreground">
                  Final Score: <span className="font-bold text-primary">{accuracy}/{questions.length}</span>
                </div>
                <Button onClick={restart} variant="outline" className="rounded-xl">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <Button
                onClick={submit}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
              >
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AptitudeQuiz;