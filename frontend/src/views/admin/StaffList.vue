<script setup>
import StaffService from "@/services/staff.service";
import { onMounted, ref, computed, watch } from "vue";
import InputSearch from "@/components/InputSearch.vue";
import FormEditStaff from "@/components/FormEditStaff.vue";
import PaginationTable from "@/components/PaginationTable.vue";
import { push } from "notivue";
const staffService = new StaffService();
const staffs = ref([]);
const searchText = ref("");
const selectedStaff = ref({});
const showModal_create = ref(false);
const showModal_update = ref(false);
const currentPage = ref(1);
const itemsPerPage = 7;

const fetchStaffs = async () => {
  try {
    staffs.value = await staffService.getAllStaff();
  } catch (error) {
    console.log(error);
  }
};

const openModelUpdate = (staff) => {
  selectedStaff.value = { ...staff };
  showModal_update.value = true;
};

const handleUpdateStaff = async (staff) => {
  try {
    await staffService.updateStaff(staff._id, staff);
    push.success("Cập nhật thành công");
    showModal_update.value = false;
    fetchStaffs();
  } catch (error) {
    console.log(error);
    push.error("Cập nhật không thành công");
  }
};

const handleAddStaff = async (staff) => {
  try {
    await staffService.register(staff);
    push.success("Thêm nhân viên thành công");
    showModal_create.value = false;
    fetchStaffs();
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 409) {
      push.error("Tên tài khoản đã tồn tại, vui lòng đặt tên khác !");
      return;
    }

    push.error("Thêm nhân viên không thành công");
  }
};

const deleteStaff = async (id) => {
  try {
    if (
      window.confirm(
        "Bạn chắc chắn muốn xóa? Hành động này không thể hoàn tác!"
      )
    ) {
      await staffService.deleteStaff(id);
      fetchStaffs();
      push.success("Xóa nhân viên thành công");
    }
  } catch (error) {}
};

const extractData = computed(() => {
  return staffs.value.map((staff) => {
    const { fullName, address, phone, username } = staff;
    return `${fullName}${phone}${address}${username}`.toLowerCase();
  });
});

const filteredStaffs = computed(() => {
  return staffs.value.filter((staff, index) => {
    const data = extractData.value[index];
    return data.includes(searchText.value.toLocaleLowerCase());
  });
});

const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredStaffs.value.slice(start, end);
});

const reload = () => {
  fetchStaffs();
  window.location.reload();
};

watch([searchText], () => {
  currentPage.value = 1;
});

onMounted(fetchStaffs);
</script>

<template>
  <div class="container py-4 mt-2">
    <div
      class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2"
    >
      <h3 class="mb-0">Quản lý nhân viên</h3>
      <div class="d-flex flex-wrap gap-2">
        <button @click="reload" class="btn btn-outline-primary">
          <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
        <button @click="showModal_create = true" class="btn btn-primary">
          <i class="bi bi-plus-lg me-1"></i>
          Thêm nhân viên
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
          class="table table-bordered table-striped table-hover align-middle mb-0 text-wrap"
        >
          <thead class="table-light text-nowrap">
            <tr class="text-uppercase small text-secondary">
              <th style="width: 15%">Tên đầy đủ</th>
              <th style="width: 15%">Tài khoản</th>
              <th style="width: 25%">Địa chỉ</th>
              <th style="width: 12%">Số điện thoại</th>
              <th class="text-center" style="width: 10%">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="!paginatedStaff.length">
              <td colspan="7" class="text-center text-muted py-4">
                <i class="bi bi-search me-2"></i>Không tìm thấy kết quả phù hợp
              </td>
            </tr>
            <tr
              v-for="staff in paginatedStaff"
              :key="staff._id"
              class="align-middle"
            >
              <td>{{ staff.fullName }}</td>
              <td>{{ staff.username }}</td>
              <td class="text-break">{{ staff.address }}</td>
              <td>{{ staff.phone }}</td>

              <td class="text-center">
                <button
                  @click="openModelUpdate(staff)"
                  class="btn btn-sm btn-outline-info me-1"
                  title="Chỉnh sửa"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>

                <button
                  @click="deleteStaff(staff._id)"
                  class="btn btn-sm btn-outline-danger"
                  title="Xóa"
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
          :total-items="filteredStaffs.length"
          :items-per-page="itemsPerPage"
          v-model:model-value="currentPage"
        />
      </div>
    </div>
  </div>
  <FormEditStaff
    v-model:show="showModal_create"
    mode="create"
    :staffs="{}"
    @update-staffs="handleAddStaff"
  />
  <FormEditStaff
    v-model:show="showModal_update"
    :staffs="selectedStaff"
    mode="update"
    @update-staffs="handleUpdateStaff"
  />
</template>

<style scoped>
.table {
  table-layout: fixed;
  word-break: break-word;
}
</style>
