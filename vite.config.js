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
            strategies: "generateSW",
            manifest: {
                name: "Food Exp Tracker",
                short_name: "Exp Tracker",
                description: "A food expiration tracking app",
                theme_color: "#222226",
                background_color: "#222226",
                display: "standalone",
                start_url: "/",
                lang: "it_IT",
                icons: [
                    {
                        src: "/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                cacheId: "exp-tracker-app",
            },
        }),
        ViteComponents({
            extensions: ["vue"],
            dirs: ["src/components"],
            deep: false,
        }),
    ],
});
