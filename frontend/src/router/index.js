import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../services/auth.service";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/user/login",
    name: "user.login",
    component: () => import("../views/UserLogin.vue"),
  },
  {
    path: "/staff/login",
    name: "staff.login",
    component: () => import("../views/StaffLogin.vue"),
  },
  {
    path: "/user/register",
    name: "user.register",
    component: () => import("../views/UserRegister.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../views/notFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/user/login");
  } else {
    next();
  }
});

export default router;
