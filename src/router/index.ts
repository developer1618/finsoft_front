import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
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
      component: () => import("../views/CapsuleWorkshopView.vue"),
      meta: { roles },
    },
    {
      path: "chinese-cargo",
      name: `${namePrefix}ChineseCargo`,
      component: () => import("../views/ChineseCargoView.vue"),
      meta: { roles },
    },
    {
      path: "cup-workshop",
      name: `${namePrefix}CupWorkshop`,
      component: () => import("../views/CupWorkshopView.vue"),
      meta: { roles },
    },
    {
      path: "income-expense",
      name: `${namePrefix}IncomeExpense`,
      component: () => import("../views/IncomeExpenseView.vue"),
      meta: { roles },
    },
    {
      path: "varzob-expense",
      name: `${namePrefix}VarzobExpense`,
      component: () => import("../views/VarzobExpenseView.vue"),
      meta: { roles },
    },
    {
      path: "profile",
      name: `${namePrefix}Profile`,
      component: () => import("../views/ProfileView.vue"),
      meta: { roles },
    },
    {
      path: "reports",
      name: `${namePrefix}ReportsPanel`,
      component: () => import("../views/ReportsPanelView.vue"),
      meta: { roles },
    },
    {
      path: "settings",
      name: `${namePrefix}Settings`,
      component: () => import("../views/SettingsView.vue"),
      meta: { roles },
    },
    {
      path: "warehouse",
      name: `${namePrefix}Warehouse`,
      component: () => import("../views/WarehouseView.vue"),
      meta: { roles },
    },
    {
      path: "factory-warehouse",
      name: `${namePrefix}FactoryWarehouse`,
      component: () => import("../views/FactoryWarehouseView.vue"),
      meta: { roles },
    },
    {
      path: "debts",
      name: `${namePrefix}Debts`,
      component: () => import("../views/DebtsView.vue"),
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
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: () => import("../views/AdminPanelView.vue"),
    meta: { roles: ["admin"] },
    children: createSectionRoutes(["admin"], "Admin"),
  },
  {
    path: "/manager",
    name: "ManagerPanel",
    component: () => import("../views/ManagerPanelView.vue"),
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
