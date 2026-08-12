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

const group = (
  category: PromptCategory,
  answerType: string,
  texts: string[]
): GamePrompt[] => texts.map((prompt, index) => ({
  id: `${category}-${answerType}-${index + 1}`,
  category,
  answerType,
  prompt
}));

export const prompts: GamePrompt[] = [
  ...group('movies', 'movie_title', [
    'What movie could you watch over and over?',
    'What movie do you think is overrated?',
    'What movie has the best ending?',
    'What movie deserves a sequel?'
  ]),
  ...group('movies', 'actor', [
    'Which actor always makes a movie better?',
    'Which actor would play you in a movie?',
    'Which actor is funniest on screen?',
    'Which actor would make a great villain?'
  ]),
  ...group('movies', 'character', [
    'Which movie character would be a great friend?',
    'Which movie character would win a fight?',
    'Which movie character has the best style?',
    'Which movie character would be a terrible roommate?'
  ]),
  ...group('movies', 'genre', [
    'What movie genre is best for a date night?',
    'What movie genre is most overrated?',
    'What movie genre needs more love?',
    'What movie genre is best with friends?'
  ]),

  ...group('food', 'food_item', [
    'What food could you eat every day?',
    'What food is better homemade?',
    'What food is most overrated?',
    'What food tastes best at midnight?'
  ]),
  ...group('food', 'restaurant', [
    'What restaurant is your reliable favorite?',
    'What restaurant has the best fries?',
    'What restaurant would you choose for a celebration?',
    'What restaurant is worth a long wait?'
  ]),
  ...group('food', 'snack', [
    'What snack disappears fastest at a party?',
    'What snack is best for a road trip?',
    'What snack belongs at every movie night?',
    'What snack is impossible to share?'
  ]),
  ...group('food', 'cuisine', [
    'What cuisine would you eat for a week?',
    'What cuisine has the best comfort food?',
    'What cuisine is best for sharing?',
    'What cuisine would you like to learn to cook?'
  ]),

  ...group('drinks', 'drink_name', [
    'What drink is most refreshing?',
    'What drink belongs at every party?',
    'What drink do you order most often?',
    'What drink tastes better with ice?'
  ]),
  ...group('drinks', 'soda', [
    'What soda is the best?',
    'What soda goes best with pizza?',
    'What soda has the best zero-sugar version?',
    'What soda would you bring to a cookout?'
  ]),
  ...group('drinks', 'coffee', [
    'What coffee drink is best in the morning?',
    'What coffee drink feels like a treat?',
    'What coffee drink is best served cold?',
    'What coffee drink would you recommend to a beginner?'
  ]),
  ...group('drinks', 'energy_drink', [
    'What energy drink tastes the best?',
    'What energy drink has the coolest can?',
    'What energy drink would you choose for a road trip?',
    'What energy drink flavor should everyone try?'
  ]),

  ...group('games', 'game_title', [
    'What game could you play for hours?',
    'What game is the most competitive?',
    'What game has the best replay value?',
    'What game would you bring to a game night?',
    'What game deserves a remake?',
    'What game is better with friends?'
  ]),
  ...group('games', 'game_character', [
    'Which game character would be a great teammate?',
    'Which game character has the best design?',
    'Which game character would win a race?',
    'Which game character would be fun at a party?',
    'Which game character is most iconic?'
  ]),
  ...group('games', 'game_genre', [
    'What game genre is best with friends?',
    'What game genre is hardest to master?',
    'What game genre is most relaxing?',
    'What game genre deserves more attention?',
    'What game genre has the best stories?'
  ]),

  ...group('music', 'artist', [
    'Which artist never misses?',
    'Which artist puts on the best show?',
    'Which artist has the best voice?',
    'Which artist would you want at your party?',
    'Which artist has the most recognizable style?',
    'Which artist deserves more attention?'
  ]),
  ...group('music', 'song', [
    'What song always improves your mood?',
    'What song belongs on every road-trip playlist?',
    'What song gets everyone singing?',
    'What song is impossible not to dance to?',
    'What song would be your entrance music?'
  ]),
  ...group('music', 'genre', [
    'What music genre is best for a party?',
    'What music genre is best for relaxing?',
    'What music genre has the best concerts?',
    'What music genre is most underrated?',
    'What music genre is best for a workout?'
  ]),

  ...group('animals', 'animal_name', [
    'What animal would be funniest if it could talk?',
    'What animal has the coolest name?',
    'What animal would make the best mascot?',
    'What animal seems the most confident?',
    'What animal would win a talent show?',
    'What animal is the most photogenic?'
  ]),
  ...group('animals', 'pet', [
    'What pet would be easiest to care for?',
    'What pet gives the best welcome home?',
    'What pet would be best for a small apartment?',
    'What pet has the biggest personality?',
    'What pet would make the best travel companion?'
  ]),
  ...group('animals', 'wild_animal', [
    'What wild animal would you most like to see?',
    'What wild animal is most impressive?',
    'What wild animal would be the worst surprise indoors?',
    'What wild animal looks the friendliest?',
    'What wild animal would make the best movie star?'
  ]),

  ...group('places', 'country', [
    'What country would you love to visit?',
    'What country has the best food?',
    'What country would be fun to explore by train?',
    'What country has the most beautiful scenery?',
    'What country would you visit for a month?',
    'What country seems best for an adventure?'
  ]),
  ...group('places', 'city', [
    'What city would you like to live in?',
    'What city is perfect for a weekend trip?',
    'What city has the best nightlife?',
    'What city would be fun to explore on foot?',
    'What city has the most recognizable skyline?'
  ]),
  ...group('places', 'vacation_destination', [
    'What vacation destination is worth the trip?',
    'What vacation destination is best for relaxing?',
    'What vacation destination would be fun with friends?',
    'What vacation destination is best in winter?',
    'What vacation destination belongs on a bucket list?'
  ]),

  ...group('relationships', 'age', [
    'What is the best age to start dating?',
    'What is the best age to get married?',
    'What is the best age to move in with a partner?',
    'What is the best age to start a family?',
    'What is the best age to settle down?',
    'What is the best age to meet your closest friends?'
  ]),
  ...group('relationships', 'person_type', [
    'What kind of person makes the best friend?',
    'What kind of person makes a great travel partner?',
    'What kind of person is easiest to trust?',
    'What kind of person makes a great roommate?',
    'What kind of person is fun at a party?'
  ]),
  ...group('relationships', 'activity', [
    'What activity makes a great first date?',
    'What activity is best with close friends?',
    'What activity helps people bond?',
    'What activity makes a fun family day?',
    'What activity is best for meeting new people?'
  ]),

  ...group('everyday_life', 'object', [
    'What object do you always carry?',
    'What object do people lose most often?',
    'What object makes mornings easier?',
    'What object would be hardest to live without?',
    'What object is always useful on a trip?',
    'What object deserves a better design?'
  ]),
  ...group('everyday_life', 'activity', [
    'What activity makes a weekend feel complete?',
    'What activity helps you unwind?',
    'What activity do people put off too long?',
    'What activity is better with music?',
    'What activity makes time pass quickly?'
  ]),
  ...group('everyday_life', 'place', [
    'What place do you visit most often?',
    'What place is best for people-watching?',
    'What place makes you feel productive?',
    'What place is usually too crowded?',
    'What place is best on a rainy day?'
  ]),

  ...group('numbers', 'age', [
    'What is the best age to move out?',
    'What is the best age to get married?',
    'What is the best age to start a family?',
    'What is the best age to change careers?'
  ]),
  ...group('numbers', 'number', [
    'How many alarms should someone set?',
    'How many pillows belong on a bed?',
    'How many close friends is ideal?',
    'How many days should a vacation last?'
  ]),
  ...group('numbers', 'rating', [
    'Rate naps from 1 to 10.',
    'Rate road trips from 1 to 10.',
    'Rate surprise parties from 1 to 10.',
    'Rate working from home from 1 to 10.'
  ]),
  ...group('numbers', 'percentage', [
    'What percent of your photos are worth keeping?',
    'What percent of weekends should be unplanned?',
    'What percent of your wardrobe do you actually wear?',
    'What percent of a vacation should be spent relaxing?'
  ])
];

export function getPromptsByCategory(category: PromptCategory): GamePrompt[] {
  return prompts.filter((prompt) => prompt.category === category);
}

export function getPromptsByAnswerType(
  answerType: string,
  category?: PromptCategory
): GamePrompt[] {
  return prompts.filter((prompt) =>
    prompt.answerType === answerType && (!category || prompt.category === category)
  );
}

export function getRandomPromptPair(recentPromptIds: ReadonlySet<string> = new Set()): PromptPair {
  const category = randomItem(promptCategories);
  const categoryPrompts = getPromptsByCategory(category);
  const answerTypes = [...new Set(categoryPrompts.map((prompt) => prompt.answerType))];
  const answerType = randomItem(answerTypes);
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
