"use client";

import { useState } from "react";

interface SentenceItem {
  id: string;
  text: string;
  originalIndices: number[];
}

export interface SavedScript {
  id: string;
  name: string;
  sentences: SentenceItem[];
  createdAt: number;
  updatedAt: number;
}

interface SavedScriptsProps {
  currentSentences: SentenceItem[];
  onLoad: (sentences: SentenceItem[]) => void;
  onClose: () => void;
  savedScripts: SavedScript[];
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
  currentScriptId: string | null;
}

const MAX_SCRIPTS = 10;

export default function SavedScripts({
  currentSentences,
  onLoad,
  onClose,
  savedScripts,
  onSave,
  onDelete,
  onUpdate,
  currentScriptId,
}: SavedScriptsProps) {
  const [newScriptName, setNewScriptName] = useState("");
  const [isNaming, setIsNaming] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const canSaveNew =
    savedScripts.length < MAX_SCRIPTS && currentSentences.length > 0;
  const isCurrentScriptSaved = currentScriptId !== null;

  const handleSaveNew = () => {
    if (!newScriptName.trim()) return;
    onSave(newScriptName.trim());
    setNewScriptName("");
    setIsNaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveNew();
    } else if (e.key === "Escape") {
      setIsNaming(false);
      setNewScriptName("");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md max-h-[85vh] rounded-3xl p-6 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-coral-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-coral-500"
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
            </div>
            <h2 className="text-lg font-semibold text-slate-700">My Scripts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Save Current Script Section */}
        {currentSentences.length > 0 && (
          <div className="mb-4 p-4 bg-coral-50 rounded-2xl border border-coral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">
                Current Script
              </span>
              <span className="text-xs text-coral-500 font-medium">
                {currentSentences.length} sentences
              </span>
            </div>

            {isNaming ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newScriptName}
                  onChange={(e) => setNewScriptName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Name your script..."
                  autoFocus
                  maxLength={50}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-coral-200 
                           bg-white focus:outline-none focus:ring-2 focus:ring-coral-300"
                />
                <button
                  type="button"
                  onClick={handleSaveNew}
                  disabled={!newScriptName.trim()}
                  className="px-4 py-2 bg-coral-400 text-white text-sm font-medium rounded-xl
                           hover:bg-coral-500 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                {isCurrentScriptSaved ? (
                  <>
                    <button
                      onClick={() => onUpdate(currentScriptId!)}
                      className="flex-1 py-2.5 bg-coral-400 text-white text-sm font-medium rounded-xl
                               hover:bg-coral-500 transition-colors flex items-center justify-center gap-1.5"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Update Saved
                    </button>
                    {canSaveNew && (
                      <button
                        onClick={() => setIsNaming(true)}
                        className="px-4 py-2.5 border border-coral-300 text-coral-500 text-sm font-medium rounded-xl
                                 hover:bg-coral-100 transition-colors"
                      >
                        Save as New
                      </button>
                    )}
                  </>
                ) : canSaveNew ? (
                  <button
                    onClick={() => setIsNaming(true)}
                    className="flex-1 py-2.5 bg-coral-400 text-white text-sm font-medium rounded-xl
                             hover:bg-coral-500 transition-colors flex items-center justify-center gap-1.5"
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Save Script
                  </button>
                ) : (
                  <p className="text-xs text-slate-500 py-2">
                    Maximum {MAX_SCRIPTS} scripts reached. Delete one to save
                    new.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Saved Scripts List */}
        <div className="flex-1 overflow-y-auto">
          {savedScripts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <svg
                className="w-12 h-12 mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-sm">No saved scripts yet</p>
              <p className="text-xs mt-1">
                Start practicing and save your progress!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-3">
                {savedScripts.length}/{MAX_SCRIPTS} scripts saved
              </p>
              {savedScripts.map((script) => (
                <div
                  key={script.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    currentScriptId === script.id
                      ? "bg-sage-50 border-sage-200"
                      : "bg-white/60 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-700 truncate">
                          {script.name}
                        </h3>
                        {currentScriptId === script.id && (
                          <span className="shrink-0 text-xs bg-sage-400 text-white px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {script.sentences.length} sentences · Updated{" "}
                        {formatDate(script.updatedAt)}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {script.sentences[0]?.text}
                        {script.sentences.length > 1 && "..."}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {currentScriptId !== script.id && (
                        <button
                          onClick={() => onLoad(script.sentences)}
                          className="p-2 text-sage-500 hover:bg-sage-100 rounded-xl transition-colors"
                          title="Load this script"
                        >
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
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      )}

                      {deleteConfirm === script.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onDelete(script.id);
                              setDeleteConfirm(null);
                            }}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                            title="Confirm delete"
                          >
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                            title="Cancel"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(script.id)}
                          className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete script"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full border border-slate-200 text-slate-500 
                     font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
