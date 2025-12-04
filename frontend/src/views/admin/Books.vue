<script setup>
import { computed, onMounted, ref, watch } from "vue";
import BookService from "@/services/book.service";
import InputSearch from "@/components/InputSearch.vue";
import FormEditBook from "@/components/FormEditBook.vue";
import { push } from "notivue";
import PaginationTable from "@/components/PaginationTable.vue";
import FormatData from "@/validations/FormatData";
const bookService = new BookService();
const books = ref([]);
const publishers = ref([]);
const categories = ref([]);
// Modal
const showModal_1 = ref(false);
const showModal_2 = ref(false);
const selectedBook = ref({});

// Search + Filter
const searchText = ref("");
const filterPublisher = ref("");
const filterYear = ref("");
const filterCategories = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = 8;

const fetchBook = async () => {
  try {
    books.value = await bookService.getAllBooks();
    //set - loai bo cac value trung nhau
    publishers.value = Array.from(
      new Set(books.value.map((b) => b.publisher_id?.name))
    )
      .filter(Boolean)
      .map((name) => ({ name }));
    categories.value = Array.from(books.value.map((b) => b.categories)).reduce(
      (accumulator, currentArray) => {
        return accumulator.concat(currentArray);
      },
      []
    );
    categories.value = Array.from(new Set(categories.value));
  } catch (error) {
    console.log(error);
  }
};

onMounted(fetchBook);

const openModalUpdate = (book) => {
  selectedBook.value = { ...book };
  showModal_2.value = true;
};

const handleUpdateBook = async (updatedBook) => {
  try {
    await bookService.updateBook(updatedBook._id, updatedBook);
    fetchBook();
    push.success("Cập nhật thành công");
  } catch (error) {
    console.log(error);
    push.error("Cập nhật không thành công");
  }
};

const handleAddBook = async (data) => {
  try {
    await bookService.createBook(data);
    fetchBook();
    push.success("Thêm sách mới thành công");
  } catch (error) {
    console.log(error);
    push.error("Thêm sách không thành công !");
  }
};

const deleteBook = async (id) => {
  try {
    if (
      window.confirm(
        "Bạn chắc chắn muốn xóa? Hành động này không thể hoàn tác!"
      )
    ) {
      await bookService.deleteBook(id);
      fetchBook();
      push.success("Xóa sách thành công");
    }
  } catch (error) {
    console.log(error);
    push.error("Xóa sách không thành công !");
  }
};

const reload = () => {
  fetchBook();
  window.location.reload();
};

const ExtractBook = computed(() => {
  return books.value.map((book) => {
    const name = book.publisher_id?.name || "";
    const categories = book.categories.join(" ");
    const { title, publishYear, author } = book;
    return `${title}${publishYear}${author}${categories}${name}`.toLowerCase();
  });
});

const filteredBook = computed(() => {
  return books.value.filter((book, index) => {
    const exTract = ExtractBook.value[index];
    //textInput
    const matchText = exTract.includes(searchText.value.toLowerCase());
    // box-select
    const matchPublisher =
      !filterPublisher.value ||
      book.publisher_id?.name === filterPublisher.value;
    const matchYear =
      !filterYear.value || book.publishYear === Number(filterYear.value);
    const matchCategories =
      !filterCategories.value ||
      book.categories.includes(filterCategories.value);

    return matchText && matchPublisher && matchYear && matchCategories;
  });
});

// reset lai currentPage
//Neu khong reset:
// + ket qua loc khong anh huong
// + nhung paginatedBooks chi lay ket qua dua tren currentPage hien tai
//  ==> thieu hoac khong hien thi ket qua dung
watch([searchText, filterPublisher, filterYear, filterCategories], () => {
  currentPage.value = 1;
});

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBook.value.slice(start, end);
});
</script>

<template>
  <div class="container py-4 mt-2">
    <div
      class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2"
    >
      <h3 class="mb-0">Quản lý sách</h3>
      <div class="d-flex gap-2 flex-wrap">
        <button @click="reload" class="btn btn-outline-primary">
          <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
        <button @click="showModal_1 = true" class="btn btn-primary">
          <i class="bi bi-plus-lg me-1"></i> Thêm sách mới
        </button>
      </div>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-4 col-12">
        <InputSearch v-model="searchText" />
      </div>
      <div class="col-md-2 col-6">
        <select v-model="filterPublisher" class="form-select">
          <option value="">Tất cả nhà xuất bản</option>
          <option v-for="pub in publishers" :key="pub.name" :value="pub.name">
            {{ pub.name }}
          </option>
        </select>
      </div>
      <div class="col-md-2 col-6">
        <select v-model="filterCategories" class="form-select">
          <option value="">Tất cả thể loại</option>
          <option v-for="cat in categories" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
      <div class="col-md-2 col-6">
        <input
          v-model="filterYear"
          type="number"
          class="form-control"
          placeholder="Năm xuất bản"
        />
      </div>
    </div>

    <div class="card shadow-sm p-3 rounded-3">
      <div class="table-responsive">
        <table
          class="table table-hover align-middle mb-0 text-nowrap table-bordered table-striped"
        >
          <thead class="table-light">
            <tr class="text-uppercase small text-secondary">
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th class="text-center">SL</th>
              <th>Thể loại</th>

              <th>Nhà xuất bản</th>
              <th class="text-center">Năm XB</th>
              <th class="text-center">Giá</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredBook.length">
              <td colspan="8" class="text-center text-muted py-4">
                <i class="bi bi-search me-2"></i>Không tìm thấy kết quả phù hợp
              </td>
            </tr>
            <tr v-for="book in paginatedBooks" :key="book._id">
              <td>
                <div
                  class="d-flex flex-wrap gap-1 text-truncate mw-100"
                  :title="book.title"
                >
                  {{ book.title }}
                </div>
              </td>
              <td>
                <div
                  class="d-inline-block text-truncate mw-100"
                  :title="book.author"
                >
                  {{ book.author }}
                </div>
              </td>
              <td :title="book.quantity" class="text-center">
                {{ book.quantity }}
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="(cat, j) in book.categories"
                    :key="j"
                    class="badge bg-light text-primary border"
                    :title="cat"
                  >
                    {{ cat }}
                  </span>
                </div>
              </td>

              <td>
                <div
                  class="d-inline-block text-truncate mw-100"
                  :title="book.publisher_id?.name"
                >
                  <span
                    :title="book.publisher_id?.name"
                    class="badge bg-danger-subtle text-danger px-2"
                  >
                    {{ book.publisher_id?.name || "Không rõ" }}
                  </span>
                </div>
              </td>
              <td :title="book.publishYear" class="text-center">
                {{ book.publishYear }}
              </td>
              <td
                :title="FormatData.formatMoney(book.price)"
                class="text-center text-success fw-bold"
              >
                {{ FormatData.formatMoney(book.price) }}
              </td>
              <td class="text-center">
                <button
                  title="Chỉnh sửa"
                  @click="openModalUpdate(book)"
                  class="btn btn-sm btn-outline-info me-1"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  title="Xóa"
                  @click="deleteBook(book._id)"
                  class="btn btn-sm btn-outline-danger"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3 d-flex justify-content-end">
        <PaginationTable
          :total-items="filteredBook.length"
          :items-per-page="itemsPerPage"
          v-model:model-value="currentPage"
        />
      </div>
    </div>
  </div>

  <FormEditBook
    v-model:show="showModal_1"
    mode="create"
    :bookData="{}"
    @update-bookData="handleAddBook"
  />
  <FormEditBook
    v-model:show="showModal_2"
    :bookData="selectedBook"
    mode="update"
    @update-bookData="handleUpdateBook"
  />
</template>

<style scoped>
.table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 2;
}
</style>

<style scoped>
.table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 2;
}
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
.page-link {
  cursor: pointer;
}
</style>
