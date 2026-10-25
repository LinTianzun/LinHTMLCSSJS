<script setup lang="ts">
import { ref } from 'vue'

// 下拉是否展开（原版通过 classList.toggle('active') 实现）
const isOpen = ref(false)

// 当前选中的语言（原版通过 jQuery 设置 #finalStubjmc / #finalStubjbh）
const selected = ref('Select Language')
const selectedIndex = ref(-1)

const options = ['Java', 'c#', 'Python', 'HTML', 'CSS', 'JavaScript']

function toggle(): void {
  isOpen.value = !isOpen.value
}

function select(index: number): void {
  selectedIndex.value = index
  selected.value = options[index] ?? ''
  isOpen.value = false
}
</script>

<template>
  <div class="demo">
    <div class="select-menu">
      <div class="selectNa" @click="toggle">
        <span class="finalStubjmc">{{ selected }}</span>
        <!-- 原版使用 iconfont 下拉箭头，这里用 unicode 字符替代 -->
        <a class="iconDo" :class="{ up: isOpen }">▾</a>
      </div>
      <div class="options-list" :class="{ active: isOpen }">
        <div
          v-for="(option, index) in options"
          :key="option"
          class="option"
          :class="{ selected: selectedIndex === index }"
          @click="select(index)"
        >
          {{ option }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0 1rem;
  box-sizing: border-box;
  background-color: #e9d5ca;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-menu {
  width: min(300px, 100%);
  cursor: pointer;
  position: relative;
}

.selectNa {
  background-color: #695cfe;
  padding: 20px;
  color: #fff;
  font-weight: 500;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.options-list {
  position: absolute;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 6px;
  margin-top: 5px;
  padding: 0 20px;
  max-height: 102px;
  overflow-y: auto;
  transition: 0.4s linear 0.2s;
  height: 0;
  box-sizing: border-box;
}

.option {
  padding: 8px 0;
  font-weight: 500;
  font-size: 14px;
  transition: 0.3s ease-in-out;
}

.option:hover,
.option.selected {
  color: #00a8ff;
}

.options-list::-webkit-scrollbar {
  width: 4px;
  background-color: #eee;
}

.options-list::-webkit-scrollbar-thumb {
  background-color: #00a8ff;
}

.options-list.active {
  height: 102px;
}

.iconDo {
  transition: 0.3s ease-in-out;
}

.iconDo.up {
  transform: rotate(-180deg);
}

@media (max-width: 480px) {
  .selectNa {
    padding: 16px;
  }

  .option {
    font-size: 13px;
  }
}
</style>
