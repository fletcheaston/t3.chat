import * as React from "react";

import { Link } from "@tanstack/react-router";

import { useUser } from "@/components/auth";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";

export function SidebarFooter() {
    /**************************************************************************/
    /* State */
    const user = useUser();

    /**************************************************************************/
    /* Render */
    return (
        <div
            data-slot="sidebar-header"
            data-sidebar="header"
            className="flex flex-col items-center gap-2 py-0.5"
        >
            <Separator />

            <Button
                asChild
                variant="plain"
                size="custom"
                className="hover:bg-background-light -mx-1 flex w-full items-center justify-start gap-2 px-1 py-1 text-left"
                tooltip={null}
            >
                <Link to="/settings/support">
                    {user.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt={user.name}
                            className="size-8 rounded-full"
                        />
                    ) : null}

                    <div>
                        <p className="text-sm">{user.name}</p>

                        <p className="text-xs">Demo</p>
                    </div>
                </Link>
            </Button>
        </div>
    );
}
