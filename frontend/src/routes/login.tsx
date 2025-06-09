import { createFileRoute } from "@tanstack/react-router";

import { githubOauthClientId } from "@/env";
import { Button } from "@/ui/button";

import githubIcon from "/media/github.png";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <div className="h-[calc(45%-40px)]" />

            <Button
                asChild
                size="lg"
            >
                <a
                    href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${githubOauthClientId}`}
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

            <div className="h-[calc(55%-40px)]" />
        </div>
    );
}
