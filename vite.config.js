import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import ViteComponents from "vite-plugin-components";
import { VitePWA } from "vite-plugin-pwa";
import HmrEvent from "./src/plugins/vite-plugin-hmr";
import WindiCSS from "vite-plugin-windicss";
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@js": resolve(__dirname, "./src/assets/js"),
            "@components": resolve(__dirname, "./src/components"),
        },
    },
    plugins: [
        Vue({
            include: [/\.vue$/],
        }),
        WindiCSS(),
        HmrEvent(),
        VitePWA({
            registerType: "autoUpdate",
        }),
        ViteComponents({
            extensions: ["vue"],
            dirs: ["src/components"],
            deep: false,
        }),
    ],
});
