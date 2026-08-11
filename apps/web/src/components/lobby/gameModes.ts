export type SettingSchema =
  | { key: string; label: string; type: 'number'; min?: number; max?: number; default: number }
  | { key: string; label: string; type: 'select'; options: Array<{ label: string; value: string | number }>; default: string | number }
  | { key: string; label: string; type: 'text'; default: string }

export interface GameMode {
  id: string;
  name: string;
  description?: string;
  disabled?: boolean;
  settings: SettingSchema[];
}

export const GAME_MODES: Record<string, GameMode> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Standard play with timers and imposters',
    settings: [
      { key: 'maxPlayers', label: 'Max Players', type: 'number', min: 4, max: 12, default: 8 },
      { key: 'answerTimerSeconds', label: 'Answer Time (sec)', type: 'number', min: 10, max: 120, default: 30 },
      { key: 'votingTimerSeconds', label: 'Voting Time (sec)', type: 'number', min: 10, max: 120, default: 45 },
      { key: 'imposterCount', label: 'Imposters', type: 'number', min: 1, max: 3, default: 1 }
    ]
  },

  coop: {
    id: 'coop',
    name: 'Co-op',
    description: 'Cooperative mode with shared prompts',
    disabled: true,
    settings: [
      { key: 'maxPlayers', label: 'Max Players', type: 'number', min: 2, max: 8, default: 4 },
      { key: 'answerTimerSeconds', label: 'Drawing Time (sec)', type: 'number', min: 10, max: 300, default: 60 },
      { key: 'rounds', label: 'Rounds', type: 'number', min: 1, max: 10, default: 5 }
    ]
  }
}

export const DEFAULT_MODE = 'classic'
