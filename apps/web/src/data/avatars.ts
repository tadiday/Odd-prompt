import coolBear from '../assets/avatars/cool-bear.png'
import coolCat from '../assets/avatars/cool-cat.png'
import coolCow from '../assets/avatars/cool-cow.png'
import coolDog from '../assets/avatars/cool-dog.png'
import coolFox from '../assets/avatars/cool-fox.png'
import coolLion from '../assets/avatars/cool-lion.png'
import coolMouse from '../assets/avatars/cool-mouse.png'
import coolOwl from '../assets/avatars/cool-owl.png'
import coolPanda from '../assets/avatars/cool-panda.png'
import coolParrot from '../assets/avatars/cool-parrot.png'
import coolRabbit from '../assets/avatars/cool-rabbit.png'
import coolShiba from '../assets/avatars/cool-shiba.png'

export interface AvatarOption {
  id: string
  name: string
  src: string
}

export const avatars: AvatarOption[] = [
  { id: 'cool-cat', name: 'Cool cat', src: coolCat },
  { id: 'cool-dog', name: 'Cool dog', src: coolDog },
  { id: 'cool-panda', name: 'Cool panda', src: coolPanda },
  { id: 'cool-mouse', name: 'Cool mouse', src: coolMouse },
  { id: 'cool-parrot', name: 'Cool parrot', src: coolParrot },
  { id: 'cool-bear', name: 'Cool bear', src: coolBear },
  { id: 'cool-rabbit', name: 'Cool rabbit', src: coolRabbit },
  { id: 'cool-fox', name: 'Cool fox', src: coolFox },
  { id: 'cool-shiba', name: 'Cool shiba', src: coolShiba },
  { id: 'cool-lion', name: 'Cool lion', src: coolLion },
  { id: 'cool-cow', name: 'Cool cow', src: coolCow },
  { id: 'cool-owl', name: 'Cool owl', src: coolOwl }
]

export const avatarSources = Object.fromEntries(
  avatars.map(({ id, src }) => [id, src])
) as Record<string, string>

export const defaultAvatarSource = coolCat

