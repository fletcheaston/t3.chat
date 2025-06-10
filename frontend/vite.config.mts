import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        TanStackRouterVite({
            target: "react",
            autoCodeSplitting: true,
            quoteStyle: "double",
        }),
        react(),
        viteTsconfigPaths(),
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
            "/ws/sync": {
                target: "ws://localhost:8000",
                ws: true,
                rewrite: (path) => path.replace("ws://localhost:3000", "ws://localhost:8000"),
            },
        },
    },
});
