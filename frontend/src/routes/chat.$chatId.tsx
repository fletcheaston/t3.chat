import { useCallback } from "react";
import * as React from "react";

import { createFileRoute } from "@tanstack/react-router";

import { LargeLanguageModel, MessageSchema, createMessage } from "@/api";
import { useUser } from "@/api/auth";
import { MessageTree } from "@/components/message-content";
import { MessageWindow } from "@/components/message-window";
import { ConversationProvider, useMessageTree } from "@/sync/conversation";
import { db } from "@/sync/database";

export const Route = createFileRoute("/chat/$chatId")({
    component: RouteComponent,
});

function ConversationContext(props: { conversationId: string }) {
    /**************************************************************************/
    /* State */
    const user = useUser();
    const messageTree = useMessageTree();

    const sendMessage = useCallback(
        async (content: string, llms: Array<LargeLanguageModel>) => {
            // Optimistic add data to local database
            const newMessageId = crypto.randomUUID();
            const date = new Date().toISOString();

            await db.messages.add({
                id: newMessageId,
                title: content,
                content: content,
                created: date,
                modified: date,
                conversationId: props.conversationId,
                replyToId: messageTree[messageTree.length - 1]?.id ?? null,
                authorId: user.id,
                llm: null,
            } satisfies MessageSchema);

            // Save data to the API
            const { data: message } = await createMessage({
                body: {
                    id: newMessageId,
                    title: content,
                    content,
                    conversationId: props.conversationId,
                    replyToId: messageTree[messageTree.length - 1]?.id ?? null,
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
        [props.conversationId, user.id, messageTree]
    );

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex max-w-3xl grow flex-col">
            <div className="grow px-4 pb-12">
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
            <ConversationContext conversationId={chatId} />
        </ConversationProvider>
    );
}
