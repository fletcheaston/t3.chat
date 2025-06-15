import { Outlet, createFileRoute } from "@tanstack/react-router";

import { SettingsSidebar } from "@/components/settings-sidebar";
import { SidebarProvider } from "@/ui/sidebar";

export const Route = createFileRoute("/settings")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <SidebarProvider>
            <div className="relative">
                <SettingsSidebar />
            </div>

            <div className="h-[100vh] grow overflow-hidden">
                <div className="flex h-full justify-center overflow-y-scroll px-2 pt-16">
                    <div className="max-w-3xl grow">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
