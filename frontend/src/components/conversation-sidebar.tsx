import * as React from "react";

import { Link, useLocation } from "@tanstack/react-router";

import { useConversations } from "@/sync/conversations";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/ui/sidebar";
import { cn } from "@/utils";

import { SidebarButtons } from "./sidebar-buttons";
import { SidebarHeader } from "./sidebar-header";

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
                <SidebarHeader />

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
