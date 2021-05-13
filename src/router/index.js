import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard'
import Projects from '../views/Projects'

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/',
    name: 'Projects',
    component: Projects
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
