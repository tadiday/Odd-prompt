<template>
  <section class="results-phase">
    <div class="phase-header">
      <div>
        <span class="eyebrow">ROUND COMPLETE</span>
        <h1>RESULTS</h1>
      </div>
    </div>

    <div
      v-if="!results"
      class="waiting"
    >
      Waiting for results...
    </div>

    <template v-else>
      <!-- Winning Team -->
      <div class="winner-banner">
        <span>WINNING TEAM</span>

        <strong>
          {{ results.winningTeam || 'civilian' }}
        </strong>
      </div>

      <!-- Most Voted -->
      <div class="summary-card">
        <template v-if="results.winnerId">
          <span class="label">MOST VOTES</span>

          <strong>
            {{ getPlayerName(results.winnerId) }}
          </strong>
        </template>

        <template v-else-if="results.tiedPlayerIds?.length">
          <span class="label">TIE</span>

          <strong>
            {{
              results.tiedPlayerIds
                .map(getPlayerName)
                .join(', ')
            }}
          </strong>
        </template>

        <template v-else>
          <span class="label">VOTES</span>
          <strong>No one received votes.</strong>
        </template>
      </div>

      <!-- Vote Count -->
      <div class="section">
        <h2>VOTE COUNT</h2>

        <div class="vote-results">
          <div
            v-for="entry in results.tally"
            :key="entry.playerId"
            class="vote-row"
          >
            <div class="player-info">
              <div class="avatar">
                {{ getInitial(entry.playerId) }}
              </div>

              <strong>
                {{ getPlayerName(entry.playerId) }}
              </strong>
            </div>

            <span class="vote-count">
              {{ entry.count }}
              vote{{ entry.count === 1 ? '' : 's' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Role Reveal -->
      <div
        v-if="results.revealedRoles?.length"
        class="section"
      >
        <h2>ROLES REVEALED</h2>

        <div class="role-grid">
          <article
            v-for="entry in results.revealedRoles"
            :key="entry.playerId"
            class="role-card"
            :class="{ imposter: entry.role === 'imposter' }"
          >
            <div class="avatar">
              {{ getInitial(entry.playerId) }}
            </div>

            <strong>
              {{ getPlayerName(entry.playerId) }}
            </strong>

            <span class="role">
              {{ entry.role }}
            </span>
          </article>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()

const results = computed(() =>
  gameStore.votingResults ?? null
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
.results-phase {
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

/* Winner */

.winner-banner {
  padding: 24px;
  margin-bottom: 18px;

  background: #ef1823;
  color: #fff;

  border: 3px solid #111;
  border-radius: 16px;

  text-align: center;

  box-shadow: 4px 4px 0 #111;
}

.winner-banner span {
  display: block;

  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.winner-banner strong {
  display: block;

  margin-top: 6px;

  font-size: 2rem;
  text-transform: uppercase;
}

/* Summary */

.summary-card {
  padding: 18px;
  margin-bottom: 24px;

  border: 3px solid #111;
  border-radius: 14px;

  text-align: center;
}

.summary-card .label {
  display: block;

  margin-bottom: 6px;

  color: #ef1823;

  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.summary-card strong {
  color: #111;

  font-size: 1.2rem;
}

/* Sections */

.section {
  margin-top: 24px;
}

.section h2 {
  margin: 0 0 14px;

  color: #111;

  font-size: 1rem;
  font-weight: 900;
}

/* Votes */

.vote-results {
  display: grid;
  gap: 10px;
}

.vote-row {
  min-height: 52px;

  padding: 0 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 2px solid #111;
  border-radius: 12px;

  color: #111;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
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

.vote-count {
  font-weight: 900;
}

/* Roles */

.role-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.role-card {
  padding: 18px;

  display: flex;
  align-items: center;
  gap: 12px;

  border: 3px solid #111;
  border-radius: 14px;

  background: #fff;
  color: #111;
}

.role-card .role {
  margin-left: auto;

  color: #111;

  font-size: 0.75rem;
  font-weight: 900;

  text-transform: uppercase;
}

.role-card.imposter {
  border-color: #ef1823;
}

.role-card.imposter .role {
  color: #ef1823;
}

/* Waiting */

.waiting {
  padding: 40px;

  color: #777;

  text-align: center;
  font-weight: 700;
}

@media (max-width: 650px) {
  .results-phase {
    padding: 18px;
  }

  .role-grid {
    grid-template-columns: 1fr;
  }

  .phase-header h1 {
    font-size: 2rem;
  }

  .winner-banner strong {
    font-size: 1.5rem;
  }
}
</style>
