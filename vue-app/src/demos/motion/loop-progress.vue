<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const progressValue = ref(0)
const progressEndValue = 65
const speed = 250
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    progressValue.value++
    if (progressValue.value >= progressEndValue) {
      window.clearInterval(timer)
      timer = undefined
    }
  }, speed)
})

onUnmounted(() => {
  if (timer !== undefined) window.clearInterval(timer)
})
</script>

<template>
  <div class="demo">
    <div class="container">
      <div
        class="circular-progress"
        :style="{
          background: `conic-gradient(#4d5bf9 ${progressValue * 3.6}deg, #cadcff ${progressValue * 3.6}deg)`,
        }"
      >
        <div class="value-container">{{ progressValue }}%</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(#e8f0f7 50%, #4d5bf9 50%);
  position: relative;
}

.container {
  height: 400px;
  width: 400px;
  max-width: 90%;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  box-shadow: 20px 20px 40px rgba(60, 60, 150, 0.25);
  display: grid;
  place-items: center;
}

.circular-progress {
  position: relative;
  height: 250px;
  width: 250px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.circular-progress:before {
  content: '';
  position: absolute;
  height: 84%;
  width: 84%;
  background-color: #ffffff;
  border-radius: 50%;
}

.value-container {
  position: relative;
  font-family: 'Poppins', sans-serif;
  font-size: 50px;
  color: #231c3d;
}

@media (max-width: 480px) {
  .container {
    height: 300px;
    width: 300px;
  }

  .circular-progress {
    height: 180px;
    width: 180px;
  }

  .value-container {
    font-size: 32px;
  }
}
</style>
