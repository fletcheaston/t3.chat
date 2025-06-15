import * as React from "react";

import { Link, LinkComponentProps, useLocation } from "@tanstack/react-router";

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

type To = NonNullable<LinkComponentProps["to"]>;

function SettingsLink(props: { title: string; to: To; pathname: string }) {
    /**************************************************************************/
    /* State */
    const selected = props.pathname.includes(props.to);

    /**************************************************************************/
    /* Render */
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                className={cn(
                    "text-text hover:bg-primary-light hover:text-background-dark block rounded-none rounded-t-lg border-b px-0.5 py-0.5 transition-all",
                    selected
                        ? "border-b-primary"
                        : "hover:border-b-primary-light border-b-border-dark"
                )}
            >
                <Link to={props.to}>{props.title}</Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function SettingsSidebar() {
    /**************************************************************************/
    /* State */
    const pathname = useLocation({ select: (state) => state.pathname });

    /**************************************************************************/
    /* Render */
    return (
        <>
            <SidebarButtons />

            <Sidebar
                collapsible="offcanvas"
                className="bg-background px-4"
            >
                <SidebarHeader />

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Settings</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SettingsLink
                                    title="Account"
                                    to="/settings/account"
                                    pathname={pathname}
                                />

                                <SettingsLink
                                    title="Models"
                                    to="/settings/models"
                                    pathname={pathname}
                                />

                                <SettingsLink
                                    title="Visuals"
                                    to="/settings/visuals"
                                    pathname={pathname}
                                />

                                <SettingsLink
                                    title="History"
                                    to="/settings/history"
                                    pathname={pathname}
                                />

                                <SettingsLink
                                    title="API Keys"
                                    to="/settings/api-keys"
                                    pathname={pathname}
                                />

                                <SettingsLink
                                    title="Support"
                                    to="/settings/support"
                                    pathname={pathname}
                                />
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter />
            </Sidebar>
        </>
    );
}
