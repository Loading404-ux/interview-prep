"use client";

import { useState, useEffect } from "react";
// import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, ArrowRight, Brain, RotateCcw, Zap, BookOpen } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "A train travels 360 km in 4 hours. What is its speed in km/hr?",
    options: ["80 km/hr", "90 km/hr", "100 km/hr", "85 km/hr"],
    correctAnswer: 1,
    explanation: "Speed = Distance / Time = 360 km / 4 hr = 90 km/hr",
  },
  {
    id: 2,
    text: "If 15% of a number is 45, what is the number?",
    options: ["300", "450", "200", "350"],
    correctAnswer: 0,
    explanation: "Let the number be x. 15% of x = 45 → 0.15x = 45 → x = 45/0.15 = 300",
  },
  {
    id: 3,
    text: "A shopkeeper sells an article at 20% profit. If the cost price is ₹500, what is the selling price?",
    options: ["₹550", "₹600", "₹650", "₹580"],
    correctAnswer: 1,
    explanation: "Selling Price = Cost Price × (1 + Profit%) = 500 × 1.20 = ₹600",
  },
  {
    id: 4,
    text: "The ratio of ages of A and B is 3:5. If B is 25 years old, how old is A?",
    options: ["12 years", "15 years", "18 years", "20 years"],
    correctAnswer: 1,
    explanation: "If B = 25 years and ratio is 3:5, then A = (3/5) × 25 = 15 years",
  },
  {
    id: 5,
    text: "A car travels at 60 km/hr for 2 hours and 40 km/hr for 3 hours. What is the average speed?",
    options: ["48 km/hr", "50 km/hr", "52 km/hr", "45 km/hr"],
    correctAnswer: 0,
    explanation: "Total distance = (60×2) + (40×3) = 120 + 120 = 240 km. Total time = 5 hours. Average = 240/5 = 48 km/hr",
  },
];

type Mode = "select" | "rapid" | "standard";
type QuizState = "answering" | "submitted";

const AptitudeQuiz = () => {
  const [mode, setMode] = useState<Mode>("select");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("answering");
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes for rapid fire
  const [isTimerActive, setIsTimerActive] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  // Timer for rapid fire mode
  useEffect(() => {
    if (mode === "rapid" && isTimerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isTimerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleModeSelect = (selectedMode: "rapid" | "standard") => {
    setMode(selectedMode);
    if (selectedMode === "rapid") {
      setIsTimerActive(true);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (quizState === "submitted") return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
    setQuizState("submitted");
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setQuizState("answering");
    }
  };

  const handleRestart = () => {
    setMode("select");
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizState("answering");
    setAnswers(Array(questions.length).fill(null));
    setTimeRemaining(180);
    setIsTimerActive(false);
  };

  const getScore = () => {
    return answers.reduce((score:number, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

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
                {questions.length} questions in 3 minutes. Test your speed and accuracy under pressure.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-aptitude">
                <Clock className="w-4 h-4" />
                <span>Timed</span>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect("standard")}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors text-left group"
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Standard Practice</h3>
              <p className="text-sm text-muted-foreground">
                Take your time. Focus on understanding each concept thoroughly.
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

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Timer (Rapid mode) or Progress (Standard) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-aptitude/10">
              {mode === "rapid" ? (
                <Zap className="w-5 h-5 text-aptitude" />
              ) : (
                <BookOpen className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {mode === "rapid" ? "Rapid Fire" : "Standard Practice"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          {mode === "rapid" && (
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
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar (subtle) */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-aptitude transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + (quizState === "submitted" ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div
          key={currentQuestion.id}
          className="question-enter bg-card rounded-2xl border border-border/50 overflow-hidden"
        >
          {/* Question */}
          <div className="p-6 border-b border-border/50 bg-aptitude/5">
            <p className="text-lg font-medium text-foreground">
              {currentQuestion.text}
            </p>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const showResult = quizState === "submitted";
              const isCorrectOption = index === currentQuestion.correctAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={quizState === "submitted"}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-150 flex items-center gap-4",
                    quizState === "answering" && [
                      isSelected
                        ? "border-aptitude bg-aptitude/10"
                        : "border-border/50 hover:border-aptitude/50 hover:bg-muted/30",
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
                      quizState === "answering" && [
                        isSelected ? "bg-aptitude text-white" : "bg-muted text-muted-foreground",
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
          {quizState === "submitted" && (
            <div className="mx-6 mb-6 p-4 rounded-xl bg-muted/30 border border-border/50 animate-fade-in">
              <p className="text-sm font-medium text-foreground mb-1">
                {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 pb-6 flex justify-end gap-3">
            {quizState === "answering" ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="bg-aptitude hover:bg-aptitude/90 text-white rounded-xl px-6"
              >
                Submit Answer
              </Button>
            ) : isLastQuestion ? (
              <div className="flex items-center gap-4">
                <div className="text-foreground">
                  Score: <span className="font-bold text-aptitude">{getScore()}/{questions.length}</span>
                </div>
                <Button onClick={handleRestart} variant="outline" className="rounded-xl">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-aptitude hover:bg-aptitude/90 text-white rounded-xl px-6"
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