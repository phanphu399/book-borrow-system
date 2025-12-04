<script setup>
import { Notivue, Notification, NotificationProgress } from "notivue";
</script>
<template>
  <Notivue v-slot="item">
    <Notification :item="item">
      <NotificationProgress :item="item" />
    </Notification>
  </Notivue>
  <router-view />
  <div id="app"></div>
</template>
<style>
.z-top-toast,
.notivue,
.notivue-container {
  z-index: 99999 !important;
  position: fixed !important;
}
</style>
