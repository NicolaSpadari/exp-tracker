import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/atlas.css";
import "./assets/css/fonts.css";
import "virtual:windi-base.css";
import "virtual:windi-utilities.css";
import "virtual:windi-devtools";
import { registerSW } from "virtual:pwa-register";

const app = createApp(App);

registerSW();

app.mount("#app");
