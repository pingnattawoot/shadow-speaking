"use client";

import { useState } from "react";
import InputSection from "@/components/InputSection";
import PracticeSection from "@/components/PracticeSection";

export default function Home() {
  const [sentences, setSentences] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = (text: string) => {
    // Split text into sentences
    const parsed = text.match(/[^.!?]+[.!?]+/g);
    const result = parsed
      ? parsed.map((s) => s.trim()).filter((s) => s.length > 0)
      : text.split(/\n+/).filter((s) => s.trim().length > 0);

    if (result.length === 0 && text.trim()) {
      setSentences([text.trim()]);
    } else {
      setSentences(result);
    }
    setIsStarted(true);
  };

  const handleReset = () => {
    setSentences([]);
    setIsStarted(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-coral-400 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <span className="font-semibold text-lg text-slate-700">
            Shadow<span className="text-coral-400">Speak</span>
          </span>
        </div>
        {isStarted && (
          <button
            onClick={handleReset}
            className="text-sm font-medium text-slate-400 hover:text-coral-500 transition-colors"
          >
            Start Over
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {!isStarted ? (
          <InputSection onStart={handleStart} />
        ) : (
          <PracticeSection sentences={sentences} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
