<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/views/AppHeader.vue";
import AppFooter from "../AppFooter.vue";
import AppSideBar from "../AppSideBar.vue";

const role = sessionStorage.getItem("currentLogin");
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />

    <main class="d-flex flex-grow-1 overflow-hidden">
      <AppSideBar v-if="role === 'staff'" />
      <div class="flex-grow-1 overflow-auto p-2">
        <router-view v-if="role === 'staff'" />
      </div>
    </main>

    <AppFooter class="mt-auto" />
  </div>
</template>
