import { defineConfig } from "vite-plugin-windicss";

let windiConfig = {
    attributify: false,
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
