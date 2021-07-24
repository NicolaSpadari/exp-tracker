import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/atlas.css";
import "./assets/css/fonts.css";
import "virtual:windi-base.css";
import "virtual:windi-utilities.css";
import "virtual:windi-devtools";
import { registerSW } from "virtual:pwa-register";
import { createRippleDirective } from "vue-create-ripple";

const app = createApp(App);

registerSW();
app.directive(
    "gold-ripple",
    createRippleDirective({
        class: "bg-tidal-gold-highlight opacity-50",
    })
);
app.directive(
    "cyan-ripple",
    createRippleDirective({
        class: "bg-tidal-cyan-highlight opacity-50",
    })
);
app.directive(
    "dark-ripple",
    createRippleDirective({
        class: "bg-tidal-dark-active opacity-50",
    })
);

app.mount("#app");
