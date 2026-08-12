<template>
  <span class="player-avatar" :title="playerName">
    <img :src="avatarSource" alt="" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { avatarSources, defaultAvatarSource } from '../../data/avatars'

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

const avatarSource = computed(
  () => avatarSources[props.avatarId] ?? defaultAvatarSource
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
