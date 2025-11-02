import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers"; // Đảm bảo bạn đã tạo file này
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const app = createApp(App);

app.use(router); // Bắt buộc để sử dụng vue-router
app.mount("#app");
