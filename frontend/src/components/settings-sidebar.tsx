import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
} from "@/ui/sidebar";

import { SidebarButtons } from "./sidebar-buttons";
import { SidebarHeader } from "./sidebar-header";

export function SettingsSidebar() {
    /**************************************************************************/
    /* State */

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
                            <SidebarMenu className="gap-2">test</SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter />
            </Sidebar>
        </>
    );
}
