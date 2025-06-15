import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/settings/models")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/settings/models"!</div>
}
