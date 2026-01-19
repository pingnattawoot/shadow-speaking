"use client";

import InputSection from "@/components/InputSection";
import PracticeSection from "@/components/PracticeSection";
import SavedScripts, { SavedScript } from "@/components/SavedScripts";
import SentenceEditor from "@/components/SentenceEditor";
import { useCallback, useEffect, useState } from "react";

interface SentenceItem {
  id: string;
  text: string;
  originalIndices: number[];
}

const STORAGE_KEY = "shadowspeak-scripts";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sentenceItems, setSentenceItems] = useState<SentenceItem[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showSavedScripts, setShowSavedScripts] = useState(false);
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([]);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);

  // Load saved scripts from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const scripts = JSON.parse(stored) as SavedScript[];
        setSavedScripts(scripts);
      }
    } catch (e) {
      console.error("Failed to load saved scripts:", e);
    }
  }, []);

  // Save scripts to localStorage whenever they change
  const persistScripts = useCallback((scripts: SavedScript[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
      setSavedScripts(scripts);
    } catch (e) {
      console.error("Failed to save scripts:", e);
    }
  }, []);

  const handleSaveScript = useCallback(
    (name: string) => {
      const newScript: SavedScript = {
        id: `script-${Date.now()}`,
        name,
        sentences: sentenceItems,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updated = [newScript, ...savedScripts];
      persistScripts(updated);
      setCurrentScriptId(newScript.id);
    },
    [sentenceItems, savedScripts, persistScripts]
  );

  const handleUpdateScript = useCallback(
    (id: string) => {
      const updated = savedScripts.map((script) =>
        script.id === id
          ? { ...script, sentences: sentenceItems, updatedAt: Date.now() }
          : script
      );
      persistScripts(updated);
    },
    [sentenceItems, savedScripts, persistScripts]
  );

  const handleDeleteScript = useCallback(
    (id: string) => {
      const updated = savedScripts.filter((script) => script.id !== id);
      persistScripts(updated);
      if (currentScriptId === id) {
        setCurrentScriptId(null);
      }
    },
    [savedScripts, persistScripts, currentScriptId]
  );

  const handleLoadScript = useCallback(
    (sentences: SentenceItem[]) => {
      setSentenceItems(sentences);
      setIsStarted(true);
      setShowSavedScripts(false);
      // Find the script id that matches
      const matchingScript = savedScripts.find(
        (s) => JSON.stringify(s.sentences) === JSON.stringify(sentences)
      );
      setCurrentScriptId(matchingScript?.id ?? null);
    },
    [savedScripts]
  );

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
    setCurrentScriptId(null); // New script, not saved yet
  };

  const handleReset = () => {
    setSentenceItems([]);
    setIsStarted(false);
    setCurrentScriptId(null);
  };

  const handleUpdateSentences = (items: SentenceItem[]) => {
    setSentenceItems(items);
  };

  const handleUpdateSingleSentence = (index: number, newText: string) => {
    setSentenceItems((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], text: newText };
      }
      return updated;
    });
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
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Saved Scripts Button - Always visible */}
          <button
            onClick={() => setShowSavedScripts(true)}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-sm font-medium text-slate-500 
                     hover:text-coral-500 hover:bg-coral-50 active:bg-coral-100
                     transition-colors flex items-center gap-1.5 relative"
          >
            <svg
              className="w-5 h-5 sm:w-4 sm:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <span className="hidden sm:inline">My Scripts</span>
            {savedScripts.length > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:-right-1 w-4 h-4 bg-coral-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {savedScripts.length}
              </span>
            )}
          </button>

          {isStarted && (
            <>
              {/* Save/Update Button */}
              <button
                onClick={() => setShowSavedScripts(true)}
                className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-sm font-medium transition-colors 
                          flex items-center gap-1.5 ${
                            currentScriptId
                              ? "text-sage-500 hover:text-sage-600 hover:bg-sage-50 active:bg-sage-100"
                              : "text-coral-500 hover:text-coral-600 hover:bg-coral-50 active:bg-coral-100"
                          }`}
              >
                <svg
                  className="w-5 h-5 sm:w-4 sm:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {currentScriptId ? "Saved ✓" : "Save"}
                </span>
              </button>

              {/* Edit Sentences Button */}
              <button
                onClick={() => setShowEditor(true)}
                className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-sm font-medium text-slate-500 
                         hover:text-coral-500 hover:bg-coral-50 active:bg-coral-100
                         transition-colors flex items-center gap-1.5"
              >
                <svg
                  className="w-5 h-5 sm:w-4 sm:h-4"
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

              {/* Start Over Button */}
              <button
                onClick={handleReset}
                className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-sm font-medium text-slate-400 
                         hover:text-coral-500 hover:bg-coral-50 active:bg-coral-100
                         transition-colors flex items-center gap-1.5"
              >
                <svg
                  className="w-5 h-5 sm:hidden"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Start Over</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {!isStarted ? (
          <InputSection onStart={handleStart} />
        ) : (
          <PracticeSection
            sentences={sentences}
            onReset={handleReset}
            onUpdateSentence={handleUpdateSingleSentence}
          />
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

      {/* Saved Scripts Modal */}
      {showSavedScripts && (
        <SavedScripts
          currentSentences={sentenceItems}
          onLoad={handleLoadScript}
          onClose={() => setShowSavedScripts(false)}
          savedScripts={savedScripts}
          onSave={handleSaveScript}
          onDelete={handleDeleteScript}
          onUpdate={handleUpdateScript}
          currentScriptId={currentScriptId}
        />
      )}
    </div>
  );
}
