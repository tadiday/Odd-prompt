<template>
  <section class="voting-phase">
    <div class="phase-header">
      <div>
        <span class="eyebrow">MAKE YOUR CHOICE</span>
        <h1>VOTING</h1>
      </div>

      <div class="timer">
        {{ gameStore.phaseCountdown ?? 0 }}
      </div>
    </div>

    <p class="instructions">
      Choose the player you think is the imposter.
    </p>

    <div class="vote-grid">
      <button
        v-for="player in eligiblePlayers"
        :key="player.id"
        class="vote-card"
        :class="{ selected: selectedVote === player.id }"
        @click="selectPlayer(player.id)"
      >
        <div class="avatar">
          {{ getInitial(player.username) }}
        </div>

        <span>
          {{ player.username }}
        </span>

        <div
          v-if="selectedVote === player.id"
          class="selected-mark"
        >
          ✓
        </div>
      </button>
    </div>

    <div class="actions">
      <button
        class="submit-button"
        :disabled="!selectedVote"
        @click="submitVote"
      >
        SUBMIT VOTE
      </button>

      <button
        class="skip-button"
        @click="skipVote"
      >
        SKIP VOTE
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '../../stores/game'


const gameStore = useGameStore()

const selectedVote = ref<string | null>(null)

const myRole = computed(() =>
  gameStore.getMyRole()
)

const eligiblePlayers = computed(() => {
  const currentPlayerId = gameStore.currentPlayer?.id
  const isImposter = myRole.value === 'imposter'

  return gameStore.roomPlayers.filter((player) => {
    if (player.id === currentPlayerId) {
      return false
    }

    return isImposter
      ? !player.isImposter
      : player.isImposter
  })
})

function getInitial(username: string) {
  return username?.charAt(0)?.toUpperCase() || '?'
}

function selectPlayer(playerId: string) {
  selectedVote.value = playerId
}

function submitVote() {
  if (!selectedVote.value) {
    return
  }

  gameStore.submitVote(selectedVote.value)
}

function skipVote() {
  selectedVote.value = null
  gameStore.skipVote()
}
</script>

<style scoped>
.voting-phase {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;
  padding: 28px;

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

  padding-bottom: 20px;
  margin-bottom: 20px;

  border-bottom: 3px solid #111;
}

.phase-header h1 {
  margin: 4px 0 0;

  color: #111;

  font-size: 2.5rem;
  font-weight: 900;
}

.eyebrow {
  color: #ef1823;

  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.timer {
  width: 72px;
  height: 72px;

  display: grid;
  place-items: center;

  border: 4px solid #111;
  border-radius: 50%;

  color: #ef1823;

  font-size: 1.7rem;
  font-weight: 900;

  box-shadow: 4px 4px 0 #111;
}

.instructions {
  margin: 0 0 22px;

  color: #555;

  text-align: center;
  font-weight: 700;
}

.vote-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.vote-card {
  position: relative;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 16px;

  background: #fff;
  color: #111;

  border: 3px solid #111;
  border-radius: 14px;

  font-weight: 900;
  text-align: left;

  cursor: pointer;

  box-shadow: 4px 4px 0 #111;
}

.vote-card:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #111;
}

.vote-card.selected {
  border-color: #ef1823;
  color: #ef1823;
}

.avatar {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  background: #ef1823;
  color: #fff;

  border: 2px solid #111;
  border-radius: 50%;

  font-weight: 900;
}

.selected-mark {
  margin-left: auto;

  width: 26px;
  height: 26px;

  display: grid;
  place-items: center;

  background: #ef1823;
  color: #fff;

  border: 2px solid #111;
  border-radius: 50%;
}

.actions {
  display: grid;
  gap: 12px;

  margin-top: 24px;
}

.submit-button,
.skip-button {
  width: 100%;

  padding: 15px;

  border: 3px solid #111;
  border-radius: 13px;

  font-weight: 900;

  cursor: pointer;
}

.submit-button {
  background: #ef1823;
  color: #fff;

  box-shadow: 4px 4px 0 #111;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.skip-button {
  background: #fff;
  color: #111;
}

@media (max-width: 650px) {
  .voting-phase {
    padding: 18px;
  }

  .vote-grid {
    grid-template-columns: 1fr;
  }

  .phase-header h1 {
    font-size: 2rem;
  }

  .timer {
    width: 58px;
    height: 58px;
  }
}
</style>
