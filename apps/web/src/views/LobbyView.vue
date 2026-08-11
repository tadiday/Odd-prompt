<template>
  <main class="lobby-page">

    <LobbyHeader
      :connection-status="connectionStatus"
    />

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

    <DiscussionPhase
      v-else-if="gameStore.roomStatus === 'discussion'"
    />

    <VotingPhase
      v-else-if="gameStore.roomStatus === 'voting'"
    />
    <ResultsPhase
      v-else-if="gameStore.roomStatus === 'results'"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGameStore } from '../stores/game';
import LobbyHeader from '../components/lobby/LobbyHeader.vue'
import WaitingLobby from '../components/lobby/WaitingLobby.vue'
import AnswerPhase from '../components/phases/AnswerPhase.vue'
import RevealPhase from '../components/phases/RevealPhase.vue'
import DiscussionPhase from '../components/phases/DiscussionPhase.vue'
import VotingPhase from '../components/phases/VotingPhase.vue'
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

:global(button),
:global(input),
:global(textarea) {
  font: inherit;
}

.lobby-page {
  color: #111;
}

.lobby-page h1,
.lobby-page h2,
.lobby-page h3,
.lobby-page h4,
.lobby-page p,
.lobby-page span,
.lobby-page strong,
.lobby-page small,
.lobby-page label,
.lobby-page .brand-title,
.lobby-page .brand-subtitle,
.lobby-page .connection-text,
.lobby-page .room-code-block span,
.lobby-page .waiting-banner h2,
.lobby-page .waiting-banner p,
.lobby-page .players-header h3,
.lobby-page .player-name,
.lobby-page .side-section h2,
.lobby-page .setting-row,
.lobby-page .setting-row span,
.lobby-page .setting-row strong,
.lobby-page .info-message {
  color: #111 !important;
}


.lobby-shell {
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(310px, 0.88fr);
  gap: 18px;
  align-items: stretch;
}

.lobby-card,
.side-card,
.game-card {
  background: #fff;
  border: 3px solid #111;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 6px 6px 0 rgba(17, 17, 17, 0.08);
}

.room-topbar {
  min-height: 82px;
  border-bottom: 3px solid #111;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 0 22px;
}
</style>