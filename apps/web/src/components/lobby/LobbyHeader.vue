<template>
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark">O</div>

      <div>
        <div class="brand-title">
          <span>Odd</span>
          <strong>Prompt</strong>
        </div>

        <div class="brand-subtitle">
          THE PARTY GAME
        </div>
      </div>
    </div>

    <div class="top-actions">
      <span
        class="connection-dot"
        :data-status="connectionStatus"
      ></span>

      <span class="connection-text">
        {{ connectionStatus }}
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  connectionStatus: string
}>()
</script>

<style scoped>
.topbar {
  max-width: 1160px;
  margin: 0 auto 20px;
  min-height: 132px;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  position: relative;
  color: #111;
}

/* Logo */

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 64px;
  height: 64px;

  display: grid;
  place-items: center;

  background: #ef1823;
  color: white;

  border: 3px solid #111;
  border-radius: 50%;

  font-size: 1.7rem;
  font-weight: 900;

  box-shadow: 4px 4px 0 #111;
}

.brand-title {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #111;
  font-size: 2.25rem;
  font-weight: 900;
}

.brand-title strong {
  color: #ef1823;

  border: 3px solid #ef1823;
  border-radius: 12px;

  padding: 2px 10px 5px;
}

.brand-subtitle {
  margin-top: 14px;

  color: #111;

  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.32em;
}

/* Connection status */

.top-actions {
  position: absolute;
  right: 0;
  top: 2px;

  display: flex;
  align-items: center;
  gap: 8px;

  color: #111;

  font-size: 0.78rem;
  font-weight: 800;
  text-transform: capitalize;
}

.connection-dot {
  width: 10px;
  height: 10px;

  border: 2px solid #111;
  border-radius: 50%;
}

.connection-dot[data-status="connected"] {
  background: #21c45a;
}

.connection-dot[data-status="connecting"] {
  background: #f1b928;
}

.connection-dot[data-status="disconnected"] {
  background: #ef1823;
}

.connection-text {
  color: #111;
}

/* Mobile */

@media (max-width: 680px) {
  .topbar {
    min-height: 110px;
  }

  .top-actions {
    display: none;
  }

  .brand-title {
    font-size: 1.7rem;
  }

  .brand-mark {
    width: 50px;
    height: 50px;
  }
}
</style>
