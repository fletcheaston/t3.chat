import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/support")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/settings/support"!</div>;
}
