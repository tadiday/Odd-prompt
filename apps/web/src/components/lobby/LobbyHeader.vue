<template>
  <header class="topbar">
    <!-- LEFT -->
    <button class="leave-button" @click="$emit('leave')">
      <span class="arrow">←</span>
      LEAVE ROOM
    </button>

    <!-- CENTER -->
    <div class="brand">
      <div class="brand-mark">O</div>

      <div class="brand-content">
        <div class="brand-title">
          <span>Odd</span>
          <strong>Prompt</strong>
        </div>

        <div class="brand-subtitle">
          THE PARTY GAME
        </div>
      </div>
    </div>

    <!-- RIGHT -->
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

defineEmits<{
  leave: []
}>()
</script>

<style scoped>
/* =========================================
   HEADER
========================================= */

.topbar {
  width: 100%;
  height: 132px;
  min-height: 132px;

  position: relative;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  box-sizing: border-box;

  margin: 0;
  padding: 16px 32px;

  color: #111;
}


/* =========================================
   LEAVE ROOM
========================================= */

.leave-button {
  position: absolute;
  top: 24px;
  left: 32px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 11px 16px;

  background: #fff;
  color: #111;

  border: 2px solid #111;
  border-radius: 10px;

  font-size: 0.78rem;
  font-weight: 900;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.leave-button:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.arrow {
  font-size: 1rem;
  font-weight: 900;
}


/* =========================================
   LOGO / BRAND
========================================= */

.brand {
  display: flex;
  align-items: center;
  gap: 14px;

  margin: 0 auto;
}

.brand-mark {
  width: 64px;
  height: 64px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  background: #ef1823;
  color: #fff;

  border: 3px solid #111;
  border-radius: 50%;

  font-size: 1.7rem;
  font-weight: 900;

  box-shadow: 4px 4px 0 #111;
}

.brand-content {
  display: flex;
  flex-direction: column;
}

.brand-title {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #111;

  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1;
}

.brand-title strong {
  padding: 5px 10px 7px;

  color: #ef1823;

  border: 3px solid #ef1823;
  border-radius: 12px;

  font-weight: 900;
}

.brand-subtitle {
  margin-top: 13px;

  color: #111;

  font-size: 0.76rem;
  font-weight: 900;

  letter-spacing: 0.32em;
  text-align: center;
}


/* =========================================
   CONNECTION STATUS
========================================= */

.top-actions {
  position: absolute;
  top: 24px;
  right: 32px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 9px 16px;

  background: #fff;
  color: #111;

  border: 1px solid #ccc;
  border-radius: 999px;

  font-size: 0.78rem;
  font-weight: 800;

  text-transform: capitalize;
}

.connection-dot {
  width: 10px;
  height: 10px;

  flex-shrink: 0;

  border: 1.5px solid #111;
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


/* =========================================
   TABLET
========================================= */

@media (max-width: 900px) {
  .topbar {
    padding-left: 20px;
    padding-right: 20px;
  }

  .leave-button {
    left: 20px;
  }

  .top-actions {
    right: 20px;
  }

  .brand-title {
    font-size: 1.9rem;
  }

  .brand-mark {
    width: 56px;
    height: 56px;

    font-size: 1.5rem;
  }
}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 680px) {
  .topbar {
    height: 110px;
    min-height: 110px;

    padding: 14px 16px;
  }

  .brand {
    gap: 9px;
  }

  .brand-title {
    font-size: 1.55rem;
  }

  .brand-title strong {
    padding: 3px 7px 5px;

    border-width: 2px;
    border-radius: 8px;
  }

  .brand-mark {
    width: 46px;
    height: 46px;

    border-width: 2px;

    font-size: 1.25rem;

    box-shadow: 3px 3px 0 #111;
  }

  .brand-subtitle {
    margin-top: 9px;

    font-size: 0.58rem;
    letter-spacing: 0.22em;
  }

  .leave-button {
    top: 15px;
    left: 14px;

    padding: 8px 10px;

    font-size: 0.65rem;
  }

  .top-actions {
    display: none;
  }
}


/* Very small screens */
@media (max-width: 500px) {
  .leave-button {
    padding: 8px;

    font-size: 0;
  }

  .leave-button .arrow {
    font-size: 1.1rem;
  }
}
</style>