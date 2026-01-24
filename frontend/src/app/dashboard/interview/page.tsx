"use client"
import React, { useState, useRef } from 'react';
import { api } from '@/lib/api-client';
import { toast } from "sonner";
import { useAuth } from '@clerk/nextjs';
import { Loader2, Mic, Square, FileText, CheckCircle2, ChevronRight } from "lucide-react";

type Step = 'UPLOAD' | 'INTERVIEWING' | 'REPORT';

const InterviewRoom = () => {
    // State Management
    const [step, setStep] = useState<Step>('UPLOAD');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [report, setReport] = useState<any>(null);

    // Audio & Recording Refs
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const { getToken } = useAuth();

    /**
     * STEP 1: Process Resume PDF
     */
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        const token = await getToken();
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('role', 'Fullstack Developer');
        console.log(file)
        try {
            const data: any = await api('/interview/context/resume', {
                method: 'POST',
                body: formData,
                isMultipart: true,
                token
            });

            setSessionId(data.sessionId);
            setCurrentQuestion(data.initialQuestion);
            setStep('INTERVIEWING');
            toast.success("Resume analyzed. Interview session started!");
        } catch (err) {
            toast.error("Failed to parse resume. Please try a different PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * STEP 2: Audio Recording Logic
     */
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
            
            mediaRecorder.current.onstop = async () => {
                await handleSendAudio();
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            toast.error("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    };

    const handleSendAudio = async () => {
        setIsProcessing(true);
        const token = await getToken();
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
            const res: any = await api(`/interview/answer/${sessionId}`, {
                method: 'POST',
                body: formData,
                isMultipart: true,
                token
            });
            setCurrentQuestion(res.nextQuestion);
            toast.info("Response analyzed.");
        } catch (err) {
            toast.error("Error processing audio. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * STEP 3: Final Report
     */
    const finishInterview = async () => {
        setIsProcessing(true);
        try {
            const token = await getToken();
            const finalReport = await api(`/interview/session/complete/${sessionId}`, {
                method: 'POST',
                token
            });
            setReport(finalReport);
            setStep('REPORT');
        } catch (err) {
            toast.error("Failed to generate final report.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-10">
            {/* PROGRESS INDICATOR */}
            <div className="flex justify-between mb-8 px-10">
                {['Resume', 'Interview', 'Verdict'].map((label, i) => (
                    <div key={label} className={`flex items-center gap-2 ${i === 0 && step === 'UPLOAD' || i === 1 && step === 'INTERVIEWING' || i === 2 && step === 'REPORT' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i === 0 && step !== 'UPLOAD' ? 'bg-green-500 text-white' : 'bg-secondary'}`}>
                            {i === 0 && step !== 'UPLOAD' ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        {label}
                    </div>
                ))}
            </div>

            <div className="min-h-[400px] border rounded-2xl shadow-xl bg-card p-8 flex flex-col justify-center transition-all duration-300">
                
                {/* STATE 1: UPLOAD */}
                {step === 'UPLOAD' && (
                    <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <FileText size={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Gemini AI Interviewer</h1>
                            <p className="text-muted-foreground mt-2 text-lg">Upload your resume to begin a tailored HR technical round.</p>
                        </div>
                        
                        <div className="relative group max-w-sm mx-auto">
                            <input
                                type="file"
                                accept=".pdf"
                                disabled={isProcessing}
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="bg-primary text-primary-foreground py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:bg-primary/90 transition">
                                {isProcessing ? <Loader2 className="animate-spin" /> : <ChevronRight />}
                                {isProcessing ? "Processing Resume..." : "Upload Resume (PDF)"}
                            </div>
                        </div>
                    </div>
                )}

                {/* STATE 2: INTERVIEWING */}
                {step === 'INTERVIEWING' && (
                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-muted p-8 rounded-2xl border-l-8 border-primary relative">
                            <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">AI INTERVIEWER</span>
                            <p className="text-2xl font-medium leading-relaxed">
                                {isProcessing ? "Thinking..." : currentQuestion}
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            {!isRecording ? (
                                <button
                                    disabled={isProcessing}
                                    onClick={startRecording}
                                    className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition active:scale-95 disabled:opacity-50"
                                >
                                    <Mic size={32} />
                                    <span className="text-[10px] mt-1 font-bold">START</span>
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="h-24 w-24 rounded-full bg-destructive text-white flex flex-col items-center justify-center shadow-2xl animate-pulse"
                                >
                                    <Square size={32} fill="currentColor" />
                                    <span className="text-[10px] mt-1 font-bold">STOP</span>
                                </button>
                            )}

                            <div className="text-center h-6">
                                {isProcessing ? (
                                    <div className="flex items-center gap-2 text-primary animate-pulse italic">
                                        <Loader2 size={16} className="animate-spin" />
                                        Gemini is analyzing your response...
                                    </div>
                                ) : isRecording ? (
                                    <div className="flex items-center gap-2 text-destructive animate-bounce">
                                        <div className="w-2 h-2 bg-destructive rounded-full" />
                                        Listening to your answer...
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm font-medium">Click the microphone to answer via voice</p>
                                )}
                            </div>

                            <button
                                disabled={isProcessing || isRecording}
                                onClick={finishInterview}
                                className="mt-4 px-6 py-2 border rounded-full text-xs font-semibold hover:bg-secondary transition disabled:opacity-30"
                            >
                                End Session & Generate Report
                            </button>
                        </div>
                    </div>
                )}

                {/* STATE 3: FINAL REPORT */}
                {step === 'REPORT' && report && (
                    <div className="animate-in fade-in zoom-in duration-700 space-y-6">
                        <div className="text-center border-b pb-6">
                            <h2 className="text-muted-foreground uppercase text-xs font-bold tracking-[0.2em] mb-2">Interview Outcome</h2>
                            <div className={`text-5xl font-black ${report.finalVerdict === 'Hire' ? 'text-green-500' : 'text-orange-500'}`}>
                                {report.finalVerdict}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Confidence Score: {(report.confidenceScore * 100).toFixed(0)}%</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <h3 className="text-green-800 font-bold mb-3 flex items-center gap-2 italic">✓ Key Strengths</h3>
                                <ul className="space-y-2">
                                    {report.strengths.map((s: string, i: number) => (
                                        <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5" /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <h3 className="text-orange-800 font-bold mb-3 flex items-center gap-2 italic">! Growth Areas</h3>
                                <ul className="space-y-2">
                                    {report.concerns.map((c: string, i: number) => (
                                        <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5" /> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:opacity-90 transition"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewRoom;