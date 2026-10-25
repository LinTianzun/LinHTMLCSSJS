<script setup lang="ts">
import { ref } from 'vue'

const answered = ref(false)
const noLeft = ref('')
const noTop = ref('')

function dodge() {
  const wrapperRect = { width: 600, height: 400 }
  const noRect = { width: 150, height: 46 }
  noLeft.value = `${Math.floor(Math.random() * (wrapperRect.width - noRect.width))}px`
  noTop.value = `${Math.floor(Math.random() * (wrapperRect.height - noRect.height))}px`
}
</script>

<template>
  <div class="demo">
    <form action="" class="wrapper" @submit.prevent>
      <ion-icon class="iconHihg wen" name="help-circle" :class="{ hidden: answered }"></ion-icon>
      <ion-icon
        class="iconHihg ai"
        name="heart-circle"
        :class="{ shown: answered }"
      ></ion-icon>
      <h2 class="title">
        <template v-if="!answered">喜欢我吗?</template>
        <template v-else>2024 请从爱自己开始<br /></template>
      </h2>
      <div class="btn-group">
        <button
          type="button"
          class="btn yes"
          :class="{ disappear: answered }"
          @click="answered = true"
        >
          爱的深沉
        </button>
        <button
          type="button"
          class="btn no"
          :class="{ disappear: answered }"
          :style="{ left: noLeft, top: noTop }"
          @mouseover="dodge"
        >
          滚一边去
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.demo {
  --purple: #792ddd;
  min-height: 320px;
  background-color: var(--purple);
  display: grid;
  place-items: center;
  user-select: none;
  border-radius: 8px;
}

.wrapper {
  width: 600px;
  max-width: 95%;
  height: 400px;
  background-color: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
}

.wrapper .iconHihg {
  font-size: 7em;
  color: var(--purple);
  border: 0px solid transparent;
  outline: 3px solid;
  border-radius: 50%;
  transition: filter 1.5s ease;
}

.wrapper .iconHihg.ai {
  display: none;
}

.wrapper .iconHihg.ai.shown {
  display: block;
  outline: none;
  filter: drop-shadow(0 0 60px);
}

.wrapper .iconHihg.wen.hidden {
  display: none;
}

.wrapper .title {
  font-size: 2.6em;
  color: var(--purple);
  letter-spacing: 2px;
  text-align: center;
}

.wrapper .btn-group {
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.wrapper .btn-group .btn {
  width: 150px;
  height: inherit;
  border: 2px solid var(--purple);
  border-radius: calc(infinity * 1px);
  position: absolute;
  font-size: 1em;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  animation-duration: 2s;
  animation-delay: 0s;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  box-shadow: 4px 4px 20px 4px rgba(121, 45, 221, 0.4);
}

.btn.yes {
  margin-left: -200px;
  color: #fff;
  background-color: var(--purple);
  animation-delay: 1s;
  transition: 0.3s linear;
}

.btn.yes:hover {
  opacity: 0.9;
}

.btn.no {
  margin-right: -200px;
  color: var(--purple);
  left: 0;
  top: 0;
}

.btn.disappear {
  animation-name: disappear;
}

@keyframes disappear {
  0% {
    pointer-events: none;
  }

  100% {
    opacity: 0;
    filter: blur(20px);
    transform: scale(2);
    visibility: hidden;
  }
}
</style>
