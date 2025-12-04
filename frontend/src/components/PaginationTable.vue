<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  totalItems: { type: Number, required: true },
  itemsPerPage: { type: Number, default: 7 },
  modelValue: { type: Number, default: 1 },
  maxVisible: { type: Number, default: 5 },
});

const emit = defineEmits(["update:modelValue"]);

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);
const currentPage = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Xác định các trang hiển thị
const visiblePages = computed(() => {
  const pages = [];
  if (totalPages.value <= props.maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    if (currentPage.value < 3) {
      pages.push(1, 2, 3, "...", totalPages.value);
    } else if (currentPage.value >= totalPages.value - 1) {
      pages.push(
        1,
        "...",
        totalPages.value - 2,
        totalPages.value - 1,
        totalPages.value
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        "...",
        totalPages.value
      );
    }
  }
  return pages;
});

const gotoPage = (page) => {
  if (page === "..." || page === currentPage.value) return;
  currentPage.value = Number(page);
};
</script>

<template>
  <ul
    v-if="totalPages > 1"
    class="p-1 my-1 pagination w-100 d-flex justify-content-center mb-0"
  >
    <li
      class="page-item"
      :class="{ disabled: currentPage === 1 }"
      @click="currentPage > 1 && currentPage--"
    >
      <a class="page-link">Trước</a>
    </li>
    <li
      v-for="page in visiblePages"
      :key="page"
      class="page-item"
      :class="{ active: currentPage === page, disabled: page === '...' }"
      @click="gotoPage(page)"
    >
      <a class="page-link">{{ page }}</a>
    </li>
    <li
      class="page-item"
      :class="{ disabled: currentPage === totalPages }"
      @click="currentPage < totalPages && currentPage++"
    >
      <a class="page-link">Sau</a>
    </li>
  </ul>
</template>

<style scoped>
.page-link {
  cursor: pointer;
}
</style>
