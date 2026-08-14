<template>
  <button class="evidence-card" :class="{ selected }" :style="cardStyle" :aria-label="`Choose ${suspect.name}`" @click="$emit('select')">
    <EvidencePin :id="suspect.id" /><span class="evidence-date">{{ suspect.date }}</span>
    <img :src="suspect.image" alt="" /><strong>{{ suspect.name }}</strong><small v-if="selected">✓ SELECTED</small>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Suspect } from '../../types/evidence-board'
import EvidencePin from './EvidencePin.vue'

const props = defineProps<{ suspect: Suspect; selected: boolean }>()
defineEmits<{ select: [] }>()

const cardStyle = computed(() => ({
  left: `${props.suspect.x}%`,
  top: `${props.suspect.y}%`,
  width: `${props.suspect.width ?? 96}px`,
  '--card-rotation': `${props.suspect.rotation ?? 0}deg`,
}))
</script>
<style scoped>
.evidence-card {
  position: absolute;
  z-index: 3;
  padding: 7px 7px 11px;
  border: 0;
  background: #c9b895;
  color: #16120e;
  box-shadow: 3px 6px 9px #170b0788;
  cursor: pointer;
  transform: rotate(var(--card-rotation));
  transition: transform .16s ease,filter .16s ease,box-shadow .16s ease;
}

.evidence-card:after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid #66503933;
  pointer-events: none;
}

.evidence-card img {
  display: block;
  width: 100%;
  aspect-ratio: .86;
  object-fit: contain;
  background: #6e3c2b;
  filter: sepia(.18);
}

.evidence-card strong {
  display: block;
  margin-top: 6px;
  font: 1.14rem 'Staatliches';
  letter-spacing: .05em;
}

.evidence-card small {
  position: absolute;
  right: 5px;
  bottom: -8px;
  left: 5px;
  padding: 2px;
  background: #9f2923;
  color: #fff;
  font: 11px 'Special Elite';
  letter-spacing: .08em;
}

.evidence-card:hover,.evidence-card.selected {
  z-index: 4;
  transform: translateY(-5px) rotate(0deg) scale(1.06);
}

.evidence-card.selected {
  outline: 3px solid #b32e26;
  box-shadow: 0 0 14px #e13b2e,3px 7px 8px #0009;
}

.evidence-date {
  position: absolute;
  z-index: 3;
  top: 8px;
  right: -13px;
  padding: 3px 5px;
  border: 1px solid #8b632f;
  background: #d0b263;
  color: #4a2d18;
  font: bold .7rem 'Special Elite';
  transform: rotate(7deg);
  box-shadow: 1px 2px 3px #0007;
}

</style>
