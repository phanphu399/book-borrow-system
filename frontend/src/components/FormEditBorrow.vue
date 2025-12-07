ModalBorrowForm.vue
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import BookService from "@/services/book.service";
import UserService from "@/services/user.service";
import FormatData, { formatDate } from "@/validations/FormatData";
import { Form, Field, ErrorMessage } from "vee-validate";
import { borrowSchema } from "@/validations/borrow.validate";
import BorrowService from "@/services/borrow.service";
import StaffService from "@/services/staff.service";
const bookService = new BookService();
const userService = new UserService();
const borrowService = new BorrowService();
const staffService = new StaffService();
const props = defineProps({
  show: Boolean,
  borrow: {
    type: Object,
    require: true,
  },
});

const statusMap = {
  pending: {
    label: "Chờ duyệt mượn",
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
    label: "Từ chối mượn",
    class: "bg-danger-subtle text-danger fw-semibold",
  },
};

const emit = defineEmits([
  "update:show",
  "submit",
  "update:borrow",
  "rejected",
  "return",
]);
function addDays(baseDate, numberOfDays) {
  const newDate = new Date(baseDate);
  newDate.setDate(newDate.getDate() + numberOfDays);
  return newDate;
}

const borrowing = ref({
  borrower: {},
  staff: {},
  book: {},
  status: "pending",
  borrowDate: FormatData.convertDateToYYMMDD(new Date()),
  deadline: FormatData.convertDateToYYMMDD(addDays(new Date(), 15)),
});

const renderModel = async () => {
  // console.log(await borrowService.getBorrow(props.borrow.id));

  if (["update", "create"].includes(props.borrow.typeModel)) {
    const data = await borrowService.getBorrow(props.borrow.id);

    borrowing.value.staff = data.staff_id || {};

    borrowing.value.book = data.book_id;
    borrowing.value.borrower = data.user_id;
    borrowing.value.returnDate = FormatData.convertDateToYYMMDD(
      new Date(data.returnDate)
    );
    borrowing.value.borrowDate = FormatData.convertDateToYYMMDD(
      new Date(data.borrowDate)
    );
    borrowing.value.deadline = FormatData.convertDateToYYMMDD(data.deadline);

    borrowing.value.status = data.status;
  } else if (props.borrow.typeModel === "request") {
    borrowing.value.borrower = await userService.getUser(props.borrow.user_id);
    borrowing.value.book = await bookService.getBook(props.borrow.book_id);
  }
  // console.log(borrowing.value.status);
  // console.log(statusMap[borrowing.value.status]);
  // console.log(borrowing.value);
};

watch(
  () => props.borrow,
  async (newVal) => {
    if (!props.show) return;
    await renderModel();
  },
  { deep: true, immediate: true }
);

const closeModal = () => emit("update:show", false);

const handleSubmit = () => {
  emit("submit", {
    _id: props.borrow.id || "",
    user_id: borrowing.value.borrower._id,
    book_id: borrowing.value.book._id,
    status: borrowing.value.status || "",
    borrowDate: borrowing.value.borrowDate,
    deadline: borrowing.value.deadline,
    returnDate: borrowing.value.returnDate,
  });
  closeModal();
};

const handleReject = () => {
  emit("rejected", props.borrow.id || "");
  closeModal();
};
const handleReturn = async () => {
  emit("return", (await borrowService.getBorrow(props.borrow.id)) || "");
  closeModal();
};
</script>

<template>
  <div v-if="show">
    <div class="overlay" @click="closeModal"></div>
    <div class="modal-box">
      <button class="btn-close" @click="closeModal"></button>
      <Form :validation-schema="borrowSchema">
        <div class="row g-2">
          <div class="col-md-4 my-4">
            <div class="card shadow-sm h-100">
              <img
                :src="`https://picsum.photos/seed/${borrowing.book._id}/800/800`"
                class="card-img-top h-100"
              />
              <div class="card-body">
                <h6 class="fw-bold">{{ borrowing.book.title }}</h6>
                <p class="text-muted small">{{ borrowing.book.author }}</p>
              </div>
            </div>
          </div>

          <div class="col-md-8">
            <h4 class="fw-bold p-2 mt-2">Thông tin phiếu mượn</h4>
            <div class="alert alert-info p-2 mt-2">
              Yêu cầu sẽ được nhân viên xem xét !
            </div>

            <div class="card p-3 shadow-sm mb-3">
              <p class="mb-1">
                <strong>Tên:</strong>
                {{
                  borrowing.borrower.firstName +
                  " " +
                  borrowing.borrower.lastName
                }}
              </p>
              <p class="mb-1">
                <strong>SDT:</strong> {{ borrowing.borrower.phone }}
              </p>
              <p class="mb-1">
                <strong>Địa chỉ:</strong> {{ borrowing.borrower.address }}
              </p>
            </div>

            <div class="card p-3 shadow-sm mb-3">
              <div class="row">
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">Ngày mượn</label>
                  <Field
                    type="date"
                    class="form-control"
                    name="borrowDate"
                    :disabled="
                      ['update', 'create'].includes(props.borrow.typeModel)
                    "
                    v-model="borrowing.borrowDate"
                  />
                  <ErrorMessage
                    v-if="props.borrow.typeModel === 'request'"
                    name="borrowDate"
                    class="text-danger fw-medium small"
                  />
                </div>

                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">Hạn trả</label>
                  <Field
                    type="date"
                    class="form-control"
                    name="deadline"
                    v-model="borrowing.deadline"
                    :disabled="
                      ['update', 'create'].includes(props.borrow.typeModel)
                    "
                  />
                  <ErrorMessage
                    v-if="props.borrow.typeModel === 'request'"
                    name="deadline"
                    class="text-danger fw-medium small"
                  />
                </div>
                <!-- {{ borrowing.deadline }} -->
                <div
                  class="col-md-6 mb-2"
                  v-if="borrowing.status === 'returned'"
                >
                  <label class="form-label fw-bold">Ngày trả</label>
                  <Field
                    type="date"
                    class="form-control"
                    name="returnDate"
                    v-model="borrowing.returnDate"
                    :disabled="
                      ['update', 'create'].includes(props.borrow.typeModel)
                    "
                  />
                  <ErrorMessage
                    v-if="props.borrow.typeModel === 'request'"
                    name="deadline"
                    class="text-danger fw-medium small"
                  />
                </div>
                <div
                  class="row mt-2"
                  v-if="['update', 'create'].includes(props.borrow.typeModel)"
                >
                  <p class="mb-1">
                    <strong>Nhân viên duyệt: </strong>
                    {{ borrowing.staff.fullName || "Đang tải..." }}
                  </p>
                </div>
              </div>

              <div
                class="row mt-2"
                v-if="['update', 'create'].includes(props.borrow.typeModel)"
              >
                <p class="mb-1">
                  <strong>Trạng thái: </strong>
                  <span
                    class="badge px-3 py-2"
                    :class="statusMap[borrowing.status].class"
                    >{{ statusMap[borrowing.status].label }}</span
                  >
                </p>
              </div>
            </div>

            <div class="card p-3 shadow-sm mb-3">
              <p class="mb-1">
                <strong>Tên sách:</strong> {{ borrowing.book.title }}
              </p>
              <p class="mb-1">
                <strong>Nhà xuất bản:</strong>
                {{ borrowing.book.publisher_id?.name || "NaN" }}
              </p>
              <p class="mb-1">
                <strong>Tác giả:</strong> {{ borrowing.book.author }}
              </p>
              <p class="mb-1">
                <strong>Thể loại:</strong> {{ borrowing.book.categories }}
              </p>
            </div>

            <div class="text-end mt-3">
              <button
                v-if="
                  props.borrow.typeModel === 'create' &&
                  ['pending', 'pending_return'].includes(borrowing.status)
                "
                class="btn btn-primary me-2"
                @click="handleSubmit"
              >
                Duyệt
              </button>

              <button
                v-if="
                  props.borrow.typeModel === 'create' &&
                  borrowing.status === 'pending'
                "
                class="btn btn-warning me-2"
                @click="handleReject"
              >
                Từ chối
              </button>
              <button
                v-if="props.borrow.typeModel === 'request'"
                class="btn btn-primary me-2"
                @click="handleSubmit"
              >
                Gửi yêu cầu
              </button>

              <button
                v-if="
                  props.borrow.typeModel === 'update' &&
                  ['overdue', 'borrowing'].includes(borrowing.status)
                "
                class="btn btn-primary me-2"
                @click="handleReturn"
              >
                Trả sách
              </button>
              <button class="btn btn-outline-secondary" @click="closeModal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}
.modal-box {
  position: fixed;
  z-index: 999999;
  inset: 0;
  margin: auto;
  width: 85%;
  max-width: 900px;
  background: white;
  border-radius: 10px;
  max-height: 92vh;
  overflow-y: auto;
  padding: 15px;
  overflow-x: hidden;
}
.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
