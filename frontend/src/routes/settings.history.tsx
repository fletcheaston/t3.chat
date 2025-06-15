import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/history")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/settings/history"!</div>;
}
