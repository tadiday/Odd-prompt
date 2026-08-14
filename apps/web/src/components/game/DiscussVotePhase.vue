<template>
  <section class="phase-shell">
    <div class="top-row">
      <p>DISCUSS with your friends and then vote for the imposter!</p>
      <div class="timers">
        <div :class="{ muted: canVote }">
          <small>DISCUSSION<br />TIME LEFT</small>
          <strong>◷ {{ canVote ? '00:00' : formattedCountdown }}</strong>
        </div>
        <div class="red">
          <small>VOTING<br />TIME LEFT</small>
          <strong>◷ {{ canVote ? formattedCountdown : '--:--' }}</strong>
        </div>
      </div>
    </div>
    <h1>{{ actualPrompt }}</h1>
    <p class="prompt-kind">(Actual Prompt)</p>

    <div class="phase-layout">
      <section class="answers-panel">
        <h2>ANSWERS</h2>
        <div v-if="!revealAnswers.length" class="empty-state">
          Waiting for answers…
        </div>
        <div v-else class="answer-list">
          <article v-for="answer in revealAnswers" :key="answer.playerId">
            <PlayerAvatar
              :avatar-id="getPlayer(answer.playerId)?.avatarId"
              :player-name="getPlayerName(answer.playerId)"
            />
            <strong>
              {{ getPlayerName(answer.playerId) }}
              <em v-if="answer.playerId === gameStore.currentPlayer?.id">(You)</em>
            </strong>
            <p>{{ answer.content || 'No answer.' }}</p>
          </article>
        </div>
      </section>

      <aside class="vote-panel">
        <h2>WHO IS THE IMPOSTER?</h2>
        <p>Vote for the player you think had a different prompt!</p>
        <button
          v-for="player in eligiblePlayers"
          :key="player.id"
          :class="{
            selected: selectedVote === player.id,
            submitted: gameStore.submittedVote === player.id
          }"
          :disabled="!canVote"
          @click="selectedVote = player.id"
        >
          <PlayerAvatar
            :avatar-id="player.avatarId"
            :player-name="player.username"
          />
          <strong>{{ player.username }}</strong>
          <span v-if="gameStore.submittedVote === player.id">Current vote</span>
          <i></i>
        </button>
        <button
          class="submit"
          :disabled="
            !canVote ||
            !selectedVote ||
            isSubmitting ||
            selectedVote === gameStore.submittedVote
          "
          @click="submitVote"
        >
          {{ submitButtonLabel }}
        </button>
        <button
          class="skip"
          :disabled="!canVote || isSubmitting || gameStore.submittedVote === 'skip'"
          @click="skipVote"
        >
          {{ gameStore.submittedVote === 'skip' ? 'SKIP SUBMITTED ✓' : 'SKIP VOTE' }}
        </button>
      </aside>
    </div>

    <ProgressiveFooter active-phase="discuss" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import ProgressiveFooter from './ProgressiveFooter.vue'
import PlayerAvatar from '../common/PlayerAvatar.vue'
const gameStore = useGameStore()
const selectedVote = ref<string | null>(null)
const isSubmitting = ref(false)
const revealAnswers = computed(() => gameStore.revealAnswers ?? [])
const canVote = computed(() => gameStore.roomStatus === 'voting')
const actualPrompt = computed(
  () =>
    gameStore.revealedPrompts?.actualPrompt ??
    gameStore.currentPlayerPrompt?.prompt ??
    'Waiting for the actual prompt…'
)
const formattedCountdown = computed(() => {
  const seconds = gameStore.phaseCountdown ?? 0
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const remainingSeconds = String(seconds % 60).padStart(2, '0')

  return `${minutes}:${remainingSeconds}`
})
const eligiblePlayers = computed(() =>
  gameStore.roomPlayers.filter(
    (player) => player.id !== gameStore.currentPlayer?.id
  )
)
const submitButtonLabel = computed(() => {
  if (isSubmitting.value) {
    return 'SUBMITTING…'
  }

  if (selectedVote.value && selectedVote.value === gameStore.submittedVote) {
    return 'VOTE SUBMITTED ✓'
  }

  return gameStore.submittedVote ? 'UPDATE VOTE' : 'SUBMIT VOTE'
})

function getPlayerName(id: string) {
  return getPlayer(id)?.username ?? id
}

function getPlayer(id: string) {
  return gameStore.roomPlayers.find((player) => player.id === id)
}

function submitVote() {
  if (canVote.value && selectedVote.value) {
    isSubmitting.value = true
    gameStore.submitVote(selectedVote.value)
  }
}

function skipVote() {
  if (canVote.value) {
    isSubmitting.value = true
    selectedVote.value = null
    gameStore.skipVote()
  }
}

watch(
  () => gameStore.roomStatus,
  (status) => {
    if (status === 'discussion') {
      selectedVote.value = null
    }
  }
)

watch(
  () => gameStore.submittedVote,
  (submittedVote) => {
    isSubmitting.value = false
    selectedVote.value = submittedVote === 'skip' ? null : submittedVote
  }
)
</script>

<style scoped>
.phase-shell {
  --red: #f02632;
  position: relative;
  width: 100%;
  max-width: 1600px;
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  padding: 30px 48px 105px;
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #111;
  box-shadow: none;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-row > p {
  font-size: 0.95rem;
  font-weight: 800;
}

.timers {
  display: flex;
  gap: 14px;
}

.timers > div {
  min-width: 128px;
  padding: 11px 14px;
  border: 3px solid #111;
  border-radius: 11px;
  text-align: center;
}

.timers .red {
  border-color: var(--red);
}

.timers .muted {
  opacity: 0.5;
}

.timers small {
  display: block;
  font-size: 0.65rem;
  font-weight: 900;
  line-height: 1.1;
}

.timers strong {
  display: block;
  margin-top: 5px;
  font-size: 1.2rem;
}

.phase-shell > h1 {
  margin: 12px 0 0;
  text-align: center;
  font-size: 1.65rem;
}

.prompt-kind {
  margin: 4px 0 18px;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
}

.phase-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(330px, 0.75fr);
  gap: 26px;
}

.answers-panel > h2, .vote-panel > h2 {
  margin: 0 0 12px;
  font-size: 0.88rem;
}

.answer-list {
  display: grid;
  gap: 10px;
}

.answer-list article {
  display: grid;
  grid-template-columns: 44px 190px 1fr;
  align-items: center;
  min-height: 58px;
  padding: 8px 13px;
  border: 3px solid #ddd;
  border-radius: 9px;
}

.avatar {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 3px solid #111;
  border-radius: 50%;
  background: #f5f5f5;
  font-size: 0.88rem;
  font-weight: 900;
}

.answer-list strong {
  font-size: 0.95rem;
}

.answer-list em {
  color: var(--red);
  font-size: 0.78rem;
  font-style: normal;
}

.answer-list p {
  margin: 0;
  font-size: 1rem;
}

.vote-panel {
  padding: 19px;
  border: 3px solid #111;
  border-radius: 12px;
}

.vote-panel > h2 {
  text-align: center;
  font-size: 0.95rem;
}

.vote-panel > p {
  margin: 0 0 13px;
  text-align: center;
  font-size: 0.78rem;
}

.vote-panel > button:not(.submit):not(.skip) {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 11px;
  padding: 8px;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.vote-panel button strong {
  font-size: 0.92rem;
}

.vote-panel button span {
  margin-left: auto;
  color: var(--red);
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.vote-panel button i {
  width: 18px;
  height: 18px;
  margin-left: auto;
  border: 2px solid #111;
  border-radius: 50%;
}

.vote-panel button span + i {
  margin-left: 0;
}

.vote-panel button.selected i {
  border: 5px solid var(--red);
}

.vote-panel button.submitted {
  background: #fff7f7 !important;
}

.submit, .skip {
  width: 100%;
  margin-top: 11px;
  padding: 13px;
  border: 1px solid #111;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 900;
}

.submit {
  background: var(--red);
  color: #fff;
}

.skip {
  background: #fff;
}

.submit:disabled, .skip:disabled {
  opacity: 0.45;
}

.empty-state {
  padding: 70px;
  text-align: center;
  color: #777;
  font-size: 1rem;
}

@media (max-width: 760px) {
  .phase-shell {
    width: 100%;
    padding: 26px 15px 22px;
    overflow: auto;
  }
  .top-row {
    align-items: flex-start;
    gap: 10px;
  }
  .phase-layout {
    grid-template-columns: 1fr;
  }
  .answer-list article {
    grid-template-columns: 40px 115px 1fr;
  }
}
</style>
<style scoped src="../../styles/game-phases.css"></style>
