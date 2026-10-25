<script setup lang="ts">
import { ref } from 'vue'

const isNight = ref(false)
</script>

<template>
  <div class="demo" :class="{ night: isNight }">
    <input type="checkbox" class="sr" id="toggle" v-model="isNight" />
    <label for="toggle" class="toggle">
      <span></span>
    </label>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.25s,
    background-position 0.5s;
  background: linear-gradient(
    to bottom right,
    #f9fffb 25%,
    #ffd5bc 50%,
    #490077 75%,
    #01072a
  );
  background-size: 400% 400%;
  background-position: top left;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.demo.night {
  background-position: 100% 100%;
  color: #d0d0d0;
}

.sr {
  position: absolute;
  opacity: 0;
}

.toggle {
  font-size: 32px;
  border: 2px solid currentColor;
  border-radius: 32px;
  cursor: pointer;
  display: block;
  height: 32px;
  position: relative;
  width: 60px;
}

.toggle::before,
.toggle::after {
  content: '';
  display: block;
  border-radius: 16px;
  position: absolute;
  z-index: 1;
}

.toggle::after {
  height: 18px;
  width: 18px;
  box-shadow: 4px 4px #5901d8;
  right: 9px;
  top: 3px;
}

.toggle::before {
  height: 10px;
  width: 10px;
  background-color: #ffc409;
  outline: 4px dotted #ffc409;
  left: 11px;
  top: 11px;
}

.toggle span {
  background-color: currentColor;
  border-radius: 32px;
  display: block;
  height: 24px;
  left: 4px;
  overflow: hidden;
  position: absolute;
  top: 4px;
  text-indent: -9999px;
  transition: left 0.25s;
  width: 24px;
  z-index: 2;
}

.sr:checked ~ .toggle span {
  left: 32px;
}
</style>
