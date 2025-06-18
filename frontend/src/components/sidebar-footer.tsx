import * as React from "react";

import { Link } from "@tanstack/react-router";

import { useUser } from "@/components/auth";
import { db } from "@/sync/database";
import { useCachedLiveQuery } from "@/sync/utils";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";

function DailyMessageCounter() {
    /**************************************************************************/
    /* State */
    const user = useUser();

    const messageCount = useCachedLiveQuery(async () => {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        // First, get all messages from the user in the last day
        const userMessages = await db.messages.where("authorId").equals(user.id).toArray();

        // Then count LLM replies to those messages
        return db.messages
            .where("replyToId")
            .anyOf(userMessages.map((msg) => msg.id))
            .and((message) => message.llm !== null && new Date(message.created) >= oneDayAgo)
            .count();
    }, [user.id]);

    /**************************************************************************/
    /* Render */
    return <p className="text-xs tabular-nums">{messageCount} / 100 Messages</p>;
}

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

                    <div className="grow">
                        <p className="text-sm">{user.name}</p>

                        <DailyMessageCounter />
                    </div>
                </Link>
            </Button>
        </div>
    );
}
