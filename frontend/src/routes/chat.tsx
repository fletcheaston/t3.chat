import * as React from "react";

import { Outlet, createFileRoute } from "@tanstack/react-router";

import { ConversationSidebar } from "@/components/conversation-sidebar";
import { MessageWindow } from "@/components/message-window";
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

            <div className="h-[100vh] grow overflow-hidden">
                <div className="flex h-full justify-center overflow-y-scroll px-2">
                    <div className="flex max-w-3xl grow flex-col">
                        <div className="grow pb-12">
                            <Outlet />
                        </div>

                        <div className="sticky bottom-0 rounded-xl">
                            <MessageWindow />
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
