<script setup lang="ts">
import { computed } from 'vue'

const columns = computed(() => [
  [
    '/demos/carousel/qq/01.jpg',
    '/demos/carousel/qq/02.jpg',
    '/demos/carousel/qq/03.jpg',
    '/demos/carousel/qq/04.jpg',
    '/demos/carousel/qq/05.jpg',
    '/demos/carousel/qq/06.png',
  ],
  [
    '/demos/carousel/qq/07.jpg',
    '/demos/carousel/qq/08.jpg',
    '/demos/carousel/qq/09.jpg',
    '/demos/carousel/qq/10.png',
    '/demos/carousel/qq/11.jpg',
    '/demos/carousel/qq/12.jpg',
  ],
  [
    '/demos/carousel/qq/13.jpg',
    '/demos/carousel/qq/14.jpg',
    '/demos/carousel/qq/15.jpg',
    '/demos/carousel/qq/16.jpg',
    '/demos/carousel/qq/17.jpg',
    '/demos/carousel/qq/18.jpg',
  ],
])
</script>

<template>
  <div class="demo">
    <main>
      <section v-for="(col, i) in columns" :key="i" :class="{ side: i === 0 || i === 2 }">
        <img v-for="img in col" :key="img" :src="img" alt="" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.demo {
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fffaff;
  overflow-y: auto;
}

main {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(3, 430px);
  overflow-y: hidden;
  padding: 50px 20px;
}

section {
  display: flex;
  gap: 2rem;
  flex-direction: column;
}

/* 侧边两列：随容器滚动反向流动，形成视差 */
section.side {
  flex-direction: column-reverse;
}

section img {
  width: 430px;
  max-width: 100%;
  height: 250px;
  object-fit: cover;
  box-shadow: 0 0 10px #0002;
  border-radius: 5px;
  transition: 0.3s;
}

section img:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(150, 50, 50, 0.5);
}
</style>
