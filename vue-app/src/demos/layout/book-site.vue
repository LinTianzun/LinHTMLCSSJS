<script setup lang="ts">
import { computed, ref } from 'vue'
import { assetUrl } from '../asset'

// 原版 index.html 为空壳，此组件基于原项目的图片资源（book-*.png 等）
// 重新构建一个响应式图书网站布局。

interface Book {
  id: number
  img: string
  title: string
  author: string
  price: number
  discount?: number
}

// 精选图书（首页大卡片）
const homeBooks: Book[] = [
  { id: 1, img: assetUrl('/demos/book-site/home-book-1.png'), title: 'Machine Learning 基础', author: '张涛', price: 89 },
  { id: 2, img: assetUrl('/demos/book-site/home-book-2.png'), title: 'CSS 新世界', author: '李明', price: 69 },
  { id: 3, img: assetUrl('/demos/book-site/home-book-3.png'), title: 'Vue.js 设计与实现', author: '王芳', price: 99 },
  { id: 4, img: assetUrl('/demos/book-site/home-book-4.png'), title: '算法图解', author: '刘强', price: 59 },
]

// 书单列表
const books: Book[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  img: assetUrl(`/demos/book-site/book-${i + 1}.png`),
  title: `图书标题 ${i + 1}`,
  author: `作者 ${String.fromCharCode(65 + (i % 26))}`,
  price: 39 + i * 6,
}))

// 特价图书
const discountBooks: Book[] = [
  { id: 101, img: assetUrl('/demos/book-site/discount-book-1.png'), title: '深度学习入门', author: '陈静', price: 129, discount: 0.5 },
  { id: 102, img: assetUrl('/demos/book-site/discount-book-2.png'), title: 'JavaScript 高级程序设计', author: '赵磊', price: 149, discount: 0.7 },
]

interface Testimonial {
  id: number
  img: string
  name: string
  role: string
  quote: string
}

const testimonials: Testimonial[] = [
  { id: 1, img: assetUrl('/demos/book-site/testimonial-perfil-1.png'), name: '林晓', role: '前端工程师', quote: '这里的书单很全，物流也快！' },
  { id: 2, img: assetUrl('/demos/book-site/testimonial-perfil-2.png'), name: '王鹏', role: '大学生', quote: '学生党买书首选，折扣给力。' },
  { id: 3, img: assetUrl('/demos/book-site/testimonial-perfil-3.png'), name: '赵雪', role: '产品经理', quote: '网站体验流畅，推荐给同事了。' },
  { id: 4, img: assetUrl('/demos/book-site/testimonial-perfil-4.png'), name: '孙悦', role: '设计师', quote: '设计类的书很齐全，常来淘。' },
]

// 分类筛选（响应式图书网站核心交互：点击分类过滤图书列表）
const categories = ['全部', '前端', '后端', '算法', '设计'] as const
type Category = (typeof categories)[number]
const activeCategory = ref<Category>('全部')

const categoryMap: Record<number, Category> = {
  1: '前端', 2: '前端', 3: '前端', 4: '算法',
  5: '后端', 6: '设计', 7: '算法', 8: '后端',
  9: '设计', 10: '前端',
}

const filteredBooks = computed(() =>
  activeCategory.value === '全部'
    ? books
    : books.filter((b) => categoryMap[b.id] === activeCategory.value),
)

// 搜索（联动过滤书名/作者）
const keyword = ref('')
const searching = computed(() =>
  keyword.value.trim()
    ? filteredBooks.value.filter(
        (b) =>
          b.title.includes(keyword.value.trim()) || b.author.includes(keyword.value.trim()),
      )
    : filteredBooks.value,
)

function finalPrice(book: Book): string {
  const price = book.discount ? book.price * book.discount : book.price
  return price.toFixed(2)
}
</script>

<template>
  <div class="demo">
    <header class="site-header">
      <a class="brand" href="#" @click.prevent>
        <img :src="assetUrl('/demos/book-site/favicon.png')" alt="logo" />
        <span>书海书店</span>
      </a>
      <nav class="main-nav">
        <a href="#" @click.prevent>首页</a>
        <a href="#" @click.prevent>分类</a>
        <a href="#" @click.prevent>特价</a>
        <a href="#" @click.prevent>关于</a>
      </nav>
      <input v-model="keyword" class="search" type="search" placeholder="搜索书名 / 作者…" />
    </header>

    <section class="hero">
      <div class="hero-text">
        <h1>探索知识的海洋</h1>
        <p>精选上千本技术与设计图书，响应式布局，随时随地阅读。</p>
        <a class="cta" href="#books" @click.prevent>开始逛逛</a>
      </div>
      <img class="hero-img" :src="assetUrl('/demos/book-site/home-book-1.png')" alt="推荐图书" />
    </section>

    <section class="featured">
      <h2>本周精选</h2>
      <div class="featured-grid">
        <article v-for="book in homeBooks" :key="book.id" class="featured-card">
          <img :src="book.img" :alt="book.title" />
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <p class="price">￥{{ book.price }}</p>
        </article>
      </div>
    </section>

    <section id="books" class="books">
      <h2>图书列表</h2>
      <div class="category-bar">
        <button
          v-for="c in categories"
          :key="c"
          :class="{ active: activeCategory === c }"
          @click="activeCategory = c"
        >
          {{ c }}
        </button>
      </div>
      <p v-if="searching.length === 0" class="empty">没有找到符合条件的图书。</p>
      <div v-else class="book-grid">
        <article v-for="book in searching" :key="book.id" class="book-card">
          <img :src="book.img" :alt="book.title" />
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }} · {{ categoryMap[book.id] }}</p>
          <p class="price">￥{{ book.price }}</p>
        </article>
      </div>
    </section>

    <section class="discount">
      <h2>限时特价</h2>
      <div class="discount-grid">
        <article v-for="book in discountBooks" :key="book.id" class="discount-card">
          <img :src="book.img" :alt="book.title" />
          <div class="discount-info">
            <h3>{{ book.title }}</h3>
            <p class="author">{{ book.author }}</p>
            <p class="price">
              <del>￥{{ book.price }}</del>
              <span class="now">￥{{ finalPrice(book) }}</span>
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="testimonials">
      <h2>读者评价</h2>
      <div class="testimonial-grid">
        <figure v-for="t in testimonials" :key="t.id" class="testimonial-card">
          <img :src="t.img" :alt="t.name" />
          <blockquote>“{{ t.quote }}”</blockquote>
          <figcaption>{{ t.name }} · {{ t.role }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="join" :style="{ backgroundImage: `url(${assetUrl('/demos/book-site/join-bg.jpg')})` }">
      <h2>加入会员，享全场 95 折</h2>
      <button type="button">立即注册</button>
    </section>

    <footer class="site-footer">
      <p>© 2026 书海书店 · 响应式图书网站演示</p>
    </footer>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1f2933;
  background: #faf9f6;
  box-sizing: border-box;
}

.demo * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.demo img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 顶部导航 */
.site-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.8rem 4vw;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2933;
  text-decoration: none;
}

.brand img {
  width: 28px;
  height: 28px;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.main-nav a {
  color: #52606d;
  text-decoration: none;
  font-size: 0.95rem;
}

.main-nav a:hover {
  color: #c9a24b;
}

.search {
  padding: 0.45em 0.9em;
  border: 1px solid #ddd;
  border-radius: 999px;
  outline: none;
  min-width: 200px;
  font: inherit;
}

/* Hero */
.hero {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 4rem 6vw;
  background: linear-gradient(120deg, #fdf6e3, #f3e7d8);
  flex-wrap: wrap;
}

.hero-text {
  flex: 1 1 300px;
}

.hero-text h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  margin-bottom: 0.8rem;
}

.hero-text p {
  color: #52606d;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.cta {
  display: inline-block;
  padding: 0.6em 1.6em;
  background: #c9a24b;
  color: #fff;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
}

.cta:hover {
  background: #b58e3e;
}

.hero-img {
  flex: 1 1 260px;
  max-height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18));
}

/* 通用 section */
section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
}

.featured,
.books,
.discount,
.testimonials {
  padding: 3rem 6vw;
}

/* 精选 */
.featured {
  background: #fff;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.featured-card {
  text-align: center;
  padding: 1rem;
  border: 1px solid #f0ece4;
  border-radius: 12px;
  transition: transform 0.25s, box-shadow 0.25s;
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.featured-card img {
  height: 220px;
  object-fit: contain;
  margin: 0 auto 0.8rem;
}

.featured-card h3,
.book-card h3,
.discount-card h3 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.author {
  color: #7b8794;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.price {
  color: #c0392b;
  font-weight: 700;
}

.price del {
  color: #9aa5b1;
  font-weight: 400;
  margin-right: 0.5em;
}

.price .now {
  font-size: 1.1em;
}

/* 图书列表 + 分类筛选 */
.category-bar {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.category-bar button {
  padding: 0.35em 1.1em;
  border: 1px solid #d9d2c5;
  background: #fff;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  color: #52606d;
}

.category-bar button.active {
  background: #1f2933;
  border-color: #1f2933;
  color: #fff;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1.2rem;
}

.book-card {
  background: #fff;
  border: 1px solid #f0ece4;
  border-radius: 10px;
  padding: 0.9rem;
  text-align: center;
  transition: transform 0.25s, box-shadow 0.25s;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.book-card img {
  height: 180px;
  object-fit: contain;
  margin-bottom: 0.6rem;
}

.empty {
  color: #9aa5b1;
  padding: 2rem 0;
  text-align: center;
}

/* 特价 */
.discount {
  background: #fff8ec;
}

.discount-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.discount-card {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid #f0e3c8;
}

.discount-card img {
  width: 110px;
  object-fit: contain;
}

/* 评价 */
.testimonials {
  background: #fff;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.testimonial-card {
  text-align: center;
  padding: 1.4rem;
  border: 1px solid #f0ece4;
  border-radius: 12px;
}

.testimonial-card img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 0 auto 0.8rem;
  object-fit: cover;
}

.testimonial-card blockquote {
  color: #52606d;
  font-size: 0.92rem;
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.testimonial-card figcaption {
  font-size: 0.85rem;
  color: #c9a24b;
}

/* 会员 */
.join {
  background-size: cover;
  background-position: center;
  text-align: center;
  color: #fff;
  padding: 4.5rem 6vw;
}

.join h2 {
  margin-bottom: 1.2rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.join button {
  padding: 0.7em 2.2em;
  border: none;
  border-radius: 999px;
  background: #c9a24b;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.join button:hover {
  background: #b58e3e;
}

/* 页脚 */
.site-footer {
  text-align: center;
  padding: 1.6rem;
  background: #1f2933;
  color: #9aa5b1;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .main-nav {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 1rem;
  }

  .search {
    min-width: 140px;
    flex: 1 1 100%;
    order: 4;
  }

  .hero {
    padding: 2.5rem 5vw;
    gap: 1.5rem;
  }

  .featured,
  .books,
  .discount,
  .testimonials {
    padding: 2rem 5vw;
  }

  .join {
    padding: 3rem 5vw;
  }

  section h2 {
    font-size: 1.3rem;
  }

  .featured-card img,
  .book-card img {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .site-header {
    gap: 0.8rem;
    padding: 0.6rem 4vw;
  }

  .brand {
    font-size: 1.1rem;
  }

  .main-nav {
    gap: 0.8rem;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .main-nav a {
    font-size: 0.85rem;
  }

  .hero-text h1 {
    font-size: 1.6rem;
  }

  .featured-card img,
  .book-card img {
    height: 140px;
  }

  .discount-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .discount-card img {
    width: 90px;
  }

  section h2 {
    font-size: 1.15rem;
  }

  .featured,
  .books,
  .discount,
  .testimonials {
    padding: 1.5rem 4vw;
  }

  .hero {
    padding: 1.8rem 4vw;
  }
}
</style>
