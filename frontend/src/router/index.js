import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../services/auth.service";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/user/register",
    name: "user.register",
    component: () => import("../views/UserRegister.vue"),
  },
  {
    path: "/staff/register",
    name: "staff.register",
    component: () => import("../views/StaffRegister.vue"),
  },

  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/Admin.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "book",
        name: "book.admin",

        component: () => import("../views/admin/Books.vue"),
      },
      {
        path: "publisher",
        name: "publisher.admin",
        component: () => import("../views/admin/Publisher.vue"),
      },
      {
        path: "borrow",
        name: "borrow.admin",
        component: () => import("../views/admin/Borrow.vue"),
      },
      {
        path: "staff",
        name: "staff.list.admin",
        component: () => import("../views/admin/StaffList.vue"),
      },
      {
        path: "user",
        name: "user.list.admin",
        component: () => import("../views/admin/UserList.vue"),
      },
      {
        path: "report",
        name: "report.admin",
        component: () => import("../views/admin/ReportBook.vue"),
      },
      {
        path: "book-edit",
        name: "book.edit.admin",
        component: () => import("../components/FormEditBook.vue"),
      },

      {
        path: "profile",
        name: "profile.staff",
        component: () => import("../views/profile.vue"),
      },
    ],
  },

  {
    path: "/home",
    name: "home",
    redirect: { name: "home.content" },
    component: () => import("../views/user/Home.vue"),

    children: [
      {
        path: "content",
        name: "home.content",
        component: () => import("../views/user/Content.vue"),
      },
      {
        meta: { requiresAuth: true },
        path: "book-list",
        name: "book.list",
        component: () => import("../views/user/BookList.vue"),
      },
      {
        meta: { requiresAuth: true },
        path: "my-borrow-history",
        name: "book.history",
        component: () => import("../views/user/historyBorrow.vue"),
      },
      {
        path: "profile",
        name: "profile.reader",
        component: () => import("../views/profile.vue"),
      },
    ],
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
    next("/login");
  } else {
    next();
  }
});

export default router;
