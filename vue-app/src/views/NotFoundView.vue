<script setup lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <SiteHeader />

  <main class="page">
    <div class="cow-stage">
      <!-- 复用纯 CSS 奶牛，缩小放在 404 页中央 -->
      <div class="scene">
        <div class="cow">
          <div class="head">
            <div class="face"></div>
            <div class="spot spot-a"></div>
            <div class="spot spot-b"></div>
            <div class="eye left"></div>
            <div class="eye right"></div>
            <div class="nostril left"></div>
            <div class="nostril right"></div>
            <div class="ear left"></div>
            <div class="ear right"></div>
            <div class="horn left"></div>
            <div class="horn right"></div>
          </div>
          <div class="body">
            <div class="patch p1"></div>
            <div class="patch p2"></div>
            <div class="patch p3"></div>
            <div class="tail"></div>
            <div class="leg front-left"></div>
            <div class="leg front-right"></div>
            <div class="leg back-left"></div>
            <div class="leg back-right"></div>
          </div>
          <div class="grass"></div>
        </div>
      </div>
    </div>
    <h1>404</h1>
    <p class="msg">
      这页被牛吃掉了。<RouterLink to="/">回首页 →</RouterLink>
    </p>
  </main>

  <SiteFooter />
</template>

<style scoped>
.page {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  text-align: center;
}

h1 {
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-top: 1rem;
}

.msg {
  color: var(--ink-soft);
  font-size: 1.05rem;
  margin-top: 0.6rem;
}

/* ===== 纯 CSS 奶牛（简化版，致敬 basics/404-cow demo） ===== */
.cow-stage {
  display: flex;
  justify-content: center;
}

.scene {
  --fur: #f7f3ea;
  --fur-dark: #e8e2d4;
  --ink-cow: #2b2b33;
  --pink: #e8a8b0;
  position: relative;
  width: 260px;
  height: 220px;
  margin: 0 auto;
}

.cow {
  position: absolute;
  inset: 0;
  animation: bob 3.2s ease-in-out infinite;
}

/* 头 */
.head {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 96px;
  z-index: 3;
  animation: tilt 5s ease-in-out infinite;
}

.face {
  position: absolute;
  inset: 0;
  background: var(--fur);
  border: 3px solid var(--ink-cow);
  border-radius: 48% 48% 46% 46%;
  overflow: hidden;
}

.spot {
  position: absolute;
  background: var(--ink-cow);
  border-radius: 50%;
  opacity: 0.9;
}

.spot-a {
  width: 34px;
  height: 26px;
  top: 8px;
  right: 6px;
  transform: rotate(18deg);
}

.spot-b {
  width: 18px;
  height: 14px;
  top: 26px;
  left: 8px;
  transform: rotate(-14deg);
}

.eye {
  position: absolute;
  top: 38px;
  width: 12px;
  height: 14px;
  background: var(--ink-cow);
  border-radius: 50%;
  animation: blink 4.5s infinite;
}

.eye.left { left: 26px; }
.eye.right { right: 26px; }

.nostril {
  position: absolute;
  bottom: 22px;
  width: 12px;
  height: 9px;
  background: var(--pink);
  border-radius: 50%;
}

.nostril.left { left: 36px; }
.nostril.right { right: 36px; }

.ear {
  position: absolute;
  top: -6px;
  width: 30px;
  height: 20px;
  background: var(--fur-dark);
  border: 3px solid var(--ink-cow);
  border-radius: 50% 50% 40% 40%;
  animation: twitch 3.4s ease-in-out infinite;
}

.ear.left { left: -18px; transform: rotate(-26deg); transform-origin: bottom right; }
.ear.right { right: -18px; transform: rotate(26deg); transform-origin: bottom left; }

.horn {
  position: absolute;
  top: -12px;
  width: 14px;
  height: 14px;
  background: #d9c9a3;
  border: 3px solid var(--ink-cow);
  border-radius: 50% 50% 0 0;
}

.horn.left { left: 28px; }
.horn.right { right: 28px; }

/* 身体 */
.body {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 170px;
  height: 100px;
  background: var(--fur);
  border: 3px solid var(--ink-cow);
  border-radius: 52px 52px 44px 44px;
  z-index: 2;
  overflow: visible;
}

.patch {
  position: absolute;
  background: var(--ink-cow);
  border-radius: 46% 54% 50% 50%;
  opacity: 0.92;
}

.p1 { width: 52px; height: 38px; top: 12px; left: 16px; transform: rotate(12deg); }
.p2 { width: 44px; height: 34px; top: 30px; right: 12px; transform: rotate(-18deg); }
.p3 { width: 26px; height: 20px; top: 6px; right: 44px; transform: rotate(30deg); }

.tail {
  position: absolute;
  right: -28px;
  top: 18px;
  width: 40px;
  height: 14px;
  border: 3px solid var(--ink-cow);
  border-left: none;
  border-radius: 0 12px 12px 0;
  transform-origin: left center;
  animation: wag 1.6s ease-in-out infinite;
}

.tail::after {
  content: '';
  position: absolute;
  right: -8px;
  top: -6px;
  width: 14px;
  height: 14px;
  background: var(--ink-cow);
  border-radius: 50%;
}

.leg {
  position: absolute;
  bottom: -22px;
  width: 20px;
  height: 30px;
  background: var(--fur-dark);
  border: 3px solid var(--ink-cow);
  border-radius: 0 0 8px 8px;
}

.leg.front-left { left: 30px; }
.leg.front-right { left: 58px; }
.leg.back-left { right: 58px; }
.leg.back-right { right: 30px; }

.grass {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 12px;
  border-radius: 50%;
  background: rgba(43, 58, 103, 0.12);
  filter: blur(2px);
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes tilt {
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  30% { transform: translateX(-50%) rotate(-4deg); }
  70% { transform: translateX(-50%) rotate(4deg); }
}

@keyframes blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.08); }
}

@keyframes twitch {
  0%, 100% { transform: rotate(-26deg); }
  50% { transform: rotate(-36deg); }
}

@keyframes wag {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-14deg); }
}
</style>
