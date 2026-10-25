<script setup lang="ts">
import { ref } from 'vue'

type Variant = 'checker' | 'notebook' | 'lines'

interface VariantMeta {
  id: Variant
  label: string
  // 对应原 demo 的背景样式
  bg: string
  size: string
  baseColor: string
}

// 三种网格背景变体：棋盘（最精致）、作业本方格、纯线条网格
const variants = ref<VariantMeta[]>([
  {
    id: 'checker',
    label: '棋盘背景',
    bg: `linear-gradient(45deg, #bbb 25%, transparent 0),
         linear-gradient(45deg, transparent 75%, #bbb 0),
         linear-gradient(45deg, #bbb 25%, transparent 0),
         linear-gradient(45deg, transparent 75%, #bbb 0)`,
    size: '30px 30px',
    baseColor: '#58a',
  },
  {
    id: 'notebook',
    label: '作业本方格',
    bg: `linear-gradient(white 1px, transparent 0),
         linear-gradient(90deg, white 1px, transparent 0)`,
    size: '30px 30px',
    baseColor: '#58a',
  },
  {
    id: 'lines',
    label: '红线条网格',
    bg: `linear-gradient(90deg, rgba(200, 0, 0, 0.5) 50%, transparent 0),
         linear-gradient(rgba(200, 0, 0, 0.5) 50%, transparent 0)`,
    size: '30px 30px',
    baseColor: '#58a',
  },
])

// 棋盘的 4 层渐变需要不同 background-position 才能拼出方格
const positions: Record<Variant, string> = {
  checker: '0 0, 15px 15px, 15px 15px, 30px 30px',
  notebook: '0 0, 0 0',
  lines: '0 0, 0 0',
}

const current = ref<Variant>('checker')

const active = () => variants.value.find((v) => v.id === current.value)!
</script>

<template>
  <div
    class="demo"
    :style="{
      backgroundColor: active().baseColor,
      backgroundImage: active().bg,
      backgroundSize: active().size,
      backgroundPosition: positions[current],
    }"
  >
    <div class="controls">
      <button
        v-for="v in variants"
        :key="v.id"
        class="btn"
        :class="{ on: current === v.id }"
        @click="current = v.id"
      >
        {{ v.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  position: relative;
}

.controls {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.85);
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn {
  padding: 6px 14px;
  font-size: 0.9rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.btn.on {
  background: #58a;
  color: #fff;
}
</style>
