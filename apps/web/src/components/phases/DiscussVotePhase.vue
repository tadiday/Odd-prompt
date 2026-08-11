<template>
  <section class="discuss-vote-phase">
    <div class="phase-header">
      <div>
        <span class="eyebrow">TAKE A LOOK</span>
        <h1>DISCUSS &amp; VOTE</h1>
      </div>

      <div class="timer-box">
        <span>TIME LEFT</span>
        <strong>◷ {{ formattedCountdown }}</strong>
      </div>
    </div>

    <p class="instructions">
      Discuss the answers and vote for who you think is the imposter.
    </p>

    <div class="phase-layout">
      <section class="answers-panel">
        <div class="panel-title">
          ANSWERS
        </div>

        <div v-if="revealAnswers.length === 0" class="empty-state">
          Waiting for answers...
        </div>

        <div v-else class="answer-list">
          <article
            v-for="answer in revealAnswers"
            :key="answer.playerId"
            class="answer-row"
          >
            <div class="player-pill">
              <div class="avatar">
                {{ getInitial(answer.playerId) }}
              </div>
              <strong>{{ getPlayerName(answer.playerId) }}</strong>
            </div>

            <p>{{ answer.content || 'No answer.' }}</p>
          </article>
        </div>
      </section>

      <aside class="vote-panel">
        <div class="panel-title panel-title-right">
          WHO IS THE IMPOSTER?
        </div>

        <p class="vote-helper">
          Vote for the player you think has a different prompt.
        </p>

        <div class="vote-list">
          <button
            v-for="player in eligiblePlayers"
            :key="player.id"
            class="vote-row"
            :class="{ selected: selectedVote === player.id }"
            :disabled="!canVote"
            @click="selectPlayer(player.id)"
          >
            <div class="player-pill">
              <div class="avatar">{{ getInitial(player.username) }}</div>
              <strong>{{ player.username }}</strong>
            </div>

            <span v-if="selectedVote === player.id" class="selected-mark">✓</span>
          </button>
        </div>

        <div class="actions">
          <button
            class="submit-button"
            :disabled="!canVote || !selectedVote"
            @click="submitVote"
          >
            SUBMIT VOTE
          </button>

          <button
            class="skip-button"
            :disabled="!canVote"
            @click="skipVote"
          >
            SKIP VOTE
          </button>
        </div>

        <p v-if="!canVote" class="vote-note">
          Voting opens when the discussion timer ends.
        </p>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()
const selectedVote = ref<string | null>(null)

const revealAnswers = computed(() => gameStore.revealAnswers ?? [])
const myRole = computed(() => gameStore.getMyRole())
const canVote = computed(() => gameStore.roomStatus === 'voting')

const formattedCountdown = computed(() => {
  const seconds = gameStore.phaseCountdown ?? 0
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
})

const eligiblePlayers = computed(() => {
  const currentPlayerId = gameStore.currentPlayer?.id
  const isImposter = myRole.value === 'imposter'

  return gameStore.roomPlayers.filter((player) => {
    if (player.id === currentPlayerId) {
      return false
    }

    return isImposter ? !player.isImposter : player.isImposter
  })
})

function getPlayerName(playerId: string) {
  return gameStore.roomPlayers.find((player) => player.id === playerId)?.username ?? playerId
}

function getInitial(playerIdOrName: string) {
  return getPlayerName(playerIdOrName).charAt(0).toUpperCase()
}

function selectPlayer(playerId: string) {
  if (!canVote.value) return
  selectedVote.value = playerId
}

function submitVote() {
  if (!canVote.value || !selectedVote.value) {
    return
  }

  gameStore.submitVote(selectedVote.value)
}

function skipVote() {
  if (!canVote.value) return
  selectedVote.value = null
  gameStore.skipVote()
}

watch(() => gameStore.roomStatus, (status) => {
  if (status === 'discussion') {
    selectedVote.value = null
  }
})
</script>

<style scoped>
.discuss-vote-phase {
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px;
  box-sizing: border-box;
  background: #fff;
  color: #111;
  border: 3px solid #111;
  border-radius: 22px;
  box-shadow: 6px 6px 0 #111;
}

.phase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 3px solid #111;
}

.phase-header h1 {
  margin: 4px 0 0;
  color: #111;
  font-size: 2.35rem;
  font-weight: 900;
}

.eyebrow {
  color: #ef1823;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.timer-box {
  padding: 10px 14px;
  min-width: 120px;
  text-align: center;
  border: 2px solid #ef1823;
  border-radius: 12px;
  background: #fff;
}

.timer-box span {
  display: block;
  font-size: 0.62rem;
  font-weight: 900;
}

.timer-box strong {
  display: block;
  margin-top: 3px;
  font-size: 1.35rem;
}

.instructions {
  margin: 0 0 18px;
  color: #555;
  text-align: center;
  font-weight: 700;
}

.phase-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
  gap: 16px;
  align-items: start;
}

.answers-panel,
.vote-panel {
  border: 2px solid #111;
  border-radius: 16px;
  background: #fff;
}

.panel-title {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  font-size: 0.82rem;
  font-weight: 900;
}

.panel-title-right {
  text-align: center;
}

.answer-list,
.vote-list {
  padding: 14px;
  display: grid;
  gap: 10px;
}

.answer-row,
.vote-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  box-sizing: border-box;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: #fff;
}

.answer-row p {
  margin: 0;
  color: #111;
  font-size: 0.98rem;
  line-height: 1.45;
  white-space: pre-wrap;
}

.player-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 2px solid #111;
  border-radius: 50%;
  background: #ef1823;
  color: #fff;
  font-weight: 900;
}

.vote-row {
  cursor: pointer;
}

.vote-row:hover:not(:disabled) {
  border-color: #ef1823;
}

.vote-row.selected {
  border-color: #ef1823;
}

.vote-row:disabled {
  cursor: default;
  opacity: 0.9;
}

.selected-mark {
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: 2px solid #111;
  border-radius: 50%;
  background: #ef1823;
  color: #fff;
  font-weight: 900;
}

.vote-helper,
.vote-note {
  margin: 0;
  padding: 0 16px 12px;
  color: #555;
  font-size: 0.84rem;
  text-align: center;
}

.actions {
  display: grid;
  gap: 10px;
  padding: 0 14px 14px;
}

.submit-button,
.skip-button {
  width: 100%;
  padding: 14px;
  border: 3px solid #111;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}

.submit-button {
  background: #ef1823;
  color: #fff;
  box-shadow: 4px 4px 0 #111;
}

.submit-button:disabled,
.skip-button:disabled {
  opacity: 0.55;
  cursor: default;
}

.skip-button {
  background: #fff;
  color: #111;
}

.empty-state {
  padding: 32px 16px;
  color: #777;
  text-align: center;
}

@media (max-width: 860px) {
  .phase-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .discuss-vote-phase {
    padding: 16px;
  }

  .phase-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .phase-header h1 {
    font-size: 1.9rem;
  }
}
</style>
