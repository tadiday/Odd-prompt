<template>
  <section class="mode-selector">
    <div class="modes-grid">
      <button
        v-for="(mode, key) in modes"
        :key="key"
        :class="[
          'mode-tile',
          {
            active: selectedMode === key,
            unavailable: mode.disabled
          }
        ]"
        :disabled="mode.disabled"
        @click="$emit('select', key)"
      >
        <span v-if="mode.disabled" class="coming-soon">
          COMING SOON
        </span>

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

  min-height: 225px;

  padding: 28px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1.5px solid #d8d8d8;
  border-radius: 13px;

  background: linear-gradient(180deg, #fff 0%, #fcfcfc 100%);
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
  border-color: #111;
  box-shadow: 0 8px 18px #0000000f;
}

.mode-tile.active {
  border: 2px solid #ff1022;
  background: #fffafa;
  box-shadow: 0 8px 18px #ff102212;
}

.mode-tile.unavailable {
  cursor: not-allowed;
  opacity: 0.58;
}

.mode-tile.unavailable:hover {
  transform: none;
  border-color: #d8d8d8;
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

.coming-soon {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-radius: 999px;
  background: #fff;
  color: #555;
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.05em;
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
