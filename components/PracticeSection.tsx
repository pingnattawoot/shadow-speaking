"use client";

import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useEffect, useRef, useState } from "react";
import VoiceRecorder from "./VoiceRecorder";
import VoiceSelector from "./VoiceSelector";

interface PracticeSectionProps {
  sentences: string[];
  onReset: () => void;
  onUpdateSentence?: (index: number, newText: string) => void;
}

export default function PracticeSection({
  sentences,
  onReset,
  onUpdateSentence,
}: PracticeSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { voices, selectedVoice, setSelectedVoice, speak, isSpeaking } =
    useSpeechSynthesis();

  const currentSentence = sentences[currentIndex];
  const progress = ((currentIndex + 1) / sentences.length) * 100;

  // Auto-resize textarea and focus
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      // Auto-resize
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!onUpdateSentence) return;
    setEditText(currentSentence);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== currentSentence && onUpdateSentence) {
      onUpdateSentence(currentIndex, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancelEdit();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSpeak = () => {
    speak(currentSentence);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full max-w-md flex items-center gap-3">
        <span className="text-xs font-bold text-coral-500 w-8 text-right">
          {currentIndex + 1}
        </span>
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-coral-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-400 w-8">
          {sentences.length}
        </span>
      </div>

      {/* Sentence Display Card */}
      <div className="glass-card w-full rounded-3xl p-8 md:p-12 min-h-[200px] flex items-center justify-center relative overflow-hidden group">
        {/* Decorative quotes */}
        <div className="absolute top-4 left-6 text-6xl text-coral-200 font-serif opacity-50 select-none">
          &ldquo;
        </div>

        {isEditing ? (
          <div className="w-full px-4 animate-fade-in">
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                // Auto-resize on change
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full text-2xl md:text-3xl lg:text-4xl text-center 
                       font-medium text-slate-700 leading-snug bg-transparent
                       border-none outline-none resize-none
                       focus:ring-0 placeholder:text-slate-300"
              placeholder="Enter your sentence..."
              rows={1}
            />
            <p className="text-center text-xs text-slate-400 mt-3 animate-fade-in">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">
                Enter
              </kbd>{" "}
              to save ·{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">
                Esc
              </kbd>{" "}
              to cancel
            </p>
          </div>
        ) : (
          <div
            onClick={handleStartEdit}
            className={`relative px-8 ${onUpdateSentence ? "cursor-text" : ""}`}
          >
            <p
              key={currentIndex}
              className="text-2xl md:text-3xl lg:text-4xl text-center 
                      font-medium text-slate-700 leading-snug animate-fade-in"
            >
              {currentSentence}
            </p>
            {/* Edit hint - shows on hover */}
            {onUpdateSentence && (
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 
                            flex items-center gap-1.5 text-xs text-slate-400
                            opacity-0 group-hover:opacity-100 transition-opacity
                            pointer-events-none whitespace-nowrap"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Click to edit
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-4 right-6 text-6xl text-coral-200 font-serif opacity-50 select-none rotate-180">
          &ldquo;
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-6">
          {/* Previous */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="btn-secondary p-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Play / TTS */}
          <button
            onClick={handleSpeak}
            className={`btn-primary p-6 relative group ${
              isSpeaking ? "animate-pulse" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            <span
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white 
                          text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 
                          transition-opacity whitespace-nowrap pointer-events-none"
            >
              Listen
            </span>
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={currentIndex === sentences.length - 1}
            className="btn-secondary p-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Voice Recorder */}
        <VoiceRecorder resetTrigger={currentIndex} />

        {/* Voice Selector */}
        <VoiceSelector
          voices={voices}
          selectedVoice={selectedVoice}
          onSelect={setSelectedVoice}
        />
      </div>
    </div>
  );
}
