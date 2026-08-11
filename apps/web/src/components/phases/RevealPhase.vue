<template>
  <section class="reveal-phase">
    <div class="phase-header">
      <div>
        <span class="eyebrow">ANSWERS REVEALED</span>
        <h1>REVEAL</h1>
      </div>
    </div>

    <div
    v-if="!gameStore.revealAnswers || gameStore.revealAnswers.length === 0"
    class="waiting"
    >
        Waiting for answers to be revealed...
        </div>

        <div v-else class="answer-grid">
        <article
            v-for="answer in gameStore.revealAnswers ?? []"
            :key="answer.playerId"
            class="answer-card"
        >
            <div class="player-row">
            <div class="avatar">
                {{ getPlayerName(answer.playerId).charAt(0).toUpperCase() }}
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
  </section>
</template>

<script setup lang="ts">
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()

function getPlayerName(playerId: string) {
  return (
    gameStore.roomPlayers.find(
      (player) => player.id === playerId
    )?.username ?? playerId
  )
}
</script>

<style scoped>
.reveal-phase {
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
  padding-bottom: 20px;
  margin-bottom: 24px;

  border-bottom: 3px solid #111;
}

.phase-header h1 {
  margin: 4px 0 0;

  font-size: 2.5rem;
  font-weight: 900;
}

.eyebrow {
  color: #ef1823;

  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.15em;
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

.answer-card strong {
  color: #111;
}

.answer-card p {
  margin: 0;

  color: #111;

  font-size: 1.1rem;
  line-height: 1.5;

  white-space: pre-wrap;
}

.waiting {
  padding: 40px;

  color: #777;
  text-align: center;
  font-weight: 700;
}

@media (max-width: 650px) {
  .reveal-phase {
    padding: 18px;
  }

  .answer-grid {
    grid-template-columns: 1fr;
  }

  .phase-header h1 {
    font-size: 2rem;
  }
}
</style>
