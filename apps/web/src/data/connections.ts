import type { EvidenceConnection } from '../types/evidence-board'

export const evidenceConnections: EvidenceConnection[] = [
  ['header-left', 'hero-left'], ['header-right', 'hero-right'],
  ['hero-left', 'create-left'], ['hero-right', 'join-right'],
  ['create-right', 'join-left'],
  ['cat', 'rabbit'], ['cat', 'panda'], ['panda', 'parrot'], ['parrot', 'rabbit'],
  ['rabbit', 'fox'], ['fox', 'panda'], ['fox', 'shiba'], ['shiba', 'lion'],
  ['lion', 'cow'], ['cow', 'owl'], ['dog', 'mouse'], ['mouse', 'bear'],
  ['bear', 'owl'], ['mouse', 'cow'], ['bear', 'lion'], ['rabbit', 'shiba'], ['fox', 'lion']
].map(([from, to]) => ({ from, to }))
