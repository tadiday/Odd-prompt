<template>
  <section class="settings-panel">
    <h3>{{ mode?.name }} Settings</h3>
    <div v-if="mode" class="setting-list">
      <div v-for="schema in mode.settings" :key="schema.key" class="setting-row">
        <label>{{ schema.label }}</label>
        <div>
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
            <option v-for="opt in schema.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
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
.settings-panel { padding: 12px }
.setting-list { display:flex; flex-direction:column; gap:10px }
.setting-row { display:flex; justify-content:space-between; align-items:center }
.setting-row label { font-weight:700 }
.setting-row input, .setting-row select { min-width:120px; padding:6px }
</style>
