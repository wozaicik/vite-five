import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('../layout/index.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Layout
      },
      {
        path: '/:id',
        component: Layout
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
