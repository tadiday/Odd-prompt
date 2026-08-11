<template>
  <section class="mode-selector">
    <div class="modes-grid">
      <button
        v-for="(mode, key) in modes"
        :key="key"
        :class="['mode-tile', { active: selectedMode === key }]"
        @click="$emit('select', key)"
      >
        <span
          v-if="selectedMode === key"
          class="selected-check"
        >
          ✓
        </span>

        <div class="mode-icon">
          {{ key === 'classic' ? '🏆' : '🤝' }}
        </div>

        <strong>{{ mode.name }}</strong>

        <small>{{ mode.description }}</small>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GAME_MODES } from './gameModes'

const props = defineProps<{
  selected?: string
}>()

defineEmits<{
  select: [mode: string]
}>()

const modes = GAME_MODES

const selectedMode = computed(() => props.selected ?? '')
</script>

<style scoped>
.mode-selector {
  width: 100%;
}

.modes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.mode-tile {
  position: relative;

  min-height: 260px;

  padding: 28px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1.5px solid #cfcfcf;
  border-radius: 13px;

  background: #fff;
  color: #111;

  text-align: center;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.mode-tile:hover {
  transform: translateY(-2px);
  border-color: #999;
}

.mode-tile.active {
  border: 2px solid #ff1022;
  box-shadow: none;
}

.mode-icon {
  margin-bottom: 18px;

  font-size: 3rem;
  line-height: 1;
}

.mode-tile strong {
  font-size: 1.15rem;
  font-weight: 900;
}

.mode-tile small {
  max-width: 190px;

  margin-top: 8px;

  color: #333 !important;

  font-size: 0.8rem;
  line-height: 1.5;
}

.selected-check {
  position: absolute;

  top: 14px;
  right: 14px;

  width: 25px;
  height: 25px;

  display: grid;
  place-items: center;

  border-radius: 50%;

  background: #ff1022;
  color: #fff !important;

  font-size: 0.8rem;
  font-weight: 900;
}

@media (max-width: 600px) {
  .modes-grid {
    grid-template-columns: 1fr;
  }

  .mode-tile {
    min-height: 210px;
  }
}
</style>