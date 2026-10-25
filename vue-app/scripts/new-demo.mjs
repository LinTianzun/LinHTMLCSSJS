#!/usr/bin/env node
/**
 * new-demo.mjs — 快速新建一个 demo 组件
 *
 * 用法：
 *   node scripts/new-demo.mjs <categoryId> <demoId> "demo 标题"
 *
 * 示例：
 *   node scripts/new-demo.mjs motion ripple-button "波纹按钮"
 *
 * 做三件事：
 *   1. 在 src/demos/<categoryId>/<demoId>.vue 生成响应式模板
 *   2. 在 registry.ts 对应分类的 demos 数组末尾追加条目（含 skills 占位）
 *   3. 创建 public/demos/<categoryId>/<demoId>/ 资源目录
 *
 * 路由是 import.meta.glob 自动生成的，无需改 router。
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// ── 参数校验 ──────────────────────────────────────────────
const [, , catId, demoId, title] = process.argv

if (!catId || !demoId || !title) {
  console.error('用法: node scripts/new-demo.mjs <categoryId> <demoId> "标题"')
  console.error('已有分类: layout, carousel, motion, form, game, basics')
  process.exit(1)
}

const vuePath = resolve(root, 'src/demos', catId, `${demoId}.vue`)
const pubDir = resolve(root, 'public/demos', catId, demoId)
const regPath = resolve(root, 'src/demos/registry.ts')

if (existsSync(vuePath)) {
  console.error(`✗ 已存在: ${vuePath}`)
  process.exit(1)
}

// ── 1. 生成 .vue 模板（响应式骨架） ────────────────────────
const template = `<script setup lang="ts">
import { ref } from 'vue'

// TODO: 在这里写你的逻辑
</script>

<template>
  <div class="demo">
    <!-- TODO: 在这里写你的模板 -->
    <h1>${title}</h1>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* TODO: 在这里写你的样式 */
}

/* 响应式断点：改窄屏时调整布局 */
@media (max-width: 768px) {
}

@media (max-width: 480px) {
}
</style>
`

mkdirSync(dirname(vuePath), { recursive: true })
writeFileSync(vuePath, template, 'utf8')
console.log(`✓ 创建组件: src/demos/${catId}/${demoId}.vue`)

// ── 2. 追加到 registry.ts ──────────────────────────────────
let reg = readFileSync(regPath, 'utf8')

// 找到对应分类的 demos 数组末尾（最后一个 } ] 之前插入）
// 策略：在 `    ],` 前面（该分类 demos 闭合处）插入新条目
const catBlock = reg.match(
  new RegExp(`(id: '${catId}',[\\s\\S]*?demos: \\[)([\\s\\S]*?)(\\n    \\])`)
)

if (!catBlock) {
  console.error(`✗ 在 registry.ts 中找不到分类 "${catId}"，请先在 registry.ts 手动添加分类。`)
  process.exit(1)
}

const existing = catBlock[2].trimEnd()
const newEntry = existing.endsWith(',') ? '' : ',' // 确保前一行有逗号
const insertion = `${newEntry}\n      { id: '${demoId}', title: '${title}', skills: [] },`

reg = reg.replace(catBlock[0], catBlock[1] + existing + insertion + catBlock[3])
writeFileSync(regPath, reg, 'utf8')
console.log(`✓ 注册到 registry.ts: ${catId} / ${demoId}`)

// ── 3. 创建资源目录 ────────────────────────────────────────
mkdirSync(pubDir, { recursive: true })
console.log(`✓ 资源目录: public/demos/${catId}/${demoId}/`)

console.log(`\n完成！接下来：`)
console.log(`  1. 编辑 src/demos/${catId}/${demoId}.vue 写你的 demo`)
console.log(`  2. 在 registry.ts 里把 skills: [] 补上技能标签`)
console.log(`  3. 如果有图片/音频，放到 public/demos/${catId}/${demoId}/`)
console.log(`  4. npm run dev 预览，访问 /#/<catId>/<demoId>`)
