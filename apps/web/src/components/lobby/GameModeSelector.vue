<template>
  <section class="mode-selector">
    <h3>Game Modes</h3>
    <div class="modes-grid">
      <button
        v-for="(mode, key) in modes"
        :key="key"
        :class="['mode-tile', { active: selected === key }]"
        @click="$emit('select', key)"
      >
        <strong>{{ mode.name }}</strong>
        <small>{{ mode.description }}</small>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { GAME_MODES } from './gameModes'
const props = defineProps<{ selected?: string }>()
const modes = GAME_MODES
const selected = props.selected ?? ''
</script>

<style scoped>
.modes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.mode-tile {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background: #fff;
  text-align: left;
}
.mode-tile.active {
  border-color: #ef1823;
  box-shadow: 2px 2px 0 #111;
}
.mode-tile small { display:block; color:#666; margin-top:6px }
</style>
