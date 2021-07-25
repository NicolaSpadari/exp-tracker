import { defineConfig } from "vite-plugin-windicss";

let windiConfig = {
    attributify: false,
    important: true,
    darkMode: "class",
    extract: {
        include: ["index.html", "src/**/*.{vue,html,js}"],
        exclude: ["node_modules", ".gitignore", ".gitattribute", ".eslint", ".eslingignore", "prettierrc", ".prettierignore"],
    },
    theme: {
        extend: {
            inset: {
                unset: "unset",
            },
            fontFamily: {
                heading: ["Gilroy", "sans-serif"],
                text: ["Inter", "sans-serif"],
            },
            colors: {
                "tidal-cyan": "#57FFFF",
                "tidal-cyan-highlight": "#274646",
                "tidal-gold": "#EFB573",
                "tidal-gold-highlight": "#494038",
                "tidal-dark-highlight": "#2E2E31",
                "tidal-dark-active": "#8C8C8F",
                "tidal-dark-200": "#242528",
                "tidal-dark-300": "#17171A",
            },
        },
        zIndex: {
            5: 5,
            10: 10,
            20: 20,
            30: 30,
            40: 40,
            50: 50,
            60: 60,
            70: 70,
            80: 80,
            90: 90,
            100: 100,
        },
    },
};

let configuration = defineConfig(windiConfig);

export default configuration;
