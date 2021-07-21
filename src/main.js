import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi-base.css";
import "virtual:windi-utilities.css";
import "virtual:windi-devtools";

const app = createApp(App);

app.mount("#app");
