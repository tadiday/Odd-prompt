<template>
  <i class="evidence-pin" :class="position" :data-evidence-pin="id"></i>
</template>

<script setup lang="ts">
import type { PinPosition } from '../../types/evidence-board'

withDefaults(defineProps<{
  id: string
  position?: PinPosition
}>(), { position: 'top' })
</script>

<style scoped>
.evidence-pin {
  position: absolute;
  z-index: 2;
  top: -7px;
  left: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #dc5b43, #70150f 60%);
  box-shadow: 1px 3px 3px #0008;
  transform: translateX(-50%);
}

.top-left {
  left: 18px;
}

.top-right {
  right: 18px;
  left: auto;
  transform: none;
}
</style>
