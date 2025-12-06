<script setup>

</script>

<template>
  <aside
    class="sidebar bg-white shadow-lg"
    
  >
    <nav class="p-3 mt-5">
      <ul class="nav flex-column gap-3">
        <li class="nav-item">
          <router-link
            :to="{ name: 'borrow.admin' }"
            class="nav-link sidebar-link"
            active-class="active-link"
          >
            <i class="bi bi-clipboard-check me-2"></i>
            <span class="sidebar-text-content">Phiếu Mượn</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'book.admin' }"
            class="nav-link sidebar-link"
            active-class="active-link"
          >
            <i class="bi bi-collection me-2"></i>
            <span class="sidebar-text-content">Danh mục sách</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'publisher.admin' }"
            class="nav-link sidebar-link"
            active-class="active-link"
          >
            <i class="bi bi-collection me-2"></i>
            <span class="sidebar-text-content">Nhà xuất bản</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'staff.list.admin' }"
            class="nav-link sidebar-link"
            active-class="active-link"
          >
            <i class="bi bi-people me-2"></i
            ><span class="sidebar-text-content">Nhân viên</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'user.list.admin' }"
            class="nav-link sidebar-link"
            active-class="active-link"
          >
            <i class="bi bi-people me-2"></i>
            <span class="sidebar-text-content">Người dùng</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'profile.staff' }"
            class="nav-link sidebar-link"
            active-class="active-link"
          >
            <i class="bi bi-person-gear me-2"></i>
            <span class="sidebar-text-content">Thông tin tài khoản</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-width: 250px;
  transition: width 0.3s ease, min-width 0.3s ease;
}
.sidebar-link {
  color: #333;
  border: solid 0.5px;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
  display: flex;
  align-items: center;
}
.sidebar-link:hover {
  background-color: #3235d8;
  color: white;
}
.active-link {
  background-color: #3235d8;
  color: white !important;
  font-weight: 600;
}

.sidebar.collapsed {
  width: 70px;
  min-width: 70px;
}
.sidebar.collapsed .sidebar-text-content {
  display: none;
}
.sidebar.collapsed .sidebar-link .bi {
  margin-right: 0 !important;
}
</style>
