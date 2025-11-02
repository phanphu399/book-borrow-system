<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import ReaderService from "@/services/user.service"; // Đảm bảo đường dẫn đúng
import router from "@/router";
import { useAuthStore } from "@/stores/auth"; // Dùng Pinia hoặc Composition API để quản lý trạng thái

// Định nghĩa Schema xác thực
const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Tên đăng nhập không được để trống.")
    .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự."),
  password: yup
    .string()
    .required("Mật khẩu không được để trống.")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

const login = async (values) => {
  try {
    // Gọi hàm login từ ReaderService
    const response = await ReaderService.login(
      values.username,
      values.password
    );

    // --- Xử lý Logic Đăng nhập Thành công ---
    // Lưu token vào localStorage (đã được xử lý trong api.service.js nếu bạn sửa lỗi)
    // Lưu vai trò (role) của người dùng vào localStorage (Rất quan trọng)

    // Ví dụ: Giả sử API trả về { token: '...', user: { role: 'reader', ... } }
    localStorage.setItem("authenticateToken", response.token);
    localStorage.setItem("userRole", response.user.role);

    // Chuyển hướng người dùng về trang chủ hoặc trang Reader Dashboard
    router.push("/");
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    alert(
      error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
    );
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="col-md-4 p-4 shadow-sm bg-white rounded">
      <h4 class="text-center mb-4 text-primary">Đăng nhập Độc giả</h4>

      <Form @submit="login" :validation-schema="loginSchema">
        <div class="mb-3">
          <label for="username" class="form-label">Tên đăng nhập:</label>
          <Field
            name="username"
            type="text"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
          />
          <ErrorMessage name="username" class="text-danger small" />
        </div>

        <div class="mb-4">
          <label for="password" class="form-label">Mật khẩu:</label>
          <Field
            name="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
          />
          <ErrorMessage name="password" class="text-danger small" />
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-primary">Đăng nhập</button>
        </div>
      </Form>

      <p class="text-center mt-3 small">
        Chưa có tài khoản?
        <router-link :to="{ name: 'user.register' }">Đăng ký ngay</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Có thể thêm style tùy chỉnh ở đây nếu cần */
.vh-100 {
  min-height: 100vh;
}
</style>
