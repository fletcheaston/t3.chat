import { createFileRoute } from "@tanstack/react-router";

import { useUser } from "@/components/auth";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const user = useUser();

    /**************************************************************************/
    /* Render */
    return <div>Hello {user.name}!</div>;
}
