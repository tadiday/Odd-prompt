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
        <div class="header-brand brand" aria-label="The Odd One">
          <span class="brand-hat" aria-hidden="true">🎩</span>
          <div>
            <h1>THE <b>ODD ONE</b></h1>
            <p>THE PARTY GAME OF <em>HIDDEN IDENTITIES</em></p>
          </div>
        </div>
        <div class="header-tools">
          <button aria-label="Help">?</button>
          <button aria-label="Music">♫</button>
          <button aria-label="Sound">◕</button>
        </div>
      </header>
      <EvidenceStrings :connections="evidenceConnections" />

      <EvidenceCard
        v-for="(suspect, index) in suspects"
        :key="suspect.id"
        :suspect="suspect"
        :selected="selectedAvatar === index"
        @select="selectedAvatar = index"
      />

      <section class="operations">
        <span class="case-file-number">CASE FILE NO. 95</span>
        <aside class="case-dossier">
          <i class="dossier-paperclip" aria-hidden="true"></i>
          <h2 class="folder-sheet-title">EVIDENCE SHEET</h2>
          <small class="dossier-reference">REF: OD-0095</small>
          <span class="dossier-eyebrow">SELECTED SUSPECT</span>
          <div class="dossier-photo">
            <img :src="avatars[selectedAvatar].src" alt="" />
            <strong>{{ suspectName(avatars[selectedAvatar].name) }}</strong>
          </div>
          <span class="dossier-annotation" aria-hidden="true">check alibi?<i>↙</i></span>
          <p>Primary agent assigned to this investigation.</p>
        </aside>

        <div class="room-form-area">
          <div class="room-tabs" role="tablist" aria-label="Room action">
            <button
              id="create-room-tab"
              type="button"
              role="tab"
              :aria-selected="activeRoomForm === 'create'"
              :class="{ active: activeRoomForm === 'create' }"
              @click="activeRoomForm = 'create'"
            >CREATE ROOM</button>
            <button
              id="join-room-tab"
              type="button"
              role="tab"
              :aria-selected="activeRoomForm === 'join'"
              :class="{ active: activeRoomForm === 'join' }"
              @click="activeRoomForm = 'join'"
            >JOIN ROOM</button>
          </div>

          <Transition name="paper-swap" mode="out-in">
            <article
              v-if="activeRoomForm === 'create'"
              key="create"
              class="operation-note create-note"
              role="tabpanel"
              aria-labelledby="create-room-tab"
            >
              <h2 class="folder-sheet-title">CREATE ROOM</h2>
              <div class="intake-meta"><span>CASE: ODD ONE</span><span>DATE: 08/14/26</span></div>
              <label for="host-name">AGENT NAME</label>
              <input id="host-name" v-model="hostName" maxlength="20" placeholder="ENTER YOUR NAME" @keyup.enter="createRoom" />
              <span class="create-confidential" aria-hidden="true">CONFIDENTIAL</span>
              <button @click="createRoom"><span>♟</span> CREATE ROOM <b>→</b></button>
            </article>
            <article
              v-else
              key="join"
              class="operation-note join-note"
              role="tabpanel"
              aria-labelledby="join-room-tab"
            >
              <h2 class="folder-sheet-title">JOIN ROOM</h2>
              <div class="intake-meta"><span>CASE: ODD ONE</span><span>DATE: 08/14/26</span></div>
              <label for="player-name">AGENT NAME</label>
              <input id="player-name" v-model="playerName" maxlength="20" placeholder="ENTER YOUR NAME" />
              <label for="room-code">SECRET CODE</label>
              <input id="room-code" v-model="roomCode" maxlength="6" placeholder="ENTER ROOM CODE" @keyup.enter="joinRoom" />
              <button @click="joinRoom">JOIN ROOM <b>→</b></button>
            </article>
          </Transition>
        </div>
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
import { ref, watch } from 'vue'
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
import { useFixedCanvasScale } from '../composables/useFixedCanvasScale'

const router = useRouter()
const gameStore = useGameStore()
const selectedAvatar = ref(0)
const hostName = ref('')
const playerName = ref('')
const roomCode = ref('')
const showGuide = ref(false)
const activeRoomForm = ref<'create' | 'join'>('create')
const {
  viewportElement: boardViewport,
  viewportStyle: boardViewportStyle,
} = useFixedCanvasScale({
  width: 1360,
  height: 920,
  scaleProperty: '--board-scale',
  observeParent: true,
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
