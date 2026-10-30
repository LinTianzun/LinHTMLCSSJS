<script setup lang="ts">
import { computed } from 'vue'
import { IONICON_PATHS } from './ionicons'

/**
 * 本地版 ion-icon：按名字渲染内联 ionicons SVG，
 * 尺寸跟随 font-size（1em），颜色跟随 currentColor，与原 web component 行为一致。
 */
const props = defineProps<{ name: string }>()

const html = computed(() => IONICON_PATHS[props.name] ?? '')
</script>

<template>
  <svg class="ionicon" viewBox="0 0 512 512" aria-hidden="true" v-html="html"></svg>
</template>

<style scoped>
.ionicon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: -0.125em;
}
</style>
