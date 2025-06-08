import { client } from "./client/client.gen";

export * from "./client";

client.setConfig({
    baseUrl: "https://example.com",
});

export { client };
