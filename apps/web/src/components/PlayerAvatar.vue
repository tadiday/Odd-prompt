<template>
  <span class="player-avatar" :title="playerName">
    <img :src="avatarSource" alt="" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import coolCat from '../assets/avatars/cool-cat.png'
import coolDog from '../assets/avatars/cool-dog.png'
import coolPanda from '../assets/avatars/cool-panda.png'
import coolMouse from '../assets/avatars/cool-mouse.png'
import coolParrot from '../assets/avatars/cool-parrot.png'
import coolBear from '../assets/avatars/cool-bear.png'
import coolRabbit from '../assets/avatars/cool-rabbit.png'
import coolFox from '../assets/avatars/cool-fox.png'
import coolShiba from '../assets/avatars/cool-shiba.png'
import coolLion from '../assets/avatars/cool-lion.png'
import coolCow from '../assets/avatars/cool-cow.png'
import coolOwl from '../assets/avatars/cool-owl.png'

const props = withDefaults(
  defineProps<{
    avatarId?: string
    playerName?: string
  }>(),
  {
    avatarId: 'cool-cat',
    playerName: 'Player'
  }
)

const avatarSources: Record<string, string> = {
  'cool-cat': coolCat,
  'cool-dog': coolDog,
  'cool-panda': coolPanda,
  'cool-mouse': coolMouse,
  'cool-parrot': coolParrot,
  'cool-bear': coolBear,
  'cool-rabbit': coolRabbit,
  'cool-fox': coolFox,
  'cool-shiba': coolShiba,
  'cool-lion': coolLion,
  'cool-cow': coolCow,
  'cool-owl': coolOwl
}

const avatarSource = computed(
  () => avatarSources[props.avatarId] ?? coolCat
)
</script>

<style scoped>
.player-avatar {
  display: inline-grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border: 2px solid #111;
  border-radius: 50%;
  background: #fff7f7;
}

.player-avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
