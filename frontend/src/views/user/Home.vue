<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/views/AppHeader.vue";
import AppFooter from "../AppFooter.vue";
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <AppHeader class="flex-shrink-0" />
    <main class="flex-grow-1">
      <div class="overflow-auto bg-light">
        <router-view />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>
