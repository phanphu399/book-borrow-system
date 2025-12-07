<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { push } from "notivue";
import {
  staffUpdateSchema,
  staffCreateSchema,
} from "@/validations/staff.validate";
import { ref, computed } from "vue";
import router from "@/router";
import StaffService from "@/services/staff.service";
const staffService = new StaffService();
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
const handleRegister = async (values) => {
  try {
    await staffService.register(values);
    push.success("Đăng ký tài khoản thành công");
    router.push("/login");
  } catch (error) {
    if (error.response.status === 400)
      push.error("Vui lòng nhập đầy đủ thông tin");
    else if (error.response.status === 409)
      push.error("Tên đăng nhập đã tồn tại vui lòng đặt tên khác");
    else push.error("Đăng ký không thành công, vui lòng thử lại");
  }
};
</script>

<template>
  <div
    class="d-flex justify-content-center bg align-items-center vh-100 bg-light"
  >
    <div class="col-md-4 p-4 shadow-lg bg-white rounded">
      <h3 class="text-center text-primary font-weight-light my-3">
        ĐĂNG KÝ TÀI KHOẢN
      </h3>

      <div class="card-body">
        <Form
          :initial-values="{ gender: '' }"
          method="post"
          @submit="handleRegister"
          :validation-schema="staffCreateSchema"
        >
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label" for="fullName">Họ tên (*)</label>
              <Field
                name="fullName"
                type="text"
                class="form-control"
                placeholder="Tên đầy đủ"
              />
              <ErrorMessage name="fullName" class="text-danger small" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label" for="address">Địa chỉ</label>
              <Field
                name="address"
                type="text"
                class="form-control"
                placeholder="Địa chỉ thường trú"
              />
              <ErrorMessage name="address" class="text-danger small" />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="phone">Số điện thoại</label>
              <Field
                name="phone"
                type="text"
                class="form-control"
                placeholder="Số điện thoại"
              />
              <ErrorMessage name="phone" class="text-danger small" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label" for="username">Tên đăng nhập (*)</label>
              <Field
                autocomplete="username"
                name="username"
                type="text"
                class="form-control"
                placeholder="Tối thiểu 5 ký tự"
              />
              <ErrorMessage name="username" class="text-danger small" />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="password">Mật khẩu (*)</label>
              <div class="input-group">
                <Field
                  autocomplete="current-password"
                  :type="passwordFieldType"
                  name="password"
                  id="password"
                  class="form-control"
                  placeholder="Tối thiểu 6 ký tự"
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
          </div>
          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary btn-block">
              Đăng Ký
            </button>
          </div>
        </Form>
      </div>

      <div class="card-footer text-center py-3">
        <div class="small">
          Đã có tài khoản?
          <router-link :to="{ name: 'login' }">Đăng nhập ngay</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header h3 {
  margin-bottom: 0;
}
</style>
