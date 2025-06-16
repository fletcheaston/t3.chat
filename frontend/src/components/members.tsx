import { useMemo, useState } from "react";

import { useMountEffect } from "@react-hookz/web";
import { Users } from "lucide-react";

import { useUserMap } from "@/sync/conversation";
import { db } from "@/sync/database";
import { useCachedLiveQuery } from "@/sync/utils";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Skeleton } from "@/ui/skeleton";

import { llmToName } from "./models";

function MembersDialogContent(props: { conversationId: string }) {
    /**************************************************************************/
    /* State */
    const userMap = useUserMap();
    const [isLoading, setIsLoading] = useState(true);

    const messages = useCachedLiveQuery(async () => {
        return db.messages.where("conversationId").equals(props.conversationId).sortBy("created");
    }, [props.conversationId]);

    useMountEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    });

    // Calculate message counts
    const userMessageCounts = useMemo(() => {
        if (!messages) return {};

        return Object.fromEntries(
            Object.keys(userMap).map((userId) => [
                userId,
                messages.filter((msg) => msg.authorId === userId).length,
            ])
        );
    }, [messages, userMap]);

    const llmMessageCounts = useMemo(() => {
        if (!messages) return {};

        return Object.fromEntries(
            Object.keys(llmToName).map((llm) => [
                llm,
                messages.filter((msg) => msg.llm === llm).length,
            ])
        );
    }, [messages]);

    /**************************************************************************/
    /* Render */
    if (!messages || isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-lg">Users</h3>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2 border-b py-1 text-sm">
                            <Skeleton className="bg-background-light h-6 w-full" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg">Models</h3>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2 border-b py-1 text-sm">
                            <Skeleton className="bg-background-light h-6 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-lg">Users</h3>

                <div className="flex flex-col gap-1">
                    {Object.values(userMap).map((user) => {
                        const count = userMessageCounts[user.id];

                        return (
                            <div
                                key={user.id}
                                className="flex items-center justify-between gap-2 border-b py-1 text-sm"
                            >
                                <div className="grow">
                                    <p className="font-medium">{user.name}</p>
                                </div>

                                <div>
                                    {count} {count === 1 ? "message" : "messages"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-lg">Models</h3>

                <div className="flex flex-col gap-1">
                    {Object.entries(llmToName).map(([llm, name]) => {
                        const count = llmMessageCounts[llm];

                        if (!count) return;

                        return (
                            <div
                                key={llm}
                                className="flex items-center justify-between gap-2 border-b py-1 text-sm"
                            >
                                <div className="grow">
                                    <p className="font-medium">{name}</p>
                                </div>

                                <div>
                                    {count} {count === 1 ? "message" : "messages"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function MembersDialog(props: { conversationId: string }) {
    /**************************************************************************/
    /* State */

    /**************************************************************************/
    /* Render */
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    tooltip="View Members"
                >
                    <Users className="h-5 w-5" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Conversation Members</DialogTitle>
                </DialogHeader>

                <MembersDialogContent conversationId={props.conversationId} />
            </DialogContent>
        </Dialog>
    );
}
