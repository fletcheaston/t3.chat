import * as React from "react";

import { createFileRoute } from "@tanstack/react-router";

import { ConversationSidebar } from "@/components/conversation-sidebar";
import { CreateConversation } from "@/components/create-conversation";
import { SidebarProvider } from "@/ui/sidebar";

export const Route = createFileRoute("/")({
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
                    <div className="flex max-w-3xl grow flex-col">
                        <div className="grow pb-12" />

                        <div className="sticky bottom-0 rounded-xl">
                            <CreateConversation />
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
