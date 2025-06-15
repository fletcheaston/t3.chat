import { createFileRoute } from "@tanstack/react-router";

import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

export const Route = createFileRoute("/settings/visuals")({
    component: RouteComponent,
});

function Theme() {
    /**************************************************************************/
    /* State */

    /**************************************************************************/
    /* Render */
    return (
        <div>
            <Label htmlFor="theme">Theme</Label>

            <Input
                id="theme"
                placeholder="Select a theme"
                className="text-primary-light"
            />
        </div>
    );
}

function RouteComponent() {
    return (
        <div className="pb-8">
            <h1 className="text-4xl font-semibold">Visual Settings</h1>

            <div className="my-4 flex flex-col gap-6">
                <Theme />
            </div>
        </div>
    );
}
