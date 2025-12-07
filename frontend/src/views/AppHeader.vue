<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "@/services/user.service";
import StaffService from "@/services/staff.service";
const staffService = new StaffService();
const userService = new UserService();

const router = useRouter();
const role = ref("user");
const user = ref({});
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

onMounted(async () => {
  const usr = getUser.value;
  if (usr.role === "reader") {
    user.value = await userService.getUser(usr.id);
  } else {
    user.value = await staffService.getStaff(usr.id);
  }
});

const logout = () => {
  sessionStorage.clear();
  router.push("/home");
  window.location.reload();
};
</script>

<template>
  <header
    class="navbar navbar-expand-lg navbar-dark p-3 header-gradient shadow-lg"
  >
    <!-- {{ user }} -->
    <div class="container-fluid py-2 px-4">
      <router-link to="/home" class="navbar-brand d-flex align-items-center">
        <i class="bi bi-book-half fs-4 me-2"></i>
        <span class="fw-bold fs-5">BOOK BORROW SYSTEM</span>
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
              <i class="bi bi-collection-fill me-1"></i> Danh mục sách
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
          >
            Đăng nhập
          </router-link>
          <router-link
            :to="{ name: 'user.register' }"
            class="btn btn-warning fw-medium"
          >
            Đăng ký
          </router-link>
        </template>

        <template v-else>
          <div class="dropdown">
            <div
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              class="profile-link me-3 d-flex align-items-center dropdown-toggle text-white"
            >
              <div class="avatar-container me-3">
                <img
                  :src="
                    `https://api.dicebear.com/8.x/avataaars/svg?seed=${user._id}` ||
                    getUser.id
                  "
                  alt="Avatar"
                  class="rounded-circle profile-avatar"
                />
              </div>

              <div class="d-none d-sm-block text-start">
                <span class="d-block fw-bold profile-name">
                  {{
                    user.role === "reader"
                      ? user.lastName + " " + user.firstName
                      : user.fullName || "Hồ sơ"
                  }}
                </span>
                <small class="text-white-50 text-capitalize">
                  {{ user.role === "reader" ? "Đọc giả" : "Nhân viên" }}
                </small>
              </div>
              <span class="ms-3"></span>
            </div>

            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <router-link
                  :to="{ name: `profile.${getUser.role}` }"
                  class="dropdown-item"
                >
                  Thông tin cá nhân
                </router-link>
              </li>
              <li>
                <button
                  type="button"
                  @click="logout"
                  class="dropdown-item fw-medium fs-6"
                >
                  Đăng xuất <i class="bi bi-power"></i>
                </button>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-gradient {
  background: linear-gradient(-90deg, #001234, #001b4b, #002d79, #003c9b);
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #333;
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
  transition: 0.3s;
  min-width: 150px;
}

.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #8fff07;
  overflow: hidden;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  line-height: 1.2;
}
</style>
