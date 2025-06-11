import * as React from "react";

import { Outlet, createFileRoute } from "@tanstack/react-router";

import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarProvider } from "@/ui/sidebar";

export const Route = createFileRoute("/chat")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <div className="relative">
            <SidebarProvider>
                <ChatSidebar />

                <div>
                    <div>Hello chats</div>

                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    );
}
