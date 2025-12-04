<script setup>
import { defineProps, defineEmits } from "vue";
import InputSearch from "./InputSearch.vue";

const props = defineProps({
  uniqueCategories: Array,
  uniqueYears: Array,
  uniPublishers: Array,
  searchKeyword: String,
  selectedPublisher: String,
  selectedCategory: String,
  selectedYear: String,
  filteredBookCount: Number,
});

const emit = defineEmits([
  "update:searchKeyword",
  "update:selectedCategory",
  "update:selectedPublisher",
  "update:selectedYear",
  "clear-filters",
]);

const updateCategory = (event) =>
  emit("update:selectedCategory", event.target.value);
const updatePublisher = (event) =>
  emit("update:selectedPublisher", event.target.value);
const updateYear = (event) => emit("update:selectedYear", event.target.value);
</script>

<template>
  <div class="filter-bar p-3 shadow-sm rounded-3 border">
    <div
      class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3"
    >
      <h5 class="fw-bold text-dark mb-0">Bộ Lọc</h5>
      <div class="d-flex align-items-center gap-3">
        <p class="mb-0 small text-muted">
          Tìm thấy:
          <span class="fw-bold text-dark fs-5">{{
            props.filteredBookCount
          }}</span>
          quyển sách
        </p>
        <button
          @click="emit('clear-filters')"
          class="btn btn-sm btn-outline-danger"
          :disabled="
            !props.searchKeyword &&
            !props.selectedCategory &&
            !props.selectedYear &&
            !props.selectedPublisher
          "
        >
          <i class="bi bi-x-circle-fill"></i> Xóa Lọc
        </button>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-3">
      <div class="flex-grow-1">
        <label class="form-label fw-medium mb-1 small"
          >Tìm Kiếm (Tên sách/Tác giả)</label
        >
        <InputSearch
          :model-value="searchKeyword"
          @update:modelValue="(value) => emit('update:searchKeyword', value)"
        />
      </div>
      <div class="flex-grow-1">
        <label class="form-label fw-medium mb-1 small">Nhà xuất bản</label>
        <select
          class="form-select"
          :value="props.selectedPublisher"
          @change="updatePublisher"
        >
          <option value="">-- Tất Cả nhà xuất bản --</option>
          <option v-for="pub in props.uniPublishers" :key="pub" :value="pub">
            {{ pub }}
          </option>
        </select>
      </div>
      <div class="flex-grow-1">
        <label class="form-label fw-medium mb-1 small">Thể Loại</label>
        <select
          class="form-select"
          :value="props.selectedCategory"
          @change="updateCategory"
        >
          <option value="">-- Tất Cả Thể Loại --</option>
          <option
            v-for="category in props.uniqueCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <div class="flex-grow-2">
        <label class="form-label fw-medium mb-1 small">Năm Xuất Bản</label>
        <select
          class="form-select"
          :value="props.selectedYear"
          @change="updateYear"
        >
          <option value="">-- Tất Cả Năm --</option>
          <option v-for="year in props.uniqueYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  background-color: #fff;
}
.form-label {
  margin-bottom: 0.25rem;
}
</style>
