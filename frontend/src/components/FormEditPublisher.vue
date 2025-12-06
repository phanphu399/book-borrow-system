<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch } from "vue";
import { publisherSchema } from "@/validations/publisher.validate";
import { push } from "notivue";

const props = defineProps({
  show: Boolean,
  publishers: {
    type: Object,
    required: true,
  },
  mode: { type: String, default: "create" },
});

const emit = defineEmits(["update-publishers", "update:show"]);

const formData = reactive({
  name: "",
  address: "",
  email: "",
});

watch(
  () => props.publishers,
  (newVal) => {
    if (props.mode === "update" && newVal) {
      Object.assign(formData, newVal);
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

  emit("update-publishers", { ...formData });
  closeModal();
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
    <div class="modal-dialog modal-dialog-centered modal-md" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              mode === "create"
                ? "Thêm nhà xuất bản"
                : "Cập Nhật thông tin nhà xuất bản"
            }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <Form ref="formRef" :validation-schema="publisherSchema">
            <div class="mb-3">
              <label class="form-label">Tên nhà xuất bản *</label>
              <Field
                type="text"
                name="name"
                class="form-control"
                v-model="formData.name"
              />
              <ErrorMessage name="name" class="text-danger small" />
            </div>

            <div class="mb-3">
              <label class="form-label">Địa chỉ *</label>
              <Field
                type="text"
                name="address"
                class="form-control"
                v-model="formData.address"
              />
              <ErrorMessage name="address" class="text-danger small" />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <Field
                type="email"
                name="email"
                class="form-control"
                v-model="formData.email"
              />
              <ErrorMessage name="email" class="text-danger small" />
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
