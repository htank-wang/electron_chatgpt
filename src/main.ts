import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "ant-design-vue/es/message/style/css";

createApp(App)
  .mount("#app")
  .$nextTick(() => {});
