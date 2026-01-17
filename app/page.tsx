"use client";

import { useEffect, useState } from "react";
import InputSection from "@/components/InputSection";
import PracticeSection from "@/components/PracticeSection";
import SentenceEditor from "@/components/SentenceEditor";

interface SentenceItem {
  id: string;
  text: string;
  originalIndices: number[];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sentenceItems, setSentenceItems] = useState<SentenceItem[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = (text: string) => {
    // Split text into sentences
    const parsed = text.match(/[^.!?]+[.!?]+/g);
    const result = parsed
      ? parsed.map((s) => s.trim()).filter((s) => s.length > 0)
      : text.split(/\n+/).filter((s) => s.trim().length > 0);

    const sentences =
      result.length === 0 && text.trim() ? [text.trim()] : result;

    // Create sentence items with tracking
    const items: SentenceItem[] = sentences.map((text, index) => ({
      id: `sentence-${index}`,
      text,
      originalIndices: [index],
    }));

    setSentenceItems(items);
    setIsStarted(true);
  };

  const handleReset = () => {
    setSentenceItems([]);
    setIsStarted(false);
  };

  const handleUpdateSentences = (items: SentenceItem[]) => {
    setSentenceItems(items);
  };

  // Extract just the text for PracticeSection
  const sentences = sentenceItems.map((item) => item.text);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
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
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-slate-400">Loading...</div>
        </main>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEditor(true)}
              className="text-sm font-medium text-slate-500 hover:text-coral-500 transition-colors flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleReset}
              className="text-sm font-medium text-slate-400 hover:text-coral-500 transition-colors"
            >
              Start Over
            </button>
          </div>
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

      {/* Sentence Editor Modal */}
      {showEditor && (
        <SentenceEditor
          sentences={sentenceItems}
          onUpdate={handleUpdateSentences}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
