<template>
  <footer class="progressive-footer" aria-label="Game progress">
    <template v-for="(step, index) in steps" :key="step.id">
      <div
        class="progressive-step"
        :class="{
          complete: index < activeIndex,
          active: index === activeIndex
        }"
      >
        <span class="progressive-dot">
          {{ index < activeIndex ? '✓' : '' }}
        </span>
        <span class="progressive-label">{{ step.label }}</span>
      </div>

      <span
        v-if="index < steps.length - 1"
        class="progressive-line"
        :class="{
          complete: index < activeIndex - 1,
          current: index === activeIndex - 1
        }"
      ></span>
    </template>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ProgressivePhase = 'start' | 'answer' | 'discuss' | 'result'

const props = defineProps<{
  activePhase: ProgressivePhase
}>()

const steps: Array<{ id: ProgressivePhase; label: string }> = [
  { id: 'start', label: 'START' },
  { id: 'answer', label: 'ANSWER' },
  { id: 'discuss', label: 'DISCUSS & VOTE' },
  { id: 'result', label: 'RESULT' }
]

const activeIndex = computed(() =>
  steps.findIndex((step) => step.id === props.activePhase)
)
</script>

<style scoped>
.progressive-footer {
  --progress-red: #f02632;
  position: absolute;
  bottom: 28px;
  left: 50%;
  z-index: 2;
  display: flex;
  width: min(1020px, calc(100% - 64px));
  max-width: 1020px;
  align-items: flex-start;
  margin: 0;
  transform: translateX(-50%);
}

.progressive-step {
  display: flex;
  width: 125px;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}

.progressive-dot {
  display: grid;
  width: 15px;
  height: 15px;
  place-items: center;
  border: 2px solid #aaa;
  border-radius: 50%;
  background: #fff;
  color: #fff;
  font-size: 0.55rem;
  font-weight: 900;
  line-height: 1;
}

.progressive-label {
  color: #111;
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.progressive-step.complete .progressive-dot {
  border-color: #111;
  background: #111;
}

.progressive-step.active .progressive-dot {
  border-color: var(--progress-red);
  background: var(--progress-red);
}

.progressive-step.active .progressive-label {
  color: var(--progress-red);
}

.progressive-line {
  flex: 1;
  height: 2px;
  margin-top: 7px;
  background: #ccc;
}

.progressive-line.complete {
  background: #111;
}

.progressive-line.current {
  background: var(--progress-red);
}

@media (max-width: 700px) {
  .progressive-footer {
    position: static;
    width: 100%;
    margin-top: 24px;
    transform: none;
  }

  .progressive-step {
    width: 65px;
  }

  .progressive-label {
    font-size: 0.52rem;
  }
}
</style>
