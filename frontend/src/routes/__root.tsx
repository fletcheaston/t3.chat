import { Outlet, createRootRouteWithContext, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AuthUserSchema } from "@/api";

interface RouterContext {
    user: AuthUserSchema | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    beforeLoad: async ({ context, location }): Promise<undefined> => {
        const { user } = context;
        const isLoginPage = location.pathname === "/login";

        // If the user isn't authenticated, take them to the login page
        if (user === null) {
            // Already on the login page
            if (isLoginPage) return;

            throw redirect({ to: "/login" });
        }

        // Authenticated user
        // If they're on the login page, take them to home page
        if (isLoginPage) {
            throw redirect({ to: "/" });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <>
            <Outlet />

            <TanStackRouterDevtools />
        </>
    );
}
