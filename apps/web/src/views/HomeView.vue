<template>
  <main class="home-page">
    <div ref="boardViewport" class="board-viewport" :style="boardViewportStyle">
      <EvidenceBoard>
      <header class="home-header">
        <EvidencePin id="header-left" position="top-left" />
        <EvidencePin id="header-right" position="top-right" />
        <div class="header-left">
          <button class="language-button">◎ &nbsp; EN⌄</button>
        </div>
        <div class="header-tools">
          <button aria-label="Help">?</button>
          <button aria-label="Music">♫</button>
          <button aria-label="Sound">◕</button>
        </div>
      </header>
      <EvidenceStrings :connections="evidenceConnections" />

      <div class="case-heading">
        <EvidencePin id="hero-left" position="top-left" />
        <EvidencePin id="hero-right" position="top-right" />
        <span class="stamp">CONFIDENTIAL</span>
        <div class="hero-brand brand">
          <span class="brand-hat">🎩</span>
          <div>
            <h1>ODD <b>PROMPT</b></h1>
            <p>THE PARTY GAME OF <em>HIDDEN IDENTITIES</em></p>
          </div>
        </div>
      </div>

      <EvidenceCard
        v-for="(suspect, index) in suspects"
        :key="suspect.id"
        :suspect="suspect"
        :selected="selectedAvatar === index"
        @select="selectedAvatar = index"
      />

      <section class="operations">
        <article class="operation-note create-note">
          <EvidencePin id="create-left" position="top-left" />
          <EvidencePin id="create-right" position="top-right" />
          <h3>★ &nbsp; CREATE ROOM &nbsp; ★</h3>
          <div class="chosen-agent">
            <img :src="avatars[selectedAvatar].src" alt="" />
            <span>
              SELECTED SUSPECT
              <b>{{ suspectName(avatars[selectedAvatar].name) }}</b>
            </span>
          </div>
          <label for="host-name">AGENT NAME</label>
          <input id="host-name" v-model="hostName" maxlength="20" placeholder="ENTER YOUR NAME" @keyup.enter="createRoom" />
          <button @click="createRoom"><span>♟</span> CREATE ROOM <b>→</b></button>
        </article>
        <article class="operation-note join-note">
          <EvidencePin id="join-left" position="top-left" /><EvidencePin id="join-right" position="top-right" />
          <h3>★ &nbsp; JOIN ROOM &nbsp; ★</h3>
          <label for="player-name">AGENT NAME</label>
          <input id="player-name" v-model="playerName" maxlength="20" placeholder="ENTER YOUR NAME" />
          <label for="room-code">SECRET CODE</label>
          <input id="room-code" v-model="roomCode" maxlength="6" placeholder="ENTER ROOM CODE" @keyup.enter="joinRoom" />
          <button @click="joinRoom">JOIN ROOM <b>→</b></button>
        </article>
      </section>

      <aside
        class="how-to-note taped-action"
        role="button"
        tabindex="0"
        @click="toggleGuide"
        @keydown.enter="toggleGuide"
        @keydown.space.prevent="toggleGuide"
      >
        <i aria-hidden="true"></i>
        <span>HOW TO PLAY</span>
        <b>Open the case briefing →</b>
      </aside>
      <aside v-if="showGuide" class="guide-note">
        <button aria-label="Close guide" @click="showGuide = false">×</button>
        <h3>HOW TO PLAY</h3>
        <p><b>01</b> Get a prompt. One agent gets something different.</p>
        <p><b>02</b> Answer and discuss without revealing your prompt.</p>
        <p><b>03</b> Vote for the agent you think is the Odd One.</p>
      </aside>
      <BoardNote v-for="note in boardDecorations" :key="note.id" :note="note" />
      <NewspaperClipping v-for="article in newspaperClippings" :key="article.id" :article="article" />
      <div v-if="gameStore.errorMessage" class="alert" role="alert">{{ gameStore.errorMessage }}</div>
      </EvidenceBoard>
    </div>

    <footer><nav><a href="#">PRIVACY</a><a href="#">CONTACT</a></nav></footer>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { avatars } from '../data/avatars'
import EvidenceStrings from '../components/common/EvidenceStrings.vue'
import EvidenceBoard from '../components/evidence-board/EvidenceBoard.vue'
import EvidenceCard from '../components/evidence-board/EvidenceCard.vue'
import NewspaperClipping from '../components/evidence-board/NewspaperClipping.vue'
import BoardNote from '../components/evidence-board/BoardNote.vue'
import EvidencePin from '../components/evidence-board/EvidencePin.vue'
import { suspects } from '../data/suspects'
import { evidenceConnections } from '../data/connections'
import { boardDecorations, newspaperClippings } from '../data/boardDecorations'

const router = useRouter()
const gameStore = useGameStore()
const selectedAvatar = ref(0)
const hostName = ref('')
const playerName = ref('')
const roomCode = ref('')
const showGuide = ref(false)
const boardViewport = ref<HTMLElement | null>(null)
const boardScale = ref(1)
const BOARD_WIDTH = 1360
const BOARD_HEIGHT = 920
const VIEWPORT_GUTTER = 36
let boardResizeObserver: ResizeObserver | null = null

const boardViewportStyle = computed(() => ({
  '--board-scale': boardScale.value,
  width: `${BOARD_WIDTH * boardScale.value}px`,
  height: `${BOARD_HEIGHT * boardScale.value}px`,
}))

function fitBoardToViewport() {
  const availableWidth = Math.max(0, window.innerWidth - VIEWPORT_GUTTER)
  const availableHeight = Math.max(0, window.innerHeight - VIEWPORT_GUTTER)
  boardScale.value = Math.min(1, availableWidth / BOARD_WIDTH, availableHeight / BOARD_HEIGHT)
}

onMounted(async () => {
  await nextTick()
  fitBoardToViewport()
  boardResizeObserver = new ResizeObserver(fitBoardToViewport)
  if (boardViewport.value?.parentElement) boardResizeObserver.observe(boardViewport.value.parentElement)
  window.addEventListener('resize', fitBoardToViewport)
})

onBeforeUnmount(() => {
  boardResizeObserver?.disconnect()
  window.removeEventListener('resize', fitBoardToViewport)
})

function suspectName(name: string) {
  return name.replace(/^Cool /, '').toUpperCase()
}

watch(
  () => gameStore.roomCode,
  (code) => {
    if (code) router.push(`/lobby/${code}`)
  },
)

function toggleGuide() {
  showGuide.value = !showGuide.value
}

function createRoom() {
  const name = hostName.value.trim()
  if (!name) {
    gameStore.errorMessage = 'Enter your agent name'
    return
  }

  gameStore.createRoom(name, avatars[selectedAvatar.value].id)
}

function joinRoom() {
  const name = playerName.value.trim()
  if (!name) {
    gameStore.errorMessage = 'Enter your agent name'
    return
  }

  const code = roomCode.value.trim().toUpperCase()
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    gameStore.errorMessage = 'Room codes must be 6 letters or numbers'
    return
  }

  gameStore.joinRoom(code, name, avatars[selectedAvatar.value].id)
}
</script>

<style scoped src="../styles/home.css"></style>
