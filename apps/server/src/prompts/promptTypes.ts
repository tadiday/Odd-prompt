export const promptCategories = [
  'movies',
  'food',
  'drinks',
  'games',
  'music',
  'animals',
  'places',
  'relationships',
  'everyday_life',
  'numbers'
] as const;

export type PromptCategory = (typeof promptCategories)[number];

export interface GamePrompt {
  id: string;
  category: PromptCategory;
  answerType: string;
  prompt: string;
}

export interface PromptPair {
  category: PromptCategory;
  answerType: string;
  normalPrompt: string;
  oddPrompt: string;
  normalPromptId: string;
  oddPromptId: string;
}

