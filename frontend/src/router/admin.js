import { isAuthenticated } from "@/services/auth.service";

export const adminRoutes = [
  {
    path: "/admin",
    name: "admin.home",
    component: () => import("@/views/admin/AdminHome.vue"),
    meta: { requiresAuth: true, role: "staff" },
    children: [
      {
        path: "book",
        name: "book.admin",
        component: () => import("@/views/admin/Books.vue"),
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "publisher",
        name: "publisher.admin",
        component: () => import("@/views/admin/Publisher.vue"),
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "borrow",
        name: "borrow.admin",
        component: () => import("@/views/admin/Borrow.vue"),
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "staff",
        name: "staff.list.admin",
        component: () => import("@/views/admin/StaffList.vue"),
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "user",
        name: "user.list.admin",
        component: () => import("@/views/admin/UserList.vue"),
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "report",
        name: "report.admin",
        component: () => import("@/views/admin/ReportBook.vue"),
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "book-edit",
        name: "book.edit.admin",
        component: () => import("@/components/FormEditBook.vue"),
        meta: { requiresAuth: true, role: "admin" },
      },
    ],
  },
];

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/user/login");
  } else {
    next();
  }
});
