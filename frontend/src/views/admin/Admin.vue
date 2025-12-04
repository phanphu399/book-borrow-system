<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";

import SideBar from "@/components/SideBar.vue";

const role = sessionStorage.getItem("currentLogin");
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <AppHeader class="flex-shrink-0" />
    <main class="d-flex flex-grow-1 overflow-hidden">
      <SideBar v-if="role === 'staff'" class="border-end" />
      <div class="flex-grow-1 overflow-auto p-2 bg-light">
        <router-view v-if="role === 'staff'" />
      </div>
    </main>
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
