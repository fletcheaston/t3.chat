import * as React from "react";

import { Outlet, createFileRoute } from "@tanstack/react-router";
import { PanelLeftIcon, PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/ui/button";
import { F3 } from "@/ui/logo";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarProvider,
    useSidebar,
} from "@/ui/sidebar";
import { cn } from "@/utils";

export const Route = createFileRoute("/chats")({
    component: RouteComponent,
});

function ChatSidebar() {
    /**************************************************************************/
    /* Render */
    return (
        <Sidebar
            collapsible="offcanvas"
            className="bg-gunmetal-50"
        >
            <div
                data-slot="sidebar-header"
                data-sidebar="header"
                className="flex flex-col items-center gap-2 p-0.5 text-xl"
            >
                <h1 className="my-0.5 h-3.5 select-none">
                    <F3 />
                </h1>
            </div>

            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    );
}

function SidebarButtons() {
    /**************************************************************************/
    /* State */
    const { open, toggleSidebar } = useSidebar();

    /**************************************************************************/
    /* Render */
    return (
        <div className="absolute top-2 left-2 z-50">
            <div className="bg-gunmetal-50/50 relative flex h-fit gap-x-0.5 rounded p-1 backdrop-blur-sm transition-all duration-150">
                <Button
                    data-sidebar="trigger"
                    data-slot="sidebar-trigger"
                    variant="plain"
                    size="icon"
                    className="hover:bg-gunmetal z-10"
                    onClick={toggleSidebar}
                >
                    <PanelLeftIcon />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>

                <Button
                    variant="plain"
                    size="icon"
                    className={cn(
                        "hover:bg-gunmetal relative",
                        open ? "absolute left-0 z-0 opacity-0" : ""
                    )}
                >
                    <SearchIcon
                        className={cn(
                            "absolute transition-all delay-150 duration-150 ease-[cubic-bezier(.4,0,.2,1)]",
                            open ? "-left-7" : "left-2"
                        )}
                    />
                    <span className="sr-only">Search Chats</span>
                </Button>

                <Button
                    variant="plain"
                    size="icon"
                    className={cn(
                        "hover:bg-gunmetal relative",
                        open ? "absolute left-0 z-0 opacity-0" : ""
                    )}
                >
                    <PlusIcon
                        className={cn(
                            "absolute transition-all delay-150 duration-150 ease-[cubic-bezier(.4,0,.2,1)]",
                            open ? "-left-15" : "left-2"
                        )}
                    />
                    <span className="sr-only">Create Chat</span>
                </Button>
            </div>
        </div>
    );
}

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <div className="relative">
            <SidebarProvider>
                <SidebarButtons />

                <ChatSidebar />

                <div>
                    <div>Hello chats</div>

                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    );
}
