import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["dist/*"]),
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        languageOptions: { globals: globals.browser },
        extends: [
            "js/recommended",
            tseslint.configs.recommended,
            pluginReact.configs.flat.recommended,
        ],
        rules: {
            "react/no-unescaped-entities": 0,
            "react/react-in-jsx-scope": 0,
            "@typescript-eslint/no-explicit-any": 0,
        },
    },
]);
