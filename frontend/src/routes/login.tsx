import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { githubOauthClientId } from "@/env";
import { Button } from "@/ui/button";

import githubIcon from "/media/github.png";

const loginSearchParser = z.object({
    redirect: z.string()
        .optional()
        .transform((val) => val?.startsWith("/") ? val : undefined),
});

export const Route = createFileRoute("/login")({
    validateSearch: loginSearchParser,
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const { redirect } = Route.useSearch();

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex h-full flex-col items-center justify-start">
            <div className="h-[40%]" />

            <h1 className="mb-4 text-3xl">Fletcher's T3 Chat Clone</h1>

            <Button
                asChild
                size="lg"
                tooltip="Login"
            >
                <a
                    href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${githubOauthClientId}${
                        redirect ? `&redirect_uri=${encodeURIComponent(redirect)}` : ""
                    }`}
                >
                    Login with GitHub
                    <img
                        src={githubIcon}
                        alt="GitHub icon"
                        className="rounded-full bg-white"
                        width="32"
                        height="32"
                    />
                </a>
            </Button>
        </div>
    );
}
