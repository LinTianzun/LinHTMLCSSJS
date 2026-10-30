<script setup lang="ts">
import IonIcon from '../../components/IonIcon.vue'

interface PulseLink {
  href: string
  icon: string
  filter?: string
  alt: string
}

const links: PulseLink[] = [
  { href: '#', icon: 'finger-print-outline', alt: '指纹' },
  { href: '#', icon: 'ribbon-outline', filter: 'hue-rotate(120deg)', alt: '丝带' },
  { href: '#', icon: 'megaphone-outline', filter: 'grayscale()', alt: '喇叭' },
]
</script>

<template>
  <div class="demo">
    <a
      v-for="link in links"
      :key="link.icon"
      href="#"
      class="pulse"
      :style="link.filter ? { filter: link.filter } : undefined"
      :aria-label="link.alt"
      @click.prevent
    >
      <IonIcon :name="link.icon"></IonIcon>
    </a>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(2rem, 18vw, 9rem);
  background: #333;
  border-radius: 8px;
}

@media (max-width: 480px) {
  .demo {
    gap: 1.5rem;
  }
}

.pulse .ionicon {
  font-size: 35px;
  position: absolute;
  padding: 7px;
}

.pulse {
  width: 3rem;
  color: #fff;
  transition: all 0.5s ease;
  background: #35d1e6;
}

.pulse,
.pulse::before,
.pulse::after {
  content: '';
  display: grid;
  grid-area: 1 / 1;
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: 0 0 0 0 #35d1e633;
  animation: pulsing 3s linear infinite var(--s, 0s);
}

.pulse::before {
  --s: 1s;
}

.pulse::after {
  --s: 2s;
}

.pulse:hover {
  background: #35d1e633;
  color: #ffffff99;
}

@keyframes pulsing {
  to {
    box-shadow: 0 0 0 6rem #0000;
  }
}
</style>
