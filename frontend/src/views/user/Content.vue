<script setup>
import BookService from "@/services/book.service";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const bsv = new BookService();
const router = useRouter();
const books = ref([]);
const categories = ref([]);

const fetchBooks = async () => {
  try {
    books.value = await bsv.getAllBooks();
    let allCategories = books.value.map((b) => b.categories).flat();
    categories.value = Array.from(new Set(allCategories)).filter((c) => c);
  } catch (error) {
    console.log(error);
  }
};

const countBookMatchPub = (pub) => {
  let count = 0;
  books.value.forEach((book) => {
    if (book.publisher_id?.name === pub?.name) count++;
  });
  return count;
};
const isAuthenticated = computed(() => {
  const current = sessionStorage.getItem("currentLogin");
  const section = current ? sessionStorage.getItem(current + "Section") : null;
  const token = section ? JSON.parse(section).token : null;
  return !!token;
});
onMounted(fetchBooks);
</script>

<template>
  <div class="home-page">
    <section
      class="hero-animated text-white min-vh-100 d-flex align-items-center py-5 justify-content-center"
      style="
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.75)
          ),
          url('https://govi.vn/wp-content/uploads/2022/06/banner-gia-ke-thu-vien.jpg')
            center/cover no-repeat;
        backdrop-filter: blur(2px);
      "
    >
      <div class="text-center position-relative" style="z-index: 2">
        <h1 class="display-5 fw-bold mb-3">Chào Mừng Đến Với Thư Viện Sách</h1>
        <p class="lead opacity-75">
          Khám phá hàng ngàn đầu sách từ văn học, khoa học đến thiếu nhi.
        </p>

        <div v-if="!isAuthenticated" class="mt-3">
          <router-link
            :to="{ name: 'user.register' }"
            class="btn btn-warning btn-lg px-4 rounded-pill fw-semibold shadow"
          >
            Đăng Ký Ngay <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <section class="mx-3 mb-5 p-4 shadow-sm rounded-4 bg-white">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold d-flex align-items-center mb-0">
          <i class="bi bi-grid-fill text-primary fs-4 me-2"></i> Thể Loại
        </h4>

        <router-link
          :to="{ name: 'book.list' }"
          class="text-decoration-none fw-semibold text-primary"
        >
          Xem Tất Cả <i class="bi bi-arrow-right"></i>
        </router-link>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <router-link
          v-for="category in categories.slice(0, 15)"
          :key="category"
          :to="{ query: { category }, name: 'book.list' }"
          class="badge text-decoration-none category-tag"
        >
          {{ category }}
        </router-link>
      </div>
    </section>

    <section class="p-4 shadow-sm rounded-4 bg-white mb-5 mx-3">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold">
          <i class="bi bi-star-fill text-danger me-2"></i> Sách Nổi Bật
        </h3>

        <router-link
          :to="{ name: 'book.list' }"
          class="text-decoration-none fw-semibold text-primary"
        >
          Xem Tất Cả <i class="bi bi-arrow-right"></i>
        </router-link>
      </div>

      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
        <router-link
          v-for="book in books.slice(0, 12)"
          :key="book._id"
          :to="{
            query: { id: book._id, title: book.title },
            name: 'book.list',
          }"
          class="col text-decoration-none"
        >
          <div class="card book-card-small h-100">
            <img
              :src="`https://picsum.photos/seed/${book?._id}/800/800`"
              class="card-img-top"
              alt=""
            />
            <div class="card-body p-2">
              <span class="badge bg-success mb-1">Nổi bật</span>
              <h6 class="fw-bold mb-1 text-dark">{{ book.title }}</h6>
              <p class="small text-muted mb-1">{{ book.author }}</p>
              <p class="small text-secondary mb-0">{{ book.publishYear }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <section class="p-4 shadow-sm rounded-4 bg-white mb-5 mx-3">
      <div class="mb-4">
        <h4 class="fw-bold mb-5">
          <i class="bi bi-bookmark-fill text-primary me-2"></i>Nhà Xuất Bản Nổi
          Bật
        </h4>
        <div class="row g-4">
          <div
            class="col-md-3 g-3 publisher-card border-1 rounded px-0 text-center"
            v-for="book in books.slice(0, 8)"
            :key="book"
          >
            <router-link
              :to="{
                query: { publisher: book.publisher_id?.name },
                name: 'book.list',
              }"
              class="card text-decoration-none h-100 shadow-sm border-0 p-3"
            >
              <div class="text-primary mb-2">
                <i class="bi bi-building fs-3"></i>
              </div>
              <h6 class="fw-bold mb-1">
                {{ book.publisher_id?.name }}
              </h6>
              <p class="small text-muted mb-0">
                {{ countBookMatchPub(book.publisher_id) }} đầu sách
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style>
.category-tag {
  background-color: #e6f0ff;
  color: #0d6efd;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
  border: 1px solid #c2e0ff;
}
.category-tag:hover {
  background-color: #0d6efd;
  color: white;
}
.book-card-small {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid #e9ecef;
}
.book-card-small:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.publisher-card {
  padding-left: 5px !important;
  padding-right: 5px !important;
  background: transparent !important;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.publisher-card .card {
  border-radius: 14px;

  background: #e6f0ff !important;
  transition: 0.25s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.publisher-card .card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
</style>
