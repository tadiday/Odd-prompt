<template>
  <section class="settings-panel">
    <div class="settings-heading">
      <h3>{{ mode?.name }} Settings</h3>
      <p>Customize the room before starting the game.</p>
    </div>

    <div
      v-if="mode"
      class="setting-list"
    >
      <div
        v-for="schema in mode.settings"
        :key="schema.key"
        class="setting-row"
      >
        <div class="setting-name">
          <label>{{ schema.label }}</label>
        </div>

        <div class="setting-control">
          <input
            v-if="schema.type === 'number'"
            type="number"
            :min="schema.min"
            :max="schema.max"
            :value="getValue(schema.key, schema.default)"
            @change="onNumberChange(schema.key, $event)"
          />

          <select
            v-else-if="schema.type === 'select'"
            :value="getValue(schema.key, schema.default)"
            @change="onSelectChange(schema.key, $event)"
          >
            <option
              v-for="opt in schema.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>

          <input
            v-else-if="schema.type === 'text'"
            type="text"
            :value="getValue(schema.key, schema.default)"
            @input="onTextChange(schema.key, $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameMode } from './gameModes'
import { GAME_MODES } from './gameModes'
const props = defineProps<{ modeKey: string; roomOptions?: any }>()
const emit = defineEmits<{ 'change-setting': [setting: string, value: any] }>()

const mode = computed<GameMode | undefined>(() => GAME_MODES[props.modeKey])

function getValue(key: string, fallback: any) {
  return props.roomOptions?.[key] ?? fallback
}

function onNumberChange(key: string, event: Event) {
  const target = event.target as HTMLInputElement | null
  const raw = target?.value
  if (raw === '' || raw == null) return
  const value = Number(raw)
  if (Number.isNaN(value)) return
  emit('change-setting', key, value)
}

function onSelectChange(key: string, event: Event) {
  const target = event.target as HTMLSelectElement | null
  const value = target?.value
  if (value == null) return
  emit('change-setting', key, value)
}

function onTextChange(key: string, event: Event) {
  const target = event.target as HTMLInputElement | null
  const value = target?.value
  if (value == null) return
  emit('change-setting', key, value)
}
</script>

<style scoped>
.settings-panel {
  width: 100%;
}

.settings-heading {
  margin-bottom: 24px;
}

.settings-heading h3 {
  margin: 0;

  font-size: 1rem;
  font-weight: 900;
}

.settings-heading p {
  margin: 6px 0 0;

  color: #666 !important;
  font-size: 0.78rem;
}

.setting-list {
  display: flex;
  flex-direction: column;
}

.setting-row {
  min-height: 65px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid #ddd;
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-name label {
  font-size: 0.82rem;
  font-weight: 800;
}

.setting-control input,
.setting-control select {
  width: 135px;

  padding: 9px 11px;

  box-sizing: border-box;

  border: 1.5px solid #aaa;
  border-radius: 8px;

  background: #fff;
  color: #111;

  font-size: 0.8rem;

  outline: none;
}

.setting-control input:focus,
.setting-control select:focus {
  border-color: #ff1022;
}
</style>
