<script setup lang="ts">
// 将 border-box.html 与 content-box.html 合并为一个并排对比页面
// 两个盒子 width/height/padding/border 完全相同，仅 box-sizing 不同：
// - border-box: 总尺寸 100x100（内容区被压缩）
// - content-box: 总尺寸 140x140（内容区 100 + padding 20 + border 20）
</script>

<template>
  <div class="demo">
    <h2 class="title">box-sizing 区别对比</h2>

    <div class="row">
      <div class="cell">
        <span class="label">border-box · 总尺寸 100×100</span>
        <div class="item border-box">
          <div class="ruler">100px</div>
        </div>
        <p class="desc">
          内容区 + 内边距 + 边框 = 100px。设定的 width/height 包含 padding 与 border。
        </p>
      </div>

      <div class="cell">
        <span class="label">content-box · 总尺寸 140×140</span>
        <div class="item content-box">
          <div class="ruler">140px</div>
        </div>
        <p class="desc">
          内容区 100px + 内边距 20px + 边框 20px = 140px。width/height 仅含内容区。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  background: #f5f7fa;
  padding: 24px;
  box-sizing: border-box;
}

.title {
  text-align: center;
  color: #333;
  font-size: 1.4rem;
  margin: 0 0 24px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 12px;
  font-weight: 600;
}

/* 公共盒子样式 —— 复刻原 .item */
.item {
  position: relative;
  width: 100px;
  height: 100px;
  border: dashed 10px #7dd4f2;
  padding: 10px;
}

.item::after {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background-color: #ff0000;
  z-index: -1;
}

/* border-box：设定尺寸包含 padding + border，总尺寸 100×100，背景为蓝紫 */
.border-box {
  box-sizing: border-box;
  background-color: blueviolet;
}

/* content-box：设定尺寸仅含内容区，总尺寸 140×140，背景为青色 */
.content-box {
  box-sizing: content-box;
  background-color: aqua;
}

/* 内容区尺寸标尺，便于直观对比 */
.ruler {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.desc {
  margin-top: 16px;
  font-size: 0.85rem;
  color: #666;
  max-width: 180px;
  text-align: center;
  line-height: 1.5;
}
</style>
