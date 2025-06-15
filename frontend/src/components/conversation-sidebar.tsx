import * as React from "react";

import { Link, useLocation } from "@tanstack/react-router";

import { useConversations } from "@/sync/conversations";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/ui/sidebar";
import { cn } from "@/utils";

import { SidebarButtons } from "./sidebar-buttons";
import { SidebarHeader } from "./sidebar-header";

function ConversationLink(props: { id: string; title: string; pathname: string }) {
    /**************************************************************************/
    /* State */
    const selected = props.pathname.includes(props.id);

    /**************************************************************************/
    /* Render */
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                className={cn(
                    "text-silver hover:bg-pantone-lighter hover:text-gunmetal-dark block rounded-none rounded-t-lg border-b-2 px-0.5 py-0.5 transition-all",
                    selected
                        ? "border-b-pantone"
                        : "hover:border-b-pantone-lighter border-b-silver-dull"
                )}
            >
                <Link
                    to="/chat/$chatId"
                    params={{ chatId: props.id }}
                >
                    {props.title}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function ConversationSidebar() {
    /**************************************************************************/
    /* State */
    const pathname = useLocation({ select: (state) => state.pathname });

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
                        <SidebarGroupLabel>Chats</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {conversations.map((conversation) => {
                                    return (
                                        <ConversationLink
                                            key={conversation.id}
                                            id={conversation.id}
                                            title={conversation.title}
                                            pathname={pathname}
                                        />
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
