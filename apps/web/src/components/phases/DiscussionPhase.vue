<template>
  <section class="discussion-phase">
    <div class="phase-header">
      <div>
        <span class="eyebrow">TALK IT OUT</span>
        <h1>DISCUSSION</h1>
      </div>

      <div class="timer">
        {{ gameStore.phaseCountdown ?? 0 }}
      </div>
    </div>

    <p class="instructions">
      Discuss the answers and figure out who might be the imposter.
    </p>

    <div
      v-if="revealAnswers.length === 0"
      class="waiting"
    >
      Waiting for answers...
    </div>

    <div v-else class="answer-grid">
      <article
        v-for="answer in revealAnswers"
        :key="answer.playerId"
        class="answer-card"
      >
        <div class="player-row">
          <div class="avatar">
            {{ getInitial(answer.playerId) }}
          </div>

          <strong>
            {{ getPlayerName(answer.playerId) }}
          </strong>
        </div>

        <p>
          {{ answer.content || 'No answer.' }}
        </p>
      </article>
    </div>

    <div class="discussion-note">
      Voting will begin when the timer ends.
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()

const revealAnswers = computed(() =>
  gameStore.revealAnswers ?? []
)

function getPlayerName(playerId: string) {
  return (
    gameStore.roomPlayers.find(
      player => player.id === playerId
    )?.username ?? playerId
  )
}

function getInitial(playerId: string) {
  return getPlayerName(playerId)
    .charAt(0)
    .toUpperCase()
}
</script>

<style scoped>
.discussion-phase {
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

  font-size: 1rem;
  text-align: center;
}

.answer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.answer-card {
  padding: 18px;

  background: #fff;

  border: 3px solid #111;
  border-radius: 16px;

  box-shadow: 4px 4px 0 #111;
}

.player-row {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 14px;
}

.avatar {
  width: 36px;
  height: 36px;

  display: grid;
  place-items: center;

  background: #ef1823;
  color: #fff;

  border: 2px solid #111;
  border-radius: 50%;

  font-weight: 900;
}

.player-row strong {
  color: #111;
}

.answer-card p {
  margin: 0;

  color: #111;

  font-size: 1.1rem;
  line-height: 1.5;

  white-space: pre-wrap;
}

.discussion-note {
  margin-top: 24px;
  padding: 14px;

  border: 2px dashed #111;
  border-radius: 12px;

  color: #555;

  text-align: center;
  font-weight: 700;
}

.waiting {
  padding: 40px;

  color: #777;

  text-align: center;
  font-weight: 700;
}

@media (max-width: 650px) {
  .discussion-phase {
    padding: 18px;
  }

  .answer-grid {
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
