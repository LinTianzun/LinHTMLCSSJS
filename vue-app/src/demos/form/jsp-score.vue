<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface ScoreRow {
  bh: string // 班级编号
  xh: string // 学号
  xm: string // 姓名
  yw: string // 语文
  sx: string // 数学
  yy: string // 英语
  zf: string // 总分
}

interface ClassInfo {
  bjbh: string
  bjmc: string
}

const classList: ClassInfo[] = [
  { bjbh: '1', bjmc: 'Java' },
  { bjbh: '2', bjmc: 'c#' },
  { bjbh: '3', bjmc: 'Python' },
  { bjbh: '4', bjmc: 'HTML' },
  { bjbh: '5', bjmc: 'CSS' },
  { bjbh: '6', bjmc: 'JavaScript' },
]

const scores = ref<ScoreRow[]>([
  { bh: '1', xh: '023321752101', xm: '张三', yw: '92.00', sx: '88.00', yy: '95.00', zf: '275.00' },
  { bh: '1', xh: '023321752102', xm: '李四', yw: '85.00', sx: '90.00', yy: '78.00', zf: '253.00' },
  { bh: '2', xh: '023321752103', xm: '王五', yw: '76.00', sx: '82.00', yy: '88.00', zf: '246.00' },
  { bh: '2', xh: '023321752104', xm: '赵六', yw: '90.00', sx: '95.00', yy: '92.00', zf: '277.00' },
  { bh: '3', xh: '023321752105', xm: '孙七', yw: '66.00', sx: '70.00', yy: '72.00', zf: '208.00' },
  { bh: '3', xh: '023321752106', xm: '周八', yw: '99.00', sx: '98.00', yy: '100.00', zf: '297.00' },
  { bh: '4', xh: '023321752107', xm: '吴九', yw: '80.00', sx: '75.00', yy: '85.00', zf: '240.00' },
  { bh: '5', xh: '023321752108', xm: '001', yw: '9999', sx: '100.00', yy: '001', zf: '001' },
])

/* ---------- 班级下拉筛选（原 selectStuScoreNa 下拉） ---------- */
const menuOpen = ref(false)
const selectedClass = ref<string>('allClass') // allClass 或班级编号

const selectedClassName = computed<string>(() => {
  if (selectedClass.value === 'allClass') return '全部班级'
  return classList.find((c) => c.bjbh === selectedClass.value)?.bjmc ?? '未知班级'
})

function toggleMenu(): void {
  menuOpen.value = !menuOpen.value
}

function pickClass(bjbh: string): void {
  selectedClass.value = bjbh
  menuOpen.value = false
  currentPage.value = 1
}

/* ---------- 搜索（原 #searchStuScore 按学号/姓名模糊查询） ---------- */
const searchInfo = ref('')

/* ---------- 过滤 + 分页（原 fenye()：每页 3 条） ---------- */
const PAGE_SIZE = 3
const currentPage = ref(1)

const filtered = computed<ScoreRow[]>(() => {
  let list = scores.value
  if (selectedClass.value !== 'allClass') {
    list = list.filter((row) => row.bh === selectedClass.value)
  }
  const kw = searchInfo.value.trim()
  if (kw) {
    list = list.filter((row) => row.xh.includes(kw) || row.xm.includes(kw))
  }
  return list
})

const totalPages = computed<number>(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

const pageRows = computed<ScoreRow[]>(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

function className(bh: string): string {
  return classList.find((c) => c.bjbh === bh)?.bjmc ?? '未知班级'
}

function goPage(page: number): void {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

/* ---------- 增改表单（原 addScore / revise） ---------- */
const editing = ref(false) // false=新增, true=修改
const editIndex = ref(-1) // 修改时对应 scores 的下标
const formOpen = ref(false)

const emptyForm = (): ScoreRow => ({ bh: '1', xh: '', xm: '', yw: '', sx: '', yy: '', zf: '' })
const form = reactive<ScoreRow>(emptyForm())
const formClass = ref('1')

function openAdd(): void {
  editing.value = false
  editIndex.value = -1
  Object.assign(form, emptyForm())
  formClass.value = '1'
  formOpen.value = true
}

function openEdit(index: number): void {
  const row = pageRows.value[index]
  if (!row) return
  editing.value = true
  editIndex.value = scores.value.indexOf(row)
  Object.assign(form, row)
  formClass.value = row.bh
  formOpen.value = true
}

function saveForm(): void {
  if (!form.xh.trim() || !form.xm.trim()) return
  const row: ScoreRow = { ...form, bh: formClass.value }
  if (editing.value && editIndex.value >= 0) {
    scores.value.splice(editIndex.value, 1, row)
  } else {
    scores.value.push(row)
  }
  formOpen.value = false
}

function removeRow(index: number): void {
  const row = pageRows.value[index]
  if (!row) return
  const i = scores.value.indexOf(row)
  if (i >= 0) scores.value.splice(i, 1)
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
}
</script>

<template>
  <div class="demo">
    <div class="shell">
      <h2 class="title">成绩维护</h2>

      <section class="header">
        <div class="select-menu">
          <div class="selectStuScoreNa" @click="toggleMenu">
            <span>{{ selectedClassName }}</span>
            <a class="iconDo" :class="{ up: menuOpen }">
              <span class="chev">▾</span>
            </a>
          </div>
          <div class="options-list" :class="{ stuactive: menuOpen }">
            <div class="optionStuScore" @click="pickClass('allClass')">全部班级</div>
            <div
              v-for="c in classList"
              :key="c.bjbh"
              class="optionStuScore"
              :class="{ selected: selectedClass === c.bjbh }"
              @click="pickClass(c.bjbh)"
            >
              {{ c.bjmc }}
            </div>
          </div>
        </div>

        <span class="result">查询结果: {{ totalPages }} 页 {{ filtered.length }} 项</span>

        <div class="input-group">
          <input v-model="searchInfo" type="search" placeholder="学号" @input="currentPage = 1" />
        </div>

        <input type="button" value="增加" class="liBtn add" @click="openAdd" />
      </section>

      <section class="sContent">
        <table>
          <thead>
            <tr>
              <th class="scoreClass">班级</th>
              <th class="scoreXuehao">学号</th>
              <th class="scoreText">姓名</th>
              <th class="scoreText">语文</th>
              <th class="scoreText">数学</th>
              <th class="scoreText">英语</th>
              <th class="scoreText">总分</th>
              <th class="scoreCaozuo">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in pageRows" :key="row.xh">
              <td>{{ className(row.bh) }}</td>
              <td>{{ row.xh }}</td>
              <td>{{ row.xm }}</td>
              <td>{{ row.yw }}</td>
              <td>{{ row.sx }}</td>
              <td>{{ row.yy }}</td>
              <td>{{ row.zf }}</td>
              <td>
                <input type="button" value="修改" class="liBtn revise" @click="openEdit(i)" />
                <input type="button" value="删除" class="liBtn delete" @click="removeRow(i)" />
              </td>
            </tr>
            <tr v-if="pageRows.length === 0">
              <td colspan="8" class="empty">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="sBotton">
        <ul class="pagination">
          <li
            class="page-btn page-btn-prev"
            :class="{ isClick: currentPage > 1 }"
            @click="goPage(currentPage - 1)"
          >
            &lt;
          </li>
          <li
            v-for="p in totalPages"
            :key="p"
            class="page-number"
            :class="{ active: p === currentPage }"
            @click="goPage(p)"
          >
            {{ p }}
          </li>
          <li
            class="page-btn page-btn-next"
            :class="{ isClick: currentPage < totalPages }"
            @click="goPage(currentPage + 1)"
          >
            &gt;
          </li>
        </ul>
      </section>

      <!-- 增加/修改弹层 -->
      <div v-if="formOpen" class="modal-mask" @click.self="formOpen = false">
        <div class="modal">
          <h3>{{ editing ? '修改成绩' : '增加成绩' }}</h3>
          <div class="form-row">
            <label>班级</label>
            <select v-model="formClass">
              <option v-for="c in classList" :key="c.bjbh" :value="c.bjbh">{{ c.bjmc }}</option>
            </select>
          </div>
          <div class="form-row">
            <label>学号</label>
            <input v-model="form.xh" type="text" />
          </div>
          <div class="form-row">
            <label>姓名</label>
            <input v-model="form.xm" type="text" />
          </div>
          <div class="form-row">
            <label>语文</label>
            <input v-model="form.yw" type="text" />
          </div>
          <div class="form-row">
            <label>数学</label>
            <input v-model="form.sx" type="text" />
          </div>
          <div class="form-row">
            <label>英语</label>
            <input v-model="form.yy" type="text" />
          </div>
          <div class="form-row">
            <label>总分</label>
            <input v-model="form.zf" type="text" />
          </div>
          <div class="form-actions">
            <button class="liBtn revise" @click="saveForm">保存</button>
            <button class="liBtn delete" @click="formOpen = false">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  justify-content: center;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 0;
}

.shell {
  margin: auto;
  width: 1000px;
  max-width: 95%;
  padding: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff49;
  border-radius: 50px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5) inset;
  color: #fff;
  text-shadow: 0 0 10px #ff9dff80;
  box-sizing: content-box;
}

.title {
  font-size: 45px;
  margin-bottom: 30px;
  color: #fff;
  text-shadow: 0 0 10px #ff9dff80;
  letter-spacing: 3px;
}

.header {
  width: 100%;
  height: 60px;
  margin-bottom: 15px;
  background-color: #fff4;
  display: flex;
  padding: 10px 21px;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 2px;
  box-sizing: border-box;
}

.result {
  font-size: 15px;
}

.header .input-group {
  width: 15%;
  height: 65%;
  background-color: #fff5;
  padding: 0 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
}

.header .input-group:hover {
  width: 20%;
  background-color: #fff8;
  box-shadow: 0 0 10px #ff9dff80;
}

.header .input-group input {
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  color: #fff;
}

.header .input-group input::placeholder {
  color: #ffffffcc;
}

.sContent {
  width: 100%;
  background-color: #fffb;
  margin: 10px auto;
  border-radius: 10px;
  letter-spacing: 3px;
  color: #339999;
  text-shadow: 0 0 10px #ccffff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  padding: 11px;
  text-align: center;
}

thead th {
  position: sticky;
  top: 0;
  cursor: pointer;
  color: #339999;
}

tbody tr:hover {
  background-color: #ffffffaa;
}

.empty {
  color: #339999;
  padding: 30px;
}

.scoreClass {
  width: 200px;
}

.scoreText {
  width: 80px;
}

.scoreXuehao,
.scoreCaozuo {
  width: 140px;
}

.liBtn {
  padding: 10px;
  font-weight: 600;
  border: none;
  outline: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.liBtn.add {
  background-color: #86e49d;
  color: #fff;
  letter-spacing: 3px;
}

.liBtn.revise {
  background-color: #ebc474;
  color: #fff;
  letter-spacing: 3px;
}

.liBtn.delete {
  background-color: #d893a3;
  color: #b30021;
  letter-spacing: 3px;
}

/* 分页列表 */
.pagination {
  display: flex;
  height: 50px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 10px #ccffff;
  list-style: none;
  padding: 0;
}

.pagination li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  margin: 10px;
  color: #333;
  font-size: 14px;
  border-radius: 5px;
  transition: all 0.3s;
}

.pagination li.page-btn {
  color: #cdd5f7;
  font-size: 22px;
}

.pagination li.page-btn.isClick {
  color: #666666;
}

.pagination li.page-btn.isClick:hover {
  color: #fff;
  cursor: pointer;
  background-color: #6b5bfd;
}

.pagination li.page-number {
  color: #333;
  cursor: pointer;
}

.pagination li.page-number:hover {
  color: #fff;
  font-weight: bold;
  background-color: #6b5bfd;
}

.pagination li.page-number.active {
  color: #fff;
  font-weight: bold;
  background-color: #6b5bfd;
  cursor: default;
}

/* 班级下拉 */
.select-menu {
  width: 200px;
  cursor: pointer;
  position: relative;
}

.selectStuScoreNa {
  background-color: #695cfe;
  padding: 13px;
  color: #fff;
  font-weight: 500;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-shadow: none;
}

.options-list {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  color: #339999;
  border-radius: 6px;
  margin: 10px 0;
  padding: 0 20px;
  max-height: 102px;
  overflow-y: auto;
  transition: 0.4s linear 0.2s;
  height: 0;
  z-index: 100;
  text-shadow: none;
}

.optionStuScore {
  padding: 8px 0;
  font-weight: 500;
  font-size: 14px;
  transition: 0.3s ease-in-out;
}

.optionStuScore:hover,
.optionStuScore.selected {
  color: #00a8ff;
}

.options-list::-webkit-scrollbar {
  width: 4px;
  background-color: #eee;
}

.options-list::-webkit-scrollbar-thumb {
  background-color: #00a8ff;
}

.options-list.stuactive {
  height: 102px;
}

.iconDo {
  transition: 0.3s ease-in-out;
}

.iconDo.up {
  transform: rotate(-180deg);
}

.chev {
  font-size: 14px;
}

/* 弹层表单 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.modal {
  background: #fff;
  color: #339999;
  border-radius: 16px;
  padding: 24px 32px;
  width: 360px;
  text-shadow: none;
}

.modal h3 {
  margin-bottom: 16px;
  text-align: center;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-row label {
  width: 60px;
  font-size: 14px;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ccd;
  border-radius: 8px;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}
</style>
