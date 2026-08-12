import { prompts } from './promptData.js';
import { promptCategories, type GamePrompt, type PromptCategory, type PromptPair } from './promptTypes.js';

function getPromptsByCategory(category: PromptCategory): GamePrompt[] {
  return prompts.filter((prompt) => prompt.category === category);
}

function getPromptsByAnswerType(answerType: string, category: PromptCategory): GamePrompt[] {
  return prompts.filter((prompt) => prompt.answerType === answerType && prompt.category === category);
}

export function getRandomPromptPair(recentPromptIds: ReadonlySet<string> = new Set()): PromptPair {
  const category = randomItem(promptCategories);
  const categoryPrompts = getPromptsByCategory(category);
  const answerType = randomItem([...new Set(categoryPrompts.map((prompt) => prompt.answerType))]);
  const matchingPrompts = getPromptsByAnswerType(answerType, category);
  const freshPrompts = matchingPrompts.filter((prompt) => !recentPromptIds.has(prompt.id));
  const candidates = freshPrompts.length >= 2 ? freshPrompts : matchingPrompts;
  const normalPrompt = randomItem(candidates);
  const oddPrompt = randomItem(candidates.filter((prompt) => prompt.id !== normalPrompt.id));

  return {
    category,
    answerType,
    normalPrompt: normalPrompt.prompt,
    oddPrompt: oddPrompt.prompt,
    normalPromptId: normalPrompt.id,
    oddPromptId: oddPrompt.id
  };
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
