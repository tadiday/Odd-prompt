<template>
  <main class="lobby-page">
    <div class="lobby-viewport" :style="lobbyViewportStyle">
      <section class="game-shell">
        <LobbyHeader :connection-status="connectionStatus" @leave="leaveRoom" />

        <WaitingLobby
          v-if="gameStore.roomStatus === 'waiting'"
          :room-code="roomCode"
          :players="roomPlayers"
          :current-player-id="gameStore.currentPlayer?.id"
          :is-host="gameStore.isHost"
          :error-message="gameStore.errorMessage"
          @start="startGame"
          @change-setting="updateRoomSetting"
        />

        <AnswerPhase v-else-if="gameStore.roomStatus === 'answering'" />
        <RevealPhase v-else-if="gameStore.roomStatus === 'reveal'" />
        <DiscussVotePhase
          v-else-if="gameStore.roomStatus === 'discussion' || gameStore.roomStatus === 'voting'"
        />
        <ResultsPhase v-else-if="gameStore.roomStatus === 'results'" />
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { RoomSetting } from '@odd-prompt/shared'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import LobbyHeader from '../components/lobby/LobbyHeader.vue'
import WaitingLobby from '../components/lobby/WaitingLobby.vue'
import AnswerPhase from '../components/game/AnswerPhase.vue'
import RevealPhase from '../components/game/RevealPhase.vue'
import DiscussVotePhase from '../components/game/DiscussVotePhase.vue'
import ResultsPhase from '../components/game/ResultsPhase.vue'
import { useGameStore } from '../stores/gameStore'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const roomCode = computed(() => String(route.params.roomCode || gameStore.roomCode || 'NEW'))
const roomPlayers = computed(() => gameStore.roomPlayers)
const connectionStatus = computed(() => gameStore.connectionStatus)
const lobbyScale = ref(1)
const BOARD_WIDTH = 1360
const BOARD_HEIGHT = 920
const VIEWPORT_GUTTER = 36

const lobbyViewportStyle = computed(() => ({
  '--lobby-scale': lobbyScale.value,
  width: `${BOARD_WIDTH * lobbyScale.value}px`,
  height: `${BOARD_HEIGHT * lobbyScale.value}px`,
}))

function fitLobbyToViewport() {
  const availableWidth = Math.max(0, window.innerWidth - VIEWPORT_GUTTER)
  const availableHeight = Math.max(0, window.innerHeight - VIEWPORT_GUTTER)
  lobbyScale.value = Math.min(1, availableWidth / BOARD_WIDTH, availableHeight / BOARD_HEIGHT)
}

onMounted(() => {
  fitLobbyToViewport()
  window.addEventListener('resize', fitLobbyToViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', fitLobbyToViewport)
})

const startGame = () => gameStore.startGame()

onBeforeRouteLeave(() => {
  gameStore.leaveRoom()
})

function leaveRoom() {
  router.push('/')
}

function updateRoomSetting(setting: RoomSetting, value: string | number) {
  gameStore.updateRoomSetting(setting, value)
}
</script>

<style scoped>
:global(body) {
  margin: 0;
  background: #080806;
  color: #d9cbb4;
}

:global(html),
:global(body),
:global(#app) {
  height: 100%;
  overflow: hidden;
}

:global(button),
:global(input),
:global(textarea) {
  font: inherit;
}

.lobby-page {
  height: 100dvh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  box-sizing: border-box;
  background: radial-gradient(circle at 50% 0, #4a3420 0, transparent 25%), radial-gradient(#76523718 1px, transparent 1px), #090a08;
  background-size: auto, 7px 7px;
  color: #d9cbb4;
  overflow: hidden;
}

.lobby-viewport {
  position: relative;
  flex: none;
}

.game-shell {
  position: relative;
  display: flex;
  width: 1360px;
  max-width: none;
  height: 920px;
  min-height: 0;
  flex-direction: column;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  transform: scale(var(--lobby-scale));
  transform-origin: top left;
}

</style>
