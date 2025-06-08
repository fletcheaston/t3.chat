import { Link, Outlet, createRootRouteWithContext, redirect } from "@tanstack/react-router";
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
    component: () => (
        <>
            <div className="flex gap-2 p-2">
                <Link
                    to="/"
                    className="[&.active]:font-bold"
                >
                    Home
                </Link>{" "}
                <Link
                    to="/login"
                    className="[&.active]:font-bold"
                >
                    Login
                </Link>
            </div>

            <hr />

            <Outlet />

            <TanStackRouterDevtools />
        </>
    ),
});
