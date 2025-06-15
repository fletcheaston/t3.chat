import { useCallback } from "react";
import * as React from "react";

import { createFileRoute } from "@tanstack/react-router";

import { LargeLanguageModel, MessageSchema, createMessage } from "@/api";
import { useUser } from "@/components/auth";
import { MessageTree } from "@/components/message-content";
import { MessageWindow } from "@/components/message-window";
import { ConversationProvider, useConversation, useMessageTree } from "@/sync/conversation";
import { db } from "@/sync/database";

export const Route = createFileRoute("/chat/$chatId")({
    component: RouteComponent,
});

function Conversation() {
    /**************************************************************************/
    /* State */
    const user = useUser();
    const conversation = useConversation();
    const messageTree = useMessageTree();

    const sendMessage = useCallback(
        async (content: string, llms: Array<LargeLanguageModel>) => {
            // Pull the message we're replying to from the DOM
            // MUCH easier to do this than pass state around in very hard ways
            const elements = document.querySelectorAll<HTMLElement>("[data-message-id]");
            const lastElement = elements[elements.length - 1];
            const replyToId = lastElement?.getAttribute("data-message-id") ?? null;

            // Optimistic add data to local database
            const newMessageId = crypto.randomUUID();
            const date = new Date().toISOString();

            await db.messages.add({
                id: newMessageId,
                title: content,
                content: content,
                created: date,
                modified: date,
                conversationId: conversation.id,
                replyToId,
                authorId: user.id,
                llm: null,
            } satisfies MessageSchema);

            // Save data to the API
            const { data: message } = await createMessage({
                body: {
                    id: newMessageId,
                    title: content,
                    content,
                    conversationId: conversation.id,
                    replyToId,
                    llms,
                },
            });

            if (!message) {
                await db.messages.delete(newMessageId);
                throw new Error("Unable to create message");
            }

            // Add data to local database
            await db.messages.put(message, message.id);
        },
        [conversation.id, user.id, messageTree]
    );

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex max-w-3xl grow flex-col">
            <div className="grow px-4 pb-12 text-sm">
                <MessageTree messageTree={messageTree} />
            </div>

            <div className="sticky bottom-0 rounded-xl">
                <MessageWindow sendMessage={sendMessage} />
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
