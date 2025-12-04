<script setup>
import UserService from "@/services/user.service";
import StaffService from "@/services/staff.service";

import profileEdit from "@/components/profileEdit.vue";
import { ref, computed, watch, watchEffect } from "vue";
import { push } from "notivue";
const userService = new UserService();
const staffService = new StaffService();
const role = ref("user");
const payload = ref({});
const profileData = ref(null);

const getUser = computed(() => {
  const userSection = sessionStorage.getItem("userSection");
  const staffSection = sessionStorage.getItem("staffSection");
  role.value = sessionStorage.getItem("currentLogin");

  const currentData =
    role.value === "user"
      ? userSection
        ? JSON.parse(userSection)
        : {}
      : role.value === "staff"
      ? staffSection
        ? JSON.parse(staffSection)
        : {}
      : {};

  return { ...currentData, role: role.value };
});

watchEffect(async () => {
  const user = getUser.value;

  if (user && user.role === "user" && user.id) {
    try {
      profileData.value = await userService.getUser(user.id);
    } catch (error) {
      console.error("Lỗi khi fetch profile:", error);
      profileData.value = null;
    }
  } else if (user && user.role === "staff" && user.id) {
    try {
      profileData.value = await staffService.getStaff(user.id);
    } catch (error) {
      console.error(error);
      profileData.value = null;
    }
  } else {
    profileData.value = null;
  }
});

const handleUpdateProfile = async (data) => {
  try {
    console.log(data);
    if (data.role === "reader") {
      await userService.updateUser(data._id, data);
      push.success("Cập nhật thành công !");
      return;
    }
    await staffService.updateStaff(data._id, data);
    push.success("Cập nhật thành công !");
  } catch (error) {
    console.log(error);
    push.error("Lỗi trong quá trình cập nhật");
  }
};
</script>

<template>
  <div v-if="profileData">
    <profileEdit @save="handleUpdateProfile" :user="profileData" />
  </div>
  <div v-else>Đang tải hồ sơ...</div>
</template>

<style scoped></style>
