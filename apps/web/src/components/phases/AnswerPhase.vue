<template>
  <section class="answer-phase">
    <!-- Phase label -->
    <div class="phase-label">
      2&nbsp;&nbsp; ANSWER PHASE
    </div>

    <!-- Private prompt -->
    <div class="private-badge">
      ◉ PRIVATE PROMPT
    </div>

    <div class="prompt-heading">
      <h2>🔒 THIS IS YOUR PROMPT</h2>
      <p>Only you can see this. Don't tell anyone!</p>
    </div>

    <!-- Timer -->
    <div class="timer-card">
      <span>TIME LEFT</span>

      <strong>
        ◷ {{ formattedCountdown }}
      </strong>
    </div>

    <!-- Prompt + Answer -->
    <div
      v-if="gameStore.currentPlayerPrompt"
      class="answer-card"
    >
      <div class="prompt-box">
        {{ gameStore.currentPlayerPrompt.prompt }}
      </div>

      <div class="textarea-wrap">
        <textarea
          v-model="draftAnswer"
          placeholder="Write your answer here..."
          maxlength="100"
          :disabled="!!gameStore.submittedAnswer"
        ></textarea>

        <span class="character-count">
          {{ draftAnswer.length }} / 100
        </span>
      </div>
    </div>

    <div v-else class="waiting">
      Waiting for your prompt...
    </div>

    <!-- Auto submit note -->
    <p class="auto-submit">
      Your answer will be submitted automatically when time is up!
    </p>

    <!-- Submit button -->
    <button
      v-if="gameStore.currentPlayerPrompt"
      class="submit-button"
      :disabled="!!gameStore.submittedAnswer"
      @click="submitAnswer"
    >
      {{
        gameStore.submittedAnswer
          ? 'ANSWER SUBMITTED ✓'
          : 'SUBMIT ANSWER'
      }}
    </button>

    <!-- Progress -->
    <div class="progress">
      <div class="progress-item complete">
        <div class="dot">✓</div>
        <span>START</span>
      </div>

      <div class="progress-line active"></div>

      <div class="progress-item active">
        <div class="dot">✓</div>
        <span>ANSWER</span>
      </div>

      <div class="progress-line"></div>

      <div class="progress-item">
        <div class="dot"></div>
        <span>DISCUSS & VOTE</span>
      </div>

      <div class="progress-line"></div>

      <div class="progress-item">
        <div class="dot"></div>
        <span>RESULT</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()

const draftAnswer = ref('')

const formattedCountdown = computed(() => {
  const seconds = gameStore.phaseCountdown ?? 0

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`
})

function submitAnswer() {
  if (gameStore.submittedAnswer) {
    return
  }

  gameStore.submitAnswer(draftAnswer.value)
}

watch(
  () => gameStore.phaseCountdown,
  (countdown) => {
    if (
      countdown === 0 &&
      !gameStore.submittedAnswer
    ) {
      gameStore.submitAnswer(draftAnswer.value)
    }
  }
)
</script>

<style scoped>
.answer-phase {
  position: relative;

  width: 100%;
  max-width: 1000px;

  margin: 0 auto;
  padding: 56px 64px 36px;

  box-sizing: border-box;

  background: #fff;
  color: #111;

  border: 3px solid #111;
  border-radius: 22px;
}

/* Phase label */

.phase-label {
  position: absolute;
  top: -3px;
  left: -3px;

  padding: 12px 24px;

  background: #111;
  color: #fff;

  border-radius: 18px 0 14px 0;

  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

/* Private badge */

.private-badge {
  width: fit-content;

  margin: 0 auto 16px;
  padding: 7px 14px;

  background: #ffe0e3;
  color: #ef1823;

  border-radius: 10px;

  font-size: 0.75rem;
  font-weight: 900;
}

/* Prompt heading */

.prompt-heading {
  text-align: center;
}

.prompt-heading h2 {
  margin: 0;

  color: #111;

  font-size: 1.1rem;
  font-weight: 900;
}

.prompt-heading p {
  margin: 5px 0 22px;

  color: #555;

  font-size: 0.85rem;
}

/* Timer */

.timer-card {
  position: absolute;
  top: 92px;
  right: 64px;

  padding: 10px 18px;

  border: 2px solid #ef1823;
  border-radius: 12px;

  background: #fff;

  text-align: center;
}

.timer-card span {
  display: block;

  color: #111;

  font-size: 0.62rem;
  font-weight: 900;
}

.timer-card strong {
  display: block;

  margin-top: 3px;

  color: #111;

  font-size: 1.3rem;
}

/* Answer card */

.answer-card {
  max-width: 620px;

  margin: 0 auto;
  overflow: hidden;

  border: 2px solid #111;
  border-radius: 16px;

  background: #fff;
}

.prompt-box {
  padding: 18px 20px;

  border-bottom: 1px solid #ddd;

  color: #ef1823;

  text-align: center;

  font-size: 1.25rem;
  font-weight: 900;
}

/* Textarea */

.textarea-wrap {
  position: relative;
}

textarea {
  width: 100%;
  min-height: 170px;

  box-sizing: border-box;

  padding: 20px 22px 38px;

  border: 0;
  outline: 0;

  resize: none;

  background:
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 38px,
      #eee 39px
    );

  color: #111;

  font-size: 1rem;
  line-height: 39px;
}

textarea::placeholder {
  color: #777;
}

.character-count {
  position: absolute;
  right: 16px;
  bottom: 12px;

  color: #777;

  font-size: 0.75rem;
}

/* Note */

.auto-submit {
  margin: 26px 0 16px;

  color: #111;

  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
}

/* Submit */

.submit-button {
  display: block;

  width: 100%;
  max-width: 620px;

  margin: 0 auto 34px;
  padding: 14px;

  background: #ef1823;
  color: #fff;

  border: 2px solid #111;
  border-radius: 12px;

  font-weight: 900;

  cursor: pointer;

  box-shadow: 3px 3px 0 #111;
}

.submit-button:disabled {
  opacity: 0.55;
  cursor: default;
}

/* Progress bar */

.progress {
  display: flex;
  align-items: flex-start;

  max-width: 850px;

  margin: 0 auto;
}

.progress-item {
  width: 110px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 7px;
}

.progress-item span {
  color: #555;

  font-size: 0.68rem;
  font-weight: 800;

  text-align: center;
}

.dot {
  width: 16px;
  height: 16px;

  box-sizing: border-box;

  border: 2px solid #bbb;
  border-radius: 50%;

  background: #fff;

  display: grid;
  place-items: center;

  color: #fff;

  font-size: 0.55rem;
}

.progress-item.complete .dot {
  border-color: #111;
  background: #111;
}

.progress-item.active .dot {
  border-color: #ef1823;
  background: #ef1823;
}

.progress-item.active span {
  color: #ef1823;
}

.progress-line {
  flex: 1;

  height: 2px;

  margin-top: 7px;

  background: #ccc;
}

.progress-line.active {
  background: linear-gradient(
    to right,
    #111 0 50%,
    #ef1823 50% 100%
  );
}

.waiting {
  padding: 50px;

  color: #777;

  text-align: center;
}

/* Mobile */

@media (max-width: 700px) {
  .answer-phase {
    padding: 70px 20px 26px;
  }

  .timer-card {
    position: static;

    width: fit-content;

    margin: 0 auto 18px;
  }

  .progress-item {
    width: 75px;
  }

  .progress-item span {
    font-size: 0.58rem;
  }
}
</style>
