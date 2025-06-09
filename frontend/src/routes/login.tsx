import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/ui/button";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <div className="h-[calc(50vh-2rem)]" />

            <p className="bg-foreground">test</p>

            <Button>Login with GitHub</Button>

            <div className="h-[calc(50vh-2rem)]" />
        </div>
    );
}
