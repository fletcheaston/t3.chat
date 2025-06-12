import { useCallback } from "react";
import * as React from "react";

import { createFileRoute } from "@tanstack/react-router";

import { createMessage } from "@/api";
import { MessageContent } from "@/components/message-content";
import { MessageWindow } from "@/components/message-window";
import { ConversationProvider } from "@/sync/conversation";
import { db } from "@/sync/database";

export const Route = createFileRoute("/chat/$chatId")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const { chatId } = Route.useParams();

    const sendMessage = useCallback(
        async (content: string) => {
            const { data: message } = await createMessage({
                body: {
                    id: crypto.randomUUID(),
                    title: content,
                    content,
                    conversationId: chatId,
                    replyToId: null,
                },
            });

            if (!message) {
                throw new Error("Unable to create message");
            }

            // Add data to local database
            await db.messages.put(message, message.id);
        },
        [chatId]
    );

    /**************************************************************************/
    /* Render */
    return (
        <ConversationProvider conversationId={chatId}>
            <div className="flex max-w-3xl grow flex-col">
                <div className="grow pb-12">
                    <MessageContent />
                </div>

                <div className="sticky bottom-0 rounded-xl">
                    <MessageWindow sendMessage={sendMessage} />
                </div>
            </div>
        </ConversationProvider>
    );
}
