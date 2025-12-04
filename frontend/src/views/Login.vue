<script setup>
import router from "@/router";
import StaffService from "@/services/staff.service";
import UserService from "@/services/user.service";
import { Form, Field, ErrorMessage } from "vee-validate";
import { push } from "notivue";
import { loginSchema } from "@/validations/login.validate";
import { ref, computed } from "vue";
const passwordFieldType = ref("password");

const iconClass = computed(() => {
  if (passwordFieldType.value === "password") {
    return "bi bi-eye-slash";
  } else {
    return "bi bi-eye";
  }
});
const togglePasswordHidden = () => {
  passwordFieldType.value =
    passwordFieldType.value === "password" ? "text" : "password";
};
const activeTab = ref("user");
const userService = new UserService();
const staffService = new StaffService();

const createAvatarUrl = (seed) =>
  `https://api.dicebear.com/8.x/avataaars/svg?seed=${seed}&size=40`;

const login = async (values) => {
  try {
    const service = activeTab.value === "user" ? userService : staffService;

    const response = await service.login(values.username, values.password);
    const data = response.data.user || response.data.staff;

    // console.log(response.data);

    const session = {
      token: response.data.token,
      id: data.id,
      name: data.name,
      role: data.role,
      avatarURL: createAvatarUrl(data.id),
    };

    const key = activeTab.value === "user" ? "userSection" : "staffSection";

    sessionStorage.setItem(key, JSON.stringify(session));
    sessionStorage.setItem("currentLogin", activeTab.value);
    push.success("Đăng nhập thành công");
    if (activeTab.value === "user") {
      router.push("/home");

      return;
    }
    router.push("/admin");
  } catch (error) {
    if (error.response?.status === 400)
      push.error("Vui lòng nhập đầy đủ thông tin");
    else if ([401, 404].includes(error.response?.status))
      push.error("Tài khoản hoặc mật khẩu không chính xác");
    else push.error("Đăng nhập không thành công, vui lòng thử lại");
  }
};
</script>

<template>
  <div
    class="login-container d-flex justify-content-center align-items-center bg-light"
  >
    <div class="login-box shadow-lg bg-white rounded p-4 text-center">
      <h6 class="fw-bold text-primary fs-2 mb-4">Đăng nhập</h6>

      <div
        class="tab-switch d-flex justify-content-center mb-4 border rounded-pill bg-light p-1"
      >
        <button
          class="btn w-50 rounded-pill"
          :class="activeTab === 'user' ? 'btn-primary text-white' : 'btn-light'"
          @click="activeTab = 'user'"
        >
          Người đọc
        </button>
        <button
          class="btn w-50 rounded-pill"
          :class="
            activeTab === 'staff' ? 'btn-primary text-white' : 'btn-light'
          "
          @click="activeTab = 'staff'"
        >
          Nhân viên
        </button>
      </div>

      <Form @submit="login" :validation-schema="loginSchema" class="text-start">
        <div class="mb-3">
          <label class="form-label">Tên đăng nhập:</label>
          <Field
            name="username"
            type="text"
            autocomplete="username"
            class="form-control"
            placeholder="Nhập email hoặc tên đăng nhập"
          />
          <ErrorMessage name="username" class="text-danger small" />
        </div>

        <div class="mb-4">
          <label class="form-label">Mật khẩu:</label>
          <div class="input-group">
            <Field
              :type="passwordFieldType"
              name="password"
              id="password"
              class="form-control"
              autocomplete="current-password"
              placeholder="Nhập mật khẩu"
            />
            <button
              class="btn btn-secondary"
              type="button"
              @click="togglePasswordHidden"
              title="Hiển thị/Ẩn mật khẩu"
            >
              <i :class="iconClass"></i>
            </button>
          </div>
          <ErrorMessage name="password" class="text-danger small" />
        </div>

        <div class="d-grid">
          <button
            type="submit"
            class="btn btn-primary rounded-pill py-2 fw-semibold"
          >
            Đăng nhập
          </button>
        </div>
      </Form>

      <p class="text-center mt-3 small">
        Chưa có tài khoản?
        <router-link
          :to="{
            name: 'user.register',
          }"
          class="text-primary fw-semibold"
        >
          Đăng ký ngay
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  padding: 1rem;
}

.login-box {
  width: 100%;
  max-width: 420px;
}

@media (max-width: 576px) {
  .login-box {
    padding: 1.5rem;
    box-shadow: none;
  }

  h6 {
    font-size: 1.5rem !important;
  }

  .tab-switch button {
    font-size: 0.9rem;
    padding: 0.4rem;
  }

  .form-control {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 0.95rem;
  }
}
</style>
