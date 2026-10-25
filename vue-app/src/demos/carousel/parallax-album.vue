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
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.demo {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #fffaff;
  min-height: 100vh;
}

main {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(3, 1fr);
  max-width: 1400px;
  width: 100%;
  overflow-y: hidden;
  padding: 50px 20px;
}

section {
  display: flex;
  gap: 2rem;
  flex-direction: column;
}

/* 侧边两列：随页面滚动反向流动，形成视差 */
section.side {
  animation: scroller linear;
  animation-timeline: scroll(root);
  flex-direction: column-reverse;
  translate: 0% calc(-100% + 100vh);
}

@keyframes scroller {
  to {
    translate: 0% calc(100% - 100vh);
  }
}

section img {
  width: 100%;
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

@media (max-width: 768px) {
  main {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  main {
    grid-template-columns: 1fr;
  }

  section.side {
    animation: none;
    translate: none;
    flex-direction: column;
  }
}
</style>
