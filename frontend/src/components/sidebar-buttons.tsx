import * as React from "react";

import { Link } from "@tanstack/react-router";
import { PanelLeftIcon, PlusIcon, SearchIcon, Settings2Icon } from "lucide-react";

import { Button } from "@/ui/button";
import { useSidebar } from "@/ui/sidebar";
import { cn } from "@/utils";

export function SidebarButtons() {
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
                    <Link
                        to="/chat"
                        className={cn(
                            "absolute transition-all delay-150 duration-150 ease-[cubic-bezier(.4,0,.2,1)]",
                            open ? "-left-15" : "left-2"
                        )}
                    >
                        <PlusIcon />
                        <span className="sr-only">New Chat</span>
                    </Link>
                </Button>

                <Button
                    variant="plain"
                    size="icon"
                    className={cn(
                        "hover:bg-gunmetal relative",
                        open ? "absolute left-0 z-0 opacity-0" : ""
                    )}
                    tooltip="Settings"
                >
                    <Link
                        to="/settings/models"
                        className={cn(
                            "absolute transition-all delay-150 duration-150 ease-[cubic-bezier(.4,0,.2,1)]",
                            open ? "-left-24" : "left-2"
                        )}
                    >
                        <Settings2Icon />
                        <span className="sr-only">Settings</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
