import * as React from "react";

import { Link, useLocation } from "@tanstack/react-router";
import { PanelLeftIcon, PlusIcon, SearchIcon } from "lucide-react";

import { useConversations } from "@/sync/conversations";
import { Button } from "@/ui/button";
import { F3 } from "@/ui/logo";
import { Separator } from "@/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/ui/sidebar";
import { cn } from "@/utils";

function SidebarButtons() {
    /**************************************************************************/
    /* State */
    const { open, toggleSidebar } = useSidebar();

    /**************************************************************************/
    /* Render */
    return (
        <div className="absolute top-2 left-2 z-50">
            <div className="bg-gunmetal-light/50 relative flex h-fit gap-x-0.5 rounded p-1 backdrop-blur-sm transition-all duration-150">
                <Button
                    data-sidebar="trigger"
                    data-slot="sidebar-trigger"
                    variant="plain"
                    size="icon"
                    className="hover:bg-gunmetal z-10"
                    onClick={toggleSidebar}
                    tooltip="Toggle sidebar"
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
                    tooltip="Search chats"
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
                    tooltip="New chat"
                >
                    <PlusIcon
                        className={cn(
                            "absolute transition-all delay-150 duration-150 ease-[cubic-bezier(.4,0,.2,1)]",
                            open ? "-left-15" : "left-2"
                        )}
                    />
                    <span className="sr-only">New Chat</span>
                </Button>
            </div>
        </div>
    );
}

export function ConversationSidebar() {
    /**************************************************************************/
    /* State */
    const location = useLocation();

    const conversations = useConversations();

    /**************************************************************************/
    /* Render */
    return (
        <>
            <SidebarButtons />

            <Sidebar
                collapsible="offcanvas"
                className="bg-gunmetal px-4"
            >
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

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-2">
                                {conversations.map((conversation) => {
                                    const selected = location.pathname.includes(conversation.id);

                                    return (
                                        <SidebarMenuItem key={conversation.id}>
                                            <SidebarMenuButton
                                                asChild
                                                className={cn(
                                                    "h-fit transition-all",
                                                    selected
                                                        ? "bg-pantone-lighter text-gunmetal-dark"
                                                        : "hover:bg-pantone-lighter hover:text-gunmetal-dark"
                                                )}
                                            >
                                                <Link
                                                    to="/chat/$chatId"
                                                    params={{ chatId: conversation.id }}
                                                >
                                                    {conversation.title}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter />
            </Sidebar>
        </>
    );
}
