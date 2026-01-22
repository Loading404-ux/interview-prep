"use client";

import React, { useState, useEffect } from 'react';
import { useSignIn } from "@clerk/nextjs";
import { 
  Terminal, 
  Fingerprint, 
  Cpu, 
  Code2, 
  BrainCircuit, 
  ArrowRight,
  Info
} from 'lucide-react';

const REASONING_STEPS = [
  { label: "Analyzing Logic Path", status: "complete", color: "text-coding" },
  { label: "Verifying Spatial Complexity", status: "complete", color: "text-hr" },
  { label: "Evaluating Heuristic Reasoning", status: "loading", color: "text-aptitude" },
];

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleGoogleLogin = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Background Mesh Gradients - Using your theme tokens */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-coding/15 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-aptitude/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-[2.2rem] border border-border/50 bg-card/30 backdrop-blur-3xl shadow-2xl overflow-hidden animate-[page-fade-in_0.8s_ease-out]">
        
        {/* LEFT PANEL: The Storytelling logic */}
        <div className="lg:col-span-7 p-6 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50 bg-gradient-to-br from-card/50 to-transparent">
          
          <div className="animate-[fade-in_1s_ease-out]">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 bg-primary rounded-sm shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                <Terminal className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tighter">THINKCODE<span className="text-primary">.</span></span>
            </div>

            <h1 className="text-2xl lg:text-5xl font-bold leading-[1.05] tracking-tighter mb-6">
              Evaluates how {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coding via-hr to-coding animate-[shimmer_3s_infinite_linear] bg-[length:200%_100%]">
                you think,
              </span> <br />
              not just output.
            </h1>

            <p className="text-muted-foreground text-lg max-w-md leading-tight mb-10">
              The first skill-verification engine that logs your reasoning patterns and logic history.
            </p>

            {/* Unique Component: The Reasoning Preview Card */}
            <div className="hidden lg:block w-full max-w-md bg-background/60 border border-border/50 rounded-2xl p-6 shadow-inner animate-[card-fade-in_1.2s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-aptitude/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">Trace_Engine_v1.0</span>
              </div>
              
              <div className="space-y-4 font-mono text-sm">
                {REASONING_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground/30">0{i+1}</span>
                      <span className={step.color}>{step.label}</span>
                    </div>
                    {step.status === 'complete' ? (
                      <span className="text-success text-xs">READY</span>
                    ) : (
                      <div className="w-12 bg-muted h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-full animate-[loading-progress_1.5s_infinite]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof / Tech Stack Icons */}
          <div className="mt-10 flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 animate-[fade-up_1.5s_ease-out]">
            <div className="flex items-center gap-2"><Cpu className="w-5 h-5" /> <span className="text-xs font-mono">NEURAL_EVAL</span></div>
            <div className="flex items-center gap-2"><BrainCircuit className="w-5 h-5" /> <span className="text-xs font-mono">LOGIC_LOGS</span></div>
            <div className="flex items-center gap-2"><Code2 className="w-5 h-5" /> <span className="text-xs font-mono">DSA_VERIFIED</span></div>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Gateway */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 lg:p-12 relative">
          <div className="w-full max-w-sm animate-[fade-up_1s_ease-out]">
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/50 border border-border mb-6 group">
                <Fingerprint className="w-10 h-10 text-primary group-hover:animate-[logo-spin_3s_linear_infinite] transition-all" />
              </div>
              <h2 className="text-2xl font-bold mb-2">KIIT Gateway</h2>
              <p className="text-muted-foreground text-sm">Step into the future of assessment</p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="group relative w-full flex items-center justify-center gap-4 bg-foreground text-background font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
              </svg>
              <span>Sign in with KIIT Mail</span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>

            {/* Policy Info Card */}
            <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-start animate-[slide-in_1.2s_ease-out]">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase tracking-tighter">Campus Restriction</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Only <strong>@kiit.ac.in</strong> domains are authorized. Accessing via personal email will trigger a validation error.
                </p>
              </div>
            </div>

            {/* Department Footer */}
            <div className="mt-12 flex flex-wrap justify-center gap-2 opacity-50">
              {['CSE', 'CSSE', 'CSCE', 'IT',"MSC",'MCA'].map(dept => (
                <span key={dept} className="px-2 py-1 bg-muted border border-border rounded-full text-[9px] font-mono tracking-widest uppercase">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Versioning Footer */}
      <div className="absolute bottom-6 font-mono text-[10px] text-muted-foreground/30 tracking-[0.4em] uppercase">
        Engine_Build_01.22.2026
      </div>
    </div>
  );
}