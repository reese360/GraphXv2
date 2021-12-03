import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import logger from "@/plugins/logger.plugin";
import { OnClickOutside } from "@vueuse/components";

const app = createApp(App);

app.component("onClickOutside", OnClickOutside);

app.use(logger).use(store).mount("#app");
