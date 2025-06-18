import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    input: "openapi.json",
    output: "src/api/client",
    plugins: [
        "@hey-api/client-fetch",
        {
            name: "@hey-api/sdk",
        },
        {
            enums: "javascript",
            name: "@hey-api/typescript",
        },
    ],
});
