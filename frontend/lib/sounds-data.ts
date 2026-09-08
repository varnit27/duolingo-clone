export interface SoundItem {
  symbol: string;
  example: string;
}

export interface SoundCategory {
  title: string;
  sounds: SoundItem[];
}

export const SOUND_CATEGORIES: SoundCategory[] = [
  {
    title: "Vowels",
    sounds: [
      { symbol: "ɑ", example: "hot" },
      { symbol: "æ", example: "cat" },
      { symbol: "ʌ", example: "but" },
      { symbol: "ɛ", example: "bed" },
      { symbol: "eɪ", example: "say" },
      { symbol: "ɝ", example: "bird" },
      { symbol: "ɪ", example: "ship" },
      { symbol: "i", example: "sheep" },
      { symbol: "ə", example: "about" },
      { symbol: "oʊ", example: "boat" },
      { symbol: "ʊ", example: "foot" },
      { symbol: "u", example: "food" },
    ],
  },
  {
    title: "Consonants",
    sounds: [
      { symbol: "p", example: "pat" },
      { symbol: "b", example: "bat" },
      { symbol: "t", example: "top" },
      { symbol: "d", example: "dog" },
      { symbol: "k", example: "cat" },
      { symbol: "g", example: "go" },
      { symbol: "f", example: "fan" },
      { symbol: "v", example: "van" },
      { symbol: "θ", example: "think" },
      { symbol: "ð", example: "this" },
      { symbol: "s", example: "sun" },
      { symbol: "z", example: "zoo" },
    ],
  },
];