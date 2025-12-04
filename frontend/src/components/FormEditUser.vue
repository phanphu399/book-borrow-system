<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, computed } from "vue";
import {
  createUserSchema,
  updateUserSchema,
} from "@/validations/user.validate";

import { push } from "notivue";

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
const props = defineProps({
  show: Boolean,
  users: {
    type: Object,
    required: true,
  },
  mode: { type: String, default: "create" },
});

const emit = defineEmits(["update-users", "update:show"]);

const formData = reactive({
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  address: "",
  phone: "",
});

watch(
  () => props.users,
  (newVal) => {
    if (props.mode === "update" && newVal) {
      Object.assign(formData, newVal);
      if (newVal.birthDate) {
        formData.birthDate = new Date(newVal.birthDate)
          .toISOString()
          .slice(0, 10);
      }
    }
  },
  { immediate: true }
);

const formRef = ref(null);

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    push.error("Vui lòng điền đầy đủ thông tin !");
    return;
  }
  let payload = { ...formData };
  if (props.mode === "update") {
    delete payload.username;
    delete payload.password;
  }
  // console.log(payload);
  emit("update-users", { ...payload });
};

const closeModal = () => {
  emit("update:show", false);
};
</script>

<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    data-bs-backdrop="true"
    data-bs-keyboard="true"
    @click.self="closeModal"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              mode === "create"
                ? "Thêm người dùng"
                : "Cập nhật thông tin người dùng"
            }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <Form
            ref="formRef"
            :validation-schema="
              mode === 'create' ? createUserSchema : updateUserSchema
            "
          >
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Họ *</label>
                <Field
                  type="text"
                  name="lastName"
                  class="form-control"
                  v-model="formData.lastName"
                />
                <ErrorMessage name="lastName" class="text-danger small" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Tên *</label>
                <Field
                  type="text"
                  name="firstName"
                  class="form-control"
                  v-model="formData.firstName"
                />
                <ErrorMessage name="firstName" class="text-danger small" />
              </div>
            </div>

            <div class="row g-3 my-2">
              <div class="col-md-6">
                <label class="form-label">Giới tính *</label>
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <Field
                      type="radio"
                      name="gender"
                      value="male"
                      id="male"
                      class="form-check-input"
                      v-model="formData.gender"
                    />
                    <label for="male" class="form-check-label">Nam</label>
                  </div>

                  <div class="form-check">
                    <Field
                      type="radio"
                      name="gender"
                      value="female"
                      id="female"
                      class="form-check-input"
                      v-model="formData.gender"
                    />
                    <label for="female" class="form-check-label">Nữ</label>
                  </div>
                </div>

                <ErrorMessage name="gender" class="text-danger small" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày sinh *</label>
                <Field
                  type="date"
                  name="birthDate"
                  class="form-control"
                  v-model="formData.birthDate"
                />
                <ErrorMessage name="birthDate" class="text-danger small" />
              </div>
            </div>

            <div class="my-2" v-if="props.mode === 'create'">
              <label class="form-label">Tài khoản *</label>
              <Field
                type="String"
                name="username"
                class="form-control"
                v-model="formData.username"
              />
              <ErrorMessage name="username" class="text-danger small" />
            </div>
            <div class="mb-3" v-if="props.mode === 'create'">
              <label for="password" class="form-label">Mật khẩu *</label>

              <div class="input-group">
                <Field
                  :type="passwordFieldType"
                  name="password"
                  id="password"
                  class="form-control"
                  v-model="formData.password"
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
            <div class="mb-3">
              <label class="form-label">Số điện thoại</label>
              <Field
                type="String"
                name="phone"
                class="form-control"
                v-model="formData.phone"
              />
              <ErrorMessage name="phone" class="text-danger small" />
            </div>
            <div class="mb-3">
              <label class="form-label">Địa chỉ *</label>
              <Field
                type="text"
                name="address"
                class="form-control"
                v-model.number="formData.address"
              />
              <ErrorMessage name="address" class="text-danger small" />
            </div>
          </Form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Hủy
          </button>
          <button @click="submitForm" type="button" class="btn btn-primary">
            <i class="bi bi-pencil-square me-2"></i>
            {{ mode === "create" ? "Thêm" : "Cập nhật" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  transition: all 0.2s ease-in-out;
}
</style>
