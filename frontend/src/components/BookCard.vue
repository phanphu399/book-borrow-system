<!-- BookCard.vue -->
<script setup>
import FormatData from "@/validations/FormatData";
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";

const props = defineProps({
  book: { type: Object, required: true },
  setCardRef: Function,
});

const emit = defineEmits(["borrow"]);

const cardRef = ref(null);

onMounted(() => {
  if (props.setCardRef) props.setCardRef(cardRef);
  props.book.image_URL = `https://picsum.photos/seed/${props.book?._id}/800/800`;
});
</script>

<template>
  <div ref="cardRef" class="card book-card h-100 shadow-sm">
    <img
      :src="props.book.image_URL"
      :alt="props.book.title"
      class="book-cover"
    />
    <div class="card-body d-flex flex-column">
      <h5 class="card-title fw-bold text-primary mb-1">
        {{ props.book.title }}
      </h5>
      <p class="card-text mb-1">
        <span class="text-muted small">Tác giả: </span>
        <span class="fw-medium">{{ props.book.author || "N/A" }}</span>
      </p>
      <p class="card-text mb-2 small text-muted">
        Thể loại: {{ props.book.categories || "N/A" }}
      </p>
      <p class="card-text mb-1 small text-muted">
        Năm xuất bản: {{ props.book.publishYear || "N/A" }}
      </p>
      <p class="card-text mb-2 small text-muted">
        Nhà xuất bản: {{ props.book.publisher_id?.name || "N/A" }}
      </p>
      <div class="mt-auto">
        <h6 class="text-success fw-bold mb-1">
          {{ FormatData.formatMoney(props.book.price) }}
        </h6>
        <p class="text-danger fw-medium small mb-3">
          <i class="bi bi-tag-fill me-1"></i> Còn
          {{ props.book.quantity || 0 }} quyển sách
        </p>
        <button
          @click="emit('borrow', props.book._id)"
          class="btn btn-primary w-100 fw-bold rounded-pill"
          :disabled="props.book.quantity <= 0"
        >
          <i class="bi bi-book m-2"></i> Mượn sách
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #0a2540 !important;
}
.btn-primary {
  background-color: #0a2540;
  border-color: #0a2540;
}
.btn-primary:hover {
  background-color: #1a3c61;
  border-color: #1a3c61;
}
.book-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  overflow: hidden;
}
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(10, 37, 64, 0.15) !important;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}
.book-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}
@media (max-width: 768px) {
  .book-cover {
    height: 200px;
  }
}
</style>
