<!-- BookList.vue -->
<script setup>
import BookService from "@/services/book.service";
import { computed, ref, onMounted, watch, reactive } from "vue";
import FilterSidebar from "@/components/FilterSidebar.vue";
import BookCard from "@/components/BookCard.vue";
import PaginationTable from "@/components/PaginationTable.vue";
import BorrowService from "@/services/borrow.service";
import FormEditBorrow from "@/components/FormEditBorrow.vue";
import { push } from "notivue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const bsv = new BookService();
const borrowService = new BorrowService();
const currentPage = ref(1);
const itemsPerPage = 8;
const allBooks = ref([]);
const uniqueCategories = ref([]);
const uniqueYears = ref([]);
const searchKeyword = ref("");
const selectedCategory = ref(route.query.category);
const selectedYear = ref("");
const selectedPublishers = ref(route.query.publisher);
const uniquePublishers = ref([]);
const showModel = ref(false);
const borrow = ref({ bookID: "", user: {}, typeModel: "" });

const fetchBooksAndMetadata = async () => {
  try {
    allBooks.value = await bsv.getAllBooks();
    const allCategories = allBooks.value.map((b) => b.categories).flat();
    uniqueCategories.value = Array.from(new Set(allCategories)).filter(
      (c) => c
    );
    const allYears = allBooks.value
      .map((b) => b.publishYear)
      .filter((y) => y)
      .map((y) => parseInt(y));
    uniqueYears.value = Array.from(new Set(allYears)).sort((a, b) => b - a);

    const allPublisher = allBooks.value.map((b) => b.publisher_id?.name);
    uniquePublishers.value = Array.from(new Set(allPublisher));
  } catch (error) {
    console.error(error);
  }
};
watch([searchKeyword], () => {
  if (route.query.id) {
    router.replace({ query: {} });
  }
});
const filteredData = computed(() => {
  let results = allBooks.value;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  if (route.query.id) {
    searchKeyword.value = route.query.title;
    results = results.filter((b) => b._id === route.query.id);
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    results = results.filter(
      (b) =>
        b.title.toLowerCase().includes(keyword) ||
        (b.author && b.author.toLowerCase().includes(keyword))
    );
  }
  if (selectedPublishers.value) {
    results = results.filter((b) =>
      b.publisher_id?.name
        .toLowerCase()
        .includes(selectedPublishers.value.toLocaleLowerCase())
    );
  }
  if (selectedCategory.value) {
    results = results.filter((b) => {
      // console.log(b.categories);
      return b.categories.includes(selectedCategory.value);
    });
  }
  if (selectedYear.value) {
    results = results.filter(
      (b) => parseInt(b.publishYear) === parseInt(selectedYear.value)
    );
  }

  return { books: results.slice(start, end), count: results.length };
});

const handleData = async (bookId) => {
  const quantity = (await bsv.getBook(bookId)).quantity;
  if (quantity <= 0) return;
  showModel.value = true;
  borrow.value = {
    book_id: bookId,
    user_id: JSON.parse(sessionStorage.getItem("userSection"))?.id || "",
    typeModel: "request",
  };
  // console.log(borrow.value);
};

const handleBorrowBook = async (data) => {
  try {
    await borrowService.createBorrow(data);
    console.log(data);
    push.success("Gửi yêu cầu mượn sách thành công");
  } catch (error) {
    console.log(error);
    if (error.status === 422) {
      push.error("Bạn chỉ có thể mượn tối đa 3 quyển này");
      return;
    } else if (error.status === 409) {
      push.error("Bạn chỉ có thể mượn tối đa 10 quyển sách");
      return;
    }

    push.error("Lỗi trong quá trình gửi phiếu mượn");
  }
};
watch(
  [searchKeyword, selectedPublishers, selectedCategory, selectedYear],
  () => {
    currentPage.value = 1;
  }
);

const clearFilters = () => {
  router.push({ query: {} });
  searchKeyword.value = "";
  selectedCategory.value = "";
  selectedYear.value = "";
  selectedPublishers.value = "";
};

onMounted(fetchBooksAndMetadata);
</script>

<template>
  <div class="container-fluid py-4">
    <div class="mb-4">
      <FilterSidebar
        :unique-categories="uniqueCategories"
        :unique-years="uniqueYears"
        :uni-publishers="uniquePublishers"
        :search-keyword="searchKeyword"
        :selected-category="selectedCategory"
        :selected-publisher="selectedPublishers"
        :selected-year="selectedYear"
        :filtered-book-count="filteredData.count"
        @update:searchKeyword="searchKeyword = $event"
        @update:selectedCategory="selectedCategory = $event"
        @update:selectedYear="selectedYear = $event"
        @update:selectedPublisher="selectedPublishers = $event"
        @clear-filters="clearFilters"
      />
    </div>
    <div class="row">
      <div class="col-12">
        <div
          v-if="filteredData.books.length > 0"
          class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4"
        >
          <div
            v-for="book in filteredData.books"
            :key="book._id"
            class="col d-flex"
          >
            <BookCard @click="handleData(book._id)" :book="book" />
          </div>
        </div>
        <div v-else class="alert alert-warning text-center">
          <i class="bi bi-exclamation-triangle-fill"></i> Không tìm thấy sách
          nào phù hợp
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex justify-content-end">
      <PaginationTable
        :total-items="filteredData.count"
        :items-per-page="itemsPerPage"
        v-model:model-value="currentPage"
      />
    </div>
  </div>
  <FormEditBorrow
    @submit="handleBorrowBook"
    :borrow="borrow"
    v-model:show="showModel"
  />
</template>

<style scoped>
.text-primary {
  color: #0a2540 !important;
}

/* .row > .col {
  display: flex;
} */

.book-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}
</style>
