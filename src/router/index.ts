import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/LoginView.vue'
import AdminPanel from '../views/AdminPanelView.vue'
import CapsuleWorkshop from '../views/CapsuleWorkshopView.vue'
import ChineseCargo from '../views/ChineseCargoView.vue'
import CupWorkshop from '../views/CupWorkshopView.vue'
import IncomeExpense from '../views/IncomeExpenseView.vue'
import Profile from '../views/ProfileView.vue'
import ReportsPanel from '../views/ReportsPanelView.vue'
import Settings from '../views/SettingsView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    children: [
      {
        path: 'capsule-workshop',
        name: 'CapsuleWorkshop',
        component: CapsuleWorkshop
      },
      {
        path: 'chinese-cargo',
        name: 'ChineseCargo',
        component: ChineseCargo
      },
      {
        path: 'cup-workshop',
        name: 'CupWorkshop',
        component: CupWorkshop
      },
      {
        path: 'income-expense',
        name: 'IncomeExpense',
        component: IncomeExpense
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: 'reports',
        name: 'ReportsPanel',
        component: ReportsPanel
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
