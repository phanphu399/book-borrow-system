<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="d-flex align-items-center justify-content-center vh-100 bg-light text-dark">
    <div class="text-center p-5 rounded shadow-lg bg-white" style="max-width: 500px;">
      <h1 class="display-1 fw-bold mb-4">404</h1>
      <h2 class="h3 mb-3">Oops! Trang không tồn tại</h2>
      <p class="lead mb-4">
        Đường dẫn bạn truy cập có thể đã bị thay đổi hoặc không còn tồn tại. Vui lòng kiểm tra lại hoặc quay về trang chủ.
      </p>
      <RouterLink
        to="/home"
        class="btn btn-primary btn-lg px-4 py-2"
      >
        Trở về trang chủ
      </RouterLink>
    </div>
  </div>
</template>