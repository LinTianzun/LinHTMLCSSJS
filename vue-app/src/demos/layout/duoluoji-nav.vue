<script setup lang="ts">
import { computed } from 'vue'

// 导航项：文字 + 对应颜色（通过 --clr 自定义属性传递）
interface NavLink {
  text: string
  clr: string
}

// 每个字母携带随机动画时长/延迟（替代原版 querySelectorAll + Math.random 改写 DOM 的逻辑）
interface Letter {
  char: string
  duration: number
  delay: number
}

const links: NavLink[] = [
  { text: ' Home', clr: '#00ade1' },
  { text: ' About', clr: '#ff6493' },
  { text: ' Services', clr: '#ffdd1c' },
  { text: ' Team', clr: '#00dc82' },
  { text: ' Contact', clr: '#dc00d4' },
]

// 将每个链接的文字拆成带随机动画参数的字母数组（对应原版 innerHTML = split('').map(span) 逻辑）
const linkLetters = computed<Letter[][]>(() =>
  links.map((link) =>
    link.text.split('').map((char) => {
      const duration = Math.random() * 5
      return {
        char,
        duration: 0.25 + duration,
        delay: 0.25 + duration,
      }
    }),
  ),
)
</script>

<template>
  <div class="demo">
    <ul>
      <li
        v-for="(link, i) in links"
        :key="i"
        :style="{ '--clr': link.clr } as Record<string, string>"
      >
        <a href="#" :data-text="link.text">
          <span
            v-for="(letter, j) in linkLetters[i]"
            :key="j"
            :style="{
              animationDuration: letter.duration + 's',
              animationDelay: letter.delay + 's',
            } as Record<string, string>"
          >{{ letter.char }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #252839;
}

ul {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

ul li {
  position: relative;
  list-style: none;
}

ul li a {
  position: relative;
  font-size: 3em;
  text-decoration: none;
  color: #fff2;
  letter-spacing: 0.25em;
  line-height: 1em;
  text-transform: capitalize;
}

ul li a::before {
  content: attr(data-text);
  position: absolute;
  color: var(--clr);
  width: 0;
  overflow: hidden;
  border-right: 6px solid var(--clr);
  transition: 1s;
}

ul li a:hover::before {
  width: 100%;
  filter: drop-shadow(0 0 25px var(--clr));
}

ul li a span {
  position: relative;
  animation: animateText linear infinite;
}

ul:hover li a span {
  opacity: 0.1;
  animation-play-state: paused;
}

@keyframes animateText {
  0%,
  20% {
    color: #fff2;
    filter: drop-shadow(0 0 0 var(--clr));
  }

  21.001%,
  79.999% {
    color: var(--clr);
    filter: drop-shadow(0 0 25px var(--clr));
  }

  80%,
  100% {
    color: #fff2;
    filter: drop-shadow(0 0 0 var(--clr));
  }
}
</style>
