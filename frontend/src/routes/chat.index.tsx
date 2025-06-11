import * as React from "react";
import { useCallback } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { createConversation, createMessage } from "@/api";
import { MessageWindow } from "@/components/message-window";
import { db } from "@/sync/database";

export const Route = createFileRoute("/chat/")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const navigate = useNavigate();

    const sendMessage = useCallback(
        async (content: string) => {
            const { data: conversation } = await createConversation({
                body: {
                    id: crypto.randomUUID(),
                    title: content,
                    tagIds: [],
                },
            });

            if (!conversation) {
                throw new Error("Unable to create conversation");
            }

            const { data: message } = await createMessage({
                body: {
                    id: crypto.randomUUID(),
                    title: content,
                    content,
                    conversationId: conversation.id,
                    replyToId: null,
                },
            });

            if (!message) {
                throw new Error("Unable to create message");
            }

            // Add data to local database
            await db.conversations.put(conversation, conversation.id);
            await db.messages.put(message, message.id);

            // Navigate to the chat page
            await navigate({ to: "/chat/$chatId", params: { chatId: conversation.id } });
        },
        [navigate]
    );

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex max-w-3xl grow flex-col">
            <div className="grow pb-12" />

            <div className="sticky bottom-0 rounded-xl">
                <MessageWindow sendMessage={sendMessage} />
            </div>
        </div>
    );
}
