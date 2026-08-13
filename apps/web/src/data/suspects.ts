import { avatars } from './avatars'
import type { Suspect } from '../types/evidence-board'

const positions = [
  { x: 1, y: 18, rotation: -8, width: 103 },
  { x: 90.5, y: 20, rotation: 7, width: 92 },
  { x: 3.5, y: 43, rotation: 5, width: 89 },
  { x: 87.5, y: 46, rotation: -6, width: 101 },
  { x: 1, y: 68, rotation: -9, width: 98 },
  { x: 89, y: 70, rotation: 8, width: 105 },
  { x: 18, y: 82, rotation: 7, width: 91 },
  { x: 29.5, y: 78, rotation: -8, width: 102 },
  { x: 43, y: 83, rotation: 4, width: 96 },
  { x: 56, y: 76, rotation: -7, width: 88 },
  { x: 68.5, y: 82, rotation: 6, width: 104 },
  { x: 82, y: 79, rotation: -6, width: 94 }
]

const dates = ['07 MAY', '09 MAY', '11 MAY', '12 MAY', '14 MAY', '15 MAY', '17 MAY', '18 MAY', '20 MAY', '21 MAY', '23 MAY', '24 MAY']

export const suspects: Suspect[] = avatars.map((avatar, index) => ({
  id: avatar.id.replace(/^cool-/, ''),
  avatarId: avatar.id,
  name: avatar.name.replace(/^Cool /, '').toUpperCase(),
  image: avatar.src,
  date: dates[index],
  ...positions[index]
}))
