<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { push } from "notivue";
import UserService from "@/services/user.service";
import { createUserSchema } from "@/validations/user.validate";
import router from "@/router";
import { ref, computed } from "vue";
const userService = new UserService();

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
    const response = await userService.register(values);
    // console.log(response);
    push.success("Đăng ký tài khoản thành công");
    router.push("/login");
  } catch (error) {
    if (error.response.status === 400)
      push.error("Vui lòng nhập đầy đủ thông tin");
    else if (error.response.status === 409)
      push.error("Tên đăng nhập đã tồn tại vui lòng đặt tên khác");
    else if (error.response.status === 401)
      push.error("Tài khoản hoặc mật khẩu không chính xác");
    else if (error.response.status === 404)
      push.error("Tài khoản hoặc mật khẩu không chính xác");
    else push.error("Đăng nhập không thành công, vui lòng thử lại");
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
          @submit="handleRegister"
          :validation-schema="createUserSchema"
        >
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label" for="lastName">Họ (*)</label>
              <Field
                name="lastName"
                type="text"
                class="form-control"
                placeholder="Họ"
              />
              <ErrorMessage name="lastName" class="text-danger small" />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="firstName">Tên (*)</label>
              <Field
                name="firstName"
                type="text"
                class="form-control"
                placeholder="Tên"
              />
              <ErrorMessage name="firstName" class="text-danger small" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label d-block" for="gender"
                >Giới tính (*)</label
              >

              <Field name="gender" type="radio" v-slot="{ field }">
                <div class="d-flex gap-4 mt-3">
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      id="gender-male"
                      type="radio"
                      value="male"
                      v-bind="field"
                    />
                    <label class="form-check-label" for="gender-male">
                      Nam
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      id="gender-female"
                      type="radio"
                      value="female"
                      v-bind="field"
                    />
                    <label class="form-check-label" for="gender-female">
                      Nữ
                    </label>
                  </div>
                </div>
              </Field>
              <ErrorMessage name="gender" class="text-danger small" />
            </div>

            <div class="col-md-6">
              <label class="form-label" for="birthDate">Ngày sinh</label>
              <Field name="birthDate" type="date" class="form-control" />
              <ErrorMessage name="birthDate" class="text-danger small" />
            </div>
          </div>

          <div class="row mb-3">
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

.bg {
  background-color: rgba(0, 0, 0, 0.049) !important;
}
</style>
