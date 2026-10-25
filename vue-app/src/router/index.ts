import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DemoViewer from '../views/DemoViewer.vue'

// Auto-map every demo component in src/demos/<category>/<id>.vue
const demoFiles = import.meta.glob<{ default: unknown }>('../demos/*/*.vue')

const demoRoutes = Object.entries(demoFiles).map(([path, component]) => {
  // "../demos/motion/loading-anim.vue" -> "motion/loading-anim"
  const id = path.replace(/^\.\.\//, '').replace(/\.vue$/, '').replace(/^demos\//, '')
  const [categoryId, demoId] = id.split('/')
  return {
    path: `/demo/${categoryId}/${demoId}`,
    name: `demo-${id}`,
    component: DemoViewer,
    children: [
      {
        path: '',
        name: `demo-view-${id}`,
        component: component as never,
        meta: { categoryId, demoId },
      },
    ],
  }
})

const router = createRouter({
  // 使用 hash 模式：GitHub Pages 是纯静态托管，刷新子路径不会 404
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue'),
    },
    {
      path: '/demo/local/:demoId',
      name: 'demo-local',
      component: DemoViewer,
    },
    {
      path: '/share',
      name: 'share',
      component: () => import('../views/ShareView.vue'),
    },
    ...demoRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
