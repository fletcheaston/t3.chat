import * as React from "react";

import { Link } from "@tanstack/react-router";

import { Button } from "@/ui/button";
import { F3 } from "@/ui/logo";
import { Separator } from "@/ui/separator";

export function SidebarHeader() {
    /**************************************************************************/
    /* Render */
    return (
        <div
            data-slot="sidebar-header"
            data-sidebar="header"
            className="flex flex-col items-center gap-2 py-0.5"
        >
            <h1 className="mt-0.5 h-3.5 select-none">
                <F3 />
            </h1>

            <Button
                asChild
                variant="plain"
                size="default"
                className="text-gunmetal hover:bg-pantone bg-pantone-light hover:border-pantone border-gunmetal-light mt-4 w-full border text-sm"
                tooltip="New chat"
            >
                <Link to="/chat">New Chat</Link>
            </Button>

            <Separator />
        </div>
    );
}
