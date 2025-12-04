<script setup>
import PublisherService from "@/services/publish.service.";
import { push } from "notivue";
import { computed, onMounted, ref, watch } from "vue";
import InputSearch from "@/components/InputSearch.vue";
import FormEditPublisher from "@/components/FormEditPublisher.vue";
import PaginationTable from "@/components/PaginationTable.vue";
//const
const publisherService = new PublisherService();

const publishers = ref([]);
const searchText = ref("");
const selectedPubLisher = ref({});
const showModal_create = ref(false);
const showModal_update = ref(false);
const currentPage = ref(1);
const itemsPerPage = 7;
const fetchPublisher = async () => {
  try {
    publishers.value = await publisherService.getAllPublisher();
  } catch (error) {
    console.log(error);
  }
};

const openModelUpdate = (pub) => {
  selectedPubLisher.value = { ...pub };
  showModal_update.value = true;
};

const handleUpdatePub = async (updatePub) => {
  try {
    await publisherService.updatePublisher(updatePub._id, updatePub);
    fetchPublisher();
    push.success("Cập nhật thành công");
  } catch (error) {
    console.log(error);
    push.error("Cập nhật không thành công");
  }
};

const handleAddPub = async (data) => {
  try {
    await publisherService.createPublisher(data);
    fetchPublisher();
    push.success("Thêm nhà xuất bản mới thành công");
  } catch (error) {
    console.log(error);
    push.error("Thêm nhà xuất bản không thành công !");
  }
};

const deletePub = async (id) => {
  try {
    if (
      window.confirm(
        "Bạn chắc chắn muốn xóa? Hành động này không thể hoàn tác!"
      )
    ) {
      await publisherService.deletePublisher(id);
      fetchPublisher();
      push.success("Xóa nhà xuất bản thành công");
    }
  } catch (error) {
    console.log(error);
    push.error("Xóa nhà xuất bản không thành công !");
  }
};
const paginatedPub = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPublisher.value.slice(start, end);
});
const reload = () => {
  fetchPublisher();
  // Giữ nguyên logic cũ
  window.location.reload();
};
watch([searchText], () => {
  currentPage.value = 1;
});
const extractData = computed(() => {
  return publishers.value.map((pub) => {
    const { name, address, email } = pub;
    return `${name}${email}${address}`.toLowerCase();
  });
});

const filteredPublisher = computed(() => {
  return publishers.value.filter((pub, index) => {
    const data = extractData.value[index];
    return data.includes(searchText.value.toLocaleLowerCase());
  });
});
onMounted(fetchPublisher);
</script>
<template>
  <div class="container py-4 mt-2">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">Quản lý nhà xuất bản</h3>
      <div>
        <button @click="reload" class="btn btn-outline-primary me-2">
          <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
        <button @click="showModal_create = true" class="btn btn-primary">
          <i class="bi bi-plus-lg me-1"></i> Thêm nhà xuất bản mới
        </button>
      </div>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-4">
        <InputSearch v-model="searchText" />
      </div>
    </div>

    <div class="card shadow-sm p-3 rounded-3">
      <div class="table-responsive">
        <table
          class="table table-hover align-middle mb-0 text-nowrap table-bordered table-striped"
        >
          <thead class="table-light">
            <tr class="text-uppercase small text-secondary">
              <th class="py-2" style="width: 35%">Tên nhà xuất bản</th>
              <th class="py-2" style="width: 35%">Địa chỉ</th>
              <th class="py-2" style="width: 20%">Email</th>
              <th class="text-center py-2" style="width: 10%">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!paginatedPub.length">
              <td colspan="4" class="text-center text-muted py-4">
                <i class="bi bi-search me-2"></i>Không tìm thấy kết quả phù hợp
              </td>
            </tr>

            <tr v-for="pub in paginatedPub" :key="pub._id">
              <td>
                <span class="d-flex flex-wrap gap-1 text-truncate mw-100">{{
                  pub.name
                }}</span>
              </td>

              <td>{{ pub.address }}</td>
              <td>{{ pub.email }}</td>
              <td class="text-center">
                <button
                  @click="openModelUpdate(pub)"
                  class="btn btn-sm btn-outline-info me-1"
                  title="Chỉnh sửa"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  @click="deletePub(pub._id)"
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
      <div class="card-footer bg-white border-top py-3">
        <PaginationTable
          :total-items="filteredPublisher.length"
          :items-per-page="itemsPerPage"
          v-model:model-value="currentPage"
        />
      </div>
    </div>
  </div>
  <FormEditPublisher
    v-model:show="showModal_create"
    mode="create"
    :publishers="{}"
    @update-publishers="handleAddPub"
  />
  <FormEditPublisher
    v-model:show="showModal_update"
    :publishers="selectedPubLisher"
    mode="update"
    @update-publishers="handleUpdatePub"
  />
</template>
