import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "notivue/notification.css";
import "notivue/animations.css";
import "notivue/notification-progress.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createNotivue } from "notivue";

const notivue = createNotivue({
  position: "top-right",
  limit: 4,
  enqueue: true,
  avoidDuplicates: true,
  notifications: {
    global: {
      duration: 2500,
    },
  },
});
const app = createApp(App);
app.use(notivue, {
  position: "top-right",
  container: "#notivue",
  classes: {
    container: "z-top-toast",
  },
});
app.use(router);
app.mount("#app");
