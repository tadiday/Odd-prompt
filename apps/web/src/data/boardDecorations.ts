import type { BoardDecoration, NewspaperArticle } from '../types/evidence-board'

export const newspaperClippings: NewspaperArticle[] = [
  { id: 'game-updates', eyebrow: 'ODD ONE NEWS', title: 'THE CASE FILE JUST GOT BETTER', body: 'Sharper clues.\nNew suspects.', x: 27, y: 58, rotation: 2, variant: 'updates', pins: ['top-left', 'top-right'] },
  { id: 'strange-gathering', eyebrow: 'THE NIGHTLY NEWS', title: 'STRANGE GATHERING BAFFLES LOCALS', body: 'Locals report suspicious\nbehavior among friends.', x: 12, y: 38, rotation: -8, pins: ['top-left', 'top-right'] },
  { id: 'identity-mystery', eyebrow: 'EVENING EDITION', title: 'IDENTITY REMAINS A MYSTERY', body: 'Every answer raises\na new question.', x: 73, y: 57, rotation: 7, pins: ['top-left', 'top-right'] },
  { id: 'new-clue', eyebrow: 'CASE ARCHIVE', title: 'NEW CLUE FOUND', body: 'Red thread links\nseveral suspects.', x: 13, y: 57, rotation: -3, variant: 'small', pins: ['top'] }
]

export const boardDecorations: BoardDecoration[] = [
  { id: 'suspicious', kind: 'sticky', body: 'Looks\nsuspicious...', x: 15, y: 15, rotation: -7, pins: ['top'] },
  { id: 'wrong-prompt', kind: 'sticky', body: 'Who got\nthe real prompt?', x: 76, y: 43, rotation: 9, pins: ['top'] },
  { id: 'status', kind: 'status', title: 'CASE STATUS:', body: 'WAITING FOR AGENTS', x: 5, y: 87, rotation: -2, pins: ['top'] },
  { id: 'case-file', kind: 'case-file', title: 'CASE FILE', body: 'OBJECTIVE:\nFind the Odd One.', x: 77, y: 20, rotation: 8, pins: ['top'] },
  { id: 'case-note', kind: 'board-note', body: 'Every case hides one odd friend.', x: 48, y: 69, rotation: 2, pins: ['top-left', 'top-right'] }
]
