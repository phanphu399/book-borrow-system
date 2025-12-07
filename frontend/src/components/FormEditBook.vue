<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted } from "vue";
import { bookSchema } from "@/validations/book.validate";
import PublisherService from "@/services/publish.service";
import { push } from "notivue";

const publisherService = new PublisherService();
const publishers = ref([]);

const props = defineProps({
  show: Boolean,
  bookData: {
    type: Object,
    required: true,
  },
  mode: { type: String, default: "create" },
});

const emit = defineEmits(["update-bookData", "update:show"]);

const formData = reactive({
  title: "",
  price: null,
  quantity: null,
  categories: [],
  publishYear: null,
  author: "",
  publisher_id: "",
  image_URL: ``,
});

const categoriesInput = ref("");

watch(
  () => props.bookData,
  (newVal) => {
    if (props.mode === "update" && newVal) {
      Object.assign(formData, newVal);
      formData.publisher_id =
        newVal.publisher_id && typeof newVal.publisher_id === "object"
          ? newVal.publisher_id._id
          : newVal.publisher_id || "";
      categoriesInput.value = newVal.categories
        ? newVal.categories.map((c) => c.trim()).join(", ")
        : "";
    }
  },
  { immediate: true }
);

watch(categoriesInput, (val) => {
  formData.categories = val.split(",");
});

const fetchPublisher = async () => {
  try {
    publishers.value = await publisherService.getAllPublisher();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchPublisher();
});

const formRef = ref(null);

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    push.error("Vui lòng điền đầy đủ thông tin !");
    return;
  }

  emit("update-bookData", {
    ...formData,
    price: Number(formData.price),
    quantity: Number(formData.quantity),
    publishYear: Number(formData.publishYear),
  });
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
              mode === "create" ? "Thêm Sách Mới" : "Cập Nhật Thông Tin Sách"
            }}
          </h5>

          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <Form ref="formRef" :validation-schema="bookSchema">
            <div class="mb-3">
              <label class="form-label">Tên Sách *</label>
              <Field
                type="text"
                name="title"
                class="form-control"
                v-model="formData.title"
              />
              <ErrorMessage name="title" class="text-danger small" />
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">Tác Giả</label>
                <Field
                  type="text"
                  name="author"
                  class="form-control"
                  v-model="formData.author"
                />
                <ErrorMessage name="author" class="text-danger small" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Năm Xuất Bản *</label>
                <Field
                  type="text"
                  name="publishYear"
                  class="form-control"
                  v-model.number="formData.publishYear"
                />
                <ErrorMessage name="publishYear" class="text-danger small" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Nhà xuất bản</label>
              <Field
                as="select"
                name="publisher_id"
                v-model="formData.publisher_id"
                class="form-select"
              >
                <option value="" disabled>-- Chọn nhà xuất bản --</option>
                <option v-for="pub in publishers" :value="pub._id">
                  {{ pub.name }}
                </option>
              </Field>
              <ErrorMessage name="publisher_id" class="text-danger small" />
            </div>
            <div class="mb-3">
              <label class="form-label">Giá (VNĐ) *</label>
              <Field
                type="number"
                name="price"
                class="form-control"
                v-model="formData.price"
              />
              <ErrorMessage name="price" class="text-danger small" />
            </div>

            <div class="mb-3">
              <label class="form-label">Số Lượng *</label>
              <Field
                type="number"
                name="quantity"
                class="form-control"
                v-model.number="formData.quantity"
              />
              <ErrorMessage name="quantity" class="text-danger small" />
            </div>

            <div class="mb-3">
              <label class="form-label">Thể Loại (cách nhau dấu phẩy) *</label>
              <Field
                type="text"
                name="categories"
                class="form-control"
                v-model="categoriesInput"
              />
              <ErrorMessage name="categories" class="text-danger small" />
            </div>

            <!-- <div class="mb-3">
              <label class="form-label">URL Hình Ảnh</label>
              <Field
                type="url"
                name="image_URL"
                class="form-control"
                v-model="formData.image_URL"
              />
              <ErrorMessage name="image_URL" class="text-danger small" />
            </div> -->
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
