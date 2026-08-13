export interface BoardPosition {
  x: number
  y: number
  rotation?: number
  width?: number
}

export type PinPosition = 'top' | 'top-left' | 'top-right'

export interface Suspect extends BoardPosition {
  id: string
  avatarId: string
  name: string
  image: string
  date: string
}

export interface EvidenceConnection {
  from: string
  to: string
}

export interface NewspaperArticle extends BoardPosition {
  id: string
  eyebrow: string
  title: string
  body: string
  variant?: 'small' | 'regular' | 'updates'
  pins?: PinPosition[]
}

export interface BoardDecoration extends BoardPosition {
  id: string
  kind: 'sticky' | 'status' | 'case-file' | 'board-note'
  title?: string
  body: string
  pins?: PinPosition[]
}
