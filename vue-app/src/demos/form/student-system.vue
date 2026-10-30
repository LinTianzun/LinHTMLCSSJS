<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

/* ---------- 数据模型（对应原版后端返回的 JSON 结构） ---------- */
interface ClassInfo {
  bjbh: string // 班级编号
  bjmc: string // 班级名称
}

interface ScoreRow {
  bh: string // 班级编号
  xh: string // 学号
  xm: string // 姓名
  yw: string // 语文
  sx: string // 数学
  yy: string // 英语
  zf: string // 总分
}

interface UserRow {
  username: string // 用户名
  password: string // 密码
  role: string // 用户类型：系统管理员 / 普通用户
}

const ROLES = ['系统管理员', '普通用户'] as const

type PageId =
  | 'welcome'
  | 'score'
  | 'score-add'
  | 'user'
  | 'user-add'
  | 'class'
  | 'class-add'
  | 'pass'

/* 侧边菜单（原版 menu_2.html 的七个功能入口拍平为一级菜单） */
const MENU: { id: PageId; icon: string; label: string }[] = [
  { id: 'score', icon: '📊', label: '成绩管理' },
  { id: 'user', icon: '👥', label: '学生管理' },
  { id: 'class', icon: '🏫', label: '班级管理' },
  { id: 'score-add', icon: '📝', label: '添加成绩' },
  { id: 'user-add', icon: '➕', label: '添加学生' },
  { id: 'class-add', icon: '🆕', label: '添加班级' },
  { id: 'pass', icon: '🔑', label: '密码设置' },
]

const PAGE_TITLES: Record<PageId, string> = {
  welcome: '首页',
  score: '成绩管理',
  'score-add': '添加成绩',
  user: '学生管理',
  'user-add': '添加学生',
  class: '班级管理',
  'class-add': '添加班级',
  pass: '密码设置',
}

/* ---------- 全局 UI：轻提示 / 确认弹窗 ---------- */
const toast = ref<{ text: string; kind: 'ok' | 'err' } | null>(null)
let toastTimer: number | undefined

function showToast(text: string, kind: 'ok' | 'err' = 'ok'): void {
  toast.value = { text, kind }
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = null), 2200)
}

const confirmBox = ref<{ text: string; action: () => void } | null>(null)

function askConfirm(text: string, action: () => void): void {
  confirmBox.value = { text, action }
}

function settleConfirm(ok: boolean): void {
  const box = confirmBox.value
  confirmBox.value = null
  if (ok && box) box.action()
}

/* ---------- 登录（原版 login.html：用户名密码非空即可进入） ---------- */
const logged = ref(false)
const loginUser = ref('')
const loginName = ref('')
const loginPwd = ref('')
const loginErr = ref('')

function doLogin(): void {
  if (!loginName.value.trim() || !loginPwd.value) {
    loginErr.value = '用户名或密码不能为空'
    return
  }
  loginUser.value = loginName.value.trim()
  loginErr.value = ''
  loginName.value = ''
  loginPwd.value = ''
  logged.value = true
  activePage.value = 'welcome'
  showToast(`欢迎回来，${loginUser.value}`)
}

function doLogout(): void {
  logged.value = false
  activePage.value = 'welcome'
  showToast('已退出登录')
}

/* ---------- 主框架布局（原版 menu_2.html：侧边栏 + 顶栏 + 内容区） ---------- */
const activePage = ref<PageId>('welcome')
const sidebarOpen = ref(typeof window === 'undefined' ? true : window.innerWidth > 860)
const activeTitle = computed<string>(() => PAGE_TITLES[activePage.value])

function goPage(page: PageId): void {
  activePage.value = page
  if (typeof window !== 'undefined' && window.innerWidth <= 860) sidebarOpen.value = false
}

/* ---------- mock 数据（内存态，刷新即重置） ---------- */
const classes = ref<ClassInfo[]>([
  { bjbh: '001', bjmc: '一班' },
  { bjbh: '002', bjmc: '二班' },
  { bjbh: '003', bjmc: '三班' },
  { bjbh: '004', bjmc: '四班' },
  { bjbh: '005', bjmc: '五班' },
])

const scores = ref<ScoreRow[]>([
  { bh: '001', xh: '023321752101', xm: '张三', yw: '92.00', sx: '88.00', yy: '95.00', zf: '275.00' },
  { bh: '001', xh: '023321752102', xm: '李四', yw: '85.00', sx: '90.00', yy: '78.00', zf: '253.00' },
  { bh: '001', xh: '023321752103', xm: '王五', yw: '76.00', sx: '82.00', yy: '88.00', zf: '246.00' },
  { bh: '002', xh: '023321752104', xm: '赵六', yw: '90.00', sx: '95.00', yy: '92.00', zf: '277.00' },
  { bh: '002', xh: '023321752105', xm: '孙七', yw: '66.00', sx: '70.00', yy: '72.00', zf: '208.00' },
  { bh: '002', xh: '023321752106', xm: '周八', yw: '99.00', sx: '98.00', yy: '100.00', zf: '297.00' },
  { bh: '003', xh: '023321752107', xm: '吴九', yw: '80.00', sx: '75.00', yy: '85.00', zf: '240.00' },
  { bh: '003', xh: '023321752108', xm: '郑十', yw: '58.00', sx: '61.00', yy: '66.00', zf: '185.00' },
  { bh: '003', xh: '023321752109', xm: '钱一', yw: '88.00', sx: '91.00', yy: '84.00', zf: '263.00' },
  { bh: '004', xh: '023321752110', xm: '刘二', yw: '73.00', sx: '69.00', yy: '77.00', zf: '219.00' },
  { bh: '005', xh: '023321752111', xm: '陈零', yw: '94.00', sx: '89.00', yy: '96.00', zf: '279.00' },
])

const users = ref<UserRow[]>([
  { username: 'LinLin', password: '123456', role: '系统管理员' },
  { username: 'admin', password: 'admin888', role: '系统管理员' },
  { username: 'stu001', password: '123456', role: '普通用户' },
  { username: 'stu002', password: '123456', role: '普通用户' },
])

/* ---------- 分页（原版 fenyeJQ.js：每页 3 条 + 页码/前后翻页） ---------- */
const PAGE_SIZE = 3

function createPaging<T>(source: () => T[]) {
  const page = ref(1)
  const total = computed<number>(() => Math.max(1, Math.ceil(source().length / PAGE_SIZE)))
  const rows = computed<T[]>(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return source().slice(start, start + PAGE_SIZE)
  })
  watch(total, (t) => {
    if (page.value > t) page.value = t
  })
  function go(p: number): void {
    if (p < 1 || p > total.value) return
    page.value = p
  }
  function reset(): void {
    page.value = 1
  }
  return { page, total, rows, go, reset }
}

/* ---------- 成绩管理（原版 scoreManage） ---------- */
const scoreKw = ref('')
const scoreClass = ref('all') // all 或班级编号
const scoreMenuOpen = ref(false)

const filteredScores = computed<ScoreRow[]>(() => {
  let list = scores.value
  if (scoreClass.value !== 'all') list = list.filter((r) => r.bh === scoreClass.value)
  const kw = scoreKw.value.trim()
  if (kw) list = list.filter((r) => r.xh.includes(kw) || r.xm.includes(kw))
  return list
})

const {
  page: scorePage,
  total: scoreTotal,
  rows: scoreRows,
  go: scoreGo,
  reset: scoreReset,
} = createPaging<ScoreRow>(() => filteredScores.value)

const scoreFilterName = computed<string>(() => {
  if (scoreClass.value === 'all') return '全部班级'
  return classes.value.find((c) => c.bjbh === scoreClass.value)?.bjmc ?? '未知班级'
})

function pickScoreClass(bjbh: string): void {
  scoreClass.value = bjbh
  scoreMenuOpen.value = false
  scoreReset()
}

function className(bh: string): string {
  return classes.value.find((c) => c.bjbh === bh)?.bjmc ?? '未知班级'
}

function isScoreNum(v: unknown): boolean {
  const n = Number(v)
  return v !== '' && v !== null && Number.isFinite(n) && n >= 0 && n <= 100
}

/* 修改成绩弹层 */
const scoreModal = ref(false)
const scoreTarget = ref<ScoreRow | null>(null)
const scoreForm = reactive({ bh: '', xh: '', xm: '', yw: '', sx: '', yy: '' })
const scoreEditErr = ref('')

const scoreFormZf = computed<string>(() => {
  if (isScoreNum(scoreForm.yw) && isScoreNum(scoreForm.sx) && isScoreNum(scoreForm.yy)) {
    return (Number(scoreForm.yw) + Number(scoreForm.sx) + Number(scoreForm.yy)).toFixed(2)
  }
  return '—'
})

function openScoreEdit(row: ScoreRow): void {
  scoreTarget.value = row
  Object.assign(scoreForm, row)
  scoreEditErr.value = ''
  scoreModal.value = true
}

function saveScoreEdit(): void {
  const target = scoreTarget.value
  if (!target) return
  const xh = scoreForm.xh.trim()
  const xm = scoreForm.xm.trim()
  if (!xh) {
    scoreEditErr.value = '学号不能为空'
    return
  }
  if (!xm) {
    scoreEditErr.value = '姓名不能为空'
    return
  }
  if (!isScoreNum(scoreForm.yw) || !isScoreNum(scoreForm.sx) || !isScoreNum(scoreForm.yy)) {
    scoreEditErr.value = '各科成绩必须为 0~100 的数字'
    return
  }
  if (scores.value.some((r) => r !== target && r.xh.trim() === xh)) {
    scoreEditErr.value = '该学号已存在'
    return
  }
  Object.assign(target, scoreForm, {
    xh,
    xm,
    yw: Number(scoreForm.yw).toFixed(2),
    sx: Number(scoreForm.sx).toFixed(2),
    yy: Number(scoreForm.yy).toFixed(2),
    zf: scoreFormZf.value,
  })
  scoreModal.value = false
  showToast('成绩修改成功')
}

function removeScore(row: ScoreRow): void {
  askConfirm(`确定删除学号「${row.xh}」的成绩记录吗？`, () => {
    scores.value = scores.value.filter((r) => r !== row)
    showToast('删除成功')
  })
}

/* ---------- 添加成绩（原版 addScore：总分由三科相加） ---------- */
const scoreAddForm = reactive({ bh: '', xh: '', xm: '', yw: '', sx: '', yy: '' })
const scoreAddErr = ref('')

const scoreAddZf = computed<string>(() => {
  if (isScoreNum(scoreAddForm.yw) && isScoreNum(scoreAddForm.sx) && isScoreNum(scoreAddForm.yy)) {
    return (Number(scoreAddForm.yw) + Number(scoreAddForm.sx) + Number(scoreAddForm.yy)).toFixed(2)
  }
  return '—'
})

function resetScoreAdd(): void {
  scoreAddForm.bh = ''
  scoreAddForm.xh = ''
  scoreAddForm.xm = ''
  scoreAddForm.yw = ''
  scoreAddForm.sx = ''
  scoreAddForm.yy = ''
  scoreAddErr.value = ''
}

function submitScoreAdd(): void {
  const xh = scoreAddForm.xh.trim()
  const xm = scoreAddForm.xm.trim()
  if (!scoreAddForm.bh) {
    scoreAddErr.value = '请选择班级'
    return
  }
  if (!xh) {
    scoreAddErr.value = '学号不能为空'
    return
  }
  if (!xm) {
    scoreAddErr.value = '姓名不能为空'
    return
  }
  if (!isScoreNum(scoreAddForm.yw) || !isScoreNum(scoreAddForm.sx) || !isScoreNum(scoreAddForm.yy)) {
    scoreAddErr.value = '各科成绩必须为 0~100 的数字'
    return
  }
  if (scores.value.some((r) => r.xh.trim() === xh)) {
    scoreAddErr.value = '该学号已存在'
    return
  }
  scores.value.push({
    bh: scoreAddForm.bh,
    xh,
    xm,
    yw: Number(scoreAddForm.yw).toFixed(2),
    sx: Number(scoreAddForm.sx).toFixed(2),
    yy: Number(scoreAddForm.yy).toFixed(2),
    zf: scoreAddZf.value,
  })
  resetScoreAdd()
  goPage('score')
  showToast('成绩添加成功')
}

/* ---------- 学生管理（原版 usersManage） ---------- */
const userKw = ref('')

const filteredUsers = computed<UserRow[]>(() => {
  const kw = userKw.value.trim()
  if (!kw) return users.value
  return users.value.filter((u) => u.username.includes(kw) || u.role.includes(kw))
})

const {
  page: userPage,
  total: userTotal,
  rows: userRows,
  go: userGo,
  reset: userReset,
} = createPaging<UserRow>(() => filteredUsers.value)

/* 修改学生弹层（密码留空则不修改） */
const userModal = ref(false)
const userTarget = ref<UserRow | null>(null)
const userForm = reactive({ username: '', role: '普通用户', password: '' })
const userEditErr = ref('')

function openUserEdit(row: UserRow): void {
  userTarget.value = row
  userForm.username = row.username
  userForm.role = row.role
  userForm.password = ''
  userEditErr.value = ''
  userModal.value = true
}

function saveUserEdit(): void {
  const target = userTarget.value
  if (!target) return
  const username = userForm.username.trim()
  if (!username) {
    userEditErr.value = '用户名不能为空'
    return
  }
  if (users.value.some((u) => u !== target && u.username === username)) {
    userEditErr.value = '该用户名已存在'
    return
  }
  target.username = username
  target.role = userForm.role
  if (userForm.password) target.password = userForm.password
  userModal.value = false
  showToast('用户修改成功')
}

function resetUserPwd(row: UserRow): void {
  askConfirm(`确定将「${row.username}」的密码重置为 123456 吗？`, () => {
    row.password = '123456'
    showToast('密码已重置为 123456')
  })
}

function removeUser(row: UserRow): void {
  askConfirm(`确定删除用户「${row.username}」吗？`, () => {
    users.value = users.value.filter((u) => u !== row)
    showToast('删除成功')
  })
}

/* ---------- 添加学生（原版 addUser） ---------- */
const userAddForm = reactive({ username: '', password: '', role: '普通用户' })
const userAddErr = ref('')

function resetUserAdd(): void {
  userAddForm.username = ''
  userAddForm.password = ''
  userAddForm.role = '普通用户'
  userAddErr.value = ''
}

function submitUserAdd(): void {
  const username = userAddForm.username.trim()
  if (!username) {
    userAddErr.value = '用户名不能为空'
    return
  }
  if (!userAddForm.password) {
    userAddErr.value = '密码不能为空'
    return
  }
  if (users.value.some((u) => u.username === username)) {
    userAddErr.value = '该用户名已存在'
    return
  }
  users.value.push({ username, password: userAddForm.password, role: userAddForm.role })
  resetUserAdd()
  goPage('user')
  showToast('用户添加成功')
}

/* ---------- 班级管理（原版 classManage） ---------- */
const classKw = ref('')

const filteredClasses = computed<ClassInfo[]>(() => {
  const kw = classKw.value.trim()
  if (!kw) return classes.value
  return classes.value.filter((c) => c.bjbh.includes(kw) || c.bjmc.includes(kw))
})

const {
  page: classPage,
  total: classTotal,
  rows: classRows,
  go: classGo,
  reset: classReset,
} = createPaging<ClassInfo>(() => filteredClasses.value)

/* 修改班级弹层（编号变更时同步该班所有成绩记录） */
const classModal = ref(false)
const classTarget = ref<ClassInfo | null>(null)
const classOrigBh = ref('')
const classForm = reactive({ bjbh: '', bjmc: '' })
const classEditErr = ref('')

function openClassEdit(row: ClassInfo): void {
  classTarget.value = row
  classOrigBh.value = row.bjbh
  classForm.bjbh = row.bjbh
  classForm.bjmc = row.bjmc
  classEditErr.value = ''
  classModal.value = true
}

function saveClassEdit(): void {
  const target = classTarget.value
  if (!target) return
  const bjbh = classForm.bjbh.trim()
  const bjmc = classForm.bjmc.trim()
  if (!bjbh) {
    classEditErr.value = '班级编号不能为空'
    return
  }
  if (!bjmc) {
    classEditErr.value = '班级名称不能为空'
    return
  }
  if (classes.value.some((c) => c !== target && c.bjbh === bjbh)) {
    classEditErr.value = '该班级编号已存在'
    return
  }
  if (bjbh !== classOrigBh.value) {
    scores.value.forEach((s) => {
      if (s.bh === classOrigBh.value) s.bh = bjbh
    })
  }
  target.bjbh = bjbh
  target.bjmc = bjmc
  classModal.value = false
  showToast('班级修改成功')
}

function removeClass(row: ClassInfo): void {
  const count = scores.value.filter((s) => s.bh === row.bjbh).length
  if (count > 0) {
    showToast(`该班级下仍有 ${count} 条成绩记录，无法删除`, 'err')
    return
  }
  askConfirm(`确定删除班级「${row.bjmc}」吗？`, () => {
    classes.value = classes.value.filter((c) => c !== row)
    showToast('删除成功')
  })
}

/* ---------- 添加班级（原版 addClasses） ---------- */
const classAddForm = reactive({ bjbh: '', bjmc: '' })
const classAddErr = ref('')

function resetClassAdd(): void {
  classAddForm.bjbh = ''
  classAddForm.bjmc = ''
  classAddErr.value = ''
}

function submitClassAdd(): void {
  const bjbh = classAddForm.bjbh.trim()
  const bjmc = classAddForm.bjmc.trim()
  if (!bjbh) {
    classAddErr.value = '班级编号不能为空'
    return
  }
  if (!bjmc) {
    classAddErr.value = '班级名称不能为空'
    return
  }
  if (classes.value.some((c) => c.bjbh === bjbh)) {
    classAddErr.value = '该班级编号已存在'
    return
  }
  classes.value.push({ bjbh, bjmc })
  resetClassAdd()
  goPage('class')
  showToast('班级添加成功')
}

/* ---------- 密码设置（原版 passSet：非空 + 两次一致） ---------- */
const passForm = reactive({ p1: '', p2: '' })
const passErr = ref('')

function resetPass(): void {
  passForm.p1 = ''
  passForm.p2 = ''
  passErr.value = ''
}

function submitPass(): void {
  if (!passForm.p1 || !passForm.p2) {
    passErr.value = '修改的密码不能为空'
    return
  }
  if (passForm.p1 !== passForm.p2) {
    passErr.value = '两次密码不一致'
    return
  }
  const found = users.value.find((u) => u.username === loginUser.value)
  if (found) found.password = passForm.p1
  resetPass()
  showToast(found ? '密码修改成功' : '密码修改成功（演示账号未在用户列表中）')
}
</script>

<template>
  <div class="demo">
    <!-- ========== 登录页（原版 login.html） ========== -->
    <div v-if="!logged" class="login-wrap">
      <div class="head-tit">
        <h1>学生成绩管理系统</h1>
        <span class="head-logo">🐱</span>
      </div>
      <div class="login-card">
        <h2>系统登录</h2>
        <input
          v-model="loginName"
          class="login-input"
          type="text"
          placeholder="用户名"
          @keyup.enter="doLogin"
        />
        <input
          v-model="loginPwd"
          class="login-input"
          type="password"
          placeholder="密码"
          @keyup.enter="doLogin"
        />
        <p class="login-err">{{ loginErr }}</p>
        <button class="login-btn" type="button" @click="doLogin">登 录</button>
        <p class="login-hint">演示提示：用户名与密码任意非空即可登录</p>
      </div>
    </div>

    <!-- ========== 主框架（原版 menu_2.html：侧边栏 + 顶栏 + 内容区） ========== -->
    <div v-else class="sys" :class="{ collapsed: !sidebarOpen }">
      <aside class="sidebar">
        <div class="logo-details" title="回到首页" @click="goPage('welcome')">
          <span class="logo-emoji">🎓</span>
          <span class="logo_name">学生成绩管理系统</span>
        </div>
        <ul class="nav-links">
          <li v-for="m in MENU" :key="m.id" :class="{ active: activePage === m.id }">
            <a @click="goPage(m.id)">
              <span class="nav-icon">{{ m.icon }}</span>
              <span class="link_name">{{ m.label }}</span>
            </a>
          </li>
        </ul>
        <div class="profile">
          <div class="avatar">🧑‍🎓</div>
          <div class="name-job">
            <div class="profile_name">{{ loginUser }}</div>
            <div class="job">Student</div>
          </div>
          <button class="logout-btn" type="button" title="退出登录" @click="doLogout">🚪</button>
        </div>
      </aside>

      <main class="home">
        <div class="topbar">
          <button class="menu-btn" type="button" @click="sidebarOpen = !sidebarOpen">☰</button>
          <span class="topbar-title">学生成绩管理系统</span>
          <span class="topbar-crumb">{{ activeTitle }}</span>
        </div>

        <div class="content">
          <!-- 首页欢迎 -->
          <div v-if="activePage === 'welcome'" class="welcome-card glass">
            <span class="w-emoji">🎓</span>
            <h2>WelCome to HOME</h2>
            <p class="w-sub">当前用户：{{ loginUser }}</p>
            <div class="w-stats">
              <div class="w-stat"><b>{{ classes.length }}</b><span>班级</span></div>
              <div class="w-stat"><b>{{ users.length }}</b><span>学生用户</span></div>
              <div class="w-stat"><b>{{ scores.length }}</b><span>成绩记录</span></div>
            </div>
            <p class="w-tip">点击左侧菜单进入各功能模块，☰ 可收起菜单</p>
          </div>

          <!-- 成绩管理 -->
          <div v-else-if="activePage === 'score'" class="module glass">
            <h2 class="m-title">成绩管理</h2>
            <section class="m-header">
              <div class="select-menu">
                <div class="selectStuScoreNa" @click="scoreMenuOpen = !scoreMenuOpen">
                  <span>{{ scoreFilterName }}</span>
                  <a class="iconDo" :class="{ up: scoreMenuOpen }"><span class="chev">▾</span></a>
                </div>
                <div class="options-list" :class="{ stuactive: scoreMenuOpen }">
                  <div class="optionStuScore" @click="pickScoreClass('all')">全部班级</div>
                  <div
                    v-for="c in classes"
                    :key="c.bjbh"
                    class="optionStuScore"
                    :class="{ selected: scoreClass === c.bjbh }"
                    @click="pickScoreClass(c.bjbh)"
                  >
                    {{ c.bjmc }}
                  </div>
                </div>
              </div>
              <span class="result">查询结果: {{ scoreTotal }} 页 {{ filteredScores.length }} 项</span>
              <div class="input-group">
                <input v-model="scoreKw" type="search" placeholder="学号/姓名" @input="scoreReset" />
              </div>
              <input type="button" value="增加" class="liBtn add" @click="goPage('score-add')" />
            </section>
            <section class="s-content">
              <table>
                <thead>
                  <tr>
                    <th>班级</th>
                    <th>学号</th>
                    <th>姓名</th>
                    <th>语文</th>
                    <th>数学</th>
                    <th>英语</th>
                    <th>总分</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in scoreRows" :key="row.xh">
                    <td>{{ className(row.bh) }}</td>
                    <td>{{ row.xh }}</td>
                    <td>{{ row.xm }}</td>
                    <td>{{ row.yw }}</td>
                    <td>{{ row.sx }}</td>
                    <td>{{ row.yy }}</td>
                    <td>{{ row.zf }}</td>
                    <td>
                      <input type="button" value="修改" class="liBtn revise" @click="openScoreEdit(row)" />
                      <input type="button" value="删除" class="liBtn delete" @click="removeScore(row)" />
                    </td>
                  </tr>
                  <tr v-if="scoreRows.length === 0">
                    <td colspan="8" class="empty">暂无数据</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <ul class="pagination">
              <li
                class="page-btn page-btn-prev"
                :class="{ isClick: scorePage > 1 }"
                @click="scoreGo(scorePage - 1)"
              >
                &lt;
              </li>
              <li
                v-for="p in scoreTotal"
                :key="p"
                class="page-number"
                :class="{ active: p === scorePage }"
                @click="scoreGo(p)"
              >
                {{ p }}
              </li>
              <li
                class="page-btn page-btn-next"
                :class="{ isClick: scorePage < scoreTotal }"
                @click="scoreGo(scorePage + 1)"
              >
                &gt;
              </li>
            </ul>
          </div>

          <!-- 学生管理 -->
          <div v-else-if="activePage === 'user'" class="module glass">
            <h2 class="m-title">学生管理</h2>
            <section class="m-header">
              <span class="result">查询结果: {{ userTotal }} 页 {{ filteredUsers.length }} 项</span>
              <div class="input-group">
                <input v-model="userKw" type="search" placeholder="用户名/类型" @input="userReset" />
              </div>
              <input type="button" value="增加" class="liBtn add" @click="goPage('user-add')" />
            </section>
            <section class="s-content">
              <table>
                <thead>
                  <tr>
                    <th>用户名</th>
                    <th>用户类型</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in userRows" :key="row.username">
                    <td>{{ row.username }}</td>
                    <td>
                      <span class="role-tag" :class="{ admin: row.role === '系统管理员' }">{{ row.role }}</span>
                    </td>
                    <td>
                      <input type="button" value="修改" class="liBtn revise" @click="openUserEdit(row)" />
                      <input type="button" value="重置" class="liBtn reset" @click="resetUserPwd(row)" />
                      <input type="button" value="删除" class="liBtn delete" @click="removeUser(row)" />
                    </td>
                  </tr>
                  <tr v-if="userRows.length === 0">
                    <td colspan="3" class="empty">暂无数据</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <ul class="pagination">
              <li
                class="page-btn page-btn-prev"
                :class="{ isClick: userPage > 1 }"
                @click="userGo(userPage - 1)"
              >
                &lt;
              </li>
              <li
                v-for="p in userTotal"
                :key="p"
                class="page-number"
                :class="{ active: p === userPage }"
                @click="userGo(p)"
              >
                {{ p }}
              </li>
              <li
                class="page-btn page-btn-next"
                :class="{ isClick: userPage < userTotal }"
                @click="userGo(userPage + 1)"
              >
                &gt;
              </li>
            </ul>
          </div>

          <!-- 班级管理 -->
          <div v-else-if="activePage === 'class'" class="module glass">
            <h2 class="m-title">班级管理</h2>
            <section class="m-header">
              <span class="result">查询结果: {{ classTotal }} 页 {{ filteredClasses.length }} 项</span>
              <div class="input-group">
                <input v-model="classKw" type="search" placeholder="班级编号/名称" @input="classReset" />
              </div>
              <input type="button" value="增加" class="liBtn add" @click="goPage('class-add')" />
            </section>
            <section class="s-content">
              <table>
                <thead>
                  <tr>
                    <th>班级编号</th>
                    <th>班级名称</th>
                    <th>班级操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in classRows" :key="row.bjbh">
                    <td>{{ row.bjbh }}</td>
                    <td>{{ row.bjmc }}</td>
                    <td>
                      <input type="button" value="修改" class="liBtn revise" @click="openClassEdit(row)" />
                      <input type="button" value="删除" class="liBtn delete" @click="removeClass(row)" />
                    </td>
                  </tr>
                  <tr v-if="classRows.length === 0">
                    <td colspan="3" class="empty">暂无数据</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <ul class="pagination">
              <li
                class="page-btn page-btn-prev"
                :class="{ isClick: classPage > 1 }"
                @click="classGo(classPage - 1)"
              >
                &lt;
              </li>
              <li
                v-for="p in classTotal"
                :key="p"
                class="page-number"
                :class="{ active: p === classPage }"
                @click="classGo(p)"
              >
                {{ p }}
              </li>
              <li
                class="page-btn page-btn-next"
                :class="{ isClick: classPage < classTotal }"
                @click="classGo(classPage + 1)"
              >
                &gt;
              </li>
            </ul>
          </div>

          <!-- 添加成绩 -->
          <div v-else-if="activePage === 'score-add'" class="form-card glass">
            <h2 class="m-title">添加成绩</h2>
            <div class="f-row">
              <label>班级</label>
              <select v-model="scoreAddForm.bh">
                <option value="" disabled>请选择班级</option>
                <option v-for="c in classes" :key="c.bjbh" :value="c.bjbh">{{ c.bjmc }}</option>
              </select>
            </div>
            <div class="f-row">
              <label>学号</label>
              <input v-model="scoreAddForm.xh" type="text" placeholder="学号" />
            </div>
            <div class="f-row">
              <label>姓名</label>
              <input v-model="scoreAddForm.xm" type="text" placeholder="姓名" />
            </div>
            <div class="f-row">
              <label>语文</label>
              <input v-model="scoreAddForm.yw" type="text" placeholder="0~100" />
            </div>
            <div class="f-row">
              <label>数学</label>
              <input v-model="scoreAddForm.sx" type="text" placeholder="0~100" />
            </div>
            <div class="f-row">
              <label>英语</label>
              <input v-model="scoreAddForm.yy" type="text" placeholder="0~100" />
            </div>
            <div class="f-row">
              <label>总分</label>
              <input :value="scoreAddZf" type="text" readonly />
            </div>
            <p class="form-err">{{ scoreAddErr }}</p>
            <div class="f-btns">
              <button class="liBtn ok" type="button" @click="submitScoreAdd">确定</button>
              <button class="liBtn re" type="button" @click="resetScoreAdd">重置</button>
              <button class="liBtn no" type="button" @click="goPage('welcome')">取消</button>
            </div>
          </div>

          <!-- 添加学生 -->
          <div v-else-if="activePage === 'user-add'" class="form-card glass">
            <h2 class="m-title">添加学生</h2>
            <div class="f-row">
              <label>用户类型</label>
              <select v-model="userAddForm.role">
                <option v-for="r in ROLES" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div class="f-row">
              <label>用户名</label>
              <input v-model="userAddForm.username" type="text" placeholder="用户名" />
            </div>
            <div class="f-row">
              <label>密码</label>
              <input v-model="userAddForm.password" type="password" placeholder="密码" />
            </div>
            <p class="form-err">{{ userAddErr }}</p>
            <div class="f-btns">
              <button class="liBtn ok" type="button" @click="submitUserAdd">确定</button>
              <button class="liBtn re" type="button" @click="resetUserAdd">重置</button>
              <button class="liBtn no" type="button" @click="goPage('welcome')">取消</button>
            </div>
          </div>

          <!-- 添加班级 -->
          <div v-else-if="activePage === 'class-add'" class="form-card glass">
            <h2 class="m-title">添加班级</h2>
            <div class="f-row">
              <label>班级编号</label>
              <input v-model="classAddForm.bjbh" type="text" placeholder="班级编号" />
            </div>
            <div class="f-row">
              <label>班级名称</label>
              <input v-model="classAddForm.bjmc" type="text" placeholder="班级名称" />
            </div>
            <p class="form-err">{{ classAddErr }}</p>
            <div class="f-btns">
              <button class="liBtn ok" type="button" @click="submitClassAdd">确定</button>
              <button class="liBtn re" type="button" @click="resetClassAdd">重置</button>
              <button class="liBtn no" type="button" @click="goPage('welcome')">取消</button>
            </div>
          </div>

          <!-- 密码设置 -->
          <div v-else-if="activePage === 'pass'" class="form-card glass">
            <h2 class="m-title">密码设置</h2>
            <div class="f-row">
              <label>用户名</label>
              <input :value="loginUser" type="text" disabled />
            </div>
            <div class="f-row">
              <label>新密码</label>
              <input v-model="passForm.p1" type="password" placeholder="密码" />
            </div>
            <div class="f-row">
              <label>确认密码</label>
              <input v-model="passForm.p2" type="password" placeholder="确认密码" />
            </div>
            <p class="form-err">{{ passErr }}</p>
            <div class="f-btns">
              <button class="liBtn ok" type="button" @click="submitPass">确定</button>
              <button class="liBtn re" type="button" @click="resetPass">重置</button>
              <button class="liBtn no" type="button" @click="goPage('welcome')">取消</button>
            </div>
          </div>
        </div>
      </main>

      <!-- 修改成绩弹层 -->
      <div v-if="scoreModal" class="modal-mask" @click.self="scoreModal = false">
        <div class="modal">
          <h3>修改成绩</h3>
          <div class="form-row">
            <label>班级</label>
            <select v-model="scoreForm.bh">
              <option v-for="c in classes" :key="c.bjbh" :value="c.bjbh">{{ c.bjmc }}</option>
            </select>
          </div>
          <div class="form-row">
            <label>学号</label>
            <input v-model="scoreForm.xh" type="text" />
          </div>
          <div class="form-row">
            <label>姓名</label>
            <input v-model="scoreForm.xm" type="text" />
          </div>
          <div class="form-row">
            <label>语文</label>
            <input v-model="scoreForm.yw" type="text" />
          </div>
          <div class="form-row">
            <label>数学</label>
            <input v-model="scoreForm.sx" type="text" />
          </div>
          <div class="form-row">
            <label>英语</label>
            <input v-model="scoreForm.yy" type="text" />
          </div>
          <div class="form-row">
            <label>总分</label>
            <input :value="scoreFormZf" type="text" readonly />
          </div>
          <p class="modal-err">{{ scoreEditErr }}</p>
          <div class="form-actions">
            <button class="op save" type="button" @click="saveScoreEdit">保存</button>
            <button class="op cancel" type="button" @click="scoreModal = false">取消</button>
          </div>
        </div>
      </div>

      <!-- 修改学生弹层 -->
      <div v-if="userModal" class="modal-mask" @click.self="userModal = false">
        <div class="modal">
          <h3>修改学生</h3>
          <div class="form-row">
            <label>用户名</label>
            <input v-model="userForm.username" type="text" />
          </div>
          <div class="form-row">
            <label>用户类型</label>
            <select v-model="userForm.role">
              <option v-for="r in ROLES" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div class="form-row">
            <label>新密码</label>
            <input v-model="userForm.password" type="password" placeholder="留空则不修改" />
          </div>
          <p class="modal-err">{{ userEditErr }}</p>
          <div class="form-actions">
            <button class="op save" type="button" @click="saveUserEdit">保存</button>
            <button class="op cancel" type="button" @click="userModal = false">取消</button>
          </div>
        </div>
      </div>

      <!-- 修改班级弹层 -->
      <div v-if="classModal" class="modal-mask" @click.self="classModal = false">
        <div class="modal">
          <h3>修改班级</h3>
          <div class="form-row">
            <label>班级编号</label>
            <input v-model="classForm.bjbh" type="text" />
          </div>
          <div class="form-row">
            <label>班级名称</label>
            <input v-model="classForm.bjmc" type="text" />
          </div>
          <p class="modal-err">{{ classEditErr }}</p>
          <div class="form-actions">
            <button class="op save" type="button" @click="saveClassEdit">保存</button>
            <button class="op cancel" type="button" @click="classModal = false">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="confirmBox" class="modal-mask">
      <div class="modal confirm">
        <p class="confirm-text">{{ confirmBox.text }}</p>
        <div class="form-actions">
          <button class="op delete" type="button" @click="settleConfirm(true)">确定</button>
          <button class="op cancel" type="button" @click="settleConfirm(false)">取消</button>
        </div>
      </div>
    </div>

    <!-- 轻提示 -->
    <div v-if="toast" class="toast" :class="toast.kind">{{ toast.text }}</div>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* ---------- 登录页 ---------- */
.login-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.head-tit {
  position: relative;
  height: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff49;
  padding: 0 70px 0 20px;
}

.head-tit h1 {
  margin: 0;
  font-size: clamp(26px, 5vw, 52px);
  color: #fff;
  text-shadow: 0 0 10px #ff9dff80;
  letter-spacing: 5px;
}

.head-logo {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 46px;
}

.login-card {
  margin: auto;
  width: min(430px, 92vw);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff49;
  border-radius: 50px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5) inset;
}

.login-card h2 {
  margin: 0 0 24px;
  font-size: 40px;
  color: #fff;
  text-shadow: 0 0 10px #ff9dff80;
  letter-spacing: 8px;
}

.login-input {
  width: 100%;
  height: 50px;
  margin: 10px 0;
  box-sizing: border-box;
  color: #333;
  border: 5px solid transparent;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 100px;
  padding: 5px 20px 0;
  transition: 0.3s;
  font-size: 18px;
  outline: none;
}

.login-input:hover {
  background-color: rgba(255, 255, 255, 0);
  border: 5px solid #ffffff;
}

.login-input::placeholder {
  color: #92a7e8;
}

.login-err {
  width: 100%;
  min-height: 20px;
  margin: 4px 0 0;
  color: #ffe3e3;
  font-size: 14px;
  text-shadow: none;
}

.login-btn {
  width: 100%;
  height: 50px;
  margin: 10px 0 8px;
  border: none;
  border-radius: 100px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  letter-spacing: 3px;
  transition: 0.3s;
}

.login-btn:hover {
  filter: brightness(1.1);
}

.login-hint {
  margin: 4px 0 0;
  font-size: 13px;
  color: #ffffffcc;
  text-shadow: none;
}

/* ---------- 主框架布局 ---------- */
.sys {
  position: relative;
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  transition: all 0.3s ease;
  z-index: 40;
}

.sys.collapsed .sidebar {
  width: 78px;
}

.logo-details {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  background: #695cfe;
  border-radius: 15px;
  cursor: pointer;
  overflow: hidden;
}

.logo-emoji {
  font-size: 26px;
}

.logo_name {
  font-size: 17px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 0 10px #ff9dff80;
  white-space: nowrap;
  transition: opacity 0.3s;
}

.sys.collapsed .logo_name {
  opacity: 0;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
}

.nav-links li a {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  color: #707070;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.nav-icon {
  min-width: 78px;
  text-align: center;
  font-size: 20px;
  font-style: normal;
}

.link_name {
  font-size: 16px;
}

.nav-links li:hover > a,
.nav-links li.active > a {
  background: #695cfe;
  color: #fff;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  border-top: 1px solid #eee;
  overflow: hidden;
}

.profile .avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 12px;
  background: #e4e9f7;
}

.profile .name-job {
  min-width: 0;
}

.profile .profile_name {
  font-size: 16px;
  font-weight: 500;
  color: #707070;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile .job {
  font-size: 12px;
  color: #a0a0a0;
}

.logout-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: 0.3s;
}

.logout-btn:hover {
  background: #ffd9d9;
}

.sys.collapsed .name-job,
.sys.collapsed .logout-btn {
  display: none;
}

.sys.collapsed .profile {
  justify-content: center;
}

.home {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
  color: #fff;
}

.menu-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  text-shadow: 0 0 10px #ff9dff80;
}

.topbar-title {
  margin-right: auto;
  font-size: 22px;
  font-weight: 600;
  text-shadow: 0 0 10px #ff9dff80;
  letter-spacing: 2px;
}

.topbar-crumb {
  font-size: 14px;
  background: #ffffff49;
  padding: 4px 14px;
  border-radius: 100px;
  text-shadow: none;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 6px 22px 44px;
}

/* ---------- 毛玻璃卡片（原版 .shell 风格） ---------- */
.glass {
  background-color: #ffffff49;
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5) inset;
  color: #fff;
  text-shadow: 0 0 10px #ff9dff80;
}

.module {
  width: min(1000px, 100%);
  padding: 28px 32px 32px;
  margin: 0 auto;
}

.m-title {
  margin: 0 0 18px;
  font-size: 30px;
  text-align: center;
  letter-spacing: 3px;
}

/* 模块工具条 */
.m-header {
  width: 100%;
  min-height: 60px;
  margin-bottom: 14px;
  background-color: #fff4;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 18px;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 2px;
  box-sizing: border-box;
}

.result {
  font-size: 15px;
}

.input-group {
  width: 160px;
  height: 38px;
  background-color: #fff5;
  padding: 0 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
}

.input-group:hover {
  background-color: #fff8;
  box-shadow: 0 0 10px #ff9dff80;
}

.input-group input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
}

.input-group input::placeholder {
  color: #ffffffcc;
}

/* 表格 */
.s-content {
  width: 100%;
  background-color: #fffb;
  border-radius: 10px;
  color: #339999;
  text-shadow: 0 0 10px #ccffff;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  padding: 10px;
  text-align: center;
  letter-spacing: 2px;
}

thead th {
  color: #339999;
  white-space: nowrap;
}

tbody tr:hover {
  background-color: #ffffffaa;
}

.empty {
  padding: 30px;
}

.role-tag {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 100px;
  font-size: 13px;
  background: #e4e9f7;
  color: #707070;
  text-shadow: none;
  letter-spacing: 1px;
}

.role-tag.admin {
  background: #695cfe;
  color: #fff;
}

.liBtn {
  padding: 8px 10px;
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

.liBtn.reset {
  background-color: #cfc3f5;
  color: #4a3f8f;
  letter-spacing: 3px;
}

.liBtn.delete {
  background-color: #d893a3;
  color: #b30021;
  letter-spacing: 3px;
}

/* 分页（原版 fenyeJQ） */
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 50px;
  margin: 20px auto 0;
  padding: 0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 10px #ccffff;
  list-style: none;
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

/* 班级筛选下拉（原版 selectStuScoreNa） */
.select-menu {
  width: clamp(140px, 25vw, 200px);
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

/* ---------- 表单页（添加成绩/学生/班级、密码设置） ---------- */
.form-card {
  width: min(460px, 100%);
  margin: 20px auto 0;
  padding: 32px 36px 36px;
  display: flex;
  flex-direction: column;
}

.f-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.f-row label {
  width: 72px;
  flex-shrink: 0;
  font-size: 15px;
  text-align: right;
}

.f-row input,
.f-row select {
  flex: 1;
  min-width: 0;
  height: 44px;
  box-sizing: border-box;
  border: 4px solid transparent;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 0 14px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: 0.3s;
}

.f-row input:hover,
.f-row select:hover {
  background: rgba(255, 255, 255, 0);
  border: 4px solid #fff;
}

.f-row input:disabled {
  opacity: 0.7;
}

.f-row input::placeholder {
  color: #92a7e8;
}

.form-err {
  min-height: 18px;
  margin: 0 0 4px 84px;
  color: #ffe3e3;
  font-size: 13px;
  text-shadow: none;
}

.f-btns {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 10px;
}

.f-btns .liBtn {
  width: 84px;
  height: 44px;
  padding: 0;
  font-size: 16px;
  letter-spacing: 3px;
}

.f-btns .ok {
  background: #66ccff;
  color: #fff;
}

.f-btns .re {
  background: #ccccff;
  color: #666;
}

.f-btns .no {
  background: #ffcccc;
  color: #a33;
}

/* ---------- 首页欢迎 ---------- */
.welcome-card {
  width: min(560px, 100%);
  margin: 6vh auto 0;
  padding: 44px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.w-emoji {
  font-size: 52px;
}

.welcome-card h2 {
  margin: 14px 0 8px;
  font-size: 34px;
  letter-spacing: 4px;
}

.w-sub {
  margin: 0 0 22px;
  font-size: 15px;
}

.w-stats {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 22px;
}

.w-stat {
  background: #ffffff3d;
  border-radius: 16px;
  padding: 14px 26px;
  min-width: 90px;
}

.w-stat b {
  display: block;
  font-size: 26px;
}

.w-stat span {
  font-size: 13px;
}

.w-tip {
  margin: 0;
  font-size: 13px;
  color: #ffffffcc;
  text-shadow: none;
}

/* ---------- 弹层 ---------- */
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
  width: min(400px, 92vw);
  max-height: 90vh;
  overflow-y: auto;
  text-shadow: none;
}

.modal h3 {
  margin: 0 0 16px;
  text-align: center;
  color: #695cfe;
}

.modal.confirm {
  width: min(340px, 90vw);
}

.confirm-text {
  margin: 0 0 6px;
  text-align: center;
  font-size: 15px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-row label {
  width: 60px;
  flex-shrink: 0;
  font-size: 14px;
}

.form-row input,
.form-row select {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid #ccd;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  color: #337;
}

.form-row input[readonly] {
  background: #f2f4fa;
  color: #7aa;
}

.modal-err {
  min-height: 18px;
  margin: 2px 0 0;
  color: #e05656;
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.op {
  padding: 8px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.op.save {
  background: #695cfe;
  color: #fff;
}

.op.cancel {
  background: #e4e9f7;
  color: #707070;
}

.op.delete {
  background: #d893a3;
  color: #b30021;
}

/* 轻提示 */
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 14px;
  color: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  text-shadow: none;
}

.toast.ok {
  background: rgba(34, 197, 94, 0.95);
}

.toast.err {
  background: rgba(239, 68, 68, 0.95);
}

/* ---------- 响应式 ---------- */
@media (max-width: 860px) {
  .sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    box-shadow: 6px 0 24px rgba(0, 0, 0, 0.25);
  }

  .sys.collapsed .sidebar {
    transform: translateX(-110%);
  }

  .content {
    padding: 6px 12px 32px;
  }

  .module {
    padding: 20px 16px 24px;
  }

  .m-title {
    font-size: 24px;
  }

  .m-header {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group,
  .input-group:hover {
    width: 100%;
  }

  .select-menu {
    width: 100%;
  }

  .form-card {
    padding: 24px 20px 28px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 28px 20px;
    border-radius: 28px;
  }

  .head-tit {
    padding: 0 64px 0 16px;
  }

  .head-tit h1 {
    font-size: 24px;
  }

  .head-logo {
    font-size: 34px;
  }

  table,
  th,
  td {
    padding: 8px 5px;
    font-size: 13px;
    letter-spacing: 1px;
  }

  .f-row label {
    width: 64px;
    font-size: 14px;
  }

  .form-err {
    margin-left: 76px;
  }

  .modal {
    padding: 18px 16px;
  }
}
</style>
