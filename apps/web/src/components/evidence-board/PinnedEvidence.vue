<template>
  <div class="pinned-evidence" :style="positionStyle">
    <div class="evidence-content"><slot /></div>
    <EvidencePin v-for="position in pins" :id="`${id}-${position}`" :key="position" :position="position" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BoardPosition, PinPosition } from '../../types/evidence-board'
import EvidencePin from './EvidencePin.vue'

const props = withDefaults(defineProps<{ id: string; position: BoardPosition; pins?: PinPosition[] }>(), { pins: () => ['top'] })
const positionStyle = computed(() => ({
  left: `${props.position.x}%`,
  top: `${props.position.y}%`,
  width: props.position.width ? `${props.position.width}px` : undefined,
  transform: `rotate(${props.position.rotation ?? 0}deg)`
}))
</script>

<style scoped>
.pinned-evidence { position: absolute; z-index: 2; }
.evidence-content { position: relative; }
.evidence-content :deep(> *) { position: relative; inset: auto; transform: none; }
</style>
