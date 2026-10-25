<script setup lang="ts">
import { computed } from 'vue'
import { assetUrl } from '../asset'

interface Panel {
  img: string
  rotate: number
}

const panels = computed<Panel[]>(() => [
  { img: assetUrl('/demos/carousel/seasons/01chun.jpeg'), rotate: 0 },
  { img: assetUrl('/demos/carousel/seasons/02xia.jpeg'), rotate: 90 },
  { img: assetUrl('/demos/carousel/seasons/03qiu.jpeg'), rotate: 180 },
  { img: assetUrl('/demos/carousel/seasons/04dong.jpeg'), rotate: 270 },
])
</script>

<template>
  <div class="demo">
    <div class="shell">
      <div class="content">
        <div
          v-for="panel in panels"
          :key="panel.img"
          class="item"
          :style="{
            backgroundImage: `url(${panel.img})`,
            transform: `rotateY(${panel.rotate}deg) translateZ(35vw)`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);
  overflow: hidden;
}

.shell {
  position: relative;
  width: 60vw;
  height: 40vw;
  max-width: 380px;
  max-height: 250px;
  margin: 0;
  color: white;
  perspective: 1000px;
  transform-origin: center;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform-style: preserve-3d;
  transform: translateZ(-30vw) rotateY(0);
  animation: carousel 9s infinite cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

.item {
  position: absolute;
  width: 60vw;
  height: 40vw;
  max-width: 380px;
  max-height: 250px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  background-size: cover;
  transition: transform 0.5s ease-in-out;
  animation-timing-function: linear;
  -webkit-box-reflect: below 25px -webkit-linear-gradient(transparent 50%, rgba(255, 255, 255, 0.3));
}

@keyframes carousel {

  0%,
  12% {
    transform: translateZ(-35vw) rotateY(0);
  }

  24%,
  36% {
    transform: translateZ(-35vw) rotateY(-90deg);
  }

  48%,
  60% {
    transform: translateZ(-35vw) rotateY(-180deg);
  }

  72%,
  84% {
    transform: translateZ(-35vw) rotateY(-270deg);
  }

  100% {
    transform: translateZ(-35vw) rotateY(-360deg);
  }
}
</style>
