<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const isFocused = ref(false)

function submit(): void {
  if (keyword.value.trim()) {
    // 原页面无真实后端，此处仅保留查询意图
  }
}
</script>

<template>
  <div class="demo">
    <div class="search-box" :class="{ active: isFocused || keyword !== '' }">
      <input
        v-model="keyword"
        class="search-txt"
        type="text"
        placeholder="Type to search"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keyup.enter="submit"
      />
      <a href="#" class="search-btn" @click.prevent="submit">
        <svg class="icon" viewBox="0 0 512 512" fill="currentColor">
          <path
            d="M221.09 64a150.91 150.91 0 0 1 119.68 243.6l91.91 91.91a23 23 0 0 1-32.52 32.52l-91.9-91.91A150.91 150.91 0 1 1 221.09 64m0 46a104.91 104.91 0 1 0 0 209.82 104.91 104.91 0 0 0 0-209.82"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e17055;
}

.search-box {
  position: relative;
  background: #2f3640;
  height: 40px;
  border-radius: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
}

.search-box.active > .search-txt {
  width: 240px;
  padding: 0 6px;
}

.search-box.active > .search-btn {
  background: #fff;
}

.search-btn {
  color: #e17055;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2f3640;
  display: flex;
  transition: 0.4s;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.search-txt {
  border: none;
  background: none;
  outline: none;
  padding: 0;
  color: #fff;
  font-size: 16px;
  transition: 0.4s;
  line-height: 40px;
  height: 40px;
  width: 0;
}

.icon {
  width: 22px;
  height: 22px;
}
</style>
