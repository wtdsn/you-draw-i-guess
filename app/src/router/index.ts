import { createRouter, createWebHistory } from 'vue-router'
import { Router } from 'vue-router'

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "entry"
    },
    {
      name: "enrty",
      path: "/entry",
      component: () => import('../pages/enrty/index.vue')
    },
    {
      name: "index",
      path: "/index",
      component: () => import('../pages/index/index.vue')
    }, {
      name: "404",
      path: '/:pathMatch(.*)*',
      component: () => import('../pages/404/index.vue')
    }
  ],
})

export default router