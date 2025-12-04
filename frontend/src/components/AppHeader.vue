<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const role = ref("user");

const getUser = computed(() => {
  const userSection = sessionStorage.getItem("userSection");
  const staffSection = sessionStorage.getItem("staffSection");
  role.value = sessionStorage.getItem("currentLogin");
  if (role.value === "user") return userSection ? JSON.parse(userSection) : {};
  if (role.value === "staff")
    return staffSection ? JSON.parse(staffSection) : {};
  return {};
});

const isAuthenticated = computed(() => {
  const user = getUser.value || {};
  return !!user.token;
});

const logout = () => {
  sessionStorage.clear();
  router.push("/login");
};
</script>

<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg">
    <div class="container-fluid py-2 px-4">
      <router-link to="/home" class="navbar-brand d-flex align-items-center">
        <i class="bi bi-book-half fs-4 me-2"></i>
        <span class="fw-bold fs-5">BOOK BORROW SYSTEM </span>
      </router-link>

      <div v-if="isAuthenticated" class="d-none d-lg-block mx-auto">
        <ul
          v-if="role === 'user'"
          class="navbar-nav me-auto mb-2 mb-lg-0 fw-medium"
        >
          <li class="nav-item">
            <router-link
              :to="{ name: 'home.content' }"
              class="nav-link text-white mx-2"
              active-class="text-warning fw-bold border-bottom border-warning"
            >
              <i class="bi bi-house-door-fill me-1"></i> Trang Chủ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'book.list' }"
              class="nav-link text-white mx-2"
              active-class="text-warning fw-bold border-bottom border-warning"
            >
              <i class="bi bi-collection-fill me-1"></i> Thư Viện Sách
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'book.history' }"
              class="nav-link text-white mx-2"
              active-class="text-warning fw-bold border-bottom border-warning"
            >
              <i class="bi bi-clock-history me-1"></i> Lịch Sử Mượn
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'profile.reader' }"
              class="nav-link text-white mx-2"
              active-class="text-warning fw-bold border-bottom border-warning"
            >
              <i class="bi bi-person-gear"></i> Thông tin cá nhân
            </router-link>
          </li>
        </ul>
      </div>

      <div class="d-flex align-items-center ms-auto ms-lg-0">
        <template v-if="!isAuthenticated">
          <router-link
            :to="{ name: 'login' }"
            class="btn btn-outline-light me-2 fw-medium"
            >Đăng nhập</router-link
          >
          <router-link
            :to="{ name: 'user.register' }"
            class="btn btn-warning fw-medium"
            >Đăng ký</router-link
          >
        </template>

        <template v-else>
          <router-link
            :to="{ name: `profile.${getUser.role}` }"
            class="profile-link me-3 d-flex align-items-center text-decoration-none text-white"
          >
            <div class="avatar-container me-3">
              <img
                :src="
                  getUser.avatarURL ||
                  `https://api.dicebear.com/8.x/initials/svg?seed=${
                    getUser.name || 'User'
                  }&backgroundColor=0a2540,ffc107,dc3545&size=45`
                "
                alt="Avatar"
                class="rounded-circle profile-avatar"
              />
            </div>

            <div class="d-none d-sm-block text-start">
              <span class="d-block fw-bold profile-name">{{
                getUser.name || "Hồ sơ"
              }}</span>
              <small class="text-white-50 text-capitalize">{{
                getUser.role === "reader" ? "Đọc giả" : "Nhân viên"
              }}</small>
            </div>
          </router-link>

          <button @click="logout" class="btn btn-outline-danger fw-medium fs-6">
            Đăng xuất <i class="bi bi-box-arrow-in-right"></i>
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.bg-primary {
  background-color: #0a2540 !important;
}
.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #333;
  transition: all 0.2s ease-in-out;
}
.btn-warning:hover {
  background-color: #e0a800;
  border-color: #e0a800;
}
.navbar-brand {
  font-size: 1.5rem;
}
.profile-link {
  padding: 5px 10px;
  border-radius: 25px;
  transition: all 0.3s ease;
  min-width: 150px;
}

.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
}

.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #8fff07;
  box-shadow: 0 0 5px rgba(142, 192, 84, 0.5);
  overflow: hidden;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile-name {
  line-height: 1.2;
}
</style>
