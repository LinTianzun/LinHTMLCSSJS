<script setup lang="ts">
import { computed, ref } from 'vue'

const totalPages = ref(7)
const currentPage = ref(4)

/** 单个页码项的展示模型 */
interface PageItem {
  type: 'number' | 'dots'
  value: number | null
  key: string
}

/**
 * 原生 script.js 的省略号逻辑：
 * 当总页数大于 4、5 时插入首尾页与省略号，中间显示当前页前后各一页。
 */
const pages = computed<PageItem[]>(() => {
  const total = totalPages.value
  const page = currentPage.value
  const list: PageItem[] = []

  // Prev 是否显示：当前页不是第一页时显示
  // （Prev 单独渲染，这里只算数字与省略号）

  if (page > 2) {
    if (total > 4) {
      list.push({ type: 'number', value: 1, key: 'n1' })
      if (page > 3 && total > 5) {
        list.push({ type: 'dots', value: null, key: 'd1' })
      }
    }
  }

  // 中间连续页码段
  let beforePages = page - 1
  let afterPages = page + 1
  if (total > 2) {
    if (page === total) beforePages -= 2
    else if (page === total - 1) beforePages -= 1
    if (page === 1) afterPages += 2
    else if (page === 2) afterPages += 1
  }

  for (let p = beforePages; p <= afterPages; p++) {
    if (p > total || p < 1) continue
    list.push({ type: 'number', value: p, key: 'n' + p })
  }

  if (page < total - 1) {
    if (total > 4) {
      if (page < total - 2 && total > 5) {
        list.push({ type: 'dots', value: null, key: 'd2' })
      }
      list.push({ type: 'number', value: total, key: 'n' + total })
    }
  }

  return list
})

function go(page: number): void {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
}

function prev(): void {
  go(currentPage.value - 1)
}

function next(): void {
  go(currentPage.value + 1)
}
</script>

<template>
  <div class="demo">
    <div class="pagination">
      <ul>
        <li
          v-if="currentPage > 1"
          class="btn prev"
          @click="prev"
        >
          <span><span class="arrow">‹</span> Prev</span>
        </li>

        <li
          v-for="item in pages"
          :key="item.key"
          class="numb"
          :class="{ active: item.type === 'number' && item.value === currentPage }"
          @click="item.type === 'number' && item.value !== null && go(item.value)"
        >
          <span v-if="item.type === 'number'">{{ item.value }}</span>
          <span v-else class="dots">...</span>
        </li>

        <li
          v-if="currentPage < totalPages"
          class="btn next"
          @click="next"
        >
          <span>Next <span class="arrow">›</span></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: linear-gradient(
    to right bottom,
    #e8eaf9 20%,
    #e0b8cf 50%,
    #55aafa 70%,
    #105d89 100%
  );
}

.pagination ul {
  display: flex;
  background: #fff;
  padding: 8px;
  border-radius: 50px;
  list-style: none;
  margin: 0;
}

.pagination ul li {
  color: #7daeed;
  list-style: none;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.pagination ul li.numb {
  border-radius: 50%;
  height: 45px;
  width: 45px;
  margin: 0 3px;
}

.pagination ul li.dots {
  font-size: 22px;
  cursor: default;
}

.pagination ul li.btn {
  padding: 0 20px;
  font-weight: 600;
}

.pagination ul li.prev {
  border-radius: 25px 5px 5px 25px;
}

.pagination ul li.prev:hover {
  color: #fff;
  background: linear-gradient(to right bottom, #e8eaf9, #e0b8cf, #e1bbd2);
}

.pagination ul li.next {
  border-radius: 5px 25px 25px 5px;
}

.pagination ul li.next:hover {
  color: #fff;
  background: linear-gradient(
    to right bottom,
    #b0b3de 20%,
    #7daeed 50%,
    #55aafa
  );
}

.pagination ul li.active,
.pagination ul li.numb:hover {
  color: #fff;
  background: linear-gradient(to right bottom, #e8eaf9, #e0b8cf, #55aafa);
}

.arrow {
  font-size: 16px;
  display: inline-block;
}
</style>
