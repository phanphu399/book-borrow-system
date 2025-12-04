<script setup>
import UserService from "@/services/user.service";
import { onMounted, ref, computed, watch } from "vue";
import InputSearch from "@/components/InputSearch.vue";
import PaginationTable from "@/components/PaginationTable.vue";
import FormEditUser from "@/components/FormEditUser.vue";
import { push } from "notivue";
import FormatData from "@/validations/FormatData";

const userService = new UserService();
const users = ref([]);
const searchText = ref("");
const selectedUser = ref({});
const showModal_create = ref(false);
const showModal_update = ref(false);
const currentPage = ref(1);
const itemsPerPage = 7;

const fetchUsers = async () => {
  try {
    users.value = await userService.getAllUser();
  } catch (error) {
    console.log(error);
  }
};

const openModelUpdate = (user) => {
  selectedUser.value = { ...user };
  showModal_update.value = true;
};

const handleUpdateUser = async (user) => {
  try {
    await userService.updateUser(user._id, user);
    push.success("Cập nhật thành công");
    showModal_update.value = false;
    fetchUsers();
  } catch (error) {
    console.log(error);
    if (error.response?.status === 409) {
      push.error("Tên tài khoản đã tồn tại, vui lòng đặt tên khác !");
      return;
    }
    push.error("Cập nhật không thành công");
  }
};

const handleAddUser = async (user) => {
  try {
    await userService.register(user);
    fetchUsers();
    push.success("Thêm người dùng thành công");
    showModal_create.value = false;
  } catch (error) {
    console.log(error);
    if (error.response?.status === 409) {
      push.error("Tên tài khoản đã tồn tại, vui lòng đặt tên khác !");
      return;
    }
    push.error("Thêm người dùng không thành công");
  }
};

const deleteUser = async (id) => {
  try {
    if (
      window.confirm(
        "Bạn chắc chắn muốn xóa? Hành động này không thể hoàn tác!"
      )
    ) {
      await userService.deleteUser(id);
      fetchUsers();
      push.success("Xóa người dùng thành công");
    }
  } catch (error) {}
};

const extractData = computed(() => {
  return users.value.map((user) => {
    const { firstName, lastName, address, phone, username, birthDate } = user;
    return `${phone}${address}${username}${firstName}${lastName}${birthDate}`.toLowerCase();
  });
});

const filteredUsers = computed(() => {
  return users.value.filter((user, index) => {
    const data = extractData.value[index];
    return data.includes(searchText.value.toLocaleLowerCase());
  });
});

const paginatedUser = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const reload = () => {
  fetchUsers();
  window.location.reload();
};

watch([searchText], () => {
  currentPage.value = 1;
});

onMounted(fetchUsers);
</script>

<template>
  <div class="container py-4 mt-2">
    <div
      class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2"
    >
      <h3 class="mb-0">Quản lý người dùng</h3>
      <div class="d-flex flex-wrap gap-2">
        <button @click="reload" class="btn btn-outline-primary">
          <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
        <button @click="showModal_create = true" class="btn btn-primary">
          <i class="bi bi-plus-lg me-1"></i> Thêm người dùng
        </button>
      </div>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-4 col-12">
        <InputSearch v-model="searchText" />
      </div>
    </div>

    <div class="card shadow-sm p-3 rounded-3">
      <div class="table-responsive">
        <table
          class="table table-bordered table-striped table-hover align-middle mb-0 text-nowrap"
        >
          <thead class="table-light text-nowrap">
            <tr class="text-uppercase small text-secondary">
              <th style="width: 15%">Họ và tên</th>
              <th style="width: 15%">Tài khoản</th>
              <th style="width: 8%">Giới tính</th>
              <th style="width: 10%">Ngày sinh</th>
              <th style="width: 25%">Địa chỉ</th>
              <th style="width: 12%">Số điện thoại</th>
              <th class="text-center" style="width: 10%">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="!paginatedUser.length">
              <td colspan="7" class="text-center text-muted py-4">
                <i class="bi bi-search me-2"></i>Không tìm thấy kết quả phù hợp
              </td>
            </tr>

            <tr
              v-for="usr in paginatedUser"
              :key="usr._id"
              class="align-middle"
            >
              <td>
                <div
                  class="d-inline-block text-truncate mw-100"
                  :title="usr.lastName + ' ' + usr.firstName"
                >
                  {{ usr.lastName }} {{ usr.firstName }}
                </div>
              </td>
              <td>
                <div
                  class="d-inline-block text-truncate mw-100"
                  :title="usr.username"
                >
                  {{ usr.username }}
                </div>
              </td>
              <td>{{ FormatData.formatGender(usr.gender) }}</td>
              <td>
                {{ FormatData.formatBirthDate(usr.birthDate) || "Không rõ" }}
              </td>
              <td>
                <div
                  class="d-inline-block text-truncate mw-100"
                  :title="usr.address"
                >
                  {{ usr.address }}
                </div>
              </td>
              <td>{{ usr.phone }}</td>
              <td class="text-center">
                <button
                  title="Chỉnh sửa"
                  @click="openModelUpdate(usr)"
                  class="btn btn-sm btn-outline-info me-1"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  title="Xóa"
                  @click="deleteUser(usr._id)"
                  class="btn btn-sm btn-outline-danger"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer bg-white border-top">
        <PaginationTable
          :total-items="filteredUsers.length"
          :items-per-page="itemsPerPage"
          v-model:model-value="currentPage"
        />
      </div>
    </div>
  </div>

  <FormEditUser
    v-model:show="showModal_create"
    mode="create"
    :users="{}"
    @update-users="handleAddUser"
  />
  <FormEditUser
    v-model:show="showModal_update"
    :users="selectedUser"
    mode="update"
    @update-users="handleUpdateUser"
  />
</template>

<style scoped>
.table {
  table-layout: fixed;
  word-break: break-word;
}
</style>
