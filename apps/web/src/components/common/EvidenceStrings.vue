<template>
  <svg
    ref="svgElement"
    class="evidence-strings"
    :viewBox="`0 0 ${boardSize.width} ${boardSize.height}`"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <filter id="thread-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0.6" dy="1.2" stdDeviation="0.8" flood-color="#210504" flood-opacity="0.75" />
      </filter>
    </defs>
    <path
      v-for="path in paths"
      :key="path.key"
      :d="path.d"
      filter="url(#thread-shadow)"
    />
  </svg>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EvidenceConnection } from '../../types/evidence-board'

const props = defineProps<{
  connections: readonly EvidenceConnection[]
}>()

const boardSize = ref({ width: 1, height: 1 })
const paths = ref<Array<{ key: string; d: string }>>([])
const svgElement = ref<SVGSVGElement | null>(null)
let board: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let frame = 0
let transitionFrame = 0

function scheduleMeasure() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

function measureDuringTransition() {
  cancelAnimationFrame(transitionFrame)
  const startedAt = performance.now()
  const update = () => {
    measure()
    if (performance.now() - startedAt < 220) {
      transitionFrame = requestAnimationFrame(update)
    }
  }
  transitionFrame = requestAnimationFrame(update)
}

function pinCenter(id: string, overlayRect: DOMRect) {
  const pin = board?.querySelector<HTMLElement>(`[data-evidence-pin="${CSS.escape(id)}"]`)
  if (!pin) return null

  const rect = pin.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2 - overlayRect.left,
    y: rect.top + rect.height / 2 - overlayRect.top
  }
}

function measure() {
  if (!board || !svgElement.value) return

  const overlayRect = svgElement.value.getBoundingClientRect()
  boardSize.value = { width: overlayRect.width, height: overlayRect.height }
  paths.value = props.connections.flatMap(({ from: fromId, to: toId }, index) => {
    const from = pinCenter(fromId, overlayRect)
    const to = pinCenter(toId, overlayRect)
    if (!from || !to) return []

    const deltaX = to.x - from.x
    const deltaY = to.y - from.y
    const distance = Math.hypot(deltaX, deltaY)
    const horizontalWeight = Math.abs(deltaX) / Math.max(distance, 1)
    const sag = Math.min(
      38,
      Math.max(6, distance * (0.025 + horizontalWeight * 0.035))
    )
    const controlOneX = from.x + deltaX * 0.33
    const controlTwoX = from.x + deltaX * 0.67
    const lowerEndpoint = Math.max(from.y, to.y)
    const controlY = lowerEndpoint + sag

    return [{
      key: `${fromId}-${toId}-${index}`,
      d: `M ${from.x} ${from.y} C ${controlOneX} ${controlY} ${controlTwoX} ${controlY} ${to.x} ${to.y}`
    }]
  })
}

watch(() => props.connections, scheduleMeasure, { deep: true })

onMounted(async () => {
  await nextTick()
  const overlay = svgElement.value
  board = overlay?.closest<HTMLElement>('.evidence-board') ?? null
  if (!board || !overlay) return

  resizeObserver = new ResizeObserver(scheduleMeasure)
  resizeObserver.observe(board)
  resizeObserver.observe(overlay)
  board.querySelectorAll<HTMLElement>('[data-evidence-pin]').forEach((pin) => {
    resizeObserver?.observe(pin)
  })
  mutationObserver = new MutationObserver(measureDuringTransition)
  mutationObserver.observe(board, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  })
  board.addEventListener('transitionrun', measureDuringTransition, true)
  board.addEventListener('transitionend', scheduleMeasure, true)
  board.querySelectorAll('img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', scheduleMeasure, { once: true })
  })
  window.addEventListener('resize', scheduleMeasure)
  scheduleMeasure()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  cancelAnimationFrame(transitionFrame)
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  board?.removeEventListener('transitionrun', measureDuringTransition, true)
  board?.removeEventListener('transitionend', scheduleMeasure, true)
  window.removeEventListener('resize', scheduleMeasure)
})
</script>

<style scoped>
.evidence-strings {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

path {
  fill: none;
  stroke: #8e1718;
  stroke-width: 1.65;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
</style>
