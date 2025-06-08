// Import the generated route tree
import { StrictMode } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { routeTree } from "@/routeTree.gen";
import "@/styles.css";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Render the app
const root = ReactDOM.createRoot(document.documentElement);
root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
