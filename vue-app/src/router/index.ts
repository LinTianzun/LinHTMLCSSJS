import { createRouter, createWebHistory } from 'vue-router'
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
  history: createWebHistory(import.meta.env.BASE_URL),
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
    ...demoRoutes,
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
