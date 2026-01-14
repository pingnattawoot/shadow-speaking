"use client";

import { useState } from "react";

interface InputSectionProps {
  onStart: (text: string) => void;
}

const DEMO_TEXT = `Success is not final, failure is not fatal: it is the courage to continue that counts. I never dreamed about success. I worked for it. Don't watch the clock; do what it does. Keep going.`;

export default function InputSection({ onStart }: InputSectionProps) {
  const [text, setText] = useState("");

  const handleStart = () => {
    if (!text.trim()) {
      alert("Please enter some text first!");
      return;
    }
    onStart(text);
  };

  const fillDemo = () => {
    setText(DEMO_TEXT);
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div className="glass-card rounded-3xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-2 text-slate-700">
          Paste your script
        </h1>
        <p className="text-center text-slate-500 text-sm mb-6">
          English text only. We&apos;ll split it into sentences for you.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 rounded-2xl border border-slate-200 
                     focus:border-coral-300 focus:ring-4 focus:ring-coral-100 
                     outline-none resize-none text-slate-600 leading-relaxed 
                     transition-all bg-white/50"
          placeholder="Paste your English text here... (e.g. 'The quick brown fox jumps over the lazy dog. It was a sunny day.')"
        />

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleStart}
            className="btn-primary px-8 py-3 flex items-center gap-2"
          >
            <span>Start Practicing</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={fillDemo}
          className="text-xs text-slate-400 hover:text-coral-500 underline decoration-dotted transition-colors"
        >
          Need sample text? Click here.
        </button>
      </div>
    </div>
  );
}
