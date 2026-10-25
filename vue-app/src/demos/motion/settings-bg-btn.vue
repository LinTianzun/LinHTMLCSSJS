<script setup lang="ts">
import { computed, ref } from 'vue'

type ThemeId = 'light-theme' | 'dark-theme' | 'black-theme'

const theme = ref<ThemeId>('light-theme')

const themes: { id: ThemeId; icon: string; label: string }[] = [
  { id: 'light-theme', icon: 'sunny-outline', label: 'Light' },
  { id: 'dark-theme', icon: 'moon-outline', label: 'Dark' },
  { id: 'black-theme', icon: 'contrast-outline', label: 'Black' },
]

const items = [
  { icon: 'settings-outline', label: 'Account setting' },
  { icon: 'chatbubble-ellipses-outline', label: 'Give Feedback' },
  { icon: 'alert-circle-outline', label: 'About' },
  { icon: 'mail-outline', label: 'Support' },
]

const sliderIndex = computed(() => themes.findIndex((t) => t.id === theme.value))

const cssVars = computed<Record<string, string>>(() => {
  const palettes: Record<ThemeId, Record<string, string>> = {
    'light-theme': {
      '--c-text-primary': '#191919',
      '--c-text-secondary': '#737374',
      '--c-border-primary': '#ccc',
      '--c-bg-body': '#ccc',
      '--c-bg-primary': '#fff',
      '--c-bg-secondary': '#d4d8dd',
      '--c-bg-button': '#fff',
    },
    'dark-theme': {
      '--c-text-primary': '#eee',
      '--c-text-secondary': '#d3d5db',
      '--c-border-primary': '#454545',
      '--c-bg-body': '#5e5e5e',
      '--c-bg-primary': '#323339',
      '--c-bg-secondary': '#222128',
      '--c-bg-button': '#494a50',
    },
    'black-theme': {
      '--c-text-primary': '#edeeef',
      '--c-text-secondary': '#d4d7e1',
      '--c-border-primary': '#323232',
      '--c-bg-body': '#000',
      '--c-bg-primary': '#1b1d23',
      '--c-bg-secondary': '#000001',
      '--c-bg-button': '#343844',
    },
  }
  return palettes[theme.value]
})
</script>

<template>
  <div class="demo" :style="cssVars">
    <div class="menu">
      <div class="menu-header">
        <h2 class="menu-header-title">Theme</h2>
        <div class="theme-switcher">
          <template v-for="t in themes" :key="t.id">
            <input
              type="radio"
              name="themes"
              :id="t.id"
              :value="t.id"
              v-model="theme"
            />
            <label :for="t.id">
              <ion-icon :name="t.icon"></ion-icon>
              <span>{{ t.label }}</span>
            </label>
          </template>
          <span
            class="slider"
            :style="{ transform: `translateX(${sliderIndex * 100}%)` }"
          ></span>
        </div>
      </div>
      <div class="menu-body">
        <a v-for="item in items" :key="item.label" href="#" @click.prevent>
          <ion-icon :name="item.icon"></ion-icon>
          {{ item.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  font-family: sans-serif;
  line-height: 1.5;
  justify-content: center;
  background-color: var(--c-bg-body);
  transition: background-color 0.3s ease;
  color: var(--c-text-primary);
  border-radius: 8px;
}

.menu {
  width: 90%;
  margin-top: 80px;
  margin-bottom: 40px;
  max-width: 320px;
  background-color: var(--c-bg-primary);
  transition: background-color 0.3s ease;
  border-radius: 15px;
}

.menu-header {
  padding: 1rem;
}

.menu-header-title {
  font-size: 1.2rem;
  color: var(--c-text-secondary);
  font-weight: 700;
}

.theme-switcher input {
  display: none;
}

.theme-switcher {
  position: relative;
  background-color: var(--c-bg-secondary);
  border-radius: 10px;
  display: flex;
  padding: 0 3px;
}

.theme-switcher label {
  position: relative;
  display: flex;
  z-index: 2;
  padding: 8px 0;
  width: calc(100% / 3);
  color: var(--c-text-secondary);
}

.theme-switcher label span {
  display: flex;
  justify-content: center;
  font-weight: 600;
  opacity: 0.8;
}

.theme-switcher label span:hover {
  opacity: 1;
  cursor: pointer;
}

.theme-switcher .slider {
  position: absolute;
  z-index: 1;
  width: calc((100% - 6px) / 3);
  top: 3px;
  bottom: 3px;
  left: 3px;
  transform: translateX(0);
  border-radius: 8px;
  transition: 0.3s ease transform 0.35s ease-out;
  background-color: var(--c-bg-button);
}

.menu-body a {
  text-decoration: none;
  color: inherit;
  display: flex;
  padding: 0.6rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: 0.3s ease;
}

.menu-body a:hover {
  background-color: var(--c-bg-secondary);
}

ion-icon {
  margin-right: 5px;
  font-size: 20px;
  margin: 2px;
}
</style>
