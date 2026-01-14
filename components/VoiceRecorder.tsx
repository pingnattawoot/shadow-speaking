"use client";

import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useEffect } from "react";

interface VoiceRecorderProps {
  onReset?: () => void;
  resetTrigger?: number;
}

export default function VoiceRecorder({ resetTrigger }: VoiceRecorderProps) {
  const {
    isRecording,
    audioUrl,
    formattedDuration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  // Reset when sentence changes
  useEffect(() => {
    resetRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="bg-white/60 rounded-2xl p-4 flex items-center gap-4 border border-white/50 shadow-sm w-full max-w-md justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleRecording}
          className={`flex items-center justify-center w-12 h-12 rounded-full 
                     transition-all active:scale-95 ${
                       isRecording
                         ? "bg-red-500 text-white animate-pulse-record"
                         : "bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white"
                     }`}
        >
          {isRecording ? (
            <div className="w-4 h-4 bg-white rounded-sm" />
          ) : (
            <svg
              className="w-5 h-5"
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
          )}
        </button>
        <div className="flex flex-col">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isRecording ? "text-red-500" : "text-slate-400"
            }`}
          >
            {isRecording ? "Recording..." : audioUrl ? "Listen" : "Record"}
          </span>
          <span className="text-sm font-mono text-slate-600">
            {formattedDuration}
          </span>
        </div>
      </div>

      {audioUrl && <audio src={audioUrl} controls className="h-8 w-40" />}
    </div>
  );
}
