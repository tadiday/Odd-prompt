<template>
  <main class="lobby-page">
    <section class="game-shell">

    <LobbyHeader
      :connection-status="connectionStatus"
      @leave="leaveRoom"
    />

    <div class="header-divider" aria-hidden="true"></div>

    <WaitingLobby
      v-if="gameStore.roomStatus === 'waiting'"
      :room-code="roomCode"
      :players="roomPlayers"
      :current-player-id="gameStore.currentPlayer?.id"
      :is-host="gameStore.isHost"
      :error-message="gameStore.errorMessage"
      @start="startGame"
      @changeSetting="updateRoomSetting"
    />

    <AnswerPhase
      v-else-if="gameStore.roomStatus === 'answering'"
    />

    <RevealPhase
      v-else-if="gameStore.roomStatus === 'reveal'"
    />

    <DiscussVotePhase
      v-else-if="gameStore.roomStatus === 'discussion' || gameStore.roomStatus === 'voting'"
    />
    <ResultsPhase
      v-else-if="gameStore.roomStatus === 'results'"
    />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import LobbyHeader from '../components/lobby/LobbyHeader.vue'
import WaitingLobby from '../components/lobby/WaitingLobby.vue'
import AnswerPhase from '../components/game/AnswerPhase.vue'
import RevealPhase from '../components/game/RevealPhase.vue'
import DiscussVotePhase from '../components/game/DiscussVotePhase.vue'
import ResultsPhase from '../components/game/ResultsPhase.vue'
import type { RoomSetting } from '@odd-prompt/shared'


const route = useRoute();
const gameStore = useGameStore();
const roomCode = computed(() => String(route.params.roomCode || gameStore.roomCode || 'NEW'));
const roomPlayers = computed(() => gameStore.roomPlayers);
const connectionStatus = computed(() => gameStore.connectionStatus);

const startGame = () => gameStore.startGame();

const router = useRouter()

onBeforeRouteLeave(() => {
  gameStore.leaveRoom()
})

function leaveRoom() {
  router.push('/')
}

function updateRoomSetting(setting: RoomSetting, value: string | number) {
  gameStore.updateRoomSetting(setting, value);
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
  height: 100vh;
  min-height: 100vh;
  width: 100%;
  display: flex;
  padding: 0 18px 12px;
  box-sizing: border-box;
  background: radial-gradient(circle at 50% 0, #4a3420 0, transparent 25%), radial-gradient(#76523718 1px, transparent 1px), #090a08;
  background-size: auto, 7px 7px;
  color: #d9cbb4;
  overflow: auto;
}

.game-shell {
  position: relative;
  display: flex;
  width: 100%;
  max-width: var(--case-board-width);
  min-height: 100vh;
  flex-direction: column;
  margin: 0 auto;
  padding: 0 10px 12px;
  box-sizing: border-box;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.header-divider {
  width: calc(100% - 32px);
  height: 2px;
  flex: 0 0 auto;
  margin: 0 auto 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #84211c, transparent);
}

@media (max-width: 700px) {
  .lobby-page {
    padding: 10px;
  }

  .game-shell {
    min-height: calc(100vh - 20px);
    padding: 0 10px 10px;
    overflow: visible;
    border-radius: 14px;
  }
}

.header-divider {
  display: none;
}

</style>
