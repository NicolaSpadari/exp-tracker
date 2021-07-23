import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import ViteComponents from "vite-plugin-components";
import { VitePWA } from "vite-plugin-pwa";
import HmrEvent from "./src/plugins/vite-plugin-hmr";
import WindiCSS from "vite-plugin-windicss";
import { resolve } from "path";

export default defineConfig({
    build: {
        sourceMap: true,
    },
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
            base: "/",
            srcDir: "src",
            filename: "sw.js",
            strategies: "injectManifest",
            includeAssets: ["/favicon.ico"],
            manifest: {
                name: "Food Exp Tracker",
                short_name: "Exp Tracker",
                theme_color: "#222226",
                background_color: "#222226",
                display: "standalone",
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
                swSrc: "src/sw.js",
                swDest: "service-worker.js",
                exclude: [/\.map$/],
            },
        }),
        ViteComponents({
            extensions: ["vue"],
            dirs: ["src/components"],
            deep: false,
        }),
    ],
});
