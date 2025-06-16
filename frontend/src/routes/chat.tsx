import * as React from "react";

import { Outlet, createFileRoute } from "@tanstack/react-router";

import { ConversationSidebar } from "@/components/conversation-sidebar";
import { SidebarProvider } from "@/ui/sidebar";

export const Route = createFileRoute("/chat")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <SidebarProvider>
            <div className="relative">
                <ConversationSidebar />
            </div>

            <div className="relative h-[100vh] grow overflow-hidden">
                <div className="flex h-full justify-center overflow-y-scroll px-2 pt-16">
                    <Outlet />
                </div>
            </div>
        </SidebarProvider>
    );
}
