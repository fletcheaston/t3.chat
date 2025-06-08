// Import the generated route tree
import { StrictMode } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { AuthProvider, useAnonUser } from "@/api/auth";
import { client } from "@/api/client/client.gen";
import { routeTree } from "@/routeTree.gen";
import "@/styles.css";

// Configure the API client *before* any requests are made
client.setConfig({
    baseUrl: "http://localhost:3000",
});

// Create a new router instance with default context values
const router = createRouter({
    routeTree,
    context: {
        user: null,
    },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function Router() {
    const user = useAnonUser();

    return (
        <RouterProvider
            router={router}
            context={{ user }}
        />
    );
}

// Render the app
const root = ReactDOM.createRoot(document.documentElement);
root.render(
    <StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </StrictMode>
);
