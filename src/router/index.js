import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard'
import Projects from '../views/Projects'
import Overview from '../views/Overview'
import Storage from '../views/Storage'
import Email from '../views/Email'
import User from '../views/User'

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
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview
  },
  {
    path: '/storage',
    name: 'Storage',
    component: Storage
  },
  {
    path: '/email',
    name: 'Email',
    component: Email
  },
  {
    path: '/users',
    name: 'User',
    component: User
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
