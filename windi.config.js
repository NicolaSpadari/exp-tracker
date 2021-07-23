import { defineConfig } from "vite-plugin-windicss";

const classRange = (size, startAt = 0) => {
    return Array.from(Array(size).keys()).map((i) => i + startAt);
};

let windiConfig = {
    attributify: false,
    important: true,
    darkMode: "class",
    blocklist: [classRange(6).map((i) => `p-${i}`), classRange(6).map((i) => `pt-${i}`), classRange(6).map((i) => `pb-${i}`), classRange(6).map((i) => `pr-${i}`), classRange(6).map((i) => `pl-${i}`), classRange(6).map((i) => `px-${i}`), classRange(6).map((i) => `py-${i}`), classRange(6).map((i) => `m-${i}`), classRange(6).map((i) => `mt-${i}`), classRange(6).map((i) => `mb-${i}`), classRange(6).map((i) => `mr-${i}`), classRange(6).map((i) => `ml-${i}`), classRange(6).map((i) => `mx-${i}`), classRange(6).map((i) => `my-${i}`)],
    corePlugins: {
        container: false,
    },
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
                "tidal-dark-200": "#222226",
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
        screens: {
            xs: "0px",
            sm: "576px",
            md: "768px",
            lg: "992px",
            xl: "1200px",
            xxl: "1400px",
        },
    },
};

let configuration = defineConfig(windiConfig);

export default configuration;
