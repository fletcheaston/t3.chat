import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({
            target: "react",
            autoCodeSplitting: true,
            quoteStyle: "double",
        }),
        react(),
        viteTsconfigPaths(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    worker: {
        plugins: () => [viteTsconfigPaths()],
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                rewrite: (path) => path.replace("http://localhost:3000", "http://localhost:8000"),
            },
        },
    }
});