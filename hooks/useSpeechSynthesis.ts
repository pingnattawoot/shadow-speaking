"use client";

import { useCallback, useEffect, useState } from "react";

interface Voice {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();
      const englishVoices = availableVoices
        .filter((v) => v.lang.startsWith("en"))
        .map((v) => ({
          name: v.name,
          lang: v.lang,
          voice: v,
        }));
      setVoices(englishVoices);

      // Set default voice (prefer en-US)
      if (englishVoices.length > 0 && !selectedVoice) {
        const usVoice = englishVoices.find((v) => v.lang === "en-US");
        setSelectedVoice(usVoice?.voice || englishVoices[0].voice);
      }
    };

    loadVoices();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoice]);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined") return;

      const synth = window.speechSynthesis;

      // Cancel any ongoing speech
      if (synth.speaking) {
        synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.9; // Slightly slower for practice
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synth.speak(utterance);
    },
    [selectedVoice]
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
    isSpeaking,
  };
}
