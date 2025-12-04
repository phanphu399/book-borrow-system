<script setup>
import BorrowService from "@/services/borrow.service";
import { onMounted, ref, computed, watch } from "vue";
import InputSearch from "@/components/InputSearch.vue";
import FormatData from "@/validations/FormatData";
import PaginationTable from "@/components/PaginationTable.vue";
import { push } from "notivue";
import FormEditBorrow from "@/components/FormEditBorrow.vue";
import BookService from "@/services/book.service";
const borrowService = new BorrowService();
const bookService = new BookService();
const borrows = ref([]);
const searchText = ref("");
const filteredStatus = ref("");
const status = ref([]);
const currentPage = ref(1);
const itemsPerPage = 7;
const statusMap = {
  pending: {
    label: "Chờ duyệt",
    class: "bg-primary-subtle text-black fw-semibold",
  },
  pending_return: {
    label: "Chờ trả",
    class: "bg-primary-subtle text-black fw-semibold",
  },
  pending_approve: {
    label: "Chờ duyệt",
    class: "bg-primary-subtle text-black fw-semibold",
  },
  pending_extend: {
    label: "Chờ gia hạn",
    class: "bg-danger-subtle text-black fw-semibold",
  },
  borrowing: {
    label: "Đang mượn",
    class: "bg-success-subtle text-success fw-semibold",
  },
  extended: {
    label: "Đã gia hạn",
    class: "bg-success-subtle text-success fw-semibold",
  },
  returned: {
    label: "Đã trả",
    class: "bg-secondary-subtle text-secondary fw-semibold",
  },
  overdue: { label: "Quá hạn", class: "bg-danger fw-semibold" },
  rejected: {
    label: "Đã từ chối",
    class: "bg-danger-subtle text-danger fw-semibold",
  },
};

const staff_id = sessionStorage.getItem("staffSection")
  ? JSON.parse(sessionStorage.getItem("staffSection")).id
  : {};
const fetchBorrows = async () => {
  try {
    borrows.value = await borrowService.getAllBorrow();
    status.value = Array.from(new Set(borrows.value.map((br) => br.status)));
  } catch (error) {
    console.log(error);
  }
};

const handleApprovedBorrow = async (br) => {
  try {
    const data = await borrowService.getBorrow(br._id);
    if (data.status === "pending") {
      if (data.book_id.quantity <= 0) {
        push.error("Duyệt sách thất bại do số lượng sách đã hết");
        return;
      }
      // console.log(data);
      await borrowService.updateBorrow(data._id, {
        staff_id: staff_id,
        status: "borrowing",
        deadline: data.deadline,
        borrowDate: data.borrowDate,
      });

      await bookService.updateBook(data.book_id._id, {
        quantity: data.book_id.quantity - 1,
      });

      push.success("Duyệt phiếu mượn thành công");
    } else if (data.status === "pending_return") {
      await borrowService.updateBorrow(data._id, {
        staff_id,
        status: "returned",
        returnDate: new Date(),
      });

      await bookService.updateBook(data.book_id._id, {
        quantity: data.book_id.quantity + 1,
      });

      push.success("Xác nhận trả sách thành công");
    }

    fetchBorrows();
  } catch (error) {
    console.log(error);
    push.error("Duyệt thất bại!");
  }
};
const handleApproveAll = async () => {
  const handleAll = borrows.value.filter((br) =>
    ["pending", "pending_return", "pending_extend"].includes(br.status)
  );

  if (!handleAll.length) {
    push.warning("Không có phiếu nào để duyệt");
    return;
  }

  try {
    for (const br of handleAll) {
      if (br.status === "pending") {
        if (br.book_id.quantity <= 0) {
          push.error(`Không đủ sách để duyệt phiếu ${br._id} và đã từ chối`);
          await borrowService.updateBorrow(br._id, {
            staff_id,
            status: "rejected",
          });
          continue;
        }

        await borrowService.updateBorrow(br._id, {
          staff_id,
          status: "borrowing",
          // deadline: br.deadline,
          // borrowDate: br.borrowDate,
        });

        await bookService.updateBook(br.book_id._id, {
          quantity: br.book_id.quantity - 1,
        });
      } else if (br.status === "pending_return") {
        await borrowService.updateBorrow(br._id, {
          staff_id,
          status: "returned",
          returnDate: new Date(),
        });
        await bookService.updateBook(br.book_id._id, {
          quantity: br.book_id.quantity + 1,
        });
      }
    }
    push.success("Duyệt tất cả phiếu thành công");
    fetchBorrows();
  } catch (error) {
    console.log(error);
    push.error("Duyệt tất cả thất bại");
  }
};

const handleRejectBorrow = async (id) => {
  try {
    console.log(id);
    await borrowService.updateBorrow(id, {
      staff_id,
      status: "rejected",
    });
    push.success("Từ chối duyệt sách thành công");
    fetchBorrows();
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi từ chối duyệt sách");
  }
};

watch([searchText, filteredStatus], () => {
  currentPage.value = 1;
});
const extractData = computed(() => {
  return borrows.value.map((br) => {
    const reader = br.user_id?.lastName + " " + br.user_id?.firstName;
    const staff = br.staff_id?.fullName;
    const bookTitle = br.book_id?.title;
    const status = br.status;
    return `${reader}${staff}${bookTitle}${status}`.toLowerCase();
  });
});

const statusOrder = {
  pending: 1,
  pending_return: 2,
  pending_extend: 3,
  overdue: 4,
  borrowing: 5,
  rejected: 10,
  returned: 20,
};

const getStatusValue = (status) =>
  statusOrder[status] || statusOrder["pending"];

const filteredBorrow = computed(() => {
  return borrows.value.filter((br, index) => {
    const data = extractData.value[index];
    const matchStatus =
      !filteredStatus.value || br.status === filteredStatus.value;
    const matchText = data.includes(searchText.value.toLocaleLowerCase());
    return matchText && matchStatus;
  });
});

const paginatedBorrow = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const data = filteredBorrow.value.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    const statusA = getStatusValue(a.status);
    const statusB = getStatusValue(b.status);

    const statusCompare = statusA - statusB;

    if (statusCompare !== 0) {
      return statusCompare;
    }
    return dateB.getTime() - dateA.getTime();
  });

  return data.slice(start, end);
});
const reload = () => {
  fetchBorrows();
  window.location.reload();
};
onMounted(fetchBorrows);

const showModel = ref(false);
const modelSubmit = ref({ id: "", typeModel: "" });
const getBorrow = (br) => {
  modelSubmit.value = { id: br._id, typeModel: "create" };

  showModel.value = true;
};
</script>

<template>
  <div class="container mt-3">
    <div
      class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2"
    >
      <h3 class="mb-0">Quản lý phiếu mượn</h3>
      <div class="d-flex flex-wrap gap-2">
        <button @click="reload" class="btn btn-outline-primary">
          <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
        <button @click="handleApproveAll" class="btn btn-outline-success">
          <i class="bi bi-check2-all me-1"></i> Duyệt tất cả
        </button>
      </div>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-4 col-6">
        <InputSearch v-model="searchText" />
      </div>

      <div class="col-md-2 col-6">
        <select v-model="filteredStatus" class="form-select">
          <option value="">Tất cả trạng thái</option>
          <option v-for="stt in status" :value="stt">
            {{ statusMap[stt].label }}
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
              <th class="text-center" style="width: 15%">Người mượn</th>
              <th class="text-center" style="width: 20%">Tên sách</th>

              <th class="text-center" style="width: 12%">Ngày mượn</th>
              <th class="text-center" style="width: 12%">Hạn trả</th>
              <th class="text-center" style="width: 12%">Ngày trả</th>
              <!-- <th style="width: 15%">Nhân viên duyệt</th> -->
              <th class="text-center" style="width: 12%">Trạng thái</th>
              <th class="text-center" style="width: 10%">Thao tác</th>
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
              class="align-middle"
            >
              <td class="text-center" @click="getBorrow(br)">
                {{ br.user_id?.lastName + " " + br.user_id?.firstName }}
              </td>
              <td @click="getBorrow(br)" class="text-break">
                {{ br.book_id?.title }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                {{ FormatData.formatBirthDate(br.borrowDate) || "" }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                {{ FormatData.formatBirthDate(br.deadline) || "" }}
              </td>
              <td class="text-center" @click="getBorrow(br)">
                {{ FormatData.formatBirthDate(br.returnDate) || "" }}
              </td>
              <!-- <td>{{ br.staff_id?.fullName || "" }}</td> -->
              <td @click="getBorrow(br)" class="text-center">
                <span
                  class="badge px-3 py-2"
                  :class="
                    statusMap[br.status]?.class ||
                    'bg-secondary-subtle text-secondary'
                  "
                >
                  {{ statusMap[br.status]?.label || "Không xác định" }}
                </span>
              </td>

              <td class="text-center">
                <div class="d-flex justify-content-center gap-1">
                  <button
                    @click="handleApprovedBorrow(br)"
                    class="action-btn btn btn-sm btn-outline-success"
                    :disabled="
                      !['pending', 'pending_return', 'pending_extend'].includes(
                        br.status
                      )
                    "
                    title="Duyệt"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>

                  <button
                    @click="handleRejectBorrow(br._id)"
                    class="action-btn btn btn-sm btn-outline-danger"
                    :disabled="
                      !['pending', 'pending_extend'].includes(br.status)
                    "
                    title="Từ chối"
                  >
                    <i class="bi bi-x"></i>
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
    @submit="handleApprovedBorrow"
    @rejected="handleRejectBorrow"
    :borrow="modelSubmit"
    v-model:show="showModel"
  />
</template>

<style scoped>
.table {
  table-layout: fixed;
  word-break: break-word;
}
.action-btn:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  background-color: #e9ecef !important;
  border-color: #ced4da !important;
  color: #6c757d !important;
}
</style>
