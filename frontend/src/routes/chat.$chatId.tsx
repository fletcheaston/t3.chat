import * as React from "react";

import { createFileRoute } from "@tanstack/react-router";

import { CreateMessage } from "@/components/create-message";
import { MembersDialog } from "@/components/members";
import { MessageTree } from "@/components/message-content";
import { ShareButton } from "@/components/share";
import { ConversationProvider, useMessageTree } from "@/sync/conversation";

export const Route = createFileRoute("/chat/$chatId")({
    component: RouteComponent,
});

function Conversation() {
    /**************************************************************************/
    /* State */
    const messageTree = useMessageTree();

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex max-w-3xl grow flex-col">
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <MembersDialog />

                <ShareButton />
            </div>

            <div className="grow px-4 pb-12 text-sm">
                <MessageTree messageTree={messageTree} />
            </div>

            <div className="sticky bottom-0 rounded-xl">
                <CreateMessage />
            </div>
        </div>
    );
}

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const { chatId } = Route.useParams();

    /**************************************************************************/
    /* Render */
    return (
        <ConversationProvider conversationId={chatId}>
            <Conversation />
        </ConversationProvider>
    );
}
