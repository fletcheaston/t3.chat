import { useCallback } from "react";
import * as React from "react";

import { createFileRoute } from "@tanstack/react-router";

import { LargeLanguageModel, createMessage } from "@/api";
import { MessageContent } from "@/components/message-content";
import { MessageWindow } from "@/components/message-window";
import { ConversationProvider, useMessages } from "@/sync/conversation";
import { db } from "@/sync/database";

export const Route = createFileRoute("/chat/$chatId")({
    component: RouteComponent,
});

function ConversationContext(props: { conversationId: string }) {
    /**************************************************************************/
    /* State */
    const messages = useMessages();

    const sendMessage = useCallback(
        async (content: string, llms: Array<LargeLanguageModel>) => {
            const { data: message } = await createMessage({
                body: {
                    id: crypto.randomUUID(),
                    title: content,
                    content,
                    conversationId: props.conversationId,
                    replyToId: messages[messages.length - 1]?.id ?? null,
                    llms,
                },
            });

            if (!message) {
                throw new Error("Unable to create message");
            }

            // Add data to local database
            await db.messages.put(message, message.id);
        },
        [props.conversationId, messages]
    );

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex max-w-3xl grow flex-col">
            <div className="grow pb-12">
                <MessageContent messages={messages} />
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
