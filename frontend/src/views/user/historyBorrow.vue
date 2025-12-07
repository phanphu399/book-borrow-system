<script setup>
import BorrowService from "@/services/borrow.service";
import { onMounted, ref, computed, watch } from "vue";
import InputSearch from "@/components/InputSearch.vue";
import FormatData from "@/validations/FormatData";
import PaginationTable from "@/components/PaginationTable.vue";
import FormEditBorrow from "@/components/FormEditBorrow.vue";
import { push } from "notivue";

const borrowService = new BorrowService();

const borrows = ref([]);
const searchText = ref("");
const filteredStatus = ref("");
const status = ref([]);
const currentPage = ref(1);
const itemsPerPage = 7;

const statusMap = {
  pending: {
    label: "Chờ duyệt mượn",
    class: "bg-primary-subtle text-black fw-semibold",
  },
  borrowing: {
    label: "Đang mượn",
    class: "bg-success-subtle text-success fw-semibold",
  },
  overdue: {
    label: "Quá hạn",
    class: "bg-danger text-white fw-semibold",
  },
  returned: {
    label: "Đã trả",
    class: "bg-secondary-subtle text-secondary fw-semibold",
  },
  pending_return: {
    label: "Chờ duyệt trả",
    class: "bg-primary-subtle text-black fw-semibold",
  },
  pending_extend: {
    label: "Chờ gia hạn",
    class: "bg-danger-subtle text-black fw-semibold",
  },
  extended: {
    label: "Đã gia hạn",
    class: "bg-success-subtle text-success fw-semibold",
  },
  rejected: {
    label: "Từ chối mượn",
    class: "bg-danger-subtle text-danger fw-semibold",
  },
};

const fetchBorrows = async () => {
  try {
    const getStorage = JSON.parse(sessionStorage.getItem("userSection"));
    const userID = getStorage ? getStorage.id : "";

    borrows.value = await borrowService.getAllBorrow();
    borrows.value = borrows.value.filter((br) => br.user_id._id === userID);

    const now = new Date();

    for (const br of borrows.value) {
      const deadline = new Date(br.deadline);
      deadline.setHours(23, 59, 59, 999);
      console.log(deadline, now);
      console.log(deadline < now);
      if (br.status === "borrowing" && deadline < now) {
        await borrowService.updateBorrow(br._id, { status: "overdue" });
      }
    }
    borrows.value = await borrowService.getAllBorrow();
    borrows.value = borrows.value.filter((br) => br.user_id._id === userID);
    status.value = Array.from(new Set(borrows.value.map((br) => br.status)));
  } catch (error) {
    console.log(error);
  }
};

watch([searchText, filteredStatus], () => {
  currentPage.value = 1;
});

const extractData = computed(() =>
  borrows.value.map((br) => {
    const reader = br.user_id?.lastName + " " + br.user_id?.firstName;
    const staff = br.staff_id?.fullName;
    const bookTitle = br.book_id?.title;
    const status = br.status;
    return `${reader}${staff}${bookTitle}${status}`.toLowerCase();
  })
);

const statusOrder = {
  pending: 1,
  pending_return: 2,
  pending_extend: 3,
  overdue: 4,
  borrowing: 5,
  rejected: 10,
  returned: 20,
};

const getStatusValue = (s) => statusOrder[s] || 99;

const filteredBorrow = computed(() => {
  return borrows.value.filter((br, index) => {
    const data = extractData.value[index];
    const matchStatus =
      !filteredStatus.value || br.status === filteredStatus.value;
    const matchText = data.includes(searchText.value.toLowerCase());
    return matchText && matchStatus;
  });
});

const paginatedBorrow = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const sorted = filteredBorrow.value.sort((a, b) => {
    const sA = getStatusValue(a.status);
    const sB = getStatusValue(b.status);
    if (sA !== sB) return sA - sB;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sorted.slice(start, end);
});

const handleBorrow = async (br) => {
  try {
    if (br.status === "overdue") {
      const confirm = window.confirm(
        `Đã quá hạn thời hạn mượn "${br.book_id.title}". Vui lòng gửi trả sách !`
      );
      if (!confirm) return;
      // console.log(br.deadline);
      await borrowService.updateBorrow(br._id, {
        status: "pending_return",
      });
      push.success("Đã gửi yêu cầu trả sách!");
      fetchBorrows();
      return;
    }

    if (br.status === "borrowing") {
      const confirmReturn = window.confirm(
        `Bạn muốn gửi yêu cầu trả sách "${br.book_id.title}" ?`
      );
      if (!confirmReturn) return;

      await borrowService.updateBorrow(br._id, {
        status: "pending_return",
      });

      push.success("Đã gửi yêu cầu trả sách!");
      fetchBorrows();
      return;
    }

    if (["pending"].includes(br.status)) {
      const confirm = window.confirm(
        `Bạn muốn HỦY yêu cầu MƯỢN sách "${br.book_id.title}" ?`
      );
      if (!confirm) return;
      await borrowService.deleteBorrow(br._id);
      push.success("Hủy yêu cầu thành công!");
      fetchBorrows();
    }
  } catch (error) {
    console.log(error);
    push.error("Có lỗi xảy ra!");
  }
};

const getActionLabel = (br) => {
  if (br.status === "overdue") return "Trả ngay";
  if (br.status === "borrowing") return "Trả sách";
  return "Hủy";
};

const getActionIcon = (br) => {
  if (["overdue", "borrowing"].includes(br.status))
    return "bi bi-arrow-return-right";
  else if (["pending"].includes(br.status)) return "bi bi-archive-fill";
  return;
};

const reload = () => {
  fetchBorrows();
  window.location.reload();
};
const showModel = ref(false);
const borrow = ref({
  id: "",
  typeModel: "",
});
const getBorrow = (br) => {
  borrow.value = { id: br._id, typeModel: "update" };

  showModel.value = true;
};

onMounted(fetchBorrows);
</script>

<template>
  <div class="container mt-4">
    <div
      class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2"
    >
      <h3 class="mb-0">Lịch sử mượn sách</h3>
      <button @click="reload" class="btn btn-outline-primary">
        <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
      </button>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-4 col-6">
        <InputSearch v-model="searchText" />
      </div>

      <div class="col-md-2 col-6">
        <select v-model="filteredStatus" class="form-select">
          <option value="">Tất cả trạng thái</option>
          <option v-for="stt in status" :value="stt">
            {{ statusMap[stt]?.label || "Không xác định" }}
          </option>
        </select>
      </div>
    </div>

    <div class="card shadow-sm p-3 rounded-3">
      <div class="table-responsive">
        <table
          class="table table-bordered table-striped table-hover align-middle mb-0 text-wrap"
        >
          <thead class="table-light text-nowrap">
            <tr class="text-uppercase small text-secondary">
              <th class="text-center" style="width: 18%">Tên sách</th>
              <th class="text-center" style="width: 12%">Tác giả</th>
              <th class="text-center" style="width: 12%">Ngày mượn</th>
              <th class="text-center" style="width: 12%">Hạn trả</th>
              <th class="text-center" style="width: 12%">Ngày trả</th>
              <th class="text-center" style="width: 12%">Trạng thái</th>
              <th class="text-center" style="width: 7%">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="!paginatedBorrow.length">
              <td colspan="8" class="text-center text-muted py-4">
                <i class="bi bi-search me-2"></i>Không tìm thấy kết quả phù hợp
              </td>
            </tr>

            <tr
              v-for="br in paginatedBorrow"
              :key="br._id"
              :class="{
                'table-danger': br.status === 'overdue',
              }"
            >
              <td @click.stop="getBorrow(br)">
                {{ br.book_id?.title }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                {{ br.book_id.author }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                {{ FormatData.formatBirthDate(br.borrowDate) }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                {{ FormatData.formatBirthDate(br.deadline) }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                {{ FormatData.formatBirthDate(br.returnDate) }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                <span
                  class="badge px-3 py-2"
                  :class="statusMap[br.status]?.class"
                >
                  {{ statusMap[br.status]?.label }}
                </span>
              </td>

              <!-- <td class="d-flex gap-2 justify-content-end">
                <button
                  @click="handleBorrow(br)"
                  class="btn btn-sm btn-outline-primary"
                  v-if="['pending', 'borrowing', 'overdue'].includes(br.status)"
                  :title="getActionLabel(br)"
                >
                  <i :class="getActionIcon(br)"></i>
                </button>

                <button
                  title="Chi tiết"
                  class="btn btn-sm btn-outline-primary"
                  @click="getBorrow(br)"
                >
                  <i class="bi bi-info-circle"></i>
                </button>
              </td> -->
              <td>
                <div class="d-flex gap-2 justify-content-end">
                  <button
                    @click="handleBorrow(br)"
                    class="btn btn-sm btn-outline-primary"
                    v-if="
                      ['pending', 'borrowing', 'overdue'].includes(br.status)
                    "
                    :title="getActionLabel(br)"
                  >
                    <i :class="getActionIcon(br)"></i>
                  </button>

                  <button
                    title="Chi tiết"
                    class="btn btn-sm btn-outline-primary"
                    @click="getBorrow(br)"
                  >
                    <i class="bi bi-info-circle"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3 d-flex justify-content-end">
        <PaginationTable
          :total-items="filteredBorrow.length"
          :items-per-page="itemsPerPage"
          v-model:model-value="currentPage"
        />
      </div>
    </div>
  </div>

  <FormEditBorrow
    @return="handleBorrow"
    :borrow="borrow"
    v-model:show="showModel"
  />
</template>

<style>
.table {
  table-layout: fixed;
  word-break: break-word;
}
</style>
