"use client";

import { useState } from "react";

interface SentenceItem {
  id: string;
  text: string;
  originalIndices: number[]; // Track which original sentences are merged
}

interface SentenceEditorProps {
  sentences: SentenceItem[];
  onUpdate: (sentences: SentenceItem[]) => void;
  onClose: () => void;
}

export default function SentenceEditor({
  sentences,
  onUpdate,
  onClose,
}: SentenceEditorProps) {
  const [items, setItems] = useState<SentenceItem[]>(sentences);

  const handleMerge = (index: number) => {
    if (index >= items.length - 1) return;

    const newItems = [...items];
    const current = newItems[index];
    const next = newItems[index + 1];

    // Merge current and next
    const merged: SentenceItem = {
      id: `${current.id}-${next.id}`,
      text: `${current.text} ${next.text}`,
      originalIndices: [...current.originalIndices, ...next.originalIndices],
    };

    newItems.splice(index, 2, merged);
    setItems(newItems);
  };

  const handleSplit = (index: number) => {
    const item = items[index];
    if (item.originalIndices.length <= 1) return;

    // Split back to original sentences
    const newItems = [...items];

    // We need to reconstruct from the merged text
    // Split by sentence endings
    const parts = item.text.match(/[^.!?]+[.!?]+/g) || [item.text];
    const splitItems: SentenceItem[] = parts.map((text, i) => ({
      id: `${item.id}-split-${i}`,
      text: text.trim(),
      originalIndices: [item.originalIndices[i] ?? item.originalIndices[0]],
    }));

    newItems.splice(index, 1, ...splitItems);
    setItems(newItems);
  };

  const handleSave = () => {
    onUpdate(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg max-h-[80vh] rounded-3xl p-6 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-700">
            Edit Sentences
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-slate-500 mb-4">
          Tap <span className="inline-flex items-center justify-center w-5 h-5 bg-sage-100 rounded-full text-sage-500">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
            </svg>
          </span> to merge sentences, tap merged sentences to split.
        </p>

        {/* Sentence List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {items.map((item, index) => (
            <div key={item.id}>
              {/* Sentence Card */}
              <div
                onClick={() => item.originalIndices.length > 1 && handleSplit(index)}
                className={`p-3 rounded-xl border transition-all ${item.originalIndices.length > 1
                  ? "bg-coral-50 border-coral-200 cursor-pointer hover:bg-coral-100 active:scale-[0.99]"
                  : "bg-white/60 border-slate-100"
                  }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-coral-400 mt-0.5 shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {item.text}
                  </p>
                  {item.originalIndices.length > 1 && (
                    <span className="shrink-0 text-xs bg-coral-400 text-white px-2 py-0.5 rounded-full">
                      {item.originalIndices.length} merged
                    </span>
                  )}
                </div>
              </div>

              {/* Merge Button between sentences */}
              {index < items.length - 1 && (
                <div className="flex justify-center py-1">
                  <button
                    onClick={() => handleMerge(index)}
                    className="p-1.5 rounded-full bg-sage-100 text-sage-500 
                             hover:bg-sage-200 active:scale-90 transition-all
                             hover:shadow-md"
                    title="Merge with next sentence"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-slate-200 text-slate-500 
                     font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 btn-primary py-3 text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

