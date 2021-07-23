import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import ViteComponents from "vite-plugin-components";
import { VitePWA } from "vite-plugin-pwa";
import HmrEvent from "./src/plugins/vite-plugin-hmr";
import WindiCSS from "vite-plugin-windicss";
import { resolve } from "path";
import replace from "@rollup/plugin-replace";

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
            base: "/",
        }),
        ViteComponents({
            extensions: ["vue"],
            dirs: ["src/components"],
            deep: false,
        }),
        replace({
            __DATE__: new Date().toISOString(),
        }),
    ],
});
