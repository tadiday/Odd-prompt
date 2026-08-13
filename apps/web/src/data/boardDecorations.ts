import type { BoardDecoration, NewspaperArticle } from '../types/evidence-board'

export const newspaperClippings: NewspaperArticle[] = [
  { id: 'game-updates', eyebrow: 'ODD PROMPT NEWS · LATEST EDITION', title: 'THE CASE FILE JUST GOT BETTER', body: 'NEW: Evidence-board home and lobby.\nIMPROVED: Clearer phases and timers.\nNEXT: More prompts and suspects.', x: 27, y: 58, rotation: 2, variant: 'updates', pins: ['top-left', 'top-right'] },
  { id: 'strange-gathering', eyebrow: 'THE NIGHTLY NEWS', title: 'STRANGE GATHERING BAFFLES LOCALS', body: 'Witnesses report a suspicious game among friends. One account did not match the others.', x: 12, y: 38, rotation: -8, pins: ['top-left', 'top-right'] },
  { id: 'identity-mystery', eyebrow: 'EVENING EDITION', title: 'IDENTITY REMAINS A MYSTERY', body: 'Investigators urge citizens to question every answer.', x: 73, y: 57, rotation: 7, pins: ['top-left', 'top-right'] },
  { id: 'new-clue', eyebrow: 'CASE ARCHIVE', title: 'NEW CLUE FOUND', body: 'Red thread links several unusual suspects.', x: 13, y: 57, rotation: -3, variant: 'small', pins: ['top'] }
]

export const boardDecorations: BoardDecoration[] = [
  { id: 'suspicious', kind: 'sticky', body: 'Looks\nsuspicious...\nor not?', x: 15, y: 15, rotation: -7, pins: ['top'] },
  { id: 'wrong-prompt', kind: 'sticky', body: "One of them\ndoesn't get\nthe real prompt.", x: 76, y: 43, rotation: 9, pins: ['top'] },
  { id: 'status', kind: 'status', title: 'CASE STATUS:', body: 'WAITING FOR AGENTS', x: 5, y: 87, rotation: -2, pins: ['top'] },
  { id: 'case-file', kind: 'case-file', title: 'CASE FILE', body: 'OBJECTIVE:\nFind and vote out\nthe Odd One.', x: 77, y: 20, rotation: 8, pins: ['top'] },
  { id: 'case-note', kind: 'board-note', body: 'Every game is a new case.\nEvery friend could be the odd one.', x: 48, y: 66, rotation: 2, pins: ['top-left', 'top-right'] }
]
