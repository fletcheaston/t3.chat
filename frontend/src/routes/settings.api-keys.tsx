import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/api-keys")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/settings/api-keys"!</div>;
}
