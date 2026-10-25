<script setup lang="ts">
// 两个加载动画合并展示：液体(gooey) + 酷炫(光条)
const gooeyDots = [1, 2, 3, 4, 5, 6, 7]
const bars = Array.from({ length: 20 }, (_, i) => i + 1)
</script>

<template>
  <div class="demo">
    <div class="stage gooey-stage">
      <div class="loader">
        <span v-for="i in gooeyDots" :key="i" :style="{ '--i': i }"></span>
      </div>
      <svg class="gooey-svg">
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          <feColorMatrix
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -10"
          />
        </filter>
      </svg>
    </div>
    <div class="stage bars-stage">
      <div class="loading">
        <span v-for="i in bars" :key="i" :style="{ '--i': i }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stage {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
  border-radius: 8px;
}

.gooey-stage {
  background: #010b10;
}

.bars-stage {
  background: linear-gradient(
    to right,
    rgb(18, 194, 233),
    rgb(196, 113, 237),
    rgb(246, 79, 89)
  );
}

/* 液体加载动画 */
.gooey-svg {
  width: 0;
  height: 0;
  position: absolute;
}

.loader {
  position: relative;
  width: 200px;
  height: 200px;
  filter: url(#gooey);
}

.loader span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  animation: animate-gooey 4s ease-in-out infinite;
  animation-delay: calc(0.2s * var(--i));
}

.loader span::before {
  content: '';
  position: absolute;
  top: 0;
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 30px #03a9f4;
  background: linear-gradient(#fce4ec, #03a9f4);
}

@keyframes animate-gooey {
  0% {
    transform: rotate(0deg);
  }
  50%,
  100% {
    transform: rotate(360deg);
  }
}

/* 酷炫光条加载动画 */
.loading {
  position: relative;
  display: flex;
  gap: 15px;
}

.loading span {
  position: relative;
  width: 5px;
  height: 20px;
}

.loading span::before {
  content: '';
  position: absolute;
  inset: 0;
  animation: animate-bar 8s linear infinite;
  animation-delay: calc(var(--i) * 0.1s);
}

@keyframes animate-bar {
  0% {
    background: #7303c0;
    box-shadow:
      0 0 5px #7303c0,
      0 0 15px #7303c0,
      0 0 30px #7303c0,
      0 0 50px #7303c0;
    rotate: 0deg;
  }

  20% {
    background: #7303c0;
    box-shadow:
      0 0 5px #7303c0,
      0 0 15px #7303c0,
      0 0 30px #7303c0,
      0 0 50px #7303c0;
    rotate: 0deg;
  }

  40% {
    background: #7303c0;
    box-shadow:
      0 0 5px #7303c0,
      0 0 15px #7303c0,
      0 0 30px #7303c0,
      0 0 50px #7303c0;
    rotate: 90deg;
    transform-origin: bottom;
    filter: hue-rotate(0deg);
  }

  80% {
    background: #7303c0;
    box-shadow:
      0 0 5px #7303c0,
      0 0 15px #7303c0,
      0 0 30px #7303c0,
      0 0 50px #7303c0;
    rotate: 90deg;
    transform-origin: bottom;
    filter: hue-rotate(360deg);
  }

  90% {
    background: #fdeff9;
    box-shadow: none;
    rotate: 0deg;
  }

  90.1%,
  100% {
    background: #fdeff9;
    box-shadow: none;
  }
}
</style>
