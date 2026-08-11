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
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import LobbyHeader from '../components/lobby/LobbyHeader.vue'
import WaitingLobby from '../components/lobby/WaitingLobby.vue'
import AnswerPhase from '../components/phases/AnswerPhase.vue'
import RevealPhase from '../components/phases/RevealPhase.vue'
import DiscussVotePhase from '../components/phases/DiscussVotePhase.vue'
import ResultsPhase from '../components/phases/ResultsPhase.vue'


const route = useRoute();
const gameStore = useGameStore();
const roomCode = computed(() => String(route.params.roomCode || gameStore.roomCode || 'NEW'));
const roomPlayers = computed(() => gameStore.roomPlayers);
const connectionStatus = computed(() => gameStore.connectionStatus);
const draftAnswer = ref('');

const startGame = () => gameStore.startGame();

watch(() => [gameStore.roomStatus, gameStore.phaseCountdown], ([status, countdown]) => {
  if (status === 'answering' && countdown === 0 && !gameStore.submittedAnswer) {
    gameStore.submitAnswer(draftAnswer.value);
  }
});

const router = useRouter()

function leaveRoom() {
  gameStore.leaveRoom()
  router.push('/')
}

function updateRoomSetting(setting: string, value: number) {
  // widen param type for compatibility with component event signature,
  // then cast to the narrower union expected by the store
  gameStore.updateRoomSetting(setting as any, value);
}
</script>

<style scoped>
:global(body) {
  margin: 0;
  background: #fff;
  color: #111;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
  padding: 24px;
  box-sizing: border-box;
  background: #f3f3f3;
  color: #111;
  overflow: auto;
}

.game-shell {
  display: flex;
  width: 100%;
  max-width: 1600px;
  min-height: calc(100vh - 48px);
  flex-direction: column;
  margin: 0 auto;
  padding: 0 24px 24px;
  box-sizing: border-box;
  overflow: hidden;
  border: 2px solid #111;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 4px 14px #00000014;
}

.header-divider {
  width: calc(100% - 32px);
  height: 2px;
  flex: 0 0 auto;
  margin: 0 auto 18px;
  border-radius: 999px;
  background: #d8d8d8;
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

</style>
