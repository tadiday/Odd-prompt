import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

interface FixedCanvasOptions {
  width: number
  height: number
  gutter?: number
  scaleProperty: `--${string}`
  observeParent?: boolean
}

export function useFixedCanvasScale({
  width,
  height,
  gutter = 36,
  scaleProperty,
  observeParent = false,
}: FixedCanvasOptions) {
  const viewportElement = ref<HTMLElement | null>(null)
  const scale = ref(1)
  let resizeObserver: ResizeObserver | null = null

  const viewportStyle = computed(() => ({
    [scaleProperty]: scale.value,
    width: `${width * scale.value}px`,
    height: `${height * scale.value}px`,
  }))

  function fitToViewport() {
    const availableWidth = Math.max(0, window.innerWidth - gutter)
    const availableHeight = Math.max(0, window.innerHeight - gutter)
    scale.value = Math.min(1, availableWidth / width, availableHeight / height)
  }

  onMounted(async () => {
    await nextTick()
    fitToViewport()

    if (observeParent && viewportElement.value?.parentElement) {
      resizeObserver = new ResizeObserver(fitToViewport)
      resizeObserver.observe(viewportElement.value.parentElement)
    }

    window.addEventListener('resize', fitToViewport)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    window.removeEventListener('resize', fitToViewport)
  })

  return { viewportElement, viewportStyle }
}
