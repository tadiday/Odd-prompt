<template>
  <section class="phase-shell">
    <header>
      <span>✦</span>
      <h1>RESULTS</h1>
      <span>✦</span>
    </header>

    <div class="next-round-action">
      <button v-if="gameStore.isHost" @click="gameStore.playAgain">
        ↻ PLAY AGAIN
      </button>
      <p v-else>Waiting for the host to start another round…</p>
    </div>
    <div v-if="!results" class="waiting">Waiting for results…</div>
    <template v-else>
      <div class="summary-grid">
        <article>
          <span class="medal">★</span>
          <small>ACTUAL PROMPT</small>
          <strong>{{ actualPrompt }}</strong>
        </article>
        <article class="odd">
          <small>ODD PROMPT</small>
          <strong>{{ oddPrompt }}</strong>
        </article>
      </div>
      <div class="results-layout">
        <section class="table-wrap">
          <div class="table-head">
            <span>PLAYER</span>
            <span>ROLE</span>
            <span>ANSWER</span>
            <span>VOTES RECEIVED</span>
          </div>
          <article
            v-for="player in resultPlayers"
            :key="player.id"
            :class="{ imposter: player.role === 'imposter' }"
          >
            <div class="player">
              <PlayerAvatar
                :avatar-id="player.avatarId"
                :player-name="player.username"
              />
              <strong>{{ player.username }}</strong>
            </div>
            <b>{{ player.role === 'imposter' ? '♜ IMPOSTER' : '♟ INNOCENT' }}</b>
            <p>{{ player.answer }}</p>
            <span class="votes">{{ player.votes }}</span>
          </article>
        </section>
        <aside
          class="winner-card"
          :class="{ 'imposter-win': results.winningTeam === 'imposter' }"
        >
          <small>WINNING TEAM</small>
          <strong>{{ winnerLabel }}<br />WIN!</strong>
          <div>🏆</div>
        </aside>
      </div>
    </template>
    <ProgressiveFooter active-phase="result" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import ProgressiveFooter from './ProgressiveFooter.vue'
import PlayerAvatar from '../common/PlayerAvatar.vue'
const gameStore = useGameStore()
const results = computed(() => gameStore.votingResults ?? null)
const actualPrompt = computed(
  () => gameStore.revealedPrompts?.actualPrompt ?? 'Not revealed'
)

const oddPrompt = computed(
  () => gameStore.revealedPrompts?.oddPrompt ?? 'Not revealed'
)

const winnerLabel = computed(() =>
  results.value?.winningTeam === 'imposter' ? 'IMPOSTERS' : 'INNOCENTS'
)

const resultPlayers = computed(() =>
  gameStore.roomPlayers.map((player) => ({
    ...player,
    role:
      results.value?.revealedRoles?.find(
        (entry) => entry.playerId === player.id
      )?.role ?? (player.isImposter ? 'imposter' : 'civilian'),
    answer:
      gameStore.revealAnswers?.find((answer) => answer.playerId === player.id)
        ?.content || '—',
    votes:
      results.value?.tally.find((entry) => entry.playerId === player.id)
        ?.count ?? 0
  }))
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
  padding: 28px 46px 105px;
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #111;
  box-shadow: none;
}

header { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; color: var(--red); }
header h1 { margin: 0; color: var(--red) !important; font-size: 2.2rem; }
header span { font-size: 1.7rem; }
.next-round-action { position: absolute; top: 26px; right: 46px; }
.next-round-action button { padding: 11px 17px; border: 2px solid #111; border-radius: 9px; background: #fff; color: #111; box-shadow: 2px 2px 0 #111; font-size: 0.78rem; font-weight: 900; cursor: pointer; }
.next-round-action button:hover { border-color: var(--red); color: var(--red); transform: translateY(-1px); }
.next-round-action p { margin: 0; color: #666; font-size: 0.75rem; font-weight: 700; }
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; max-width: 820px; margin: 0 auto 24px; }
.summary-grid article { position: relative; display: grid; min-height: 110px; place-content: center; padding: 14px; border: 3px solid #111; border-radius: 12px; text-align: center; }
.summary-grid article.odd { border-color: var(--red); background: #fff7f7; }
.summary-grid small, .winner-card small { font-size: 0.75rem; font-weight: 900; }
.summary-grid strong { margin-top: 5px; font-size: 1.1rem; }
.summary-grid .medal { position: absolute; top: -17px; left: 17px; display: grid; width: 36px; height: 36px; place-items: center; border: 3px solid #111; border-radius: 50%; background: #ffc928; color: #ef1823 !important; }
.results-layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 22px; }
.table-wrap { overflow: hidden; border: 3px solid #ddd; border-radius: 10px; }
.table-head, .table-wrap article { display: grid; grid-template-columns: 1.25fr 0.9fr 1.5fr 0.65fr; align-items: center; }
.table-head { padding: 10px 15px; background: #fafafa; font-size: 0.68rem; font-weight: 900; }
.table-wrap article { min-height: 60px; padding: 8px 15px; border-top: 3px solid #ddd; font-size: 0.92rem; }
.player { display: flex; align-items: center; gap: 10px; }
.table-wrap article > b { color: #1ca54c; font-size: 0.75rem; }
.table-wrap article.imposter > b { color: var(--red); }
.table-wrap article p { margin: 0; }
.votes { font-size: 1rem; font-weight: 900; text-align: center; }
.winner-card { display: grid; min-height: 210px; place-content: center; padding: 18px; border: 3px solid #111; border-radius: 12px; text-align: center; }
.winner-card strong { margin: 12px 0; color: #10a240 !important; font-size: 1.5rem; }
.winner-card div { font-size: 3.5rem; }
.winner-card.imposter-win { border-color: var(--red); background: #fff7f7; }
.winner-card.imposter-win strong { color: var(--red) !important; }
.waiting { padding: 130px; text-align: center; color: #777; font-size: 1rem; }

@media (max-width: 760px) {
  .phase-shell { width: 100%; padding: 24px 14px 22px; overflow: auto; }
  .results-layout { grid-template-columns: 1fr; }
  .winner-card { min-height: 150px; }
  .table-head { display: none; }
  .table-wrap article { grid-template-columns: 1.2fr 1fr 0.8fr 0.3fr; }
  .summary-grid { grid-template-columns: 1fr; }
  .next-round-action { position: static; margin: -8px 0 20px; text-align: center; }
}
</style>
