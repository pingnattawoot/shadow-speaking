'use client'

interface Voice {
  name: string
  lang: string
  voice: SpeechSynthesisVoice
}

interface VoiceSelectorProps {
  voices: Voice[]
  selectedVoice: SpeechSynthesisVoice | null
  onSelect: (voice: SpeechSynthesisVoice) => void
}

export default function VoiceSelector({ voices, selectedVoice, onSelect }: VoiceSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span>Voice:</span>
      <select
        value={selectedVoice?.name || ''}
        onChange={(e) => {
          const voice = voices.find(v => v.name === e.target.value)
          if (voice) onSelect(voice.voice)
        }}
        className="bg-transparent border-none outline-none cursor-pointer 
                   text-coral-500 font-medium text-xs"
      >
        {voices.length === 0 && (
          <option value="">Loading voices...</option>
        )}
        {voices.map((v) => (
          <option key={v.name} value={v.name}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
    </div>
  )
}

