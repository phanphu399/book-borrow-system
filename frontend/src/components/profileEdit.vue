<script setup>
import FormatData from "@/validations/FormatData";
import { ref, watch } from "vue";
import { updateUserSchema } from "@/validations/user.validate";
import { staffUpdateSchema } from "@/validations/staff.validate";
import { Form, Field, ErrorMessage } from "vee-validate";
const props = defineProps({
  user: { type: Object, required: true },
});

const emit = defineEmits(["save", "reload"]);

const form = ref({});

const isEditing = ref(false);

watch(
  () => props.user,
  (v) => {
    form.value = {
      ...v,
      birthDate: FormatData.convertDateToYYMMDD(v.birthDate),
    };
  },
  { immediate: true, deep: true }
);

function toggleEdit() {
  isEditing.value = true;
}

function cancelEdit() {
  form.value = {
    ...props.user,
    birthDate: FormatData.convertDateToYYMMDD(props.user.birthDate),
  };
  isEditing.value = false;
}

function save() {
  const payload = {
    ...form.value,
    birthDate: form.value.birthDate
      ? new Date(form.value.birthDate).toISOString()
      : null,
  };

  if (payload) {
    delete payload.username;
    delete payload.password;
  }

  emit("save", payload);
  isEditing.value = false;
}
</script>
<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Thông tin cá nhân</h3>

      <button class="btn btn-primary" v-if="!isEditing" @click="toggleEdit">
        <i class="bi bi-pencil-square me-1"></i> Chỉnh sửa
      </button>

      <div v-else>
        <button class="btn btn-success me-2" @click="save">
          <i class="bi bi-save me-1"></i> Lưu
        </button>
        <button class="btn btn-secondary" @click="cancelEdit">Hủy</button>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card shadow-sm profile-card">
          <div class="avatar-wrapper">
            <img
              :src="`https://api.dicebear.com/8.x/avataaars/svg?seed=${user._id}`"
              class="avatar-img"
            />
          </div>
          <div class="card-body text-center">
            <h5 class="fw-bold mb-1">
              {{ props.user.lastName }} {{ props.user.firstName }}
            </h5>

            <h5 v-if="props.user.role === 'staff'" class="fw-bold mb-1">
              {{ props.user.fullName }}
            </h5>
            <p class="text-muted mb-0">
              ( {{ props.user.role === "reader" ? "Đọc giả" : "Nhân viên" }})
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <Form
          :validation-schema="
            props.user.role === 'reader' ? updateUserSchema : staffUpdateSchema
          "
          class="card shadow-sm p-4 form-card"
        >
          <div class="row g-3">
            <div class="col-md-8" v-if="props.user.role === 'reader'">
              <label class="form-label fw-semibold">Họ</label>
              <Field
                type="text"
                class="form-control"
                v-model="form.lastName"
                name="lastName"
                :readonly="!isEditing"
              />
              <ErrorMessage name="lastName" class="text-danger small" />
            </div>

            <div class="col-md-4" v-if="props.user.role === 'reader'">
              <label class="form-label fw-semibold">Tên</label>
              <Field
                type="text"
                name="firstName"
                class="form-control"
                v-model="form.firstName"
                :readonly="!isEditing"
              />
              <ErrorMessage name="firstName" class="text-danger small" />
            </div>
            <div class="col-md-12" v-if="props.user.role === 'staff'">
              <label class="form-label fw-semibold">Tên</label>
              <Field
                name="fullName"
                type="text"
                class="form-control"
                v-model="form.fullName"
                :readonly="!isEditing"
              />
              <ErrorMessage name="fullName" class="text-danger small" />
            </div>

            <div
              class="col-md-6"
              :disabled="!isEditing"
              v-if="props.user.role === 'reader'"
            >
              <label class="form-label">Giới tính *</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <Field
                    type="radio"
                    name="gender"
                    value="male"
                    id="male"
                    class="form-check-input"
                    v-model="form.gender"
                    :disabled="!isEditing"
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
                    v-model="form.gender"
                    :disabled="!isEditing"
                  />
                  <label for="female" class="form-check-label">Nữ</label>
                </div>
              </div>

              <ErrorMessage name="gender" class="text-danger small" />
            </div>
            <div class="col-md-6" v-if="props.user.role === 'reader'">
              <label class="form-label fw-semibold">Ngày sinh</label>
              <Field
                type="date"
                class="form-control"
                v-model="form.birthDate"
                :readonly="!isEditing"
                name="birthDate"
              />
              <ErrorMessage name="birthDate" class="text-danger small" />
            </div>

            <div class="col-md-12">
              <label class="form-label fw-semibold">Địa chỉ</label>
              <Field
                type="text"
                class="form-control"
                v-model="form.address"
                :readonly="!isEditing"
                name="address"
              />
              <ErrorMessage name="address" class="text-danger small" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">Số điện thoại</label>
              <Field
                name="phone"
                type="text"
                class="form-control"
                v-model="form.phone"
                :readonly="!isEditing"
              />
              <ErrorMessage name="phone" class="text-danger small" />
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
}

.avatar-wrapper {
  width: 100%;
  padding: 20px;
  background: #f8f9fc;
  display: flex;
  justify-content: center;
}

.avatar-img {
  width: 90%;
  border-radius: 12px;
}

.form-card {
  border-radius: 16px;
  background: #ffffff;
}

input[readonly],
select:disabled {
  background: #f1f1f1 !important;
  cursor: not-allowed;
}

.form-label {
  font-size: 14px;
}

.card-body h5 {
  font-size: 20px;
}

.container {
  max-width: 1050px;
}
</style>
