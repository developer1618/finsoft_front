import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Login from "../views/LoginView.vue";
import AdminPanel from "../views/AdminPanelView.vue";
import ManagerPanel from "../views/ManagerPanelView.vue";
import CapsuleWorkshop from "../views/CapsuleWorkshopView.vue";
import ChineseCargo from "../views/ChineseCargoView.vue";
import CupWorkshop from "../views/CupWorkshopView.vue";
import IncomeExpense from "../views/IncomeExpenseView.vue";
import VarzobExpense from "../views/VarzobExpenseView.vue";
import Profile from "../views/ProfileView.vue";
import ReportsPanel from "../views/ReportsPanelView.vue";
import Settings from "../views/SettingsView.vue";
import Warehouse from "../views/WarehouseView.vue";
import FactoryWarehouse from "../views/FactoryWarehouseView.vue";
import { getCurrentRole, type UserRole } from "../stores/auth";

declare module "vue-router" {
  interface RouteMeta {
    roles?: UserRole[];
  }
}

const createSectionRoutes = (
  roles: UserRole[],
  namePrefix: "Admin" | "Manager"
): RouteRecordRaw[] => [
  {
    path: "capsule-workshop",
    name: `${namePrefix}CapsuleWorkshop`,
    component: CapsuleWorkshop,
    meta: { roles },
  },
    {
    path: "chinese-cargo",
    name: `${namePrefix}ChineseCargo`,
    component: ChineseCargo,
    meta: { roles },
  },
  {
    path: "cup-workshop",
    name: `${namePrefix}CupWorkshop`,
    component: CupWorkshop,
    meta: { roles },
  },
  {
    path: "income-expense",
    name: `${namePrefix}IncomeExpense`,
    component: IncomeExpense,
    meta: { roles },
  },
  {
    path: "varzob-expense",
    name: `${namePrefix}VarzobExpense`,
    component: VarzobExpense,
    meta: { roles },
  },
  {
    path: "profile",
    name: `${namePrefix}Profile`,
    component: Profile,
    meta: { roles },
  },
  {
    path: "reports",
    name: `${namePrefix}ReportsPanel`,
    component: ReportsPanel,
    meta: { roles },
  },
  {
    path: "settings",
    name: `${namePrefix}Settings`,
    component: Settings,
    meta: { roles },
  },
  {
    path: "warehouse",
    name: `${namePrefix}Warehouse`,
    component: Warehouse,
    meta: { roles },
  },
  {
    path: "factory-warehouse",
    name: `${namePrefix}FactoryWarehouse`,
    component: FactoryWarehouse,
    meta: { roles },
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: AdminPanel,
    meta: { roles: ["admin"] },
    children: createSectionRoutes(["admin"], "Admin"),
  },
  {
    path: "/manager",
    name: "ManagerPanel",
    component: ManagerPanel,
    meta: { roles: ["manager"] },
    children: createSectionRoutes(["manager"], "Manager"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const getFallbackRoute = (role: UserRole | null) => {
  if (role === "admin") {
    return "/admin";
  }
  if (role === "manager") {
    return "/manager";
  }
  return "/login";
};

router.beforeEach((to, _from, next) => {
  const role = getCurrentRole();

  if (to.path !== "/login" && !role) {
    return next("/login");
  }

  if (to.path === "/login" && role) {
    return next(getFallbackRoute(role));
  }

  if (to.meta.roles && (!role || !to.meta.roles.includes(role))) {
    return next(getFallbackRoute(role));
  }

  next();
});

export default router;
