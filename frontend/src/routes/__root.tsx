import { HeadContent, Outlet, createRootRouteWithContext, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AuthUserSchema } from "@/api";
import { useAnonUser } from "@/api/auth";
import sonnerCss from "@/sonner.css?url";
import appCss from "@/styles.css?url";
import { ConversationsProvider } from "@/sync/conversations";
import { SyncProvider } from "@/sync/sync-provider";

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
    head: () => {
        return {
            meta: [
                { title: "Fletcher Easton's T3 Chat Clone" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0",
                },
            ],
            links: [
                {
                    rel: "icon",
                    href: "/favicon.ico",
                },
                {
                    rel: "stylesheet",
                    href: appCss,
                },
                {
                    rel: "stylesheet",
                    href: sonnerCss,
                },
            ],
        };
    },
    component: RouteComponent,
});

function Authenticated() {
    /**************************************************************************/
    /* Render */
    return (
        <SyncProvider>
            <ConversationsProvider>
                <Outlet />
            </ConversationsProvider>
        </SyncProvider>
    );
}

function Anonymous() {
    /**************************************************************************/
    /* Render */
    return <Outlet />;
}

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const user = useAnonUser();

    /**************************************************************************/
    /* Render */
    return (
        <>
            <head>
                <HeadContent />
            </head>

            <body className="h-full overflow-y-auto overscroll-none">
                <main>
                    {user === null ? <Anonymous /> : <Authenticated />}

                    <TanStackRouterDevtools />
                </main>
            </body>
        </>
    );
}
